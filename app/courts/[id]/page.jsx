import Heading from '@/components/Heading';
import BookingForm from  '@/components/BookingForm';
import Image from 'next/image';
import Link from 'next/';
import {FaChevronLeft } from 'react-icons/fa';
import courts from '@/data/courts.json';

const CourtPage = ({params}) => {
    const { id } = params;
const court = courts.find((court) => court.$id === id);

    if (!court) {
        return <Heading title="Court not found" />;
    }

    return <>
        <Heading title={court.name} />
              <div className="bg-white shadow rounded-lg p-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaChevronLeft className='inline-block mr-1' />
          <span className="ml-2">Back to Rooms</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <Image
            src={`/images/courts/${court.image}`} 
            alt={court.name}
            width={400}
            height={200}
            className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="mt-4 sm:mt-0 sm:flex-1">
            <p className="text-gray-600 mb-4">
                {court.description} 
            </p>

            <ul className="space-y-2">
              <li>
              </li>
              <li>
                <span className="font-semibold text-gray-800">Availability:</span>
                {court.availability}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Price:</span>
                R{court.price}/hour
              </li>
              <li>
                <span className="font-semibold text-gray-800">Address:</span> 
                {court.address}

              </li>
            </ul>
          </div>
        </div>

        <BookingForm />


      </div>
    </>;
    
}
 
export default CourtPage;