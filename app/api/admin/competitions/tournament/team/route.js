import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TournamentTeam from '@/models/TournamentTeam';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { teamId, updates } = await request.json();

    if (!teamId || !updates) {
      return NextResponse.json({ error: 'Team ID and updates are required.' }, { status: 400 });
    }

    await connectDB();

    // Ensure we don't accidentally update internal Mongo fields or userId unless intended
    const filteredUpdates = { ...updates };
    delete filteredUpdates._id;
    delete filteredUpdates.userId;

    const team = await TournamentTeam.findByIdAndUpdate(
      teamId,
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );

    if (!team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Team "${team.teamName}" updated successfully in real-time.`,
      team,
    });
  } catch (error) {
    console.error('API Error (Tournament Team Update):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
