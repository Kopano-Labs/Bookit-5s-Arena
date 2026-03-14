import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  fromName: { type: String, default: '5S Arena' },
  body: { type: String, required: true }, // HTML content
  status: { type: String, enum: ['draft', 'scheduled', 'sent'], default: 'draft' },
  scheduledAt: { type: Date, default: null },
  sentAt: { type: Date, default: null },
  recipientCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);
