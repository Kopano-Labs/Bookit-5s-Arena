'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaArchive,
  FaArrowLeft,
  FaShieldAlt,
  FaSync,
  FaTrophy,
} from 'react-icons/fa';
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from '@/lib/tournamentConfig';

export default function PublicStandingsArchivePage() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadedAt, setLoadedAt] = useState(null);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tournament/standings', { cache: 'no-store' });
      if (response.ok) {
        const payload = await response.json();
        setGroups(payload.groups || {});
        setLoadedAt(new Date());
      }
    } catch {
      setGroups({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStandings();
  }, [fetchStandings]);

  const groupEntries = Object.entries(groups).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  return (
    <main className="min-h-screen bg-[#040609] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/tournament"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 transition hover:text-white"
        >
          <FaArrowLeft /> World Cup archive
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-green-300/15 bg-black/35 p-6 sm:p-8 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-300/20 bg-green-300/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-green-200">
            <FaArchive /> Recorded standings
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
            Group standings <span className="text-green-300">archive</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
            World Cup 2026 ended {TOURNAMENT_DATES.end}. This page performs a bounded historical read; the old live SSE indicator and “check back when the group stage begins” state have been retired.
          </p>
          {loadedAt ? (
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-600">
              Archive read · {loadedAt.toLocaleString('en-ZA')}
            </p>
          ) : null}
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <FaSync className="animate-spin text-3xl text-green-300" />
          </div>
        ) : groupEntries.length === 0 ? (
          <section className="mt-6 rounded-[2rem] border border-amber-300/15 bg-amber-300/[0.035] p-8 text-center">
            <FaTrophy className="mx-auto text-4xl text-amber-200" />
            <h2 className="mt-4 text-2xl font-black uppercase text-white">
              No recorded standings returned
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400">
              The current authoritative standings endpoint did not return a group table. Five’s Arena will not reconstruct one from demo data.
            </p>
          </section>
        ) : (
          <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {groupEntries.map(([groupLetter, teams]) => (
              <article
                key={groupLetter}
                className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03]"
              >
                <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-white">
                    Group {groupLetter}
                  </h2>
                  <span className="text-[9px] font-black uppercase tracking-widest text-green-300">
                    Historical read
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-[10px] font-bold">
                    <thead>
                      <tr className="text-gray-600">
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">Team</th>
                        <th className="px-2 py-3 text-center">MP</th>
                        <th className="px-2 py-3 text-center">W</th>
                        <th className="px-2 py-3 text-center">D</th>
                        <th className="px-2 py-3 text-center">L</th>
                        <th className="px-2 py-3 text-center">GF</th>
                        <th className="px-2 py-3 text-center">GA</th>
                        <th className="px-2 py-3 text-center">GD</th>
                        <th className="px-2 py-3 text-center text-white">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team, index) => (
                        <tr key={team._id || `${groupLetter}-${index}`} className="border-t border-white/5">
                          <td
                            className={`px-4 py-3 font-black ${
                              index < TOURNAMENT_FORMAT.advancePerGroup
                                ? 'border-l-2 border-l-green-500 text-green-300'
                                : 'text-gray-500'
                            }`}
                          >
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {team.worldCupTeamProfile ? (
                                <div className="relative h-7 w-7 shrink-0">
                                  <Image
                                    src={team.worldCupTeamProfile}
                                    alt={`${team.teamName || 'Team'} profile`}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                              ) : null}
                              <span className="text-white">{team.teamName || team.worldCupTeam || 'Recorded team'}</span>
                            </div>
                          </td>
                          <td className="px-2 py-3 text-center text-gray-400">{team.played ?? 0}</td>
                          <td className="px-2 py-3 text-center text-gray-400">{team.won ?? 0}</td>
                          <td className="px-2 py-3 text-center text-gray-400">{team.drawn ?? 0}</td>
                          <td className="px-2 py-3 text-center text-gray-400">{team.lost ?? 0}</td>
                          <td className="px-2 py-3 text-center text-gray-400">{team.goalsFor ?? 0}</td>
                          <td className="px-2 py-3 text-center text-gray-400">{team.goalsAgainst ?? 0}</td>
                          <td className="px-2 py-3 text-center text-gray-400">{team.goalDifference ?? 0}</td>
                          <td className="px-2 py-3 text-center font-black text-white">{team.points ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="mt-6 rounded-[2rem] border border-green-300/10 bg-green-300/[0.025] p-6">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-green-300">
            <FaShieldAlt /> Evidence rule
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Rows above are rendered only from the tournament standings endpoint. No live-state animation, synthetic scores or inferred qualification result is added by this page.
          </p>
        </section>
      </div>
    </main>
  );
}
