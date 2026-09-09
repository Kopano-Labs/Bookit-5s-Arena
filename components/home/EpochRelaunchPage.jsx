"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  CANONICAL_OUTBOUND_LINKS,
  KPGSTHREE_EXPERIMENT_ID,
  KPGSTHREE_MODULE_NAME,
  KPGSTHREE_STATUS,
  KPGSTHREE_VISUAL_THESIS,
  VALIDATED_DISCOVERY_METRICS,
} from "@/lib/experiments/KPGSTHREE";

const KPGSTHREEScene = dynamic(() => import("@/components/experiments/KPGSTHREEScene"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.18),transparent_42%),linear-gradient(160deg,#04120a_0%,#030506_100%)]"
      aria-hidden="true"
    />
  ),
});

const CTAS = [
  {
    key: "kopanoLabs",
    label: "Kopano Labs",
    href: CANONICAL_OUTBOUND_LINKS.kopanoLabs,
    note: "Studio & platform lane",
  },
  {
    key: "krrababalela",
    label: "KRRababalela",
    href: CANONICAL_OUTBOUND_LINKS.krrababalela,
    note: "Founder portfolio",
  },
  {
    key: "linkedIn",
    label: "LinkedIn",
    href: CANONICAL_OUTBOUND_LINKS.linkedIn,
    note: "Professional contact",
  },
];

export default function EpochRelaunchPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      data-testid="epoch-relaunch-root"
      className="relative min-h-screen overflow-hidden text-white"
      style={{ backgroundColor: "#030506" }}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <KPGSTHREEScene scrollProgress={scrollProgress} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-emerald-400/90">
          FivesArena · Epoch transition
        </p>

        <h1 className="mt-5 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
          FivesArena is evolving.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
          The venue proved the need. The platform is becoming something bigger.
        </p>

        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-400">
          Experiment {KPGSTHREE_EXPERIMENT_ID} — {KPGSTHREE_MODULE_NAME}
          <span className="ml-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] tracking-[0.16em] text-yellow-300">
            {KPGSTHREE_STATUS}
          </span>
        </p>

        <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
          Visual thesis: {KPGSTHREE_VISUAL_THESIS}. Product engine, history, SEO equity, and
          evidence remain preserved while the public surface parks for the next venue and investor
          lane.
        </p>

        <nav
          aria-label="Canonical outbound identity"
          className="mt-10 grid gap-3 sm:grid-cols-3"
          data-testid="epoch-canonical-ctas"
        >
          {CTAS.map((cta) => (
            <a
              key={cta.key}
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cta={cta.key}
              className="group rounded-2xl border border-white/10 bg-black/35 px-5 py-4 backdrop-blur-sm transition hover:border-emerald-400/40 hover:bg-emerald-500/5"
            >
              <p className="text-sm font-black uppercase tracking-[0.14em] text-white group-hover:text-emerald-200">
                {cta.label}
              </p>
              <p className="mt-2 text-xs text-gray-500">{cta.note}</p>
              <p className="mt-3 break-all text-[11px] text-emerald-400/80">{cta.href}</p>
            </a>
          ))}
        </nav>

        <section
          aria-labelledby="discovery-evidence-heading"
          className="mt-12 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm"
          data-testid="epoch-discovery-metrics"
        >
          <h2
            id="discovery-evidence-heading"
            className="text-[11px] font-black uppercase tracking-[0.22em] text-yellow-400"
          >
            Validated product-discovery evidence
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Search performance receipts only. No bookings, revenue, or conversion claims.
          </p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">
                {VALIDATED_DISCOVERY_METRICS.august2026.label}
              </dt>
              <dd className="mt-2 text-2xl font-black text-white">
                {VALIDATED_DISCOVERY_METRICS.august2026.impressions}
              </dd>
              <dd className="mt-1 text-sm text-emerald-300">
                {VALIDATED_DISCOVERY_METRICS.august2026.clicks} Google clicks
              </dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">
                {VALIDATED_DISCOVERY_METRICS.june2026.label} baseline
              </dt>
              <dd className="mt-2 text-2xl font-black text-white">
                {VALIDATED_DISCOVERY_METRICS.june2026.impressions}
              </dd>
              <dd className="mt-1 text-sm text-emerald-300">
                {VALIDATED_DISCOVERY_METRICS.june2026.clicks} Google clicks
              </dd>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-500">
                {VALIDATED_DISCOVERY_METRICS.ionosAssessment.label}
              </dt>
              <dd className="mt-2 text-2xl font-black capitalize text-white">
                {VALIDATED_DISCOVERY_METRICS.ionosAssessment.optimisation}
              </dd>
              <dd className="mt-1 text-sm text-gray-400">Optimisation rating</dd>
            </div>
          </dl>
        </section>

        <p className="mt-8 max-w-2xl text-xs leading-6 text-gray-500">
          Domain remains indexable at https://fivesarena.com/. Repository, database, screenshots,
          Search Console verification, and deployment history are retained. This page is a parked
          relaunch shell — not a venue booking surface.
        </p>
      </div>
    </main>
  );
}
