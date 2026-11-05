import mongoose from "mongoose";

const SwfusProjectionSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    version: {
      type: Number,
      required: true,
      min: 1,
    },
    stateClass: {
      type: String,
      required: true,
      enum: ["non_authoritative", "derived_projection", "pending_proposal"],
    },
    authorityEffect: {
      type: String,
      required: true,
      enum: ["none"],
      default: "none",
    },
    updateId: {
      type: String,
      required: true,
      trim: true,
    },
    correlationId: {
      type: String,
      default: "",
      trim: true,
    },
    receiptId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

SwfusProjectionSchema.index({ updateId: 1 });
SwfusProjectionSchema.index({ stateClass: 1, updatedAt: -1 });

if (mongoose.models.SwfusProjection) {
  try {
    mongoose.deleteModel("SwfusProjection");
  } catch {
    /* ignore */
  }
}

export default mongoose.model("SwfusProjection", SwfusProjectionSchema);
