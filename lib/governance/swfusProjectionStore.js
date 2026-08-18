import SwfusProjection from "@/models/SwfusProjection";

export class SwfusProjectionConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "SwfusProjectionConflictError";
  }
}

function toProjection(record) {
  if (!record) return null;
  return {
    value: record.value ?? null,
    version: record.version,
    state_class: record.stateClass,
    authority_effect: record.authorityEffect,
    update_id: record.updateId,
  };
}

export async function loadSwfusProjection(nodeId) {
  const record = await SwfusProjection.findOne({ nodeId }).lean();
  return toProjection(record);
}

export async function applySwfusProjection({
  update,
  previousProjection,
  nextProjection,
  receiptId,
}) {
  if (update.operation === "READ") return previousProjection;

  if (update.operation === "CREATE") {
    try {
      const created = await SwfusProjection.create({
        nodeId: update.node_id,
        value: nextProjection.value,
        version: nextProjection.version,
        stateClass: nextProjection.state_class,
        authorityEffect: "none",
        updateId: update.update_id,
        correlationId: update.correlation_id,
        receiptId,
      });
      return toProjection(created.toObject());
    } catch (error) {
      if (error?.code === 11000) {
        throw new SwfusProjectionConflictError("CREATE target changed before projection commit.");
      }
      throw error;
    }
  }

  if (update.operation === "UPDATE") {
    const updated = await SwfusProjection.findOneAndUpdate(
      { nodeId: update.node_id, version: previousProjection.version },
      {
        $set: {
          value: nextProjection.value,
          version: nextProjection.version,
          stateClass: nextProjection.state_class,
          authorityEffect: "none",
          updateId: update.update_id,
          correlationId: update.correlation_id,
          receiptId,
        },
      },
      { new: true },
    ).lean();
    if (!updated) {
      throw new SwfusProjectionConflictError("UPDATE projection version changed before commit.");
    }
    return toProjection(updated);
  }

  const deleted = await SwfusProjection.findOneAndDelete({
    nodeId: update.node_id,
    version: previousProjection.version,
  }).lean();
  if (!deleted) {
    throw new SwfusProjectionConflictError("DELETE projection version changed before commit.");
  }
  return null;
}

export async function rollbackSwfusProjection({ update, previousProjection }) {
  if (update.operation === "READ") return;

  if (update.operation === "CREATE") {
    await SwfusProjection.deleteOne({ nodeId: update.node_id, updateId: update.update_id });
    return;
  }

  if (update.operation === "UPDATE") {
    await SwfusProjection.findOneAndUpdate(
      { nodeId: update.node_id, updateId: update.update_id },
      {
        $set: {
          value: previousProjection.value,
          version: previousProjection.version,
          stateClass: previousProjection.state_class,
          authorityEffect: "none",
          updateId: previousProjection.update_id,
          correlationId: "rollback",
          receiptId: null,
        },
      },
      { new: false },
    );
    return;
  }

  if (previousProjection) {
    await SwfusProjection.updateOne(
      { nodeId: update.node_id },
      {
        $setOnInsert: {
          nodeId: update.node_id,
          value: previousProjection.value,
          version: previousProjection.version,
          stateClass: previousProjection.state_class,
          authorityEffect: "none",
          updateId: previousProjection.update_id,
          correlationId: "rollback",
          receiptId: null,
        },
      },
      { upsert: true },
    );
  }
}
