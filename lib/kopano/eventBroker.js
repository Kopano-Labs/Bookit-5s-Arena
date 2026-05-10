import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import BrokerOutbox from "@/models/BrokerOutbox";
import {
  isWhin2Configured,
  sendWhin2TextMessage,
} from "@/lib/integrations/whatsappWhin2";
import { buildBookingConfirmationWhatsappText } from "@/lib/kopano/buildBookingWhatsappText";

function buildOutboxPayload(booking, paystackReference, paystackEventId) {
  const courtId =
    booking.court && typeof booking.court === "object" && booking.court._id
      ? String(booking.court._id)
      : String(booking.court);

  return {
    bookingId: String(booking._id),
    date: booking.date,
    start_time: booking.start_time,
    duration: booking.duration,
    courtName:
      booking.court && typeof booking.court === "object" && booking.court.name
        ? booking.court.name
        : null,
    courtId,
    paystackReference,
    paystackEventId: paystackEventId ?? null,
    paymentStatus: booking.paymentStatus,
    status: booking.status,
    hasGuest: Boolean(booking.guestPhone || booking.guestEmail),
  };
}

async function sendWhin2ForBooking(booking) {
  const phone =
    (booking.user &&
      booking.user.phone &&
      String(booking.user.phone).trim()) ||
    (booking.guestPhone && String(booking.guestPhone).trim()) ||
    null;

  if (!phone) {
    return { skipped: true, reason: "no_phone" };
  }
  if (!isWhin2Configured()) {
    return { skipped: true, reason: "whin2_not_configured" };
  }

  const courtLabel =
    booking.court && typeof booking.court === "object" && booking.court.name
      ? booking.court.name
      : "Court";

  const text = buildBookingConfirmationWhatsappText({
    bookingId: String(booking._id),
    court: courtLabel,
    date: booking.date,
    time: booking.start_time,
  });

  return sendWhin2TextMessage({ to: phone, message: text });
}

/**
 * After MongoDB is authoritative for payment: persist Kopano outbox (IdeaPad sync),
 * then Whin2 in-process (no HTTP to ``/api/whatsapp``).
 *
 * @param {{ bookingId: string; paystackReference: string; paystackEventId?: string | null }} args
 */
export async function publishPaymentCleared({
  bookingId,
  paystackReference,
  paystackEventId,
}) {
  await connectDB();

  const booking = await Booking.findById(bookingId)
    .populate("court", "name")
    .populate("user", "phone name");

  if (!booking) {
    throw new Error("booking_not_found");
  }

  const payload = buildOutboxPayload(booking, paystackReference, paystackEventId);

  let outboxDoc;
  try {
    outboxDoc = await BrokerOutbox.create({
      eventType: "payment.cleared",
      booking: booking._id,
      payload,
      source: "paystack_webhook",
      paystackDedupeKey: paystackReference,
    });
  } catch (err) {
    if (err?.code === 11000) {
      const existing = await BrokerOutbox.findOne({
        paystackDedupeKey: paystackReference,
      });
      if (!existing) {
        throw err;
      }
      if (existing.whatsappDispatchedAt) {
        return {
          duplicate: true,
          outboxId: String(existing._id),
          whatsapp: { skipped: true, reason: "already_dispatched" },
        };
      }
      const wa = await sendWhin2ForBooking(booking);
      if (wa?.success) {
        existing.whatsappDispatchedAt = new Date();
        await existing.save();
      }
      return { duplicate: true, outboxId: String(existing._id), whatsapp: wa };
    }
    throw err;
  }

  const wa = await sendWhin2ForBooking(booking);

  if (wa?.success) {
    outboxDoc.whatsappDispatchedAt = new Date();
    await outboxDoc.save();
  }

  return {
    outboxId: String(outboxDoc._id),
    whatsapp: wa,
  };
}
