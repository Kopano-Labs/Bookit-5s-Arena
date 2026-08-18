export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/getSession";
import connectDB from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import {
  APU_SCHEMA,
  APU_STAGES,
  assertApuReceivableBySwfus,
  markApuSwfusSynced,
} from "@/lib/offline/apuProgressiveUpdate";
import {
  SWFUS_DISPOSITIONS,
  bindSwfusReceiptProof,
  evaluateKpgsProgressiveUpdate,
} from "@/lib/governance/kpgsProgressiveUpdate";
import {
  SwfusProjectionConflictError,
  applySwfusProjection,
  loadSwfusProjection,
  rollbackSwfusProjection,
} from "@/lib/governance/swfusProjectionStore";
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

function stateDigest(projection) {
  return projection === null ? null : sha256(stableJson(projection));
}

function finalizeSwfusReceipt(evaluation, at) {
  const digest = stateDigest(evaluation.nextProjection);
  const updateDigest = sha256(stableJson(evaluation.update));
  const receiptId = `swfus_${sha256(
    `swfus-vnext:${updateDigest}:${evaluation.receipt.disposition}:${digest || "none"}`,
  ).slice(0, 24)}`;
  const receipt = bindSwfusReceiptProof(evaluation.receipt, {
    receiptId,
    stateDigest: digest,
    createdAt: at,
  });
  const distribution = evaluation.distribution
    ? { ...evaluation.distribution, state_digest: digest }
    : null;
  return { receipt, distribution };
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

function replayPayload(existing, idempotencyKey, eventType) {
  return {
    ok: true,
    replay: true,
    idempotencyKey,
    eventType,
    status: existing?.status || "ACCEPTED",
    ...(existing?.apu ? { apu: existing.apu } : {}),
    ...(existing?.swfusDistribution ? { swfusDistribution: existing.swfusDistribution } : {}),
  };
}

function bindLegacyProgressiveIdempotency(apu, idempotencyKey) {
  const progressive = apu?.progressive_update;
  if (!progressive || progressive.idempotency_key === idempotencyKey) return apu;

  const legacyMarker = ":apu:";
  const markerIndex = apu.update_id.indexOf(legacyMarker);
  const legacyKey = markerIndex >= 0 ? apu.update_id.slice(markerIndex + legacyMarker.length) : null;
  const isLegacyAdapter = progressive.source === "fivesarena-apu-legacy-adapter";

  if (isLegacyAdapter && legacyKey === idempotencyKey) {
    return {
      ...apu,
      progressive_update: {
        ...progressive,
        idempotency_key: idempotencyKey,
        correlation_id: progressive.correlation_id || idempotencyKey,
      },
    };
  }

  return apu;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/v1/sync",
    eventTypes: Array.from(VALID_EVENT_TYPES),
    idempotency: "X-Idempotency-Key",
    apu: {
      schema: APU_SCHEMA,
      intakeStage: APU_STAGES.POC,
      acceptedStage: APU_STAGES.SYNCED,
      progressiveUpdateSchema: "kpgs.progressive-update.v1",
      swfusReceiptSchema: "kpgs.swfus.receipt.v1",
      boundaryMarker: "#NB",
      semantics:
        "Adaptive Progressive Update -> #NB -> bounded non-authoritative CRUD projection -> SWFUS distribution. Synchronization does not grant canonical authority.",
    },
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

  let incomingApu = null;
  if (body?.apu !== undefined && body?.apu !== null) {
    try {
      incomingApu = assertApuReceivableBySwfus(body.apu);
      incomingApu = bindLegacyProgressiveIdempotency(incomingApu, idempotencyKey);
    } catch (error) {
      return badRequest(error?.message || "Invalid APU progressive update envelope.");
    }
    if (incomingApu.progressive_update.idempotency_key !== idempotencyKey) {
      return badRequest(
        "progressive_update.idempotency_key must match X-Idempotency-Key at the SWFUS boundary.",
      );
    }
  }

  const payloadHash = sha256(
    stableJson({ eventType, payload, ...(incomingApu ? { apu: incomingApu } : {}) }),
  );
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

      return NextResponse.json(replayPayload(existing, idempotencyKey, eventType));
    }

    const acceptedAt = new Date().toISOString();
    let syncedApu = null;
    let swfusDistribution = null;
    let previousProjection = null;
    let appliedUpdate = null;

    if (incomingApu) {
      const progressiveUpdate = incomingApu.progressive_update;
      previousProjection = await loadSwfusProjection(progressiveUpdate.node_id);
      const evaluation = evaluateKpgsProgressiveUpdate(progressiveUpdate, previousProjection);
      const finalized = finalizeSwfusReceipt(evaluation, acceptedAt);

      if (evaluation.receipt.disposition === SWFUS_DISPOSITIONS.HELD) {
        return NextResponse.json(
          {
            ok: false,
            status: "HELD",
            error: "Progressive update held by KPGS vNext governance.",
            swfusReceipt: finalized.receipt,
          },
          { status: 409 },
        );
      }
      if (evaluation.receipt.disposition === SWFUS_DISPOSITIONS.REJECTED) {
        return NextResponse.json(
          {
            ok: false,
            status: "REJECTED",
            error: "Progressive update rejected by KPGS vNext governance.",
            swfusReceipt: finalized.receipt,
          },
          { status: 422 },
        );
      }
      if (evaluation.receipt.disposition !== SWFUS_DISPOSITIONS.APPLIED) {
        return NextResponse.json(
          {
            ok: true,
            status: evaluation.receipt.disposition,
            swfusReceipt: finalized.receipt,
          },
          { status: 200 },
        );
      }

      try {
        await applySwfusProjection({
          update: evaluation.update,
          previousProjection,
          nextProjection: evaluation.nextProjection,
          receiptId: finalized.receipt.receipt_id,
        });
        appliedUpdate = evaluation.update;
        swfusDistribution = finalized.distribution;
        syncedApu = markApuSwfusSynced(incomingApu, {
          receiptId: finalized.receipt.receipt_id,
          swfusReceipt: finalized.receipt,
          at: acceptedAt,
        });
      } catch (error) {
        if (appliedUpdate) {
          await rollbackSwfusProjection({ update: appliedUpdate, previousProjection });
          appliedUpdate = null;
        }
        throw error;
      }
    }

    let created;
    try {
      created = await OfflineSyncEvent.create({
        idempotencyKey,
        eventType,
        payload,
        payloadHash,
        ...(syncedApu ? { apu: syncedApu } : {}),
        ...(swfusDistribution ? { swfusDistribution } : {}),
        status: "ACCEPTED",
        source: syncedApu ? "fivesarena_kpgs_vnext_swfus" : "bookit_offline_queue",
        user: session?.user?.id || null,
        requestMeta: {
          ipHash: sha256(ip),
          userAgentHash: sha256(request.headers.get("user-agent") || ""),
        },
      });
    } catch (error) {
      if (appliedUpdate) {
        await rollbackSwfusProjection({ update: appliedUpdate, previousProjection });
        appliedUpdate = null;
      }
      throw error;
    }

    return NextResponse.json(
      {
        ok: true,
        replay: false,
        idempotencyKey,
        eventType,
        status: "ACCEPTED",
        ...(created.apu ? { apu: created.apu.toObject?.() || created.apu } : {}),
        ...(created.swfusDistribution
          ? { swfusDistribution: created.swfusDistribution }
          : swfusDistribution
            ? { swfusDistribution }
            : {}),
      },
      { status: 202 },
    );
  } catch (error) {
    if (error instanceof SwfusProjectionConflictError) {
      return NextResponse.json(
        {
          error: error.message,
          idempotencyKey,
          status: "CONFLICT",
        },
        { status: 409 },
      );
    }

    if (error?.code === 11000) {
      try {
        const duplicate = await OfflineSyncEvent.findOne({ idempotencyKey }).lean();
        return NextResponse.json(replayPayload(duplicate, idempotencyKey, eventType));
      } catch {
        return NextResponse.json({
          ok: true,
          replay: true,
          idempotencyKey,
          eventType,
          status: "ACCEPTED",
        });
      }
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
