"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { FaChevronUp, FaCrosshairs, FaLink } from "react-icons/fa";
import {
  BLACKBOX_PROTOCOL_ID,
  BLACKBOX_PROTOCOL_LABEL,
  MICROSOFT_GAMING_REALIGNMENT,
  UGC_AGE_MARKET_MASKS,
  EXECUTION_MASK,
  BLACKBOX_SOURCES,
} from "@/lib/blackboxMicrosoftGamingProtocol";

export default function BlackboxMarketMask() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const clock = useMemo(
    () =>
      new Intl.DateTimeFormat("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date(tick)),
    [tick],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const panelSpring = reduce
    ? { type: "tween", duration: 0.15 }
    : { type: "spring", stiffness: 420, damping: 34, mass: 0.85 };

  const enter3d = reduce
    ? { opacity: 0, y: 12 }
    : { opacity: 0, y: 28, rotateX: 10, scale: 0.94 };
  const settle3d = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, rotateX: 0, scale: 1 };

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <div className="pointer-events-none fixed bottom-24 left-3 z-[58] md:bottom-8 md:left-6">
      <div
        className="pointer-events-auto flex flex-col items-start gap-2"
        style={{ perspective: reduce ? undefined : "1200px" }}
      >
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="panel"
              role="dialog"
              aria-label={BLACKBOX_PROTOCOL_LABEL}
              initial={enter3d}
              animate={settle3d}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, rotateX: 6 }}
              transition={panelSpring}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              className="w-[min(100vw-1.5rem,22rem)] overflow-hidden rounded-2xl border border-white/10 bg-gray-950/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(34,197,94,0.12),transparent_55%),radial-gradient(90%_60%_at_100%_100%,rgba(59,130,246,0.1),transparent_50%)]" />
              <div className="relative border-b border-white/5 px-4 py-3">
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-green-400/90">
                  {BLACKBOX_PROTOCOL_ID} · live client
                </p>
                <h2 className="mt-1 text-sm font-black uppercase tracking-wide text-white">
                  {BLACKBOX_PROTOCOL_LABEL}
                </h2>
                <p className="mt-1 text-[11px] leading-snug text-gray-400">
                  {MICROSOFT_GAMING_REALIGNMENT.headline}
                </p>
                <p className="mt-2 font-mono text-[10px] text-gray-500">
                  session clock {clock}
                </p>
              </div>

              <div className="relative max-h-[min(52vh,420px)] space-y-4 overflow-y-auto px-4 py-3">
                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Realignment pillars
                  </p>
                  <ul className="space-y-2">
                    {MICROSOFT_GAMING_REALIGNMENT.pillars.map((p, i) => (
                      <motion.li
                        key={p.id}
                        initial={reduce ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: reduce ? 0 : 0.05 + i * 0.05,
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                        className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
                      >
                        <p className="text-[11px] font-bold text-white">{p.title}</p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-gray-400">
                          {p.body}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    UGC age masks (Roblox / MC / FN)
                  </p>
                  <div className="space-y-2">
                    {UGC_AGE_MARKET_MASKS.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-xl border border-white/5 bg-gradient-to-br ${m.accent} px-3 py-2`}
                      >
                        <p className="text-[11px] font-black uppercase tracking-wide text-white">
                          {m.name}
                        </p>
                        <ul className="mt-1 list-disc space-y-1 pl-4 text-[10px] text-gray-300">
                          {m.bullets.map((b, i) => (
                            <li key={`${m.id}-${i}`}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Execution mask (venue)
                  </p>
                  <ul className="space-y-1.5 text-[10px] text-gray-300">
                    {EXECUTION_MASK.map((line) => (
                      <li key={line} className="flex gap-2">
                        <FaCrosshairs
                          className="mt-0.5 shrink-0 text-green-500/80"
                          size={10}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/5 pt-3">
                  <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Sources
                  </p>
                  <ul className="space-y-1.5">
                    {BLACKBOX_SOURCES.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-green-400/90 hover:text-green-300"
                        >
                          <FaLink size={9} />
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-gray-950/90 px-3 py-2 text-left shadow-lg backdrop-blur-md"
          whileHover={reduce ? {} : { scale: 1.02 }}
          whileTap={reduce ? {} : { scale: 0.98 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            Blackbox
          </span>
          <span className="font-mono text-[9px] text-gray-500">{clock}</span>
          <FaChevronUp
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            size={12}
          />
        </motion.button>
      </div>
    </div>
  );
}
