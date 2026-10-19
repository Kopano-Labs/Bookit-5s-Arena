import Link from 'next/link';

export const metadata = {
  title: "Book a Court | Five's Arena",
  description:
    "Choose a Five's Arena court, date and available time in the current online booking calendar.",
};

const SETMORE_BOOKING_URL = 'https://fivesarena.setmore.com/';

export default function BookPage() {
  return (
    <main className="min-h-[70vh] bg-gray-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-gray-800 bg-gray-900/70 p-7 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-500">
          Five&apos;s Arena · Milnerton
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-5xl">
          Book a court
        </h1>
        <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base">
          Choose a court, date, duration and available time in Five&apos;s Arena&apos;s current
          Setmore booking calendar. Review the price and booking terms shown there before you
          confirm. Setmore will handle the booking details and confirmation.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={SETMORE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-yellow-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-950 transition hover:bg-yellow-400"
          >
            Open court calendar
          </a>
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-700 px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-200 transition hover:border-gray-500"
          >
            Ask the arena
          </a>
        </div>

        <p className="mt-5 text-xs leading-6 text-gray-400">
          The booking calendar opens in a new tab. Keep its confirmation for your reservation
          details. For existing Setmore bookings, use the provider&apos;s confirmation or booking
          account to check available management options.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex text-xs font-bold uppercase tracking-widest text-gray-400 transition hover:text-white"
        >
          Back to Five&apos;s Arena
        </Link>
      </section>
    </main>
  );
}

