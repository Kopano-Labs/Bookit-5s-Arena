import Link from 'next/link';
import { FaArchive, FaCalendarCheck, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from '@/lib/tournamentConfig';

export default function TournamentArchiveSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/8 bg-gray-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(245,197,66,0.11),transparent_38%)]" />
      <div className="relative mx-auto max-w-6xl rounded-[2.25rem] border border-amber-300/15 bg-black/35 p-6 shadow-2xl sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
              <FaArchive /> 2026 event archive
            </div>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.92] text-white sm:text-6xl">
              5s Arena World Cup <span className="text-amber-300">has concluded.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
              The inaugural World Cup window ran {TOURNAMENT_DATES.rangeShort} at Hellenic Football Club in Milnerton. Registration and prize CTAs are retired; this surface now preserves the event as historical evidence instead of presenting expired actions as live.
            </p>
          </div>

          <div className="grid min-w-[260px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaCalendarCheck /> Event window
              </p>
              <p className="mt-2 text-sm font-black uppercase text-white">{TOURNAMENT_DATES.rangeShort}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaMapMarkerAlt /> Venue
              </p>
              <p className="mt-2 text-sm font-black uppercase text-white">Hellenic FC · Milnerton</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaTrophy /> Format
              </p>
              <p className="mt-2 text-sm font-black uppercase text-white">
                {TOURNAMENT_FORMAT.groupCount} groups · {TOURNAMENT_FORMAT.totalTeams} teams
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/8 pt-6">
          <Link
            href="/tournament"
            className="inline-flex min-h-11 items-center rounded-xl bg-amber-300 px-5 text-[10px] font-black uppercase tracking-[0.16em] text-black transition hover:bg-amber-200"
          >
            Explore 2026 archive
          </Link>
          <Link
            href="/tournament/stats"
            className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white transition hover:border-white/20"
          >
            Historical stats
          </Link>
          <Link
            href="/rules-of-the-game"
            className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 text-[10px] font-black uppercase tracking-[0.16em] text-white transition hover:border-white/20"
          >
            Rules archive
          </Link>
        </div>
      </div>
    </section>
  );
}
