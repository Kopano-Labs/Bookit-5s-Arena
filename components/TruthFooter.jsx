import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const SOCIALS = [
  { label: "TikTok", href: "https://www.tiktok.com/@fivesarena", icon: FaTiktok },
  { label: "Instagram", href: "https://www.instagram.com/fivesarena", icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61588019843126", icon: FaFacebook },
  { label: "WhatsApp", href: "https://wa.me/27637820245", icon: FaWhatsapp },
];

export default function TruthFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 pb-24 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="text-xl font-black uppercase tracking-wider">
              5S <span className="text-yellow-500">ARENA</span>
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-500">
              5-a-side football at Hellenic Football Club, Milnerton. Book courts, arrange matches
              and get venue details directly from the arena.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 text-gray-500 transition hover:border-gray-700 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">Navigate</h2>
            <div className="mt-5 space-y-2 text-sm">
              <Link href="/#courts" className="block text-gray-400 hover:text-white">Courts</Link>
              <Link href="/events-and-services" className="block text-gray-400 hover:text-white">Events & Services</Link>
              <Link href="/leagues" className="block text-gray-400 hover:text-white">Competitions</Link>
              <Link href="/fixtures" className="block text-gray-400 hover:text-white">Fixtures</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">Contact</h2>
            <div className="mt-5 space-y-4 text-sm text-gray-400">
              <a href="tel:+27637820245" className="flex items-center gap-3 hover:text-white">
                <FaPhone className="text-yellow-500" size={12} /> 063 782 0245
              </a>
              <a
                href="https://wa.me/27637820245"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white"
              >
                <FaWhatsapp className="text-yellow-500" size={13} /> WhatsApp
              </a>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-yellow-500" size={12} />
                <span>Pringle Rd, Milnerton, Cape Town, 7441</span>
              </div>
              <a href="mailto:fivearena@gmail.com" className="block hover:text-white">
                fivearena@gmail.com
              </a>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">Hours</h2>
              <span className="rounded-full border border-amber-700/30 bg-amber-900/20 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-300">
                Confirm
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm text-gray-400">
              <div className="flex justify-between gap-4"><span>Mon – Fri</span><span>10:00 – 22:00</span></div>
              <div className="flex justify-between gap-4"><span>Saturday</span><span>10:00 – 22:00</span></div>
              <div className="flex justify-between gap-4"><span>Sunday</span><span>10:00 – 22:00</span></div>
              <div className="flex justify-between gap-4 border-t border-gray-800 pt-2"><span>Public holidays</span><span className="text-amber-300">Confirm directly</span></div>
            </div>
            <p className="mt-3 text-[10px] leading-5 text-gray-600">
              Please confirm hours before travelling.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-800 pt-6 text-[10px] uppercase tracking-widest text-gray-700">
          <span>© {new Date().getFullYear()} Bookit 5s Arena</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-gray-400">About</Link>
            <Link href="/security" className="hover:text-gray-400">Security</Link>
            <Link href="/rules-of-the-game" className="hover:text-gray-400">Terms</Link>
            <Link href="/api/rss" className="hover:text-gray-400">RSS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
