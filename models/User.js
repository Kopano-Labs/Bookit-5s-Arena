import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Not required — OAuth users won't have a password
      minlength: [6, 'Password must be at least 6 characters'],
    },
    image: {
      type: String,
      default: null,
    },
    // Custom uploaded avatar (overrides image from OAuth)
    profileImage: {
      type: String,
      default: null,
    },
    // Public handle — auto-generated from name on OAuth sign-up, editable by user
    username: {
      type: String,
      trim: true,
      default: null,
    },
    // Newsletter opt-in
    newsletterOptIn: {
      type: Boolean,
      default: false,
    },
    // 'user' = regular user, 'admin' = can add/edit/delete courts
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Hash password before saving if it was modified
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare plain password with stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
