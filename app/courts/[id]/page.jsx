import Heading from '@/components/Heading';
import BookingForm from '@/components/BookingForm';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

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

const CourtPage = async ({ params }) => {
  const { id } = await params;
  const court = await getCourt(id);

  if (!court) {
    return <Heading title="Court not found" />;
  }

  return (
    <>
      <Heading title={court.name} />
      <div className="bg-white shadow rounded-lg p-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaChevronLeft className="inline-block mr-1" />
          <span className="ml-2">Back to Courts</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <Image
            src={`/images/courts/${court.image}`}
            alt={court.name}
            width={400}
            height={200}
            className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="mt-4 sm:mt-0 sm:flex-1">
            <p className="text-gray-600 mb-4">{court.description}</p>

            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-gray-800">Amenities:</span>{' '}
                {court.amenities}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Availability:</span>{' '}
                {court.availability}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Price:</span>{' '}
                R{court.price_per_hour}/hour
              </li>
              <li>
                <span className="font-semibold text-gray-800">Address:</span>{' '}
                {court.address}
              </li>
            </ul>
          </div>
        </div>

        <BookingForm courtId={court._id} pricePerHour={court.price_per_hour} />
      </div>
    </>
  );
};

export default CourtPage;
