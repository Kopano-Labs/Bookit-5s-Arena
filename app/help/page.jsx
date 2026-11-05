"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaChevronDown,
  FaCreditCard,
  FaEnvelope,
  FaPhone,
  FaQuestionCircle,
  FaShieldAlt,
  FaTrophy,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

const FAQ_CATEGORIES = [
  {
    name: "Bookings & Payments",
    icon: FaCreditCard,
    color: "#22c55e",
    faqs: [
      {
        q: "How do I check current court availability?",
        a: "Use the Courts section on the home page. Bookable inventory is shown only when the current booking source returns verified court records. If that source is unavailable, confirm the court, rate and slot directly with 5s Arena instead of relying on fallback data.",
      },
      {
        q: "What are the current court rates?",
        a: "Current rates are not hard-coded into this FAQ. Use the rate shown by the current booking inventory. If no source-backed rate is shown, confirm it on WhatsApp before booking or travelling.",
      },
      {
        q: "Which payment methods are accepted?",
        a: "Use only payment options presented by the current transactional booking flow or confirmed directly by a 5s Arena human. This FAQ does not independently certify card, cash, EFT, deposits or bank details.",
      },
      {
        q: "Can I cancel or get a refund?",
        a: "Use My Bookings for any cancellation action currently available to your booking, then confirm the applicable cancellation/refund terms with 5s Arena. This FAQ does not promise a 24-hour rule, refund eligibility, or a processing timeline without a current policy receipt.",
      },
    ],
  },
  {
    name: "Events & Parties",
    icon: FaCalendarAlt,
    color: "#3b82f6",
    faqs: [
      {
        q: "How do I request an event?",
        a: "Use the Events enquiry surface or contact the team directly. Submitting an enquiry is not a confirmed booking; the team must confirm the date, package scope, rate and payment instructions.",
      },
      {
        q: "Which event packages are available?",
        a: "Package descriptions on the site are reference information. Confirm current inclusions, guest limits, catering, staffing, equipment and pricing directly before relying on them.",
      },
      {
        q: "How early should I enquire?",
        a: "There is no guaranteed lead-time rule in this FAQ. Send the preferred date and requirements as early as practical, then wait for the team to confirm availability.",
      },
    ],
  },
  {
    name: "World Cup 2026 Archive",
    icon: FaTrophy,
    color: "#eab308",
    faqs: [
      {
        q: "Is World Cup 5s 2026 still open for registration?",
        a: "No. The public event window ran 29–31 May 2026 and registration closed 22 May 2026. The /tournament route is now an archive, not a signup or payment flow.",
      },
      {
        q: "Can I still use the old tournament payment reference or entry fee?",
        a: "No current payment instruction is issued by the archive. Do not reuse historical World Cup entry-fee or EFT-reference instructions. Ask the team what current competition, if any, is open before paying anything.",
      },
      {
        q: "Where are the historical standings and fixtures?",
        a: "Open the World Cup 2026 archive at /tournament and use its standings or fixtures reference links. Historical data must not be read as a current live-event state.",
      },
    ],
  },
  {
    name: "Rules & Safety",
    icon: FaShieldAlt,
    color: "#ef4444",
    faqs: [
      {
        q: "Where can I find the rules that apply?",
        a: "Use the Rules/Terms surface for site-stated rules. If a rule affects safety, payment, cancellation, liability or a disputed booking, confirm it with the team rather than treating this FAQ as the final contractual source.",
      },
      {
        q: "What should I do if a safety or conduct issue happens at the venue?",
        a: "Contact venue staff immediately. For urgent support from 5s Arena, use WhatsApp or phone. Do not rely on the website alone for an active physical safety incident.",
      },
    ],
  },
  {
    name: "Competitions",
    icon: FaUsers,
    color: "#a855f7",
    faqs: [
      {
        q: "Which leagues or competitions are currently open?",
        a: "The site does not assume an OPEN registration state without a current receipt. Use /leagues to request the current competition options, or confirm directly with the team.",
      },
      {
        q: "What does a competition cost?",
        a: "Current competition fees are not certified by this FAQ. Confirm the specific competition, date, format and fee before making any payment.",
      },
      {
        q: "Can an individual join without a team?",
        a: "Ask the team whether the current competition supports individual placement or player matching. A feature or route existing in the codebase is not proof that it is currently operational for a given competition.",
      },
    ],
  },
];

export default function HelpPage() {
  const [openCategory, setOpenCategory] = useState(FAQ_CATEGORIES[0].name);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaQuestionCircle className="mx-auto mb-4 text-green-400" size={36} />
          <h1
            className="mb-3 font-black uppercase tracking-widest"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontFamily: "Impact, Arial Black, sans-serif",
            }}
          >
            HELP & <span className="text-green-400">FAQ</span>
          </h1>
          <p className="mx-auto max-w-2xl text-gray-400">
            Stable navigation can live here. Changing business facts—price, availability, payment,
            refund, OPEN/LIVE status—must come from their current source or a human confirmation.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {FAQ_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = openCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => {
                  setOpenCategory(category.name);
                  setOpenFaq(null);
                }}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                  isActive
                    ? "text-white"
                    : "border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
                }`}
                style={
                  isActive
                    ? {
                        borderColor: category.color,
                        background: `${category.color}15`,
                        color: category.color,
                      }
                    : {}
                }
              >
                <Icon size={12} /> {category.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <AnimatePresence mode="wait">
          {FAQ_CATEGORIES.filter((category) => category.name === openCategory).map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {category.faqs.map((faq, index) => {
                const key = `${category.name}-${index}`;
                const isOpen = openFaq === key;
                return (
                  <div key={key} className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : key)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-800/30"
                    >
                      <span className="text-sm font-bold text-gray-200">{faq.q}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                        <FaChevronDown size={12} style={{ color: category.color }} />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-sm leading-7 text-gray-400">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
          <FaPhone className="mx-auto mb-4 text-green-400" size={24} />
          <h2 className="text-xl font-black uppercase tracking-widest">Need a current answer?</h2>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            Use a human confirmation for changing business state. No response-time guarantee is
            implied by these contact routes.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/27637820245"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-green-600/40 bg-green-600/20 px-5 py-2.5 text-sm font-bold text-green-400"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href="tel:+27637820245"
              className="flex items-center gap-2 rounded-xl border border-blue-600/40 bg-blue-600/20 px-5 py-2.5 text-sm font-bold text-blue-400"
            >
              <FaPhone /> 063 782 0245
            </a>
            <a
              href="mailto:fivearena@gmail.com"
              className="flex items-center gap-2 rounded-xl border border-purple-600/40 bg-purple-600/20 px-5 py-2.5 text-sm font-bold text-purple-400"
            >
              <FaEnvelope /> Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
