"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFutbol, FaTrophy, FaArrowLeft, FaUndo, FaShieldAlt, FaWhatsapp } from "react-icons/fa";

export default function PlayPage() {
  const [shotState, setShotState] = useState("ready"); // "ready", "goal", "miss", "post"
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);

  const handleShoot = (target) => {
    setShotsTaken((t) => t + 1);

    // Realistic penalty physics
    if (target === "top-left" || target === "top-right") {
      setShotState("goal");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((s) => s + 3);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
    } else if (target === "bottom-left" || target === "bottom-right") {
      // 80% chance goal, 20% save
      const isSaved = Math.random() < 0.2;
      if (isSaved) {
        setShotState("miss");
        setStreak(0);
      } else {
        setShotState("goal");
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setScore((s) => s + 2);
        if (nextStreak > bestStreak) setBestStreak(nextStreak);
      }
    } else if (target === "crossbar") {
      setShotState("post");
      setStreak(0);
    } else {
      setShotState("miss");
      setStreak(0);
    }
  };

  const handleReset = () => {
    setShotState("ready");
  };

  return (
    <div className="relative min-h-screen bg-gray-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      {/* Top Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,197,94,0.15),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 transition hover:text-white"
          >
            <FaArrowLeft /> Return to Arena
          </Link>
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-yellow-400">
            Arena Play Lab
          </span>
        </div>

        {/* Header */}
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight sm:text-6xl">
            Cape Town <span className="text-green-400">Penalty Shootout</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-300">
            Step up to the spot under the floodlights at Hellenic FC. Pick your corner, beat the keeper, and set the arena high score!
          </p>
        </div>

        {/* Scoreboard Bar */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 text-center backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Points</span>
            <p className="mt-1 text-2xl font-black text-white sm:text-3xl">{score}</p>
          </div>
          <div className="rounded-2xl border border-green-500/30 bg-green-950/40 p-4 text-center backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Streak</span>
            <p className="mt-1 text-2xl font-black text-green-300 sm:text-3xl">{streak} 🔥</p>
          </div>
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-950/40 p-4 text-center backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">Best Streak</span>
            <p className="mt-1 text-2xl font-black text-yellow-300 sm:text-3xl">{bestStreak} 🏆</p>
          </div>
        </div>

        {/* Goal Area Container */}
        <div className="relative mx-auto mt-8 h-[340px] w-full max-w-2xl overflow-hidden rounded-3xl border-4 border-white/80 bg-green-950 shadow-2xl">
          {/* Net Crosshatch */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* Turf Base */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-900 to-transparent" />

          {/* Goalkeeper */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-5xl sm:text-6xl">
            🧤
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hellenic Keeper</div>
          </div>

          {/* Target Click Grid */}
          {shotState === "ready" && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-3 p-4">
              <button
                onClick={() => handleShoot("top-left")}
                className="flex items-center justify-center rounded-xl border-2 border-dashed border-green-400/40 bg-green-900/20 text-xs font-black uppercase tracking-wider text-green-300 transition hover:scale-105 hover:border-green-400 hover:bg-green-500 hover:text-black"
              >
                Top Left 🎯 (+3)
              </button>
              <button
                onClick={() => handleShoot("crossbar")}
                className="flex items-center justify-center rounded-xl border border-gray-700 bg-black/40 text-[10px] font-black uppercase tracking-wider text-gray-400 transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Crossbar Bar
              </button>
              <button
                onClick={() => handleShoot("top-right")}
                className="flex items-center justify-center rounded-xl border-2 border-dashed border-green-400/40 bg-green-900/20 text-xs font-black uppercase tracking-wider text-green-300 transition hover:scale-105 hover:border-green-400 hover:bg-green-500 hover:text-black"
              >
                Top Right 🎯 (+3)
              </button>
              <button
                onClick={() => handleShoot("bottom-left")}
                className="flex items-center justify-center rounded-xl border border-green-500/30 bg-black/40 text-xs font-black uppercase tracking-wider text-green-400 transition hover:bg-green-600 hover:text-white"
              >
                Bottom Left (+2)
              </button>
              <button
                onClick={() => handleShoot("center")}
                className="flex items-center justify-center rounded-xl border border-gray-700 bg-black/40 text-[10px] font-black uppercase tracking-wider text-gray-500 transition hover:bg-red-500/40 hover:text-white"
              >
                Direct Center
              </button>
              <button
                onClick={() => handleShoot("bottom-right")}
                className="flex items-center justify-center rounded-xl border border-green-500/30 bg-black/40 text-xs font-black uppercase tracking-wider text-green-400 transition hover:bg-green-600 hover:text-white"
              >
                Bottom Right (+2)
              </button>
            </div>
          )}

          {/* Result Overlays */}
          {shotState === "goal" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
              <span className="text-5xl">⚽🔥 GOOOAL!</span>
              <p className="mt-2 text-sm font-black uppercase tracking-wider text-green-400">
                Top Bins! Unstoppable strike!
              </p>
              <button
                onClick={handleReset}
                className="mt-4 flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-green-600/30 transition hover:bg-green-500"
              >
                <FaUndo /> Take Next Penalty
              </button>
            </div>
          )}

          {shotState === "miss" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
              <span className="text-5xl">🧤 SAVED!</span>
              <p className="mt-2 text-sm font-black uppercase tracking-wider text-red-400">
                The keeper anticipated your shot!
              </p>
              <button
                onClick={handleReset}
                className="mt-4 flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-gray-700"
              >
                <FaUndo /> Try Again
              </button>
            </div>
          )}

          {shotState === "post" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
              <span className="text-5xl">💥 OFF THE POST!</span>
              <p className="mt-2 text-sm font-black uppercase tracking-wider text-yellow-400">
                Rattled the woodwork! Inches away!
              </p>
              <button
                onClick={handleReset}
                className="mt-4 flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-gray-700"
              >
                <FaUndo /> Try Again
              </button>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/#courts"
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-600/20 transition hover:bg-green-500"
          >
            <FaFutbol /> Book Real Pitch at Hellenic FC
          </Link>
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-green-800/60 bg-green-950/40 px-6 py-3 text-xs font-black uppercase tracking-widest text-green-400 transition hover:border-green-600"
          >
            <FaWhatsapp /> Inquire via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
