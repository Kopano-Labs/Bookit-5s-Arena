import mongoose from 'mongoose';

const CourtSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Court name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    location: {
      type: String,
    },
    capacity: {
      type: Number,
      default: 10,
    },
    amenities: {
      type: String,
    },
    availability: {
      type: String,
      default: '10:00 AM - 22:00 PM',
    },
    price_per_hour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: 'court-default.jpg',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Court || mongoose.model('Court', CourtSchema);
