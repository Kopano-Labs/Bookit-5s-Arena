export const dynamic = 'force-dynamic';

import BookCourtClient from './BookCourtClient';
import CourtAvailabilityNotice from '@/components/home/CourtAvailabilityNotice';
import connectDB from '@/lib/mongodb';
import Court from '@/models/Court';

async function loadCourts() {
  try {
    await connectDB();
    const courts = await Court.find({})
      .sort({ sortOrder: 1, createdAt: 1 })
      .select('_id name address availability price_per_hour image')
      .lean();

    return courts.map((court) => ({
      _id: String(court._id),
      name: court.name,
      address: court.address || '',
      availability: court.availability || '',
      price_per_hour: court.price_per_hour,
      image: court.image || '',
    }));
  } catch (error) {
    console.error('GET /book courts error:', error);
    return [];
  }
}

export const metadata = {
  title: 'Book a Court | 5s Arena',
  description: 'Choose a 5s Arena court and reserve a verified Bookit slot.',
};

export default async function BookCourtPage() {
  const courts = await loadCourts();

  return (
    <main className="min-h-screen bg-gray-950 pt-6 text-white">
      {courts.length > 0 ? (
        <BookCourtClient courts={courts} />
      ) : (
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
          <CourtAvailabilityNotice />
        </div>
      )}
    </main>
  );
}
