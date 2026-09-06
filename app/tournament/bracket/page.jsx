import Link from 'next/link';
import {
  FaArchive,
  FaArrowLeft,
  FaChartBar,
  FaExclamationTriangle,
  FaShieldAlt,
  FaTrophy,
} from 'react-icons/fa';
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from '@/lib/tournamentConfig';

export const metadata = {
  title: 'World Cup 2026 Bracket Archive | Five’s Arena',
  description:
    'Evidence-first bracket archive for the completed Five’s Arena World Cup 2026. Results are shown only when authoritative tournament records exist.',
};

export default function BracketArchivePage() {
  return (
    <main className="min-h-screen bg-[#040609] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/tournament"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 transition hover:text-white"
        >
          <FaArrowLeft /> World Cup archive
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-amber-300/15 bg-black/35 p-6 sm:p-8 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
            <FaArchive /> Historical bracket
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
            Knockout bracket <span className="text-amber-300">evidence state</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
            The 2026 competition concluded {TOURNAMENT_DATES.end}. The previous public bracket contained demonstration scores rather than an authoritative competition ledger. Those mock results have been removed.
          </p>
        </section>

        <section className="mt-6 rounded-[2rem] border border-red-300/15 bg-red-300/[0.035] p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-300/15 bg-red-300/8 text-red-200">
              <FaExclamationTriangle />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200">
                Authoritative result ledger not attached
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">
                No winner path is published from synthetic data.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
                Bracket teams, scores, penalties, winners and the champion remain unavailable here until a verified tournament source is connected. Missing evidence is preserved as missing evidence.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Format</p>
            <p className="mt-2 text-sm font-black uppercase text-white">
              {TOURNAMENT_FORMAT.knockoutTeams} knockout qualifiers
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Planned rounds</p>
            <p className="mt-2 text-sm font-black uppercase text-white">
              {TOURNAMENT_FORMAT.bracket.length} stages
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Result state</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-black uppercase text-amber-200">
              <FaShieldAlt /> Evidence pending
            </p>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/tournament/standings"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white"
          >
            <FaChartBar /> Recorded standings
          </Link>
          <Link
            href="/tournament/stats"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white"
          >
            <FaTrophy /> Archive statistics
          </Link>
        </div>
      </div>
    </main>
  );
}
