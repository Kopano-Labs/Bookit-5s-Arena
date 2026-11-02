export function bookingResponse(booking, { replay = false } = {}) {
  const source = booking.toObject ? booking.toObject() : booking;
  if (replay) return { _id: String(source._id), status: source.status, paymentStatus: source.paymentStatus,
    total_price: source.total_price, replayed: true };
  const result = {};
  for (const key of ['_id', 'date', 'start_time', 'duration', 'total_price', 'status', 'paymentStatus',
    'guestName', 'guestEmail', 'guestPhone', 'communicationRevision', 'createdAt', 'updatedAt']) {
    if (source[key] !== undefined) result[key] = source[key];
  }
  const court = source.court;
  result.court = court?._id && court.name ? { _id: court._id, name: court.name, image: court.image,
    address: court.address, price_per_hour: court.price_per_hour } : court;
  if (source.user) result.user = source.user?._id || source.user;
  return result;
}
