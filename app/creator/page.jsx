'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ════════════════════════════════════════════════════════════════
   5-SECOND WELCOME ANIMATION — plays before content reveals
   ════════════════════════════════════════════════════════════════ */

/* Floating particle using deterministic values (based on delay instead of Math.random) to fix hydration */
function Particle({ delay, color }) {
  // Use a deterministic seed to prevent hydration mismatch across server/client
  const pseudoRandom = Math.sin(delay * 100) * 10000;
  const random = pseudoRandom - Math.floor(pseudoRandom);
  const pseudoRandom2 = Math.cos(delay * 100) * 10000;
  const random2 = pseudoRandom2 - Math.floor(pseudoRandom2);

  const x = (random - 0.5) * 800;
  const y = (random2 - 0.5) * 600;
  const size = random * 6 + 2;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        left: "50%",
        top: "50%",
        opacity: 0,
      }}
      animate={{
        x: [0, x * 0.3, x],
        y: [0, y * 0.3, y],
        opacity: [0, 0.9, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{ duration: 2.5, delay, ease: "easeOut" }}
    />
  );
}

/* Stadium light sweep */
function LightBeam({ angle, color, delay }) {
  return (
    <motion.div
      className="absolute pointer-events-none origin-bottom"
      style={{
        width: 2,
        height: "55vh",
        background: `linear-gradient(to top, ${color}00, ${color}60, ${color}00)`,
        left: "50%",
        bottom: "50%",
        transformOrigin: "50% 100%",
        rotate: angle,
        opacity: 0,
      }}
      animate={{ opacity: [0, 0.8, 0], rotate: [angle - 15, angle, angle + 15, angle] }}
      transition={{ duration: 3, delay, ease: "easeInOut" }}
    />
  );
}

const WELCOME_COLORS = ["#22c55e", "#06b6d4", "#f59e0b", "#a855f7", "#ef4444"];
const NAME_LETTERS = "KHOLOFELO".split("");
const TAGLINE = "Lead Developer and Web-developer";

