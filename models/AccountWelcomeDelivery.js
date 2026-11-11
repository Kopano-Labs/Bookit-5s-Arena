import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientAddress: { type: String, required: true },
  status: { type: String, enum: ['queued', 'sending', 'sent', 'failed', 'skipped', 'unknown'], default: 'queued' },
  provider: String, providerMessageId: String, attempts: { type: Number, default: 0 },
  lastAttemptAt: Date, sentAt: Date, error: String,
}, { timestamps: true });
schema.index({ user: 1 }, { unique: true, name: 'account_welcome_once' });
export default mongoose.models.AccountWelcomeDelivery || mongoose.model('AccountWelcomeDelivery', schema);
