"use client";

import { useOfflineQueue } from "@/hooks/useOfflineQueue";

export default function OfflineBanner() {
  const { isOnline, pendingCount, conflictCount, deadLetterCount, flush } = useOfflineQueue();

  if (isOnline && pendingCount === 0 && conflictCount === 0 && deadLetterCount === 0) {
    return null;
  }

  const hasAttention = conflictCount > 0 || deadLetterCount > 0;
  const message = !isOnline
    ? "Offline Mode: Actions saved locally."
    : hasAttention
      ? "Offline sync needs review."
      : `${pendingCount} action${pendingCount === 1 ? "" : "s"} syncing.`;

  const backgroundColor = !isOnline ? "#F5A623" : hasAttention ? "#991b1b" : "#065f46";

  return (
    <div
      role="status"
      className="fixed left-0 right-0 top-0 z-[9999] flex items-center justify-center gap-3 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg"
      style={{ backgroundColor }}
    >
      <span>{message}</span>
      {isOnline && pendingCount > 0 && (
        <button
          type="button"
          onClick={flush}
          className="rounded border border-white/30 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white hover:bg-white/10"
        >
          Retry
        </button>
      )}
    </div>
  );
}
