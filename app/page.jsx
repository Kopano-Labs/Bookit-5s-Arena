import Heading from '@/components/Heading';
import CourtCard from '@/components/CourtCard';

// Fetch courts from our API instead of static JSON
const getCourts = async () => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/courts`, {
      cache: 'no-store', // always fetch fresh data
    });

    if (!res.ok) throw new Error('Failed to fetch courts');

    return res.json();
  } catch (error) {
    console.error('Error fetching courts:', error);
    return [];
  }
};

const HomePage = async () => {
  const courts = await getCourts();

  return (
    <>
      <Heading title="Available Courts" />
      <div className="max-w-4xl mx-auto">
        {courts.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No courts available at the moment.</p>
        ) : (
          courts.map((court) => (
            <CourtCard key={court._id} court={court} />
          ))
        )}
      </div>
    </>
  );
};

export default HomePage;
