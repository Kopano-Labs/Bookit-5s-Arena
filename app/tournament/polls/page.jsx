import Link from 'next/link';
import {
  FaArchive,
  FaArrowLeft,
  FaPoll,
  FaShieldAlt,
} from 'react-icons/fa';
import { TOURNAMENT_DATES } from '@/lib/tournamentConfig';

export const metadata = {
  title: 'World Cup 2026 Polls Archive | Five’s Arena',
  description:
    'Evidence-first archive for fan polling from the completed Five’s Arena World Cup 2026.',
};

export default function TournamentPollsArchivePage() {
  return (
    <main className="min-h-screen bg-[#040609] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/tournament"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 transition hover:text-white"
        >
          <FaArrowLeft /> World Cup archive
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-blue-300/15 bg-black/35 p-6 sm:p-8 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
            <FaArchive /> Polling archive
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
            Fan votes <span className="text-blue-300">closed</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
            World Cup 2026 concluded {TOURNAMENT_DATES.end}. This route no longer accepts client-side demonstration votes and does not publish synthetic totals as historical fact.
          </p>
        </section>

        <section className="mt-6 rounded-[2rem] border border-amber-300/15 bg-amber-300/[0.035] p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/8 text-amber-200">
              <FaPoll />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
                Vote ledger unavailable
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">
                No poll winner is asserted without receipts.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
                The previous page used hard-coded player names, vote totals and a winner for demonstration. Those values were not an authoritative tournament voting ledger and have been removed from the public archive.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-green-300/10 bg-green-300/[0.025] p-6 sm:p-8">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-green-300">
            <FaShieldAlt /> Archive policy
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Future polls need server-side persistence, one governed voter identity/rate policy, auditable totals and a close timestamp before Five’s Arena can publish results as evidence.
          </p>
        </section>
      </div>
    </main>
  );
}
