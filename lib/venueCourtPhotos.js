// Owner-requested venue presentation. These photographs are not database inventory or available slots.
export const venueCourtPhotos = [
  { key: 'court-1', name: 'Premier Court', image: 'court-1.jpg' },
  { key: 'court-2', name: 'Secondary Court', image: 'court-2.jpg' },
  { key: 'court-3', name: 'Third Court', image: 'court-3.jpg' },
  { key: 'court-4', name: 'Fourth Court', image: 'court-4.jpg' },
];

export function courtShowcase(liveCourts = []) {
  if (liveCourts.length) return liveCourts.map(court => ({ ...court,
    bookingHref: `/book?courtId=${encodeURIComponent(String(court._id))}` }));
  return venueCourtPhotos.map(court => ({ ...court, _id: court.key, galleryOnly: true,
    bookingHref: '/book' }));
}
