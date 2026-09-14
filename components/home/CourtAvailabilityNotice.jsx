import Link from 'next/link';

export default function CourtAvailabilityNotice() {
  return (
    <section id="courts" className="bg-gray-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-gray-800 bg-gray-900/70 p-7 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-500">
          Book a court
        </p>
        <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-5xl">
          Check today&apos;s court and time directly with 5s Arena.
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
          Online slots are not available on this page right now. WhatsApp or call us for the
          current court, rate and time slot before travelling.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-green-500"
          >
            WhatsApp 5s Arena
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
