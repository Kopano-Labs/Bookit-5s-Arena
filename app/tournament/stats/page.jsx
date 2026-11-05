'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaArchive,
  FaArrowLeft,
  FaCalendarCheck,
  FaChartBar,
  FaFutbol,
  FaShieldAlt,
  FaTrophy,
  FaUsers,
} from 'react-icons/fa';
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from '@/lib/tournamentConfig';

export default function TournamentStatsArchivePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/tournament', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (mounted) setData(payload);
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const registeredCount = loading ? '—' : data?.registeredCount ?? 'Unavailable';

  return (
    <main className="min-h-screen bg-[#040609] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/tournament"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 transition hover:text-white"
        >
          <FaArrowLeft /> World Cup archive
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-green-300/15 bg-black/35 p-6 sm:p-8 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-300/20 bg-green-300/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-green-200">
            <FaArchive /> Historical statistics
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
            World Cup 2026 <span className="text-green-300">archive data</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
            The competition ran {TOURNAMENT_DATES.rangeShort}. This page now reports stored historical configuration and registration records only; countdowns and registration CTAs are retired.
          </p>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
            <FaUsers className="mx-auto text-green-300" />
            <p className="mt-3 text-3xl font-black text-white">{registeredCount}</p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-500">
              Stored registrations
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
            <FaTrophy className="mx-auto text-amber-300" />
            <p className="mt-3 text-3xl font-black text-white">{TOURNAMENT_FORMAT.totalTeams}</p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-500">
              Planned slots
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
            <FaChartBar className="mx-auto text-blue-300" />
            <p className="mt-3 text-3xl font-black text-white">{TOURNAMENT_FORMAT.groupCount}</p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-500">
              Groups
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
            <FaFutbol className="mx-auto text-purple-300" />
            <p className="mt-3 text-3xl font-black text-white">{TOURNAMENT_FORMAT.teamsPerGroup}</p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-500">
              Teams per group
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 sm:p-8">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <FaCalendarCheck /> Historical format
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ['Event window', TOURNAMENT_DATES.rangeLong],
              ['Registration deadline', TOURNAMENT_DATES.signupDeadline],
              ['Venue', 'Hellenic Football Club, Milnerton'],
              ['Group model', `${TOURNAMENT_FORMAT.groupCount} groups × ${TOURNAMENT_FORMAT.teamsPerGroup} teams`],
              ['Advancement', TOURNAMENT_FORMAT.qualificationLegend],
              ['Planned bracket', TOURNAMENT_FORMAT.bracket.join(' → ')],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{label}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-gray-200">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-amber-300/12 bg-amber-300/[0.025] p-6">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
            <FaShieldAlt /> Evidence boundary
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Planned capacity and format are configuration evidence. They are not proof that every planned match occurred, nor proof of results, attendance, prizes or a champion.
          </p>
        </section>
      </div>
    </main>
  );
}