function WelcomeAnimation({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setPhase(3), 4200);
    const t4 = setTimeout(() => onComplete(), 5000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
      style={{ background: "#030712" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Particles burst */}
      {Array.from({ length: 40 }).map((_, i) => (
        <Particle
          key={i}
          delay={i * 0.04}
          color={WELCOME_COLORS[i % WELCOME_COLORS.length]}
        />
      ))}

      {/* Stadium light beams */}
      {[-60, -30, 0, 30, 60].map((angle, i) => (
        <LightBeam key={i} angle={angle} color={WELCOME_COLORS[i]} delay={0.3 + i * 0.15} />
      ))}

      {/* Pitch circle decorations */}
      {[200, 300, 420].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: size,
            height: size,
            borderColor: `${WELCOME_COLORS[i]}30`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{ scale: [0.5, 1.2, 1], opacity: [0, 0.5, 0.2] }}
          transition={{ duration: 2, delay: i * 0.2 }}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 text-center px-4">
        {/* Football */}
        <motion.div
          style={{ fontSize: "5rem", display: "block", marginBottom: "1.5rem" }}
          animate={{ rotate: [0, 360], scale: [0, 1.3, 1] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          ⚽
        </motion.div>

        {/* Greeting */}
        <motion.p
          style={{
            fontFamily: "'Montserrat',sans-serif",
            color: "#22c55e",
            fontSize: "0.85rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 200 }}
        >
          welcome to the mind of
        </motion.p>

        {/* Name — letters fly in */}
        <div className="flex justify-center gap-1 sm:gap-2 mb-6 flex-wrap">
          {NAME_LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: "'Bebas Neue',Impact,sans-serif",
                fontSize: "clamp(2rem,10vw,6rem)",
                letterSpacing: "0.02em",
                color: WELCOME_COLORS[i % WELCOME_COLORS.length],
                textShadow: `0 0 40px ${WELCOME_COLORS[i % WELCOME_COLORS.length]}, 0 0 80px ${WELCOME_COLORS[i % WELCOME_COLORS.length]}60`,
                display: "inline-block",
                lineHeight: 1,
              }}
              initial={{ y: -120, opacity: 0, rotate: -20 }}
              animate={phase >= 1 ? { y: 0, opacity: 1, rotate: 0 } : {}}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 16,
                delay: i * 0.1,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          style={{
            fontFamily: "'Inter',sans-serif",
            color: "#9ca3af",
            fontSize: "clamp(0.75rem,2vw,1rem)",
            letterSpacing: "0.1em",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {TAGLINE}
        </motion.p>

        {/* Loading bar */}
        <div className="mt-10 w-48 mx-auto h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #22c55e, #06b6d4, #a855f7)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      </div>

      {/* Phase 3 flash */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CREATOR PAGE CONTENT
   ══════════════════════════════════════════════════════════════ */

const SKILLS = [
  { name: "React / Vite / Next.js",    level: 95, color: "#06b6d4" },
  { name: "Framer Motion",   level: 90, color: "#a855f7" },
  { name: "UI/UX Design",    level: 88, color: "#22c55e" },
  { name: "TailwindCSS",     level: 92, color: "#f59e0b" },
  { name: "Node / Express / MongoDB",  level: 85, color: "#ef4444" },
  { name: "Football IQ",     level: 100, color: "#22c55e" },
];

const PROJECTS = [
  {
    name: "5s Arena Blog",
    desc: "A full-stack React football blog with live fixtures, author system, and heavy animations.",
    icon: "⚽",
    color: "#22c55e",
    link: "https://github.com/RobynAwesome/5s-Arena-Blog",
  },
  {
    name: "Bookit 5s Arena",
    desc: "Court booking platform with real-time scheduling, guest payments, loyalty rewards, and Stripe.",
    icon: "🏟️",
    color: "#f59e0b",
    link: "/",
  },
  {
    name: "AI Analytics Dash",
    desc: "Platform integrating Anthropic Claude and Groq for generating real-time venue analytics.",
    icon: "🤖",
    color: "#a855f7",
    link: "#",
  },
];

const SOCIAL_LINKS = [
  { label: "Ko-fi", icon: "☕", url: "https://ko-fi.com/robynawesome",       color: "#29abe0" },
  { label: "PayPal", icon: "🅿️", url: "https://www.paypal.me/osheenviews",  color: "#003087" },
  { label: "WhatsApp", icon: "📱", url: "https://wa.me/27637820245",          color: "#25d366" },
];

function SkillBar({ name, level, color, inView }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span style={{ fontFamily: "'Montserrat',sans-serif", color: "#d1d5db", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
          {name}
        </span>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", color, fontSize: "0.95rem" }}>{level}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 8px ${color}60` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.1 }}
        />
      </div>
    </div>
  );
}

export default function CreatorPage() {
  const [welcomeDone, setWelcomeDone] = useState(false);

  const skillsRef = useRef(null);
  const skillsInView = useInView(skillsRef, { once: true, margin: "-60px" });
  const projectsRef = useRef(null);
  const projectsInView = useInView(projectsRef, { once: true, margin: "-60px" });

  useEffect(() => { 
    document.title = "Meet the Creator — 5s Arena"; 
  }, []);

  return (
    <>
      <AnimatePresence>
        {!welcomeDone && (
          <WelcomeAnimation key="welcome" onComplete={() => setWelcomeDone(true)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {welcomeDone && (
          <motion.div
            key="creator-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-950 min-h-screen relative"
          >
            {/* ══ HERO ════════════════════════════════════════════ */}
            <section
              className="relative overflow-hidden py-24 px-4 text-center"
              style={{
                background: "linear-gradient(135deg, #030712 0%, #0d1117 40%, #1a0a2e 100%)",
                borderBottom: "1px solid rgba(168,85,247,0.15)",
              }}
            >
              {WELCOME_COLORS.map((color, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 300,
                    height: 300,
                    background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                    left: `${i * 25}%`,
                    top: `${20 + (i % 2) * 40}%`,
                  }}
                  animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}

              <div className="relative z-10">
                <motion.div
                  className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #22c55e)",
                    boxShadow: "0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(34,197,94,0.3)",
                    fontSize: "3.5rem",
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                >
                  🎨
                </motion.div>

                <motion.h1
                  style={{
                    fontFamily: "'Bebas Neue',Impact,sans-serif",
                    fontSize: "clamp(2rem,8vw,5rem)",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                    marginBottom: "0.5rem",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <span style={{ color: "#a855f7" }}>KHOLOFELO ROBYN</span>{" "}
                  <span style={{ color: "#f9fafb" }}>RABABALELA</span>
                </motion.h1>

                <motion.p
                  style={{ fontFamily: "'Montserrat',sans-serif", color: "#22c55e", letterSpacing: "0.2em", fontSize: "0.85rem", textTransform: "uppercase" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Web Designer · Football Enthusiast · Creative Developer
                </motion.p>

                <motion.p
                  className="max-w-xl mx-auto mt-6"
                  style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", lineHeight: 1.8, fontSize: "0.95rem" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Cape Town-based creator behind the Bookit 5s Arena platform and 5s Arena blog.
                  Passionate about building immersive digital experiences that blend sports
                  culture with cutting-edge web design.
                </motion.p>

                <motion.div
                  className="flex justify-center gap-4 mt-8 flex-wrap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {SOCIAL_LINKS.map(({ label, icon, url, color }) => (
                    <motion.a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                      style={{
                        fontFamily: "'Montserrat',sans-serif",
                        background: `${color}15`,
                        border: `1px solid ${color}40`,
                        color,
                        textDecoration: "none",
                      }}
                      whileHover={{ background: `${color}25`, y: -2, boxShadow: `0 8px 24px ${color}30` }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>{icon}</span> {label}
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ══ SKILLS ══════════════════════════════════════════ */}
            <section ref={skillsRef} className="py-16 px-4" style={{ background: "#0d1117" }}>
              <div className="max-w-3xl mx-auto">
                <motion.h2
                  className="mb-10"
                  style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.5rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.1em" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={skillsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span style={{ color: "#a855f7" }}>/// </span>SKILLS & TOOLS
                </motion.h2>
                <div className="grid md:grid-cols-2 gap-x-12">
                  {SKILLS.map((skill) => (
                    <SkillBar key={skill.name} {...skill} inView={skillsInView} />
                  ))}
                </div>
              </div>
            </section>

            {/* ══ PROJECTS ════════════════════════════════════════ */}
            <section ref={projectsRef} className="py-16 px-4 bg-gray-950">
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="mb-10"
                  style={{ fontFamily: "'Oswald',sans-serif", fontSize: "1.5rem", color: "#f9fafb", textTransform: "uppercase", letterSpacing: "0.1em" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={projectsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span style={{ color: "#22c55e" }}>/// </span>FEATURED BUILDS
                </motion.h2>
                <div className="grid md:grid-cols-3 gap-5">
                  {PROJECTS.map(({ name, desc, icon, color, link }, i) => (
                    <motion.a
                      key={name}
                      href={link}
                      className="block rounded-2xl p-6 cursor-pointer no-underline"
                      style={{
                        background: "rgba(17,24,39,0.8)",
                        border: `1px solid ${color}25`,
                        backdropFilter: "blur(12px)",
                        textDecoration: "none",
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={projectsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.1 }}
                      whileHover={{ y: -4, boxShadow: `0 16px 40px ${color}20`, borderColor: `${color}60` }}
                    >
                      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{icon}</div>
                      <h3 style={{ fontFamily: "'Oswald',sans-serif", color, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                        {name}
                      </h3>
                      <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", fontSize: "0.8rem", lineHeight: 1.6 }}>
                        {desc}
                      </p>
                    </motion.a>
                  ))}
                </div>
              </div>
            </section>

            {/* ══ SUPPORT THE CREATOR CTA ══════════════════════════ */}
            <section
              className="py-20 px-4 text-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #0d1117 60%, #030712 100%)" }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.12) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative z-10 max-w-2xl mx-auto">
                <motion.div
                  style={{ fontSize: "3rem", marginBottom: "1rem" }}
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ☕
                </motion.div>
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: "'Bebas Neue',Impact,sans-serif",
                    fontSize: "clamp(2rem,6vw,4rem)",
                    color: "#f9fafb",
                    letterSpacing: "0.05em",
                  }}
                >
                  ENJOYED THE WORK?{" "}
                  <span style={{ color: "#a855f7" }}>BUY ME A COFFEE</span>
                </h2>
                <p style={{ fontFamily: "'Inter',sans-serif", color: "#9ca3af", marginBottom: "2rem", lineHeight: 1.7 }}>
                  Every donation keeps the code flowing and the football stories alive.
                  I build all of this solo — your support means everything.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="https://ko-fi.com/robynawesome"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-2xl font-bold text-white text-sm no-underline"
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      letterSpacing: "0.05em",
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                      boxShadow: "0 0 30px rgba(168,85,247,0.5)",
                    }}
                    whileHover={{ y: -3, boxShadow: "0 0 50px rgba(168,85,247,0.7)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ☕ Support on Ko-fi
                  </motion.a>
                  <motion.a
                    href="https://www.paypal.me/osheenviews"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-2xl font-bold text-sm no-underline"
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      letterSpacing: "0.05em",
                      background: "rgba(0,48,135,0.2)",
                      border: "1px solid rgba(96,165,250,0.4)",
                      color: "#60a5fa",
                    }}
                    whileHover={{ background: "rgba(0,48,135,0.35)", y: -3 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    🅿️ Donate via PayPal
                  </motion.a>
                </div>
              </div>
            </section>

            {/* ══ Fun facts footer ════════════════════════════════ */}
            <section className="py-10 px-4 text-center" style={{ background: "#030712", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex flex-wrap justify-center gap-8 max-w-3xl mx-auto">
                {[
                  ["☕", "Fuelled by coffee"],
                  ["⚽", "Football every weekend"],
                  ["🌙", "Codes past midnight"],
                  ["🇿🇦", "Cape Town, SA"],
                  ["💚", "Loves green"],
                ].map(([icon, text]) => (
                  <motion.div key={text} className="text-center" whileHover={{ scale: 1.1 }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{icon}</div>
                    <p style={{ fontFamily: "'Inter',sans-serif", color: "#6b7280", fontSize: "0.75rem" }}>{text}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
