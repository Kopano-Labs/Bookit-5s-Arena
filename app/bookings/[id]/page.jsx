'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaEnvelope, FaEdit, FaArrowLeft } from 'react-icons/fa';

const BookingDetailPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => { setBooking(data); setLoading(false); });
  }, [id]);

  const handleResend = async () => {
    setResending(true);
    setResendMsg('');
    const res = await fetch(`/api/bookings/${id}/resend`, { method: 'POST' });
    setResendMsg(res.ok ? 'Receipt sent to your email!' : 'Failed to send. Please try again.');
    setResending(false);
  };

  const isWithin8Hours = () => {
    if (!booking) return false;
    const bookingDateTime = new Date(`${booking.date}T${booking.start_time}:00`);
    return (bookingDateTime - new Date()) / (1000 * 60 * 60) < 8;
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading booking...</div>;
  if (!booking || booking.error) return <div className="text-center py-10 text-red-500">Booking not found.</div>;

  const court = booking.court;
  const canEdit = !isWithin8Hours() && booking.status !== 'cancelled';

  const statusStyle =
    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
    'bg-yellow-100 text-yellow-700';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      <Link href="/bookings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <FaArrowLeft className="text-xs" /> Back to Bookings
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{court?.name}</h1>
      <hr className="mb-6" />

      {/* Court info */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {court?.image && (
          <Image
            src={`/images/courts/${court.image}`}
            alt={court.name}
            width={300}
            height={200}
            className="w-full md:w-72 h-52 object-cover rounded-lg"
          />
        )}
        <div className="space-y-2 text-sm text-gray-700">
          {court?.description && <p className="text-teal-600 italic">{court.description}</p>}
          {court?.amenities?.length > 0 && (
            <p><span className="font-semibold text-gray-800">Amenities:</span> {court.amenities.join(', ')}</p>
          )}
          <p><span className="font-semibold text-gray-800">Availability:</span> {court?.availability}</p>
          <p><span className="font-semibold text-gray-800">Price:</span> R{court?.price_per_hour}/hour</p>
          <p><span className="font-semibold text-gray-800">Address:</span> {court?.address}</p>
        </div>
      </div>

      {/* Booking details */}
      <div className="bg-white shadow rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Booked Court</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="font-medium text-gray-800 flex items-center gap-1">
              <FaCalendarAlt className="text-gray-400 text-xs" />
              {new Date(booking.date).toLocaleDateString('en-ZA', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Start Time</p>
            <p className="font-medium text-gray-800 flex items-center gap-1">
              <FaClock className="text-gray-400 text-xs" /> {booking.start_time}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Duration</p>
            <p className="font-medium text-gray-800">{booking.duration} hour{booking.duration > 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Paid</p>
            <p className="font-bold text-gray-900">R{booking.total_price}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FaEnvelope className="text-xs" />
            {resending ? 'Sending...' : 'Resend Receipt to Email'}
          </button>

          {canEdit ? (
            <Link
              href={`/bookings/${id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-md text-sm hover:bg-blue-50"
            >
              <FaEdit className="text-xs" /> Edit Booking
            </Link>
          ) : (
            <button
              disabled
              title={booking.status === 'cancelled' ? 'Cancelled bookings cannot be edited' : 'Cannot edit within 8 hours of start time'}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-400 rounded-md text-sm cursor-not-allowed"
            >
              <FaEdit className="text-xs" /> Edit Booking
            </button>
          )}
        </div>

        {resendMsg && (
          <p className={`text-sm ${resendMsg.includes('sent') ? 'text-green-600' : 'text-red-500'}`}>
            {resendMsg}
          </p>
        )}

        {/* T&Cs */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-400 leading-relaxed">
            By booking a court at 5s Arena, you agree to our Terms &amp; Conditions. Bookings are non-refundable within 8 hours
            of the scheduled start time. Cancellations made more than 8 hours in advance will be reviewed by management.
            5s Arena reserves the right to cancel bookings due to unforeseen circumstances, in which case a full refund or
            rebooking will be offered. Players are responsible for their own safety and that of other participants. 5s Arena
            accepts no liability for injury, loss, or damage to personal property. All bookings are subject to availability
            and confirmation.
          </p>
        </div>
      </div>

    </div>
  );
};

export default BookingDetailPage;
