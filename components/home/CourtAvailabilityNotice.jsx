import Link from 'next/link';

export default function CourtAvailabilityNotice() {
  return (
    <section id="courts" className="bg-gray-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-7 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
          Booking truth gate
        </p>
        <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-5xl">
          Online court availability is temporarily unverified.
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
          The live court source did not return a verified booking inventory, so 5s Arena is not
          substituting demo courts, guessed prices, or an "Available" badge. Confirm the current
          court, rate, and slot directly with the venue while the booking feed is unavailable.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-green-500"
          >
            Confirm on WhatsApp
          </a>
          <a
            href="tel:+27637820245"
            className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-200 transition hover:border-gray-600"
          >
            Call 063 782 0245
          </a>
          <Link
            href="/contact"
            className="rounded-xl border border-gray-800 px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-400 transition hover:text-white"
          >
            Contact details
          </Link>
        </div>
      </div>
    </section>
  );
}
