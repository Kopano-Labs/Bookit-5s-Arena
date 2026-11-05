import AdaptiveMatchWorld from '@/components/apwa/AdaptiveMatchWorld';
import { classifyDataTruth } from '@/lib/apwa/dataTruth';

export const metadata = {
  title: 'APWA Proof · 5s Arena',
  description: 'Adaptive runtime, data-truth, progressive-update and deterministic Three.js physics proof for 5s Arena.',
};

const progressiveUpdateStages = [
  {
    stage: 'S1_IMPLEMENTED',
    label: 'CRUD ready',
    detail: 'A mutation intent has an explicit resource, operation and stable update identity.',
  },
  {
    stage: 'S2_POC',
    label: 'Persisted locally',
    detail: 'The existing IndexedDB queue has durably stored the action for executable replay.',
  },
  {
    stage: 'S3_SYNCED',
    label: 'SWFUS synchronized',
    detail: 'The server accepted the exact idempotent envelope and returned a matching synchronization receipt.',
  },
] as const;

export default function ApwaProofPage() {
  const receipt = classifyDataTruth({
    data: { route: '/api/football/featured' },
    observedAt: new Date('2026-08-16T20:00:00.000Z'),
    sourceTimestamp: new Date('2026-08-16T19:59:00.000Z'),
    source: 'proof-fixture',
  });

  return (
    <main style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 20px 80px', display: 'grid', gap: 36 }}>
      <header>
        <p style={{ textTransform: 'uppercase', letterSpacing: '.14em', opacity: 0.7 }}>5s Arena · governed POC</p>
        <h1 style={{ fontSize: 'clamp(2.5rem,8vw,6rem)', lineHeight: 0.95, margin: '12px 0' }}>Progressive shell.<br />Adaptive runtime.<br />Resilient continuity.</h1>
        <p style={{ maxWidth: 780, fontSize: '1.1rem' }}>This route proves the architecture without pretending every device deserves the same workload. Capability signals decide whether the court runs full Three.js + deterministic physics, a lighter 3D lane, or a static fallback.</p>
      </header>

      <AdaptiveMatchWorld />

      <section style={{ display: 'grid', gap: 12 }}>
        <h2>Adaptive Progressive Updates</h2>
        <p style={{ maxWidth: 820 }}>
          New browser-queued actions use the existing offline transport as a progressive proof path instead of creating a second synchronization system. Each stage has to earn the next receipt.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          {progressiveUpdateStages.map((item) => (
            <article key={item.stage} style={{ padding: 18, borderRadius: 18, border: '1px solid rgba(127,127,127,.28)', background: 'rgba(127,127,127,.08)' }}>
              <p style={{ margin: 0, fontSize: '.76rem', fontWeight: 800, letterSpacing: '.08em' }}>{item.stage}</p>
              <h3 style={{ margin: '8px 0' }}>{item.label}</h3>
              <p style={{ margin: 0, opacity: 0.82 }}>{item.detail}</p>
            </article>
          ))}
        </div>
        <p style={{ margin: 0, opacity: 0.72 }}>
          Boundary: S3 proves synchronization of the exact update proposal. It does not claim a booking/payment domain write, PSO operationalization or S5 governance promotion.
        </p>
      </section>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2>Data truth membrane</h2>
        <p>Provider → validate → normalize → freshness → cache → UI. The UI receives an explicit state instead of pretending cached data is live.</p>
        <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 18, borderRadius: 16, background: 'rgba(127,127,127,.12)' }}>{JSON.stringify(receipt, null, 2)}</pre>
      </section>

      <section>
        <h2>Hard boundaries</h2>
        <ul>
          <li>Private/auth/booking/payment/admin APIs are never service-worker cached.</li>
          <li>Physics advances in a fixed 1/60 s step and remains isolated from booking/account state.</li>
          <li>Reduced-motion and missing WebGL produce a static court, not a broken canvas.</li>
          <li>APU synchronization receipts cannot self-promote into domain-write, PSO or governed truth.</li>
          <li>TypeScript 7 remains a compatibility gate until production compiler promotion is separately evidenced.</li>
        </ul>
      </section>
    </main>
  );
}
