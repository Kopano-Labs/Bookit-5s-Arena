import CourtCard from '@/components/CourtCard';
import Heading from '@/components/Heading';
import courts from '@/data/courts.json';


export default function Home() {
  return (
    <>
      <Heading title="Available Courts" />
      {courts.length > 0 ? (
        courts.map((court) => <CourtCard court={court} key={court.$id} />)
        ) : (
        <p>No courts available at the moment</p>
        )}
    </>
  );
}
