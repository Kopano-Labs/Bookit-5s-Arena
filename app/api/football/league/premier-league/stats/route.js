import { NextResponse } from "next/server";
import { getPremierLeagueStats } from "@/lib/sports/premierLeagueStats";
import {
  normalizePremierLeagueSeason,
  normalizePremierLeagueStatsCategory,
} from "@/lib/sports/premierLeagueConfig";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
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
