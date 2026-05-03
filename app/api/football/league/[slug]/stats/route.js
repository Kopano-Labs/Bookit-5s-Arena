import { NextResponse } from "next/server";
import { getPremierLeagueStats } from "@/lib/sports/premierLeagueStats";
import {
  normalizePremierLeagueSeason,
  normalizePremierLeagueStatsCategory,
} from "@/lib/sports/premierLeagueConfig";

export const dynamic = "force-dynamic";

const PREMIER_LEAGUE_SLUG = "premier-league";

export async function GET(request, context) {
  try {
    const { slug } = await context.params;

    if (slug !== PREMIER_LEAGUE_SLUG) {
      return NextResponse.json(
        { error: "Stats are not available for this league" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const { seasonYear } = normalizePremierLeagueSeason(searchParams.get("season"));
    const category = normalizePremierLeagueStatsCategory(searchParams.get("category"));
    const payload = await getPremierLeagueStats(seasonYear, category);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load stats" },
      { status: 500 },
    );
  }
}
