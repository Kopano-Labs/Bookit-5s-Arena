import BookingForm from '@/components/BookingForm';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft, FaFutbol, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';

// Fetch single court from our API
const getCourt = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/courts/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching court:', error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const court = await getCourt(id);
  if (!court) return { title: 'Court Not Found' };
  return {
    title: court.name,
    description: court.description || `Book ${court.name} at 5s Arena — floodlit 5-a-side court in Milnerton, Cape Town.`,
  };
}

const CourtPage = async ({ params }) => {
  const { id } = await params;
  const court = await getCourt(id);

  if (!court) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FaFutbol className="mx-auto text-5xl text-gray-700 mb-4" />
          <h1 className="text-2xl font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            Court Not Found
          </h1>
          <Link href="/" className="mt-4 inline-block text-green-400 hover:text-green-300 text-sm">
            ← Back to Courts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm mb-8 transition-colors uppercase tracking-wide"
        >
          <FaChevronLeft size={11} /> Back to Courts
        </Link>

        {/* Court card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">

          {/* Court image with gradient overlay */}
          <div className="relative w-full h-64 sm:h-80">
            <Image
              src={`/images/courts/${court.image}`}
              alt={court.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1
                className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                {court.name}
              </h1>
            </div>
          </div>

          {/* Court details */}
          <div className="p-6 sm:p-8">
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{court.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
                <FaStar className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Amenities</p>
                  <p className="text-white text-sm font-medium">{court.amenities}</p>
                </div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
                <FaClock className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Availability</p>
                  <p className="text-white text-sm font-medium">{court.availability}</p>
                </div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Address</p>
                  <p className="text-white text-sm font-medium">{court.address}</p>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-800/40 rounded-xl p-4 flex items-start gap-3">
                <FaFutbol className="text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-green-600 uppercase tracking-widest mb-1">Price per Hour</p>
                  <p className="text-green-400 text-2xl font-black">R{court.price_per_hour}</p>
                </div>
              </div>
            </div>

            {/* Booking form */}
            <BookingForm courtId={court._id} courtName={court.name} pricePerHour={court.price_per_hour} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtPage;
