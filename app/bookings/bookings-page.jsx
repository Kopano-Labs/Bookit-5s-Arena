import Link from 'next/link';
import Image from 'next/image';
import Heading from '@/components/Heading';
import { FaFutbol, FaCalendarAlt, FaClock, FaTrash } from 'react-icons/fa';

// TODO: Replace with real data fetched from your backend/database
const mockBookings = [
  {
    id: 'b1',
    courtId: '1',
    courtName: 'Premier Court',
    courtImage: 'court-1.jpg',
    date: '2026-03-20',
    startTime: '18:00',
    duration: 1,
    pricePerHour: 400,
    status: 'confirmed',
  },
  {
    id: 'b2',
    courtId: '2',
    courtName: 'Secondary Court',
    courtImage: 'court-2.jpg',
    date: '2026-03-25',
    startTime: '19:00',
    duration: 2,
    pricePerHour: 400,
    status: 'pending',
  },
];

const statusStyles = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const BookingsPage = () => {
  return (
    <>
      <Heading title="My Bookings" />
      <div className="max-w-4xl mx-auto">
        {mockBookings.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center">
            <FaFutbol className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You have no bookings yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              Browse Courts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white shadow rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={`/images/courts/${booking.courtImage}`}
                    alt={booking.courtName}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800">{booking.courtName}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      {new Date(booking.date).toLocaleDateString('en-ZA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FaClock className="text-gray-400" />
                      {booking.startTime} · {booking.duration} hour{booking.duration > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      Total: R{booking.pricePerHour * booking.duration}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/courts/${booking.courtId}`}
                      className="text-sm px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      View Court
                    </Link>
                    {/* TODO: Wire up cancel booking to backend */}
                    <button className="text-sm px-3 py-1 border border-red-200 text-red-500 rounded-md hover:bg-red-50 flex items-center gap-1">
                      <FaTrash className="text-xs" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default BookingsPage;