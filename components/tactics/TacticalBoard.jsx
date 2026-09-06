'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCopy, FaFutbol, FaShareAlt, FaUndo } from 'react-icons/fa';

const FORMATIONS = {
  '1-2-1': [
    { x: 50, y: 82 }, { x: 28, y: 58 }, { x: 72, y: 58 }, { x: 50, y: 30 }, { x: 50, y: 10 },
  ],
  '2-1-1': [
    { x: 50, y: 82 }, { x: 32, y: 62 }, { x: 68, y: 62 }, { x: 50, y: 40 }, { x: 50, y: 15 },
  ],
  '1-1-2': [
    { x: 50, y: 82 }, { x: 50, y: 62 }, { x: 50, y: 44 }, { x: 30, y: 20 }, { x: 70, y: 20 },
  ],
};

const DEFAULT_NAMES = ['GK', 'DEF L', 'DEF R', 'MID', 'FWD'];

function makePlayers(formation = '1-2-1') {
  return FORMATIONS[formation].map((position, index) => ({
    id: `player-${index + 1}`,
    name: DEFAULT_NAMES[index],
    ...position,
  }));
}

export default function TacticalBoard() {
  const [formation, setFormation] = useState('1-2-1');
  const [players, setPlayers] = useState(() => makePlayers('1-2-1'));
  const [copied, setCopied] = useState(false);

  const resetFormation = (nextFormation) => {
    setFormation(nextFormation);
    setPlayers(makePlayers(nextFormation));
  };

  const movePlayer = (id, info, board) => {
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((info.point.x - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((info.point.y - rect.top) / rect.height) * 100));
    setPlayers((current) => current.map((player) => (player.id === id ? { ...player, x, y } : player)));
  };

  const summary = useMemo(
    () => `5s Arena tactics — ${formation} formation. Check current court availability at https://fivesarena.com/#courts`,
    [formation]
  );

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: '5s Arena tactics', text: summary, url: 'https://fivesarena.com/#courts' });
        return;
      }
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if (error?.name !== 'AbortError') console.warn('Tactics share unavailable:', error);
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gray-950 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      <div className="grid gap-5 border-b border-gray-800 p-5 lg:grid-cols-[1fr_auto] lg:items-end sm:p-7">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
            <FaFutbol /> 5v5 tactics lab
          </div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">Drag the shape. Build the idea.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            This board is a planning sandbox. It does not claim a confirmed lineup, fixture, coach decision,
            court reservation or live match state.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(FORMATIONS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => resetFormation(key)}
              className={`min-h-11 rounded-xl border px-4 text-xs font-black uppercase tracking-widest transition ${
                formation === key
                  ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-200'
                  : 'border-gray-800 bg-gray-900 text-gray-500 hover:text-white'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_240px] sm:p-7">
        <TacticsPitch players={players} movePlayer={movePlayer} />

        <aside className="rounded-2xl border border-gray-800 bg-black/25 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Current sketch</p>
          <p className="mt-2 text-xl font-black uppercase text-white">{formation}</p>
          <p className="mt-3 text-xs leading-6 text-gray-500">
            Drag each marker anywhere on the board. Formation buttons reset the sketch to a starting shape.
          </p>

          <div className="mt-5 space-y-2">
            {players.map((player, index) => (
              <label key={player.id} className="block">
                <span className="sr-only">Player {index + 1} label</span>
                <input
                  value={player.name}
                  maxLength={12}
                  onChange={(event) => {
                    const value = event.target.value;
                    setPlayers((current) => current.map((item) => item.id === player.id ? { ...item, name: value } : item));
                  }}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2.5 text-xs font-bold uppercase text-gray-200 outline-none focus:border-cyan-500/50"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => resetFormation(formation)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 text-xs font-black uppercase tracking-widest text-gray-300 hover:border-gray-700"
            >
              <FaUndo /> Reset shape
            </button>
            <button
              type="button"
              onClick={share}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-600 text-xs font-black uppercase tracking-widest text-white hover:bg-cyan-500"
            >
              {copied ? <FaCopy /> : <FaShareAlt />} {copied ? 'Copied' : 'Share idea'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TacticsPitch({ players, movePlayer }) {
  const boardRef = useRef(null);

  return (
    <div
      ref={boardRef}
      className="relative min-h-[520px] overflow-hidden rounded-[1.75rem] border-4 border-white/60 bg-[linear-gradient(180deg,#166534_0%,#15803d_50%,#166534_100%)] shadow-inner"
      aria-label="Interactive 5v5 tactics board"
    >
      <div className="pointer-events-none absolute inset-3 border border-white/55" />
      <div className="pointer-events-none absolute inset-y-3 left-1/2 border-l border-white/55" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/55" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
      <div className="pointer-events-none absolute left-1/2 top-3 h-20 w-44 -translate-x-1/2 border-x border-b border-white/55" />
      <div className="pointer-events-none absolute bottom-3 left-1/2 h-20 w-44 -translate-x-1/2 border-x border-t border-white/55" />

      {players.map((player, index) => (
        <motion.button
          key={player.id}
          type="button"
          drag
          dragMomentum={false}
          dragConstraints={boardRef}
          onDragEnd={(_, info) => movePlayer(player.id, info, boardRef.current)}
          className="absolute z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-white bg-gray-950 text-[9px] font-black uppercase text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] active:cursor-grabbing"
          style={{ left: `${player.x}%`, top: `${player.y}%` }}
          whileDrag={{ scale: 1.12, zIndex: 20 }}
          aria-label={`Move ${player.name || `player ${index + 1}`}`}
        >
          {player.name || index + 1}
        </motion.button>
      ))}
    </div>
  );
}
