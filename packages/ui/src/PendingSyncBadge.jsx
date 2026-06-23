"use client";

export default function PendingSyncBadge({ isPending = true, showLabel = true }) {
  if (!isPending) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400">
      <span
        className="inline-block h-2 w-2 rounded-full bg-[#00E676] shadow-[0_0_0_4px_rgba(0,230,118,0.14)] motion-safe:animate-pulse"
        title="Syncing when online"
      />
      {showLabel ? <span>Syncing when online</span> : <span className="sr-only">Syncing when online</span>}
    </span>
  );
}
