import Link from "next/link";
import { FaArchive, FaArrowRight, FaCalendarAlt, FaTrophy } from "react-icons/fa";
import { TOURNAMENT_DATES } from "@/lib/tournamentConfig";

export default function TournamentSection() {
  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-yellow-600/20 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-7 shadow-2xl sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-600/30 bg-yellow-600/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
            <FaArchive size={10} /> 2026 World Cup archive
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-500">
            <FaCalendarAlt /> {TOURNAMENT_DATES.rangeShort}
          </span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black uppercase leading-tight text-white sm:text-5xl">
              The tournament window has closed. The football continues.
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
              The World Cup 5s campaign is now preserved as a 2026 archive instead of being presented as a live registration event. Court bookings, social football, events, and current arena activity remain active across 5s Arena.
            </p>
          </div>

          <Link
            href="/tournament"
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-yellow-600/30 bg-yellow-600/10 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-yellow-400 transition hover:bg-yellow-600/20"
          >
            <FaTrophy /> Open archive <FaArrowRight size={10} />
          </Link>
        </div>
      </div>
    </section>
  );
}
