import mongoose from "mongoose";

const OfflineSyncEventSchema = new mongoose.Schema(
  {
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ["booking", "payment", "check-in", "broadcast", "testimony", "admin-audit"],
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    payloadHash: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "CONFLICT", "DEAD_LETTER", "RESOLVED"],
      default: "ACCEPTED",
    },
    source: {
      type: String,
      default: "bookit_offline_queue",
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    requestMeta: {
      ipHash: { type: String, default: null },
      userAgentHash: { type: String, default: null },
    },
    lastError: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

OfflineSyncEventSchema.index({ eventType: 1, createdAt: -1 });
OfflineSyncEventSchema.index({ status: 1, updatedAt: -1 });
OfflineSyncEventSchema.index({ user: 1, createdAt: -1 });

if (mongoose.models.OfflineSyncEvent) {
  try {
    mongoose.deleteModel("OfflineSyncEvent");
  } catch {
    /* ignore */
  }
}

export default mongoose.model("OfflineSyncEvent", OfflineSyncEventSchema);
