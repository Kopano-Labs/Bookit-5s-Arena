"use client";

import { motion } from "framer-motion";

function formatUpdatedAt(timestamp) {
  if (!timestamp) return "";
  try {
    return new Intl.DateTimeFormat("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return "";
  }
}

export default function VaultFreshnessRibbon({ vault }) {
  if (!vault?.fromVault && !vault?.stale && !vault?.refreshing) {
    return null;
  }

  const label = vault.offline
    ? `Using saved market data${vault.lastUpdated ? ` · ${formatUpdatedAt(vault.lastUpdated)}` : ""}`
    : vault.refreshing
      ? "Refreshing saved market data…"
      : vault.stale
        ? `Saved data may be delayed${vault.lastUpdated ? ` · ${formatUpdatedAt(vault.lastUpdated)}` : ""}`
        : "Loaded from vault";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-2 mb-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-green-300"
      role="status"
    >
      {label}
    </motion.div>
  );
}
