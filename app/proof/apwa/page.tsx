import AdaptiveMatchWorld from "@/components/apwa/AdaptiveMatchWorld";
import { classifyDataTruth } from "@/lib/apwa/dataTruth";
import Link from "next/link";
import { FaArrowLeft, FaFutbol, FaGamepad, FaTrophy } from "react-icons/fa";

export const metadata = {
  title: "APWA Proof · 5s Arena",
  description: "Adaptive progressive web application proof, data-truth classification, and deterministic physics for 5s Arena.",
};

const progressiveUpdateStages = [
  {
    stage: "S1_IMPLEMENTED",
    label: "CRUD ready",
    detail: "A mutation intent has an explicit resource, operation and stable update identity.",
  },
  {
    stage: "S2_POC",
    label: "Persisted locally",
    detail: "The existing IndexedDB queue has durably stored the action for executable replay.",
  },
  {
    stage: "S3_SYNCED",
    label: "SWFUS synchronized",
    detail: "The server accepted the exact idempotent envelope and returned a matching synchronization receipt.",
  },
] as const;

export default function ApwaProofPage() {
  const receipt = classifyDataTruth({
    data: { route: "/api/football/featured" },
    observedAt: new Date("2026-08-16T20:00:00.000Z"),
    sourceTimestamp: new Date("2026-08-16T19:59:00.000Z"),
    source: "proof-fixture",
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-white sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 transition hover:text-white"
        >
          <FaArrowLeft /> Return to Arena
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/play"
            className="flex items-center gap-1.5 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-400 hover:bg-yellow-500/20"
          >
            <FaGamepad /> Play Minigame
          </Link>
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-green-400">
            APWA Canonical Proof
          </span>
        </div>
      </div>

      <header className="mt-8">
        <p className="text-xs font-black uppercase tracking-widest text-green-400">5s Arena · Governed APWA Runtime</p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl" style={{ fontFamily: "Impact, Arial Black, sans-serif" }}>
          Progressive Shell · <span className="text-yellow-500">Adaptive Runtime</span> · Resilient Truth
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
          This route proves the APWA architecture without pretending every mobile device deserves the same heavy GPU workload. Capability signals decide whether the court runs full Three.js + deterministic physics, a lighter 3D lane, or a static fallback.
        </p>
      </header>

      {/* Adaptive 3D Match World */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <AdaptiveMatchWorld />
      </div>

      {/* Progressive Updates Stages */}
      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-white sm:text-2xl">
          Adaptive Progressive Updates (SWFUS)
        </h2>
        <p className="max-w-3xl text-sm text-gray-400">
          New browser-queued actions use the existing offline transport as a progressive proof path instead of creating a second synchronization system. Each stage earns its verifiable receipt.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {progressiveUpdateStages.map((item) => (
            <article
              key={item.stage}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition hover:border-gray-700"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400">{item.stage}</p>
              <h3 className="mt-2 text-base font-bold text-white">{item.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Data Truth Membrane */}
      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-white sm:text-2xl">
          Data Truth Membrane
        </h2>
        <p className="text-sm text-gray-400">
          Provider → Validate → Normalize → Freshness → Cache → UI. The UI receives an explicit state instead of pretending stale cached data is live.
        </p>
        <pre className="overflow-x-auto rounded-2xl border border-gray-800 bg-black/70 p-4 text-xs font-mono text-green-400">
          {JSON.stringify(receipt, null, 2)}
        </pre>
      </section>

      {/* Hard Invariants */}
      <section className="mt-12 rounded-3xl border border-gray-800 bg-gray-900/30 p-6 sm:p-8">
        <h2 className="text-lg font-black uppercase tracking-wider text-yellow-400">
          Hard System Invariants
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-xs text-gray-300">
          <li>Private/auth/booking/payment/admin APIs are never service-worker cached.</li>
          <li>Physics advances in a fixed 1/60 s step and remains isolated from booking/account state.</li>
          <li>Reduced-motion and missing WebGL produce a static court, not a broken canvas.</li>
          <li>APU synchronization receipts cannot self-promote into domain-write, PSO or governed truth.</li>
          <li>Every mutation follows the CRUD → SWFUS → KPCB+ protocol pipeline.</li>
        </ul>
      </section>
    </main>
  );
}
