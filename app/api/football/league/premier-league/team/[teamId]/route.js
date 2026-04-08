import { NextResponse } from "next/server";
import { getPremierLeagueTeamAnalysis } from "@/lib/sports/premierLeagueStandings";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");
    const payload = await getPremierLeagueTeamAnalysis(params.teamId, season);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load team analysis" },
      { status: 500 },
    );
  }
}
