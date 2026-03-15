import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local file');
}

// Use a cached connection to avoid creating a new connection on every serverless request
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// ── Connection options ────────────────────────────────────────────────────────
// bufferCommands: false — fail immediately if DB is not connected instead of
//   silently queuing operations (surfaces Atlas outages fast in serverless)
// maxPoolSize: 10 — up to 10 concurrent connections per worker instance
// serverSelectionTimeoutMS: 5 s — fast fail if Atlas is unreachable
// socketTimeoutMS: 45 s — close idle TCP sockets before AWS/Vercel kills them
const MONGOOSE_OPTS = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, MONGOOSE_OPTS)
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
