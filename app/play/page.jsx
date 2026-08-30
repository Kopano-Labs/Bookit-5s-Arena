'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaFutbol, FaRedo, FaArrowRight } from 'react-icons/fa';

const TARGETS = [
  { id: 'tl', label: 'Top left', goal: true },
  { id: 'tc', label: 'Crossbar', goal: false },
  { id: 'tr', label: 'Top right', goal: true },
  { id: 'bl', label: 'Low left', goal: true },
  { id: 'bc', label: 'Keeper', goal: false },
  { id: 'br', label: 'Low right', goal: true },
];

export default function PlayPage() {
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [result, setResult] = useState(null);

  const shoot = (target) => {
    setShots((value) => value + 1);
    if (target.goal) {
      setScore((value) => value + 1);
      setResult('goal');
    } else {
      setResult('saved');
    }
  };

  const reset = () => {
    setScore(0);
    setShots(0);
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
            <FaFutbol /> Browser playground
          </span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">
            Take a penalty
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-400">
            A lightweight football mini-game. This score exists only in your current browser session;
            it is not a venue, league, reward, booking or competition record.
          </p>
        </div>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-gray-800 bg-black/45 p-5 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Session score</p>
              <p className="mt-1 text-2xl font-black text-green-400">{score} / {shots}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 text-xs font-black uppercase tracking-widest text-gray-300 hover:border-gray-700"
            >
              <FaRedo /> Reset
            </button>
          </div>

          <div className="relative mx-auto mt-7 min-h-[360px] max-w-2xl overflow-hidden rounded-2xl border-4 border-white/70 bg-green-950/60 p-4">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-5xl">🧤</div>

            <div className="relative z-10 grid min-h-[320px] grid-cols-3 grid-rows-2 gap-3">
              {TARGETS.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => shoot(target)}
                  className="min-h-[96px] rounded-xl border border-white/15 bg-black/15 px-2 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm transition hover:border-yellow-300/50 hover:bg-yellow-300/10 active:scale-[0.98] sm:text-xs"
                >
                  {target.label}
                </button>
              ))}
            </div>

            {result && (
              <div className="absolute inset-x-4 bottom-4 z-20 rounded-xl border border-white/10 bg-black/85 px-4 py-3 text-center backdrop-blur">
                <p className={`text-sm font-black uppercase tracking-widest ${result === 'goal' ? 'text-green-300' : 'text-red-300'}`}>
                  {result === 'goal' ? 'GOAL ⚽🔥' : 'SAVED 🧤'}
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/#pitches"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-5 text-xs font-black uppercase tracking-widest text-cyan-200"
          >
            Explore 3D concept <FaArrowRight />
          </Link>
          <Link
            href="/#courts"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-600 px-5 text-xs font-black uppercase tracking-widest text-white hover:bg-green-500"
          >
            Check court availability <FaArrowRight />
          </Link>
        </div>
      </div>
    </main>
  );
}
