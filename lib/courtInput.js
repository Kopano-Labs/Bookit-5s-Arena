export function parseCourtCreatePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A court details object is required' };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const requestedPrice = body.price_per_hour ?? body.pricePerHour;
  const parsedPrice = requestedPrice === '' || requestedPrice === null || requestedPrice === undefined
    ? Number.NaN
    : Number(requestedPrice);

  if (!name || name.length > 100 || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return { error: 'Enter a court name and a positive hourly price' };
  }

  const availability = typeof body.availability === 'string' ? body.availability.trim() : '';
  const openTime = typeof body.openTime === 'string' ? body.openTime.trim() : '';
  const closeTime = typeof body.closeTime === 'string' ? body.closeTime.trim() : '';
  const capacity = Number(body.capacity);
  const sortOrder = Number(body.sortOrder);

  return {
    value: {
      name,
      description: typeof body.description === 'string' ? body.description.trim() : '',
      address: typeof body.address === 'string' ? body.address.trim() : '',
      location: body.location && typeof body.location === 'object' && !Array.isArray(body.location) ? body.location : {},
      capacity: Number.isInteger(capacity) && capacity > 0 ? capacity : 10,
      amenities: Array.isArray(body.amenities)
        ? body.amenities.filter((amenity) => typeof amenity === 'string').join(', ')
        : typeof body.amenities === 'string' ? body.amenities.trim() : '',
      availability: availability || (openTime && closeTime ? `${openTime} - ${closeTime}` : '10:00 AM - 10:00 PM'),
      price_per_hour: parsedPrice,
      image: typeof body.image === 'string' && body.image.trim() ? body.image.trim() : 'court-default.jpg',
      sortOrder: Number.isInteger(sortOrder) && sortOrder >= 0 ? sortOrder : 99,
    },
  };
}
