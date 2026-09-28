import mongoose from 'mongoose';

const BookingSlotSchema = new mongoose.Schema(
  {
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    hour: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },
    claimId: {
      type: String,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

BookingSlotSchema.index(
  { court: 1, date: 1, hour: 1 },
  { unique: true, name: 'court_date_hour_unique' },
);
BookingSlotSchema.index({ claimId: 1 }, { name: 'booking_slot_claim_lookup' });
BookingSlotSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    name: 'unattached_booking_claim_ttl',
    partialFilterExpression: { bookingId: null },
  },
);

if (mongoose.models.BookingSlot) {
  try {
    mongoose.deleteModel('BookingSlot');
  } catch {}
}

export default mongoose.model('BookingSlot', BookingSlotSchema);
