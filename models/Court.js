import mongoose from 'mongoose';

const CourtSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    capacity: { type: Number, default: 10 },
    amenities: { type: String, trim: true },
    availability: { type: String, trim: true },
    price_per_hour: { type: Number, required: true },
    image: { type: String, default: 'court-default.jpg' },
    sortOrder: { type: Number, default: 99 },
  },
  { timestamps: true }
);

export default mongoose.models.Court || mongoose.model('Court', CourtSchema);
