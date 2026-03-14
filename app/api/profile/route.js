import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET — return current user profile
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorised' }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).select('-password');
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  return Response.json({ name: user.name, email: user.email, image: user.image, role: user.role });
}

// PUT — update name and/or password
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorised' }, { status: 401 });

  const body = await request.json();
  const { name, currentPassword, newPassword } = body;

  if (!name || name.trim().length < 2) {
    return Response.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  // Update name
  user.name = name.trim();

  // Update password only if provided
  if (newPassword) {
    if (newPassword.length < 6) {
      return Response.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }
    // Credentials users must verify current password
    if (user.password) {
      if (!currentPassword) {
        return Response.json({ error: 'Please enter your current password to change it.' }, { status: 400 });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return Response.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }
    }
    user.password = newPassword; // pre-save hook hashes it
  }

  await user.save();
  return Response.json({ message: 'Profile updated successfully.' });
}
