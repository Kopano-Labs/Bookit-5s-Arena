"use client";

import { useState, useRef } from "react";
import { FaShareAlt, FaWhatsapp, FaShieldAlt, FaUser } from "react-icons/fa";

const FORMATIONS = [
  { id: "1-2-1", name: "1-2-1 (Diamond)", positions: [
    { label: "GK", top: "85%", left: "50%" },
    { label: "DEF", top: "65%", left: "50%" },
    { label: "LM", top: "45%", left: "25%" },
    { label: "RM", top: "45%", left: "75%" },
    { label: "FWD", top: "20%", left: "50%" }
  ]},
  { id: "2-2", name: "2-2 (The Box)", positions: [
    { label: "GK", top: "85%", left: "50%" },
    { label: "LD", top: "60%", left: "30%" },
    { label: "RD", top: "60%", left: "70%" },
    { label: "LF", top: "25%", left: "30%" },
    { label: "RF", top: "25%", left: "70%" }
  ]},
  { id: "2-1-1", name: "2-1-1 (Pyramid)", positions: [
    { label: "GK", top: "85%", left: "50%" },
    { label: "LD", top: "65%", left: "30%" },
    { label: "RD", top: "65%", left: "70%" },
    { label: "MID", top: "42%", left: "50%" },
    { label: "ST", top: "18%", left: "50%" }
  ]},
];

const KIT_COLORS = [
  { name: "Emerald", hex: "#16a34a", bg: "bg-green-600" },
  { name: "Royal Blue", hex: "#2563eb", bg: "bg-blue-600" },
  { name: "Crimson", hex: "#dc2626", bg: "bg-red-600" },
  { name: "Gold", hex: "#ca8a04", bg: "bg-yellow-600" },
  { name: "Jet Black", hex: "#0f172a", bg: "bg-slate-900" },
];

export default function TacticalBoard() {
  const [teamName, setTeamName] = useState("My 5s Squad (Template)");
  const [selectedFormation, setSelectedFormation] = useState(FORMATIONS[0]);
  const [selectedKit, setSelectedKit] = useState(KIT_COLORS[0]);
  const [players, setPlayers] = useState(["Player 1 (GK)", "Player 2 (DEF)", "Player 3 (LM)", "Player 4 (RM)", "Player 5 (FWD)"]);
  const boardRef = useRef();

  const handlePlayerChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleShareToWhatsApp = () => {
    const roster = players.map((p, i) => `${selectedFormation.positions[i]?.label || i+1}. ${p}`).join("\n");
    const text = `⚽ *${teamName}* — 5v5 Lineup Card\n🏟️ Venue: FivesArena (Hellenic FC)\n📐 Formation: ${selectedFormation.name}\n\n*Starting 5:*\n${roster}\n\nBook your court: https://fivesarena.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-yellow-400">
            Tactics Lab (Template)
          </span>
          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            5v5 Tactical Lineup Builder
          </h2>
          <p className="text-xs text-gray-400">Customise your starting 5 formation and export match cards to WhatsApp</p>
        </div>

        <button
          onClick={handleShareToWhatsApp}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-600/20 transition hover:bg-green-500"
        >
          <FaWhatsapp size={16} /> Share to WhatsApp
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Controls Column */}
        <div className="space-y-6 lg:col-span-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-bold text-white focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400">
              Formation
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {FORMATIONS.map((form) => (
                <button
                  key={form.id}
                  onClick={() => setSelectedFormation(form)}
                  className={`rounded-xl border px-3 py-2 text-center text-xs font-black transition ${
                    selectedFormation.id === form.id
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
                  }`}
                >
                  {form.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400">
              Kit Color
            </label>
            <div className="mt-2 flex gap-3">
              {KIT_COLORS.map((kit) => (
                <button
                  key={kit.name}
                  onClick={() => setSelectedKit(kit)}
                  className={`h-8 w-8 rounded-full ${kit.bg} transition-all ${
                    selectedKit.name === kit.name ? "ring-2 ring-white ring-offset-2 ring-offset-gray-950" : "opacity-70 hover:opacity-100"
                  }`}
                  title={kit.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400">
              Starting 5 Roster
            </label>
            <div className="mt-2 space-y-2">
              {players.map((player, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-12 text-center text-xs font-black text-yellow-500">
                    {selectedFormation.positions[idx]?.label}
                  </span>
                  <input
                    type="text"
                    value={player}
                    onChange={(e) => handlePlayerChange(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-xs text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2D/3D Pitch Board View */}
        <div className="flex justify-center lg:col-span-7">
          <div
            ref={boardRef}
            className="relative h-[480px] w-full max-w-[380px] overflow-hidden rounded-2xl border-4 border-green-800/60 bg-green-950 shadow-2xl"
            style={{
              backgroundImage: "radial-gradient(ellipse at center, #14532d 0%, #052e16 100%)",
            }}
          >
            {/* White Pitch Markings */}
            <div className="absolute inset-4 rounded-xl border-2 border-white/40" />
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t-2 border-white/40" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
            <div className="absolute left-1/2 top-4 h-16 w-32 -translate-x-1/2 rounded-b-xl border-b-2 border-l-2 border-r-2 border-white/40" />
            <div className="absolute bottom-4 left-1/2 h-16 w-32 -translate-x-1/2 rounded-t-xl border-l-2 border-r-2 border-t-2 border-white/40" />

            {/* Team Banner */}
            <div className="absolute left-0 right-0 top-6 text-center">
              <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-yellow-400 backdrop-blur-md">
                {teamName}
              </span>
            </div>

            {/* Draggable Players on Pitch */}
            {selectedFormation.positions.map((pos, idx) => (
              <div
                key={idx}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ top: pos.top, left: pos.left }}
              >
                <div
                  className={`flex h-10 w-10 flex-col items-center justify-center rounded-full shadow-lg ${selectedKit.bg} border-2 border-white/90`}
                >
                  <span className="text-[9px] font-black text-white">{pos.label}</span>
                </div>
                <div className="mt-1 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 text-center text-[9px] font-bold text-white backdrop-blur-sm">
                  {players[idx]?.split(" ")[0] || `Player ${idx+1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
