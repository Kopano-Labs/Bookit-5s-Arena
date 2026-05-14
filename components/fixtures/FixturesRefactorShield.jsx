"use client";

import { BLACKBOX_PROTOCOL_LABEL } from "@/lib/blackboxMicrosoftGamingProtocol";

export default function FixturesRefactorShield() {
  return (
    <div
      className="relative z-40 mx-auto mb-8 max-w-6xl overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black px-5 py-4 shadow-[0_0_40px_rgba(245,158,11,0.12)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-400">
            {BLACKBOX_PROTOCOL_LABEL} — fixtures refactor
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            Match centre upgrade in progress. Premier League 2025-26 is the most reliable path right now.
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            We are rebuilding Today / Upcoming / Results rails and league fallbacks. Use the season toggle on
            2025-26 for live tables and stats.
          </p>
        </div>
        <a
          href="/fixtures?league=premier-league"
          className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-black hover:bg-amber-400"
        >
          Open PL hub
        </a>
      </div>
    </div>
  );
}
