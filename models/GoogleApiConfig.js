import mongoose from 'mongoose';

const GoogleApiConfigSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
    enum: [
      'maps',
      'calendar',
      'analytics',
      'recaptcha',
      'youtube',
      'sheets',
      'gmail',
      'search',
    ],
  },
  label:       { type: String, required: true },
  description: { type: String, default: '' },
  enabled:     { type: Boolean, default: false },
  configured:  { type: Boolean, default: false },
  // Which roles can see features powered by this API
  visibleTo: {
    guest:   { type: Boolean, default: false },
    user:    { type: Boolean, default: false },
    manager: { type: Boolean, default: false },
    admin:   { type: Boolean, default: true },
  },
  // Tracks usage (updated periodically)
  usage: {
    requestsToday: { type: Number, default: 0 },
    requestsMonth: { type: Number, default: 0 },
    lastUsed:      { type: Date, default: null },
    errors:        { type: Number, default: 0 },
  },
  // API-specific settings (flexible per API)
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.GoogleApiConfig ||
  mongoose.model('GoogleApiConfig', GoogleApiConfigSchema);
