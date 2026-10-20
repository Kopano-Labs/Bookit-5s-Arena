import QuickBookExperience from '@/components/booking/QuickBookExperience';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';
import { courtImageUrl, normalizeCourtImageFilename } from '@/lib/courtImage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Book a Court | Five's Arena",
  description: "Choose a Five's Arena court and book directly with Bookit.",
};

async function getCourts() {
  try {
    await connectDB();
    const courts = await Court.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return {
      courts: courts.map((court) => ({
        id: String(court._id),
        name: court.name,
        price: court.price_per_hour,
        image: normalizeCourtImageFilename(court.image),
      })),
      available: true,
    };
  } catch {
    return { courts: [], available: false };
  }
}

export default async function BookPage({ searchParams }) {
  const params = await searchParams;
  const { courts, available } = await getCourts();

  return (
    <main className="min-h-[70vh] bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">Five&apos;s Arena</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-5xl">Pick your pitch</h1>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300 sm:inline-flex">
            Milnerton · Cape Town
          </span>
        </div>

        {courts.length ? (
          <QuickBookExperience initialCourtId={params?.courtId || ''} courts={courts.map((court, index) => ({
            ...court,
            image: courtImageUrl(court.image) || `/images/courts/court-${index + 1}.jpg`,
          }))} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center sm:p-14">
            <p className="text-5xl" aria-hidden="true">⚽</p>
            <h2 className="mt-4 text-xl font-black uppercase">{available ? 'Courts are not online yet' : 'Booking is temporarily unavailable'}</h2>
            {available ? <p className="mt-2 text-sm text-gray-400">Check back soon.</p> : null}
          </div>
        )}
      </section>
    </main>
  );
}
