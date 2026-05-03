import { NextResponse } from "next/server";
import { getPremierLeagueStandings } from "@/lib/sports/premierLeagueStandings";
import {
  normalizePremierLeagueSeason,
  normalizePremierLeagueStandingsView,
} from "@/lib/sports/premierLeagueConfig";

export const dynamic = "force-dynamic";

const PREMIER_LEAGUE_SLUG = "premier-league";

export async function GET(request, context) {
  try {
    const { slug } = await context.params;

    if (slug !== PREMIER_LEAGUE_SLUG) {
      return NextResponse.json(
        { error: "Standings are not available for this league" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const { seasonYear } = normalizePremierLeagueSeason(searchParams.get("season"));
    const view = normalizePremierLeagueStandingsView(searchParams.get("view"));
    const payload = await getPremierLeagueStandings(seasonYear, view);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load standings" },
      { status: 500 },
    );
  }
}
