import { NextResponse } from "next/server";
import { getPremierLeagueTeamAnalysis } from "@/lib/sports/premierLeagueStandings";
import { normalizePremierLeagueSeason } from "@/lib/sports/premierLeagueConfig";

export const dynamic = "force-dynamic";

const PREMIER_LEAGUE_SLUG = "premier-league";

export async function GET(request, context) {
  try {
    const { slug, teamId } = await context.params;

    if (slug !== PREMIER_LEAGUE_SLUG) {
      return NextResponse.json(
        { error: "Team analysis is not available for this league" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const { seasonYear } = normalizePremierLeagueSeason(searchParams.get("season"));
    const payload = await getPremierLeagueTeamAnalysis(teamId, seasonYear);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load team analysis" },
      { status: 500 },
    );
  }
}
