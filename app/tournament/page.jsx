import Link from 'next/link';
import {
  FaArchive,
  FaArrowLeft,
  FaCalendarCheck,
  FaChartBar,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTrophy,
  FaUsers,
} from 'react-icons/fa';
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from '@/lib/tournamentConfig';

export const metadata = {
  title: 'World Cup 5s 2026 Archive | Five’s Arena',
  description:
    'Historical archive for the inaugural Five’s Arena World Cup 5s held at Hellenic Football Club in Milnerton from 29–31 May 2026.',
};

const archiveLinks = [
  {
    href: '/tournament/stats',
    title: 'Historical statistics',
    note: 'Inspect recorded tournament statistics and evidence where data exists.',
    icon: FaChartBar,
  },
  {
    href: '/tournament/bracket',
    title: 'Competition bracket',
    note: 'Review the knockout structure as an archived competition surface.',
    icon: FaTrophy,
  },
  {
    href: '/rules-of-the-game',
    title: 'Rules archive',
    note: 'Preserve the rules that governed the 2026 competition.',
    icon: FaShieldAlt,
  },
];

export default function TournamentArchivePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#040609] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,66,0.12),transparent_38%),radial-gradient(circle_at_12%_80%,rgba(57,217,138,0.08),transparent_35%)]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 transition hover:border-white/20 hover:text-white"
        >
          <FaArrowLeft /> Back to arena
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-amber-300/15 bg-black/35 p-6 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
            <FaArchive /> Archived · concluded 31 May 2026
          </div>

          <h1 className="mt-6 max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-7xl lg:text-8xl">
            5s Arena World Cup <span className="text-amber-300">2026</span>
          </h1>

          <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
            This competition is no longer accepting registrations or payments. The inaugural event window ran {TOURNAMENT_DATES.rangeShort} at Hellenic Football Club in Milnerton. This route now preserves the competition as evidence instead of presenting expired actions as current.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaCalendarCheck /> Event window
              </p>
              <p className="mt-3 text-sm font-black uppercase text-white">
                {TOURNAMENT_DATES.rangeShort}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaMapMarkerAlt /> Venue
              </p>
              <p className="mt-3 text-sm font-black uppercase text-white">
                Hellenic FC · Milnerton
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaUsers /> Field
              </p>
              <p className="mt-3 text-sm font-black uppercase text-white">
                {TOURNAMENT_FORMAT.totalTeams}-team format
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaShieldAlt /> Registration state
              </p>
              <p className="mt-3 text-sm font-black uppercase text-amber-200">
                Closed · {TOURNAMENT_DATES.signupDeadline}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {archiveLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-amber-300/20 hover:bg-amber-300/[0.035]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/8 text-amber-200">
                  <Icon size={18} />
                </div>
                <h2 className="mt-5 text-xl font-black uppercase text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {item.note}
                </p>
                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200 transition group-hover:translate-x-1">
                  Open archive →
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2rem] border border-green-300/10 bg-green-300/[0.025] p-6 sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">
            Truth boundary
          </p>
          <h2 className="mt-3 text-2xl font-black uppercase text-white">
            Historical claims require receipts.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
            Results, champions, attendance, prizes and performance claims are surfaced only when the underlying tournament records provide evidence. Missing evidence remains missing instead of being reconstructed from promotional copy.
          </p>
        </section>
      </div>
    </main>
  );
}
