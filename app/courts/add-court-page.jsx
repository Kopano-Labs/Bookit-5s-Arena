'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Heading from '@/components/Heading';
import { FaFutbol } from 'react-icons/fa';

const AddCourtPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    capacity: 10,
    amenities: '',
    availability: '',
    price_per_hour: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.description || !form.address || !form.price_per_hour) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    // TODO: Replace with real API call to POST /api/courts
    console.log('New court submitted:', form);

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <>
        <Heading title="Add a Court" />
        <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-10 text-center mt-4">
          <FaFutbol className="mx-auto text-4xl text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Court Added Successfully!</h2>
          <p className="text-gray-500 mt-2 text-sm">Your new court has been submitted.</p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => { setSuccess(false); setForm({ name: '', description: '', address: '', capacity: 10, amenities: '', availability: '', price_per_hour: '', image: '' }); }}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Add Another Court
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              View All Courts
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Heading title="Add a Court" />
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8 mt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaFutbol /> Court Details
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Court Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Premier Court"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the court, surface type, ideal for..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="e.g. Pringle Rd, Milnerton, Cape Town"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Hour (R) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price_per_hour"
                value={form.price_per_hour}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 400"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (players)
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                min="2"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability Hours
              </label>
              <input
                type="text"
                name="availability"
                value={form.availability}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 22:00 PM"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <input
                type="text"
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="e.g. Floodlights, Change rooms, Secure Parking"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Filename
              </label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="e.g. court-5.jpg (must be in /public/images/courts/)"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Image upload will be available once the backend is connected.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Court...' : 'Add Court'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCourtPage;