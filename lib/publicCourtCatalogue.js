import { MongoClient, ObjectId } from 'mongodb';
import connectDB from './mongodb.js';
import { normalizeCourtImageFilename } from './courtImage.js';

// Existing Hellenic court records in Bookit, scoped to this venue's catalogue.
const courtIds = [
  '69b2d12c45270721dd43b6c7',
  '69b2d12c45270721dd43b6c8',
  '69b2d12c45270721dd43b6c9',
  '69b2d12c45270721dd43b6ca',
];
const publicFields = {
  name: 1,
  description: 1,
  address: 1,
  location: 1,
  capacity: 1,
  amenities: 1,
  availability: 1,
  price_per_hour: 1,
  image: 1,
  sortOrder: 1,
};

let clientPromise;

async function catalogueCollection() {
  const dedicatedUri = process.env.COURT_CATALOGUE_MONGODB_URI;
  if (dedicatedUri) {
    if (!clientPromise) {
      const client = new MongoClient(dedicatedUri, { maxPoolSize: 4, serverSelectionTimeoutMS: 5000 });
      clientPromise = client.connect().catch(async (error) => {
        await client.close();
        clientPromise = undefined;
        throw error;
      });
    }

    const client = await clientPromise;
    return client.db('bookit').collection('courts');
  }

  const conn = await connectDB();
  const client = conn?.connection?.getClient?.() ?? conn?.getClient?.();
  if (!client) throw new Error('The public court catalogue connection is not configured');
  return client.db('bookit').collection('courts');
}

function toPublicCourt(court) {
  return {
    ...court,
    _id: court._id.toHexString(),
    image: normalizeCourtImageFilename(court.image),
  };
}

export async function listPublicCourts() {
  const collection = await catalogueCollection();
  const courts = await collection
    .find({ _id: { $in: courtIds.map((id) => new ObjectId(id)) } }, { projection: publicFields })
    .sort({ sortOrder: 1, _id: 1 })
    .toArray();
  return courts.map(toPublicCourt);
}

export async function findPublicCourt(id) {
  const courtId = id.toLowerCase();
  if (!courtIds.includes(courtId)) return null;

  const collection = await catalogueCollection();
  const court = await collection.findOne({ _id: new ObjectId(courtId) }, { projection: publicFields });
  return court ? toPublicCourt(court) : null;
}
