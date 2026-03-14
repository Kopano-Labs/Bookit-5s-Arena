'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

    try {
      const res = await fetch('/api/courts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price_per_hour: Number(form.price_per_hour),
          capacity: Number(form.capacity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add court. Please try again.');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-full placeholder-gray-500';
  const labelClass = 'block text-gray-300 uppercase tracking-widest text-xs mb-2 font-semibold';

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center max-w-md w-full">
          <FaFutbol className="mx-auto text-4xl text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Court Added!</h2>
          <p className="text-gray-400 text-sm mb-8">Your new court has been submitted successfully.</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setSuccess(false);
                setForm({ name: '', description: '', address: '', capacity: 10, amenities: '', availability: '', price_per_hour: '', image: '' });
              }}
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
            >
              Add Another
            </button>
            <button
              onClick={() => router.push('/my-courts')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition"
              style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)' }}
            >
              View My Courts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1
            className="text-4xl uppercase text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: '4px' }}
          >
            Add a Court
          </h1>
          <div className="mt-2 h-1 w-16 rounded-full" style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)' }} />
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FaFutbol className="text-green-500 text-xl" />
            <h2 className="text-white text-lg font-bold uppercase tracking-widest">Court Details</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Court Name */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Court Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Premier Court"
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe the court, surface type, ideal for..."
                  className={inputClass}
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Pringle Rd, Milnerton, Cape Town"
                  className={inputClass}
                />
              </div>

              {/* Price */}
              <div>
                <label className={labelClass}>
                  Price per Hour (R) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price_per_hour"
                  value={form.price_per_hour}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 400"
                  className={inputClass}
                />
              </div>

              {/* Capacity */}
              <div>
                <label className={labelClass}>Capacity (players)</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  min="2"
                  className={inputClass}
                />
              </div>

              {/* Availability */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Availability Hours</label>
                <input
                  type="text"
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  placeholder="e.g. 10:00 AM - 22:00 PM"
                  className={inputClass}
                />
              </div>

              {/* Amenities */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Amenities</label>
                <input
                  type="text"
                  name="amenities"
                  value={form.amenities}
                  onChange={handleChange}
                  placeholder="e.g. Floodlights, Change rooms, Secure Parking"
                  className={inputClass}
                />
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <label className={labelClass}>Image Filename</label>
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="e.g. court-5.jpg (must be in /public/images/courts/)"
                  className={inputClass}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Place the image file in <code className="text-gray-400">/public/images/courts/</code> before adding.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl text-white font-bold text-sm uppercase tracking-widest transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)' }}
              >
                {loading ? 'Adding Court...' : 'Add Court'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourtPage;
