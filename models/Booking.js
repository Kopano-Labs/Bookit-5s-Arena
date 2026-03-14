import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    // Guest booking fields (when user is not authenticated)
    guestName:  { type: String, default: null },
    guestEmail: { type: String, default: null },
    guestPhone: { type: String, default: null },
    date: {
      type: String, // stored as 'YYYY-MM-DD'
      required: [true, 'Booking date is required'],
    },
    start_time: {
      type: String, // stored as 'HH:MM'
      required: [true, 'Start time is required'],
    },
    duration: {
      type: Number, // in hours
      required: [true, 'Duration is required'],
      min: [1, 'Minimum booking is 1 hour'],
      max: [3, 'Maximum booking is 3 hours'],
    },
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded', 'reserved'],
      default: 'unpaid',
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent double bookings: same court, same date, overlapping time
BookingSchema.index({ court: 1, date: 1, start_time: 1 }, { unique: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
