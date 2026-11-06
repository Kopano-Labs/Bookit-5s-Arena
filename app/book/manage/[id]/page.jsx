import GuestBookingManager from '@/components/booking/GuestBookingManager';

export const metadata = {
  title: 'Manage your reservation',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function ManageGuestBookingPage({ params }) {
  const { id } = await params;
  return <GuestBookingManager key={id} id={id} />;
}
