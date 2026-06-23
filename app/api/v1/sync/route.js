export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/getSession";
import connectDB from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import OfflineSyncEvent from "@/models/OfflineSyncEvent";

const VALID_EVENT_TYPES = new Set([
  "booking",
  "payment",
  "check-in",
  "broadcast",
  "testimony",
  "admin-audit",
]);

const MAX_BODY_BYTES = 32 * 1024;
const IDEMPOTENCY_KEY_PATTERN = /^[a-zA-Z0-9:_.-]{8,220}$/;

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function normalizeBody(body) {
  const eventType = body?.event_type || body?.eventType;
  const payload =
    body?.payload && typeof body.payload === "object" && !Array.isArray(body.payload)
      ? body.payload
      : body?.data && typeof body.data === "object" && !Array.isArray(body.data)
        ? body.data
        : null;

  return { eventType, payload };
}

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function getOptionalSession() {
  try {
    return await getAuthSession();
  } catch {
    return null;
  }
}

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function isStoreUnavailable(error) {
  return (
    error?.name === "MongooseServerSelectionError" ||
    error?.name === "MongoServerSelectionError" ||
    /Could not connect to any servers/i.test(error?.message || "")
  );
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/v1/sync",
    eventTypes: Array.from(VALID_EVENT_TYPES),
    idempotency: "X-Idempotency-Key",
    status: "ready",
  });
}

export async function POST(request) {
  const idempotencyKey = request.headers.get("X-Idempotency-Key")?.trim();

  if (!idempotencyKey) {
    return badRequest("Missing X-Idempotency-Key header.");
  }

  if (!IDEMPOTENCY_KEY_PATTERN.test(idempotencyKey)) {
    return badRequest("Invalid X-Idempotency-Key format.");
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Sync payload is too large." }, { status: 413 });
  }

  const ip = getClientIp(request);
  if (rateLimit(`offline-sync:${ip}`, 60, 60 * 1000)) {
    return NextResponse.json({ error: "Too many sync attempts." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const serializedBody = stableJson(body);
  if (Buffer.byteLength(serializedBody, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Sync payload is too large." }, { status: 413 });
  }

  const { eventType, payload } = normalizeBody(body);
  if (!VALID_EVENT_TYPES.has(eventType)) {
    return badRequest(`Unsupported event_type. Use one of: ${Array.from(VALID_EVENT_TYPES).join(", ")}.`);
  }

  if (!payload) {
    return badRequest("Body must include an object payload.");
  }

  const payloadHash = sha256(stableJson({ eventType, payload }));
  const session = await getOptionalSession();

  try {
    await connectDB();

    const existing = await OfflineSyncEvent.findOne({ idempotencyKey }).lean();
    if (existing) {
      if (existing.eventType !== eventType || existing.payloadHash !== payloadHash) {
        return NextResponse.json(
          {
            error: "Idempotency conflict. The same key was used for different content.",
            idempotencyKey,
            status: "CONFLICT",
          },
          { status: 409 },
        );
      }

      return NextResponse.json({
        ok: true,
        replay: true,
        idempotencyKey,
        eventType,
        status: existing.status,
      });
    }

    await OfflineSyncEvent.create({
      idempotencyKey,
      eventType,
      payload,
      payloadHash,
      status: "ACCEPTED",
      source: "bookit_offline_queue",
      user: session?.user?.id || null,
      requestMeta: {
        ipHash: sha256(ip),
        userAgentHash: sha256(request.headers.get("user-agent") || ""),
      },
    });

    return NextResponse.json(
      {
        ok: true,
        replay: false,
        idempotencyKey,
        eventType,
        status: "ACCEPTED",
      },
      { status: 202 },
    );
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({
        ok: true,
        replay: true,
        idempotencyKey,
        eventType,
        status: "ACCEPTED",
      });
    }

    if (isStoreUnavailable(error)) {
      console.error("POST /api/v1/sync store unavailable:", error);
      return NextResponse.json(
        { error: "Offline sync store is temporarily unavailable. Retry later." },
        { status: 503 },
      );
    }

    console.error("POST /api/v1/sync error:", error);
    return NextResponse.json({ error: "Offline sync failed." }, { status: 500 });
  }
}
