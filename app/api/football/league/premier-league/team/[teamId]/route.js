import { NextResponse } from "next/server";
import { getPremierLeagueTeamAnalysis } from "@/lib/sports/premierLeagueStandings";
import { normalizePremierLeagueSeason } from "@/lib/sports/premierLeagueConfig";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const { seasonYear } = normalizePremierLeagueSeason(searchParams.get("season"));
    const payload = await getPremierLeagueTeamAnalysis(params.teamId, seasonYear);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load team analysis" },
      { status: 500 },
    );
  }
}
