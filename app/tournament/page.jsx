import Link from 'next/link';
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaUsers,
} from 'react-icons/fa';

export const metadata = {
  title: 'Competitions at Five’s Arena',
  description:
    'Ask about team events or book a court at Five’s Arena. Competition dates and team entry details are not currently published.',
};

const competitionLinks = [
  {
    href: '/events-and-services',
    title: 'Plan a team event',
    note: 'Ask about a private match, team day or local competition format.',
    icon: FaUsers,
  },
  {
    href: '/#courts',
    title: 'Book a court',
    note: 'Choose a court and book a time for your next game.',
    icon: FaCalendarCheck,
  },
  {
    href: '/fixtures',
    title: 'Follow fixtures',
    note: 'See current match information when fixtures are available.',
    icon: FaMapMarkerAlt,
  },
];

export default function CompetitionsPage() {
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
            <FaCalendarCheck /> Competition information
          </div>

          <h1 className="mt-6 max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-tight sm:text-7xl lg:text-8xl">
            Competitions at <span className="text-amber-300">Five&apos;s Arena</span>
          </h1>

          <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
            Competition dates and team entry details are not currently published.
            Ask about current team options or book a court for your next game.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaCalendarCheck /> Event window
              </p>
              <p className="mt-3 text-sm font-black uppercase text-white">
                No dates published
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaMapMarkerAlt /> Venue
              </p>
              <p className="mt-3 text-sm font-black uppercase text-white">
                Ask about venue and format
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaUsers /> Field
              </p>
              <p className="mt-3 text-sm font-black uppercase text-white">
                5-a-side football
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                <FaUsers /> Team entry
              </p>
              <p className="mt-3 text-sm font-black uppercase text-amber-200">
                Ask about team options
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {competitionLinks.map((item) => {
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
                  Explore →
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2rem] border border-green-300/10 bg-green-300/[0.025] p-6 sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">
            Team football
          </p>
          <h2 className="mt-3 text-2xl font-black uppercase text-white">
            Looking for a team event?
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
            Ask our team about a private match, team day or local competition.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-green-300/20 bg-green-300/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-green-200 transition hover:bg-green-300/15 hover:text-white"
          >
            Contact the Arena
          </Link>
        </section>
      </div>
    </main>
  );
}
