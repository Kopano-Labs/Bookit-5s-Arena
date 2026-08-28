"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBirthdayCake,
  FaBuilding,
  FaEnvelope,
  FaStar,
  FaTrophy,
  FaWhatsapp,
} from "react-icons/fa";

const CONTACT_EMAIL = "fivearena@gmail.com";
const WHATSAPP_NUMBER = "27637820245";

const PACKAGES = [
  {
    id: "birthday",
    name: "Kids Birthday",
    icon: FaBirthdayCake,
    duration: "Site-listed: 2 hours",
    capacity: "Site-listed: up to 15 guests",
  },
  {
    id: "premium-birthday",
    name: "Premium Birthday",
    icon: FaStar,
    duration: "Site-listed: 2 hours",
    capacity: "Site-listed: up to 30 guests",
  },
  {
    id: "corporate",
    name: "Corporate Team Building",
    icon: FaBuilding,
    duration: "Site-listed: 3 hours",
    capacity: "Site-listed: up to 20 guests",
  },
  {
    id: "social",
    name: "Social Tournament",
    icon: FaTrophy,
    duration: "Site-listed: 3 hours",
    capacity: "Site-listed: up to 40 guests",
  },
];

function EventEnquiryContent() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("package");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requestedDate: "",
    guests: "",
    notes: "",
  });

  useEffect(() => {
    if (PACKAGES.some((item) => item.id === preselected)) {
      setSelectedPackageId(preselected);
    }
  }, [preselected]);

  const selectedPackage = useMemo(
    () => PACKAGES.find((item) => item.id === selectedPackageId) || null,
    [selectedPackageId]
  );

  const enquiryText = useMemo(() => {
    const packageName = selectedPackage?.name || "Event / package not yet selected";
    return [
      `5s Arena event enquiry`,
      `Package: ${packageName}`,
      `Name: ${form.name || "Not provided"}`,
      `Email: ${form.email || "Not provided"}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Requested date: ${form.requestedDate || "Not provided"}`,
      `Guests: ${form.guests || "Not provided"}`,
      `Notes: ${form.notes || "None"}`,
      "",
      "Please confirm current availability, package scope and pricing before any payment is made.",
    ].join("\n");
  }, [form, selectedPackage]);

  const openEmailDraft = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      `5s Arena event enquiry${selectedPackage ? ` — ${selectedPackage.name}` : ""}`
    );
    const body = encodeURIComponent(enquiryText);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiryText)}`;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 transition hover:text-white"
        >
          <FaArrowLeft size={10} /> Back to Events
        </Link>

        <section className="rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
            Human-in-the-loop enquiry
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Request an event. Do not assume a booking.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300">
            This page does not create, confirm or charge an event booking. Choose a site-listed
            package and send an enquiry. The 5s Arena team must confirm the current date, package
            scope, rate and payment instructions before you pay anything.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-2">
            <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">
              Site-listed packages
            </h2>
            <div className="space-y-3">
              {PACKAGES.map((item) => {
                const Icon = item.icon;
                const selected = item.id === selectedPackageId;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPackageId(item.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-green-500/50 bg-green-500/10"
                        : "border-gray-800 bg-gray-900 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-green-400">
                        <Icon />
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-wide text-white">{item.name}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.duration}</p>
                        <p className="text-xs text-gray-500">{item.capacity}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            <p className="mt-4 text-[10px] leading-5 text-gray-600">
              Package descriptions are reference information. Final inclusions and pricing require
              direct confirmation from the team.
            </p>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-gray-900 p-6 lg:col-span-3 sm:p-8">
            <form onSubmit={openEmailDraft} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Name
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-green-500"
                  />
                </label>
                <label className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-green-500"
                  />
                </label>
                <label className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Phone
                  <input
                    value={form.phone}
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-green-500"
                  />
                </label>
                <label className="space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Requested date
                  <input
                    type="date"
                    min={today}
                    value={form.requestedDate}
                    onChange={(event) => setForm({ ...form, requestedDate: event.target.value })}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-green-500"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                Guests
                <input
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={(event) => setForm({ ...form, guests: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-green-500"
                />
              </label>

              <label className="block space-y-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                Notes
                <textarea
                  rows={5}
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none focus:border-green-500"
                />
              </label>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-6 text-red-100">
                No deposit or EFT reference is issued by this page. Use payment instructions only
                after a human from 5s Arena confirms them directly.
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-green-500"
                >
                  <FaEnvelope /> Open Email Draft
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-xs font-black uppercase tracking-widest text-green-300 transition hover:bg-green-500/15"
                >
                  <FaWhatsapp /> Send via WhatsApp
                </a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function EventBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <EventEnquiryContent />
    </Suspense>
  );
}
