import mongoose from "mongoose";

const ApuReceiptSchema = new mongoose.Schema(
  {
    receipt_id: { type: String, required: true, trim: true },
    kind: { type: String, required: true, trim: true },
    evidence: { type: String, required: true, trim: true },
    at: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ApuProgressiveUpdateSchema = new mongoose.Schema(
  {
    schema: {
      type: String,
      required: true,
      enum: ["fivesarena.apu.progressive-update.v1"],
    },
    update_id: { type: String, required: true, trim: true },
    resource: { type: String, required: true, trim: true },
    resource_id: { type: String, default: null, trim: true },
    operation: {
      type: String,
      required: true,
      enum: ["create", "read", "update", "delete"],
    },
    base_version: { type: Number, default: null, min: 0 },
    stage: {
      type: String,
      required: true,
      enum: [
        "S0_CONCEPT",
        "S1_IMPLEMENTED",
        "S2_POC",
        "S3_SYNCED",
        "S4_PSO",
        "S5_GOVERNED",
      ],
    },
    receipts: { type: [ApuReceiptSchema], default: [] },
  },
  { _id: false },
);

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
    apu: {
      type: ApuProgressiveUpdateSchema,
      default: null,
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
OfflineSyncEventSchema.index({ "apu.update_id": 1 }, { sparse: true });
OfflineSyncEventSchema.index({ "apu.stage": 1, createdAt: -1 }, { sparse: true });

if (mongoose.models.OfflineSyncEvent) {
  try {
    mongoose.deleteModel("OfflineSyncEvent");
  } catch {
    /* ignore */
  }
}

export default mongoose.model("OfflineSyncEvent", OfflineSyncEventSchema);
