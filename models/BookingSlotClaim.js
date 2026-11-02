import mongoose from 'mongoose';

// One document per occupied hour.  A unique key on this small record makes
// interval ownership enforceable even where Mongo transactions are unavailable.
const BookingSlotClaimSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    date: { type: String, required: true },
    hour: { type: String, required: true },
  },
  { timestamps: true },
);

BookingSlotClaimSchema.index({ court: 1, date: 1, hour: 1 }, { unique: true, name: 'booking_slot_ownership' });
BookingSlotClaimSchema.index({ booking: 1, createdAt: 1 });

if (mongoose.models.BookingSlotClaim) {
  try { mongoose.deleteModel('BookingSlotClaim'); } catch {}
}
if (mongoose.modelSchemas?.BookingSlotClaim) delete mongoose.modelSchemas.BookingSlotClaim;

export default mongoose.model('BookingSlotClaim', BookingSlotClaimSchema);
