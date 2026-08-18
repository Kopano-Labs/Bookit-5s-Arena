export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TournamentTeam from '@/models/TournamentTeam';
import { WORLD_CUP_TEAMS } from '@/lib/worldCupTeams';
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from '@/lib/tournamentConfig';

const TOURNAMENT_DEADLINE = new Date(TOURNAMENT_DATES.signupDeadlineISO);
const TOURNAMENT_END = new Date('2026-05-31T23:59:59+02:00');

function lifecycleState(now = new Date()) {
  if (now < TOURNAMENT_DEADLINE) return 'registration';
  if (now <= TOURNAMENT_END) return 'closed-live-window';
  return 'archived';
}

/* Historical read surface: team records remain queryable, registration does not. */
export async function GET() {
  try {
    await connectDB();
    const teams = await TournamentTeam.find().sort({ createdAt: -1 }).lean();
    const takenTeams = teams.map((team) => team.worldCupTeam);
    const availableTeams = WORLD_CUP_TEAMS.filter(
      (worldCupTeam) => !takenTeams.includes(`${worldCupTeam.name} (${worldCupTeam.player})`),
    );
    const lifecycle = lifecycleState();

    return NextResponse.json({
      lifecycle,
      archive: lifecycle === 'archived',
      teams: teams.map((team) => ({ ...team, _id: team._id.toString() })),
      availableTeams: lifecycle === 'registration' ? availableTeams : [],
      deadline: TOURNAMENT_DEADLINE.toISOString(),
      eventEndedAt: TOURNAMENT_END.toISOString(),
      isOpen: lifecycle === 'registration',
      totalSlots: TOURNAMENT_FORMAT.totalTeams,
      registeredCount: teams.length,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* World Cup 2026 is immutable historical state. Old clients cannot create registrations. */
export async function POST() {
  return NextResponse.json(
    {
      error: `World Cup 2026 registration is closed. The deadline was ${TOURNAMENT_DATES.signupDeadline} and the event concluded ${TOURNAMENT_DATES.end}.`,
      lifecycle: 'archived',
      archiveUrl: '/tournament',
    },
    {
      status: 410,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
