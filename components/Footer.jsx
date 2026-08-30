"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaArrowUp,
  FaEnvelope,
  FaFacebook,
  FaFutbol,
  FaInstagram,
  FaMapMarkerAlt,
  FaNewspaper,
  FaPhone,
  FaRss,
  FaShareAlt,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

const SOCIALS = [
  {
    icon: FaTiktok,
    href: "https://www.tiktok.com/@fivesarena",
    label: "TikTok",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/fivesarena",
    label: "Instagram",
  },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/profile.php?id=61588019843126",
    label: "Facebook",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/27637820245",
    label: "WhatsApp",
  },
];

const GUEST_QUICK_LINKS = [
  { label: "Book a Court", href: "/#courts" },
  { label: "South Africa Pulse", href: "/news" },
  { label: "Fixtures", href: "/fixtures" },
  { label: "Leagues", href: "/leagues" },
  { label: "Rules of the Game", href: "/rules-of-the-game" },
];

const AUTH_QUICK_LINKS = [
  { label: "My Bookings", href: "/bookings" },
  { label: "Book a Court", href: "/#courts" },
  { label: "South Africa Pulse", href: "/news" },
  { label: "Fixtures", href: "/fixtures" },
  { label: "Events & Services", href: "/events-and-services" },
  { label: "Rules of the Game", href: "/rules-of-the-game" },
];

const ORGANISM_LINKS = [
  {
    label: "Arena",
    href: "/",
    note: "Sovereign runtime shell",
  },
  {
    label: "South Africa Pulse",
    href: "/news",
    note: "Province-aware weather + football intelligence",
  },
  {
    label: "Blog Organ",
    href: "/news?organ=blog",
    note: "Editorial organ rendered inside this shell",
  },
  {
    label: "APWA Proof",
    href: "/proof/apwa",
    note: "Adaptive runtime evidence",
  },
  {
    label: "RSS",
    href: "/api/rss",
    note: "Machine-readable public feed",
  },
];

export default function Footer() {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Five's Arena", url });
        return;
      } catch {}
    }
    await navigator.clipboard?.writeText(url);
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[#030506] pb-24 text-white sm:pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(57,217,138,0.09),transparent_34%),radial-gradient(circle_at_85%_100%,rgba(245,197,66,0.07),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.7fr)_minmax(280px,0.85fr)]">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-300/15 bg-green-300/8 text-green-300">
                <FaFutbol size={20} />
              </div>
              <div>
                <p className="text-xl font-black uppercase tracking-[0.12em]">
                  Five&apos;s <span className="text-yellow-400">Arena</span>
                </p>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-600">
                  Hellenic Football Club · Milnerton
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400">
              The Arena is the canonical user surface. Court booking, fixtures, province-aware weather and football intelligence stay inside the same Adaptive PWA while editorial services act as bounded organs behind it.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/news"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-green-300/20 bg-green-300/8 px-4 text-[10px] font-black uppercase tracking-[0.14em] text-green-200 transition hover:bg-green-300/12"
              >
                <FaNewspaper /> South Africa Pulse
              </Link>
              <button
                type="button"
                onClick={() => void handleShare()}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-gray-300 transition hover:border-white/20 hover:text-white"
              >
                <FaShareAlt /> Share Arena
              </button>
            </div>

            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-gray-400 transition hover:border-green-300/25 hover:bg-green-300/8 hover:text-green-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
              {session ? "Your Arena" : "Play & Explore"}
            </h2>
            <nav className="mt-4 grid gap-2" aria-label="Footer quick links">
              {(session ? AUTH_QUICK_LINKS : GUEST_QUICK_LINKS).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center rounded-xl border border-white/8 bg-white/[0.025] px-4 text-xs font-bold text-gray-400 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">
              Arena Contact
            </h2>
            <div className="mt-4 grid gap-3">
              <a
                href="tel:+27637820245"
                className="flex min-h-11 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 text-sm text-gray-300 transition hover:border-green-300/20"
              >
                <FaPhone className="text-green-300" /> 063 782 0245
              </a>
              <a
                href="mailto:fivearena@gmail.com"
                className="flex min-h-11 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 text-sm text-gray-300 transition hover:border-green-300/20"
              >
                <FaEnvelope className="text-green-300" /> fivearena@gmail.com
              </a>
              <a
                href="https://wa.me/27637820245"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 text-sm text-gray-300 transition hover:border-green-300/20"
              >
                <FaWhatsapp className="text-green-300" /> WhatsApp
              </a>
              <div className="flex min-h-11 items-start gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-sm leading-6 text-gray-400">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-green-300" />
                Hellenic Football Club, Milnerton, Cape Town, 7441
              </div>
            </div>
            <p className="mt-4 text-[10px] leading-5 text-gray-600">
              Availability and operating state should be confirmed through the live booking surface rather than a hard-coded footer timetable.
            </p>
          </section>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/8 bg-white/[0.025] p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-green-300">
                Living organism map
              </p>
              <h2 className="mt-2 text-xl font-black uppercase text-white">
                Organs resolve back into Five&apos;s Arena
              </h2>
            </div>
            <Link
              href="/api/rss"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-[10px] font-black uppercase tracking-[0.14em] text-gray-300"
            >
              <FaRss /> RSS
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ORGANISM_LINKS.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={item.href}
                  className="block h-full rounded-2xl border border-white/8 bg-black/20 p-4 transition hover:border-green-300/18 hover:bg-green-300/[0.025]"
                >
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-white">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[10px] leading-5 text-gray-500">
                    {item.note}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-6 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Five&apos;s Arena · Cape Town, South Africa</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/rules-of-the-game" className="transition hover:text-white">
              Rules
            </Link>
            <Link href="/security" className="transition hover:text-white">
              Security
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 transition hover:border-white/20 hover:text-white"
            >
              <FaArrowUp /> Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
