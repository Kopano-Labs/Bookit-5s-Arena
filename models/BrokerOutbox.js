import mongoose from "mongoose";

const BrokerOutboxSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    source: {
      type: String,
      default: "paystack_webhook",
      trim: true,
    },
    /** IdeaPad / sync agent sets when the row is ingested into the local vault */
    consumedAtLocal: {
      type: Date,
      default: null,
    },
    /**
     * Dedupe key for Paystack ``charge.success`` (``data.reference``) — one outbox row per charge.
     */
    paystackDedupeKey: {
      type: String,
      default: null,
      trim: true,
    },
    /** Set after a successful Whin2 send (best-effort; used for webhook retry recovery). */
    whatsappDispatchedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

BrokerOutboxSchema.index({ booking: 1, createdAt: -1 });
BrokerOutboxSchema.index(
  { paystackDedupeKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      paystackDedupeKey: { $exists: true, $type: "string", $gt: "" },
    },
  },
);

if (mongoose.models.BrokerOutbox) {
  try {
    mongoose.deleteModel("BrokerOutbox");
  } catch {
    /* ignore */
  }
}

export default mongoose.model("BrokerOutbox", BrokerOutboxSchema);
