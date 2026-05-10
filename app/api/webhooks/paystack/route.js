import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import BrokerOutbox from "@/models/BrokerOutbox";
import { verifyPaystackSignature } from "@/lib/kopano/verifyPaystack";
import { publishPaymentCleared } from "@/lib/kopano/eventBroker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Paystack → Mongo ledger → Kopano BrokerOutbox → Whin2 (in-process).
 *
 * Initialize charges with metadata: ``{ bookingId: "<Mongo ObjectId>" }``.
 * Optional aliases: ``booking_id``.
 */
export async function POST(request) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const event = body.event;
  if (event !== "charge.success") {
    return NextResponse.json({ received: true, ignored: event || "unknown" });
  }

  const data = body.data || {};
  const reference = data.reference;
  const eventId = data.id != null ? String(data.id) : null;
  const metadata = data.metadata || {};
  const bookingId =
    metadata.bookingId || metadata.booking_id || metadata.booking;

  if (!bookingId || !reference) {
    return NextResponse.json(
      { error: "metadata.bookingId and data.reference are required" },
      { status: 400 },
    );
  }

  if (!mongoose.Types.ObjectId.isValid(String(bookingId))) {
    return NextResponse.json({ error: "invalid_booking_id" }, { status: 400 });
  }

  await connectDB();

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "booking_not_found" }, { status: 404 });
  }

  if (eventId && booking.paystackLastEventId === eventId) {
    return NextResponse.json({ received: true, duplicate_event: true });
  }

  const outboxForRef = await BrokerOutbox.findOne({
    paystackDedupeKey: reference,
  });

  if (
    booking.paymentStatus === "paid" &&
    booking.externalPaymentRef === reference
  ) {
    if (outboxForRef?.whatsappDispatchedAt) {
      return NextResponse.json({ received: true, idempotent: true });
    }
    try {
      const broker = await publishPaymentCleared({
        bookingId: String(booking._id),
        paystackReference: reference,
        paystackEventId: eventId,
      });
      if (eventId) {
        booking.paystackLastEventId = eventId;
        await booking.save();
      }
      return NextResponse.json({
        received: true,
        recovered: true,
        broker,
        replay: Boolean(outboxForRef),
      });
    } catch (err) {
      console.error("[paystack webhook] recovery broker failed", err);
      return NextResponse.json(
        { received: true, recovered: false, broker_error: err?.message },
        { status: 500 },
      );
    }
  }

  if (booking.paymentStatus === "paid") {
    return NextResponse.json(
      { error: "booking_already_paid_different_reference" },
      { status: 409 },
    );
  }

  if (!["unpaid", "reserved"].includes(booking.paymentStatus)) {
    return NextResponse.json(
      { error: "booking_not_payable_state", paymentStatus: booking.paymentStatus },
      { status: 409 },
    );
  }

  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  booking.externalPaymentRef = reference;
  await booking.save();

  try {
    const broker = await publishPaymentCleared({
      bookingId: String(booking._id),
      paystackReference: reference,
      paystackEventId: eventId,
    });
    if (eventId) {
      booking.paystackLastEventId = eventId;
      await booking.save();
    }
    return NextResponse.json({ received: true, broker });
  } catch (err) {
    console.error("[paystack webhook] broker failed after ledger update", err);
    return NextResponse.json(
      {
        received: true,
        booking_updated: true,
        broker_error: err?.message || "broker_failed",
      },
      { status: 500 },
    );
  }
}
