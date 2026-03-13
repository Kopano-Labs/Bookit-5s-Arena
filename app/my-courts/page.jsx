'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Heading from '@/components/Heading';
import { FaFutbol, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

    const MyCourtsPage = () => {
      const [courts, setCourts] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchCourts = async () => {
          const res = await fetch('/api/courts?mine=true');
          const data = await res.json();
          setCourts(data);
          setLoading(false);
        };
        fetchCourts();
      }, []);

      const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this court?')) return;
        await fetch(`/api/courts/${id}`, { method: 'DELETE' });
        setCourts((prev) => prev.filter((c) => c._id !== id));
      };

      if (loading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

      return (

    <>
      <Heading title="My Courts" />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <Link
            href="/courts/add"
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
          >
            <FaPlus /> Add New Court
          </Link>
        </div>

        {courts.length === 0 ? (

          <div className="bg-white shadow rounded-lg p-10 text-center">
            <FaFutbol className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You haven&apos;t added any courts yet.</p>
            <Link
              href="/courts/add"
              className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              Add Your First Court
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {courts.map((court) => (
              <div
                key={court._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={`/images/courts/${court.image}`}
                    alt={court.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800">{court.name}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Address:</span> {court.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Availability:</span> {court.availability}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Price:</span> R{court.price_per_hour}/hour
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/courts/${court.$id}`}
                    className="text-sm px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    View
                  </Link>
          <Link
              href={`/courts/${court._id}/edit`}
              className="text-sm px-3 py-1 border border-blue-200 text-blue-500 rounded-md hover:bg-blue-50 flex items-center gap-1"
          >
            <FaEdit className="text-xs" /> Edit
          </Link>
          <button
              onClick={() => handleDelete(court._id)}
              className="text-sm px-3 py-1 border border-red-200 text-red-500 rounded-md hover:bg-red-50 flex items-center gap-1"
          >
            <FaTrash className="text-xs" /> Delete
          </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyCourtsPage;