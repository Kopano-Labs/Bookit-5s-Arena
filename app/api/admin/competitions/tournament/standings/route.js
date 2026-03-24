import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TournamentTeam from '@/models/TournamentTeam';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const teams = await TournamentTeam.find().lean();
    
    // Group teams into A-H
    const groups = {};
    ['A','B','C','D','E','F','G','H'].forEach(l => groups[l] = []);
    
    teams.forEach(t => {
      if (t.groupLetter && groups[t.groupLetter]) {
        groups[t.groupLetter].push({
          ...t,
          _id: t._id.toString()
        });
      }
    });

    // Sort teams in each group by PTS, then GD, then GF
    Object.keys(groups).forEach(l => {
      groups[l].sort((a,b) => (b.pts||0) - (a.pts||0) || (b.gd||0) - (a.gd||0) || (b.gf||0) - (a.gf||0));
    });

    return NextResponse.json({ groups });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
