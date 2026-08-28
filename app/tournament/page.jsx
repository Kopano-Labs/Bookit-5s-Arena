import Link from "next/link";
import { FaArchive, FaCalendarAlt, FaFutbol, FaListOl, FaTrophy } from "react-icons/fa";
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from "@/lib/tournamentConfig";

export const metadata = {
  title: "World Cup 5s 2026 Archive",
  description:
    "Archive hub for the 5s Arena World Cup 2026 event window at Hellenic Football Club, Milnerton.",
};

const archiveLinks = [
  {
    href: "/tournament/standings",
    label: "Standings",
    description: "Review the tournament standings surface.",
    icon: FaListOl,
  },
  {
    href: "/tournament/fixtures",
    label: "Fixtures",
    description: "Review the tournament fixture surface.",
    icon: FaCalendarAlt,
  },
  {
    href: "/#courts",
    label: "Book a Court",
    description: "Return to the active 5s Arena booking experience.",
    icon: FaFutbol,
  },
];

export default function TournamentArchivePage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[2rem] border border-yellow-600/20 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-7 shadow-2xl sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-600/30 bg-yellow-600/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
              <FaArchive size={10} /> 2026 archive
            </span>
            <span className="rounded-full border border-gray-800 bg-black/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
              Registration closed {TOURNAMENT_DATES.signupDeadline}
            </span>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-500">
              5s Arena World Cup
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              The 2026 event window is closed.
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-400 sm:text-lg">
              The World Cup 5s public event window ran {TOURNAMENT_DATES.rangeShort} at Hellenic Football Club, Milnerton. The registration flow is no longer an active public action. Tournament reference surfaces remain available below while everyday court bookings and social football continue across 5s Arena.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
              <FaCalendarAlt className="text-yellow-500" />
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Event window</p>
              <p className="mt-1 font-black text-white">{TOURNAMENT_DATES.rangeShort}</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
              <FaTrophy className="text-yellow-500" />
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Format</p>
              <p className="mt-1 font-black text-white">{TOURNAMENT_FORMAT.totalTeams} teams</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
              <FaArchive className="text-yellow-500" />
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">Public state</p>
              <p className="mt-1 font-black text-white">Archived</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {archiveLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-gray-800 bg-gray-900/60 p-6 transition hover:border-yellow-600/40 hover:bg-yellow-600/5"
              >
                <Icon className="text-yellow-500" size={20} />
                <h2 className="mt-4 text-lg font-black uppercase tracking-wide text-white group-hover:text-yellow-400">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">{item.description}</p>
              </Link>
            );
          })}
        </section>

        <p className="mt-8 text-center text-xs leading-6 text-gray-600">
          Archive state prevents expired registration and live-event marketing from being presented as current activity.
        </p>
      </div>
    </main>
  );
}
