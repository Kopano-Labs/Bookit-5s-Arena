import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/getSession";
import { requireRole } from "@/lib/roles";
import { rateLimit } from "@/lib/rateLimit";
import {
  isWhin2Configured,
  sendWhin2TextMessage,
} from "@/lib/integrations/whatsappWhin2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET — capability probe for admin UI */
export async function GET() {
  const session = await getAuthSession();
  if (!requireRole(session, "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({
    configured: isWhin2Configured(),
  });
}

/** POST — send a test message (admin only); wire booking flow via lib after validation */
export async function POST(request) {
  const session = await getAuthSession();
  if (!requireRole(session, "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimitKey = `${session?.user?.email || ip}:whin2-send`;

  if (rateLimit(rateLimitKey, 8, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many send attempts. Try again later." },
      { status: 429 },
    );
  }

  if (!isWhin2Configured()) {
    return NextResponse.json(
      {
        error:
          "Whin2 is not configured. Set WHIN2_RAPIDAPI_KEY, WHIN2_RAPIDAPI_HOST, and WHIN2_RAPIDAPI_URL.",
      },
      { status: 400 },
    );
  }

  try {
    const payload = await request.json();
    const { to, message } = payload || {};
    if (!to || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Body must include { to, message }." },
        { status: 400 },
      );
    }

    const result = await sendWhin2TextMessage({
      to,
      message: message.trim(),
    });

    const status = result.success ? 200 : 502;
    return NextResponse.json(result, { status });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Whin2 send failed" },
      { status: 500 },
    );
  }
}
