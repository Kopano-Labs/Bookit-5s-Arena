"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFutbol, FaHome, FaWhatsapp, FaArrowLeft, FaUndo } from "react-icons/fa";

export default function NotFound() {
  const [shotState, setShotState] = useState("ready"); // "ready", "goal", "miss"
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const handleShoot = (target) => {
    if (target === "top-corner" || target === "bottom-corner") {
      setShotState("goal");
      setScore((s) => s + 1);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setShotState("miss");
      setStreak(0);
    }
  };

  const handleReset = () => {
    setShotState("ready");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      {/* Radial Glow Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,197,94,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Badge */}
        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
          404 · Out of Bounds
        </span>

        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          Ball Kicked <span className="text-green-400">Over the Roof!</span>
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
          Eish! That shot cleared the Hellenic FC floodlights. While the ballboy runs to fetch it outside the stadium, test your finishing in the penalty box!
        </p>

        {/* ── Interactive Penalty Shootout Minigame ── */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-gray-800 bg-black/70 p-5 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Penalty Box
              </span>
              {streak > 1 && (
                <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-yellow-400 animate-pulse">
                  🔥 {streak} Streak!
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase font-bold text-gray-400">Best: {bestStreak}</span>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-black uppercase text-green-400 border border-green-500/30">
                Score: {score}
              </span>
            </div>
          </div>

          {/* Goal Visual */}
          <div className="relative mx-auto mt-5 h-52 w-full max-w-md rounded-xl border-4 border-white/80 bg-green-950/40 p-2 shadow-inner">
            {/* Goal Net Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:16px_16px]" />

            {/* Goalkeeper Silhouette */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-4xl pointer-events-none select-none">
              🧤
            </div>

            {/* Target Click Areas */}
            {shotState === "ready" && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-2">
                <button
                  onClick={() => handleShoot("top-corner")}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-[10px] sm:text-xs font-black uppercase text-green-400 transition hover:bg-green-500 hover:text-black active:scale-95 cursor-pointer"
                >
                  Top Left 🎯
                </button>
                <button
                  onClick={() => handleShoot("center")}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-700/60 bg-black/40 text-[10px] sm:text-xs font-black uppercase text-gray-400 transition hover:bg-red-500/40 hover:text-white active:scale-95 cursor-pointer"
                >
                  Crossbar
                </button>
                <button
                  onClick={() => handleShoot("top-corner")}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-[10px] sm:text-xs font-black uppercase text-green-400 transition hover:bg-green-500 hover:text-black active:scale-95 cursor-pointer"
                >
                  Top Right 🎯
                </button>
                <button
                  onClick={() => handleShoot("bottom-corner")}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-[10px] sm:text-xs font-black uppercase text-green-400 transition hover:bg-green-500 hover:text-black active:scale-95 cursor-pointer"
                >
                  Low Left
                </button>
                <button
                  onClick={() => handleShoot("keeper")}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-700/60 bg-black/40 text-[10px] sm:text-xs font-black uppercase text-gray-400 transition hover:bg-red-500/40 hover:text-white active:scale-95 cursor-pointer"
                >
                  At Keeper
                </button>
                <button
                  onClick={() => handleShoot("bottom-corner")}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-[10px] sm:text-xs font-black uppercase text-green-400 transition hover:bg-green-500 hover:text-black active:scale-95 cursor-pointer"
                >
                  Low Right
                </button>
              </div>
            )}

            {/* Goal feedback */}
            {shotState === "goal" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm rounded-lg">
                <span className="text-3xl sm:text-4xl animate-bounce">⚽🔥 GOOOAL!</span>
                <p className="mt-1.5 text-xs font-black uppercase tracking-wider text-green-400">
                  Top bins! What a finish!
                </p>
                <button
                  onClick={handleReset}
                  className="mt-3 flex min-h-[44px] items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-green-500 active:scale-95 cursor-pointer shadow-lg shadow-green-600/30"
                >
                  <FaUndo size={12} /> Shoot Again
                </button>
              </div>
            )}

            {/* Miss feedback */}
            {shotState === "miss" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm rounded-lg">
                <span className="text-3xl sm:text-4xl">🧤 SAVED!</span>
                <p className="mt-1.5 text-xs font-black uppercase tracking-wider text-red-400">
                  Keeper caught it clean!
                </p>
                <button
                  onClick={handleReset}
                  className="mt-3 flex min-h-[44px] items-center gap-1.5 rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-gray-700 active:scale-95 cursor-pointer"
                >
                  <FaUndo size={12} /> Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Recovery Links ── */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-600/20 transition hover:bg-green-500"
          >
            <FaHome size={16} /> Return to Arena
          </Link>

          <Link
            href="/#pitches"
            className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-gray-200 transition hover:border-gray-700 hover:text-white"
          >
            <FaFutbol size={16} /> 3D Pitches & Tactics
          </Link>

          <a
            href="https://blog.fivesarena.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-gray-200 transition hover:border-gray-700 hover:text-white"
          >
            5s Arena Blog ↗
          </a>

          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-green-800/40 bg-green-950/40 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-green-400 transition hover:border-green-600"
          >
            <FaWhatsapp size={16} /> WhatsApp Venue
          </a>
        </div>
      </div>
    </div>
  );
}
