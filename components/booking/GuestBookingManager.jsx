'use client';

import { useEffect, useRef, useState } from 'react';
import { guestManagementPath } from '@/lib/bookings/guestManagementLink';

export default function GuestBookingManager({ id }) {
  const token = useRef('');
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ date: '', start_time: '', duration: 1 });
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [privateLink, setPrivateLink] = useState('');
  const storageKey = `bookit.guest.${id}`;

  useEffect(() => {
    const controller = new AbortController();
    const incoming = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (incoming) token.current = incoming;
    try {
      if (incoming && guestManagementPath(id, incoming)) sessionStorage.setItem(storageKey, incoming);
      else if (!token.current) token.current = sessionStorage.getItem(storageKey) || '';
    } catch { /* In-memory access still works when browser storage is disabled. */ }
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
    const path = guestManagementPath(id, token.current);
    if (!path) {
      setError('Open the private management link from your reservation email or saved confirmation.');
      setBusy(false);
      return () => controller.abort();
    }
    setPrivateLink(window.location.origin + path);
    fetch(`/api/bookings/${id}`, { cache: 'no-store', signal: controller.signal,
      headers: { 'x-booking-management-token': token.current } })
      .then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(response.status === 401 || response.status === 403
          ? 'This private link has expired or is no longer valid. Contact the venue with your booking reference.'
          : result.error || 'Could not load your reservation.');
        setBooking(result);
        setForm({ date: result.date, start_time: result.start_time, duration: result.duration });
      })
      .catch(reason => { if (!controller.signal.aborted) setError(reason.message); })
      .finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [id, storageKey]);

  async function changeBooking(method) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/bookings/${id}`, { method, cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'x-booking-management-token': token.current },
        ...(method === 'PUT' ? { body: JSON.stringify(form) } : {}) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your change could not be saved.');
      if (method === 'DELETE') {
        setBooking(current => ({ ...current, status: 'cancelled' }));
        setNotice('Reservation cancelled. Contact the venue about any payment already made.');
        setPrivateLink(''); token.current = '';
        try { sessionStorage.removeItem(storageKey); } catch { /* Nothing to clear. */ }
      } else {
        if (String(result._id) !== id) throw new Error('Bookit could not verify the saved change. Reload to check your reservation.');
        setBooking(result);
        setForm({ date: result.date, start_time: result.start_time, duration: result.duration });
        setNotice('Reservation updated. Your saved details are shown below.');
      }
      setConfirmCancel(false);
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  }

  const fieldClass = 'min-h-11 w-full rounded-lg border border-white/20 bg-gray-900 p-3 text-white';
  return (
    <section className="mx-auto max-w-2xl space-y-5 px-4 py-10 text-white">
      <h1 className="text-3xl font-bold">Manage your reservation</h1>
      <p className="text-sm text-gray-300">Reference {id.slice(-8).toUpperCase()}</p>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 p-4">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-green-400/40 p-4">{notice}</p>}
      {busy && <p role="status">Loading your reservation…</p>}
      {booking && <>
        <div aria-label="Saved reservation" className="space-y-2 rounded-xl border border-white/20 p-5">
          <h2 className="text-xl font-bold">{booking.court?.name || 'Court reservation'}</h2>
          <p>{booking.date} · {booking.start_time} · {booking.duration}h</p>
          <p>Status: {booking.status} · Payment: {booking.paymentStatus}</p>
          <p>Booking total: R{booking.total_price}</p>
        </div>
        {booking.status !== 'cancelled' && <>
          <form onSubmit={event => { event.preventDefault(); changeBooking('PUT'); }} className="space-y-4">
            <h2 className="text-xl font-bold">Change date or time</h2>
            <p className="text-sm text-gray-300">Changes must be made at least 8 hours before the existing start time. Availability is checked when you save.</p>
            <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-3">
              <label>Date<input className={fieldClass} type="date" required value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /></label>
              <label>Start time<input className={fieldClass} type="time" step="3600" required value={form.start_time} onChange={event => setForm({ ...form, start_time: event.target.value })} /></label>
              <label>Duration<select className={fieldClass} value={form.duration} onChange={event => setForm({ ...form, duration: Number(event.target.value) })}>
                {[1, 2, 3].map(hours => <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>)}
              </select></label>
              <button className="min-h-11 rounded-lg bg-green-700 p-3 font-semibold sm:col-span-3" type="submit">Save changes</button>
            </fieldset>
          </form>
          {confirmCancel ? <div className="space-y-3 rounded-xl border border-red-400/40 p-4">
            <p>Cancel this reservation? This releases the court and ends access through this private link.</p>
            <button disabled={busy} className="min-h-11 rounded-lg bg-red-800 px-4" onClick={() => changeBooking('DELETE')}>Confirm cancellation</button>{' '}
            <button disabled={busy} className="min-h-11 px-4" onClick={() => setConfirmCancel(false)}>Keep reservation</button>
          </div> : <button disabled={busy} className="min-h-11 rounded-lg border border-red-400/40 px-4" onClick={() => setConfirmCancel(true)}>Cancel reservation</button>}
          {privateLink && <div className="space-y-2 text-sm">
            <label htmlFor="private-booking-link">Save your private management link</label>
            <input id="private-booking-link" readOnly value={privateLink} onFocus={event => event.target.select()} className={fieldClass} />
            <p className="text-gray-300">Anyone with this link can manage this reservation. Keep it private. It expires 30 days after booking.</p>
          </div>}
        </>}
      </>}
      <a href="/contact" className="inline-block py-3 text-yellow-300 underline">Contact the venue</a>
    </section>
  );
}
