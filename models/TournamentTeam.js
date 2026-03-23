import mongoose from 'mongoose';

const TournamentTeamSchema = new mongoose.Schema(
  {
    /* Manager / captain details */
    managerName: { type: String, required: true, trim: true },
    managerEmail: { type: String, required: true, trim: true, lowercase: true },
    managerPhone: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    /* Team identity */
    teamName: { type: String, required: true, trim: true },
    worldCupTeam: { type: String, required: true }, // e.g. "Argentina (Lionel Messi)"
    worldCupTeamLogo: { type: String },

    /* Players (5 required + up to 3 reserves) */
    players: [
      {
        name: { type: String, required: true },
        position: { type: String, enum: ['GK', 'DEF', 'MID', 'FWD'], default: 'MID' },
        isReserve: { type: Boolean, default: false },
      },
    ],

    /* Support staff (up to 3) */
    supportGuests: [
      {
        name: { type: String },
        role: { type: String }, // e.g. "Water Carrier", "Coach", "Physio"
      },
    ],

    /* Communication preference */
    communicationPref: {
      type: String,
      enum: ['sms', 'email', 'whatsapp'],
      default: 'whatsapp',
    },

    /* Tournament assignment */
    groupNumber: { type: Number, min: 1, max: 8 },
    groupLetter: { type: String, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },

    /* Status */
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'disqualified'],
      default: 'pending',
    },

    agreedToTerms: { type: Boolean, required: true, default: false },
    agreedToRules: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Validation: at least 5 non-reserve players
TournamentTeamSchema.path('players').validate(function (players) {
  const starters = players.filter((p) => !p.isReserve);
  return starters.length >= 5;
}, 'A team must have at least 5 starting players.');

// Validation: max 3 reserves
TournamentTeamSchema.path('players').validate(function (players) {
  const reserves = players.filter((p) => p.isReserve);
  return reserves.length <= 3;
}, 'A team can have at most 3 reserve players.');

// Validation: max 3 support guests
TournamentTeamSchema.path('supportGuests').validate(function (guests) {
  return guests.length <= 3;
}, 'A team can have at most 3 support guests.');

const TournamentTeam =
  mongoose.models.TournamentTeam || mongoose.model('TournamentTeam', TournamentTeamSchema);

export default TournamentTeam;
