// Run this once with: node fix-sort-order.js
// Place in your project root next to package.json

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

const Court = mongoose.models.Court || mongoose.model('Court', new mongoose.Schema({
  name: String,
  sortOrder: Number,
}, { strict: false }));

const sortMap = {
  'Premier Court': 1,
  'Secondary Court': 2,
  'Third Court': 3,
  'Fourth Court': 4,
};

for (const [name, order] of Object.entries(sortMap)) {
  const result = await Court.updateOne({ name }, { $set: { sortOrder: order } });
  console.log(`${name}: ${result.modifiedCount ? '✅ updated' : '⚠️ not found'}`);
}

await mongoose.disconnect();
console.log('Done!');
