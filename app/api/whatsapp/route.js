import { NextResponse } from "next/server";
import {
  isWhin2Configured,
  sendWhin2TextMessage,
} from "@/lib/integrations/whatsappWhin2";
import { buildBookingConfirmationWhatsappText } from "@/lib/kopano/buildBookingWhatsappText";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Tier 2 broadcast — Whin2 RapidAPI after payment (or internal trigger).
 * NOT for anonymous browsers: require ``BOOKIT_WHATSAPP_BROADCAST_SECRET`` in
 * ``x-bookit-internal-secret`` (Paystack/Make server-side call after you verify
 * the provider signature in your webhook handler).
 */
export async function POST(req) {
  const secret = process.env.BOOKIT_WHATSAPP_BROADCAST_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "BOOKIT_WHATSAPP_BROADCAST_SECRET is not configured." },
      { status: 503 },
    );
  }

  if (req.headers.get("x-bookit-internal-secret") !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isWhin2Configured()) {
    return NextResponse.json(
      {
        error:
          "Whin2 is not configured (WHIN2_RAPIDAPI_KEY, WHIN2_RAPIDAPI_HOST, WHIN2_RAPIDAPI_URL).",
      },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const { phone, bookingId, court, date, time } = body || {};

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }
    if (!court || !date || !time) {
      return NextResponse.json(
        { error: "court, date, and time are required" },
        { status: 400 },
      );
    }
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    const text = buildBookingConfirmationWhatsappText({
      bookingId: String(bookingId),
      court: String(court),
      date: String(date),
      time: String(time),
    });

    const result = await sendWhin2TextMessage({ to: phone, message: text });

    if (!result.success) {
      return NextResponse.json(
        { success: false, provider: result.provider, error: result.error, raw: result.raw },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      provider: result.provider,
      result: result.raw,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "broadcast_failed" },
      { status: 500 },
    );
  }
}
