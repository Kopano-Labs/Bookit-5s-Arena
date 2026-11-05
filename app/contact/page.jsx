"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

const CONTACT_EMAIL = "fivearena@gmail.com";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(`[5s Arena] ${form.subject}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-500 font-black uppercase tracking-[0.3em] text-xs mb-4"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-black uppercase leading-none mb-6"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              fontFamily: "Impact, Arial Black, sans-serif",
            }}
          >
            Contact <span className="text-green-500">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Use WhatsApp, phone or email for current court, rate, event and competition enquiries.
            The form below opens an email draft on your device; it does not claim a message was sent
            until your email provider actually sends it.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="space-y-6">
              {[
                {
                  icon: FaPhone,
                  label: "Call Us",
                  value: "+27 63 782 0245",
                  href: "tel:+27637820245",
                  color: "#22c55e",
                },
                {
                  icon: FaWhatsapp,
                  label: "WhatsApp",
                  value: "Message Support",
                  href: "https://wa.me/27637820245",
                  color: "#25D366",
                },
                {
                  icon: FaEnvelope,
                  label: "Email",
                  value: CONTACT_EMAIL,
                  href: `mailto:${CONTACT_EMAIL}`,
                  color: "#3b82f6",
                },
                {
                  icon: FaMapMarkerAlt,
                  label: "Location",
                  value: "Hellenic Football Club, Milnerton, Cape Town, ZA",
                  href: "https://maps.google.com/?q=Hellenic+Football+Club+Milnerton",
                  color: "#ef4444",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}33` }}
                  >
                    <item.icon style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">
                      {item.label}
                    </p>
                    <p className="text-white font-bold group-hover:text-green-400 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-linear-to-br from-green-900/20 to-gray-900 border border-green-500/20">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white font-bold">Site-stated hours</h3>
                <span className="rounded-full border border-amber-700/30 bg-amber-900/20 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-amber-300">
                  Confirm availability
                </span>
              </div>
              <ul className="text-sm text-gray-400 space-y-2 mt-4">
                <li className="flex justify-between gap-4">
                  <span>Monday - Sunday</span>
                  <span className="text-gray-200">10:00 - 22:00</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Public Holidays</span>
                  <span className="text-amber-300">Confirm directly</span>
                </li>
              </ul>
              <p className="mt-3 text-[10px] leading-5 text-gray-600">
                These hours are reference information, not a real-time open/closed signal.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-3xl p-8"
          >
            <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm leading-6 text-blue-100">
              This is an email-draft helper. Pressing the button opens your configured email client;
              you remain the human-in-the-loop for the final send.
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-green-500 outline-none transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-green-500 outline-none transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-green-500 outline-none transition-all"
                >
                  <option>General Inquiry</option>
                  <option>Court Availability</option>
                  <option>Competition Information</option>
                  <option>Events & Birthdays</option>
                  <option>Booking Issues</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black ml-1">Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-green-500 outline-none transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-lg shadow-green-900/40 flex items-center justify-center gap-3"
              >
                <FaPaperPlane size={14} /> Open Email Draft
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
