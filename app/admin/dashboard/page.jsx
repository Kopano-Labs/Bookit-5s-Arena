'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Heading from '@/components/Heading';
import { FaCalendarAlt, FaFutbol, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && session.user.role !== 'admin') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: <FaCalendarAlt className="text-2xl text-blue-500" /> },
    { label: 'Total Revenue', value: `R${stats.totalRevenue.toLocaleString()}`, icon: <FaMoneyBillWave className="text-2xl text-green-500" /> },
    { label: 'Total Courts', value: stats.totalCourts, icon: <FaFutbol className="text-2xl text-yellow-500" /> },
    { label: 'Upcoming Bookings', value: stats.upcomingBookings, icon: <FaClock className="text-2xl text-purple-500" /> },
  ];

  return (
    <>
      <Heading title="Admin Dashboard" />
      <div className="max-w-4xl mx-auto mt-4 space-y-6">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white shadow rounded-lg p-5 flex flex-col items-center text-center gap-2">
              {card.icon}
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          ))}
        </div>

        {stats.mostBookedCourt && (
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Most Booked Court</h3>
            <p className="text-xl font-bold text-gray-800">{stats.mostBookedCourt.name}</p>
            <p className="text-sm text-gray-500">{stats.mostBookedCourt.count} booking(s)</p>
          </div>
        )}

      </div>
    </>
  );
};

export default AdminDashboard;
