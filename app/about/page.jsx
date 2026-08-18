"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaTrophy,
  FaFutbol,
  FaUsers,
  FaCalendarAlt,
  FaLinkedin,
  FaArrowRight,
  FaHeart,
  FaMapMarkedAlt,
} from "react-icons/fa";
import AboutSection from "@/components/home/AboutSection";

const TEAM = [
  {
    name: "Kholofelo Robyn Rababalela",
    role: "Lead Developer",
    desc: "Full-stack developer behind the Bookit 5s Arena platform, focused on immersive mobile UX, real-time operations, resilient booking flows, and the adaptive software layer that connects venue activity with football intelligence.",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Mashoto Bayne Rababalela",
    role: "Founder",
    desc: "Founder and visionary behind 5s Arena at Hellenic Football Club, building accessible football experiences for community athletes, social teams, events, and competitive play in Milnerton.",
    linkedin: "https://linkedin.com",
  },
];

const STATS = [
  { val: "4+", label: "Floodlit Courts", icon: FaFutbol, color: "#22c55e" },
  { val: "2026", label: "World Cup Archive", icon: FaTrophy, color: "#eab308" },
  { val: "12h", label: "Open Daily", icon: FaCalendarAlt, color: "#3b82f6" },
  { val: "∞", label: "Community", icon: FaHeart, color: "#f97316" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,197,94,0.08),transparent_65%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-8 flex flex-col items-center justify-center">
            <div className="relative mb-4 h-36 w-36 animate-bounce-slow">
              <img
                src="/images/logo.png"
                alt="Bookit 5s Arena Logo"
                className="h-full w-full rounded-full object-contain"
                style={{ animation: "spin 8s linear infinite" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-green-400"
            >
              Hellenic Football Club · Milnerton · Cape Town
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-6 font-black uppercase leading-none tracking-tight"
              style={{
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                fontFamily: "Impact, Arial Black, sans-serif",
              }}
            >
              About <span className="text-green-500">5s Arena</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400"
            >
              Five-a-side football in Milnerton with live court booking, social competition, events, and a South Africa-aware digital layer that adapts football intelligence and weather to the user&apos;s province.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-center"
            >
              <stat.icon
                size={20}
                style={{ color: stat.color }}
                className="mx-auto mb-3"
              />
              <p
                className="text-3xl font-black"
                style={{ color: stat.color, fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                {stat.val}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <AboutSection />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-green-400">
            Get In Touch
          </p>
          <h2
            className="text-3xl font-black uppercase"
            style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
          >
            Contact Us
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: FaPhone,
              label: "Call Us",
              value: "+27 63 782 0245",
              href: "tel:+27637820245",
              color: "#22c55e",
            },
            {
              icon: FaEnvelope,
              label: "Email",
              value: "fivearena@gmail.com",
              href: "mailto:fivearena@gmail.com",
              color: "#3b82f6",
            },
            {
              icon: FaWhatsapp,
              label: "WhatsApp",
              value: "Message Us",
              href: "https://wa.me/27637820245",
              color: "#25D366",
            },
          ].map((contact) => (
            <motion.a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-6 text-center transition-all hover:border-gray-700"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: `${contact.color}22`,
                  border: `1px solid ${contact.color}44`,
                }}
              >
                <contact.icon size={20} style={{ color: contact.color }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {contact.label}
                </p>
                <p className="mt-0.5 text-sm font-bold text-white">{contact.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <FaMapMarkerAlt size={20} className="mt-0.5 shrink-0 text-green-400" />
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Address
            </p>
            <p className="font-semibold text-white">
              Hellenic Football Club, Milnerton, Cape Town, 7441
            </p>
            <a
              href="https://maps.google.com/?q=Hellenic+Football+Club+Milnerton+Cape+Town"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-green-400 transition-colors hover:text-green-300"
            >
              Get Directions <FaArrowRight size={10} />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-green-400">
            The People Behind It
          </p>
          <h2
            className="text-3xl font-black uppercase"
            style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
          >
            Our Team
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {TEAM.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500/40 bg-green-900/30">
                <FaUsers size={24} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide text-white">
                  {member.name}
                </h3>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-green-400">
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed text-gray-400">{member.desc}</p>
              </div>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 transition-colors hover:text-blue-300"
              >
                <FaLinkedin /> Connect on LinkedIn
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-linear-to-r from-green-900/30 via-gray-900 to-green-900/30 p-10 text-center">
          <FaFutbol size={32} className="mx-auto mb-4 text-green-400" />
          <h2
            className="mb-3 text-2xl font-black uppercase md:text-3xl"
            style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
          >
            Ready to Play?
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-sm leading-6 text-gray-400">
            Book a court now, switch your province for the South Africa pulse, or inspect the completed World Cup 2026 as an archive.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/courts"
              className="rounded-xl bg-green-600 px-8 py-3 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] transition-all hover:bg-green-500"
            >
              Book a Court
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/8 px-8 py-3 text-sm font-bold uppercase tracking-widest text-green-200 transition-all hover:bg-green-500/15"
            >
              <FaMapMarkedAlt /> South Africa Pulse
            </Link>
            <Link
              href="/tournament"
              className="rounded-xl border border-gray-700 bg-gray-800 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-700"
            >
              World Cup Archive
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
