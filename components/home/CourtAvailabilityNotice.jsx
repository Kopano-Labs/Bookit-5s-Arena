import Link from 'next/link';

export default function CourtAvailabilityNotice() {
  return (
    <section id="courts" className="bg-gray-950 px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="group relative mx-auto flex min-h-64 max-w-6xl items-end overflow-hidden rounded-3xl border border-white/10 bg-gray-900 p-6 sm:min-h-80 sm:p-10">
        <img src="/images/courts/court-1.jpg" alt="Five-a-side pitch at Five's Arena" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/55 to-gray-950/10" />
        <div className="relative max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Five&apos;s Arena · Milnerton</p>
          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">Pick. Play. Book.</h2>
          <Link href="/book" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-yellow-300 px-6 text-sm font-black uppercase tracking-wide text-gray-950 transition hover:bg-yellow-200">
            Book a pitch <span aria-hidden="true" className="ml-3 text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

