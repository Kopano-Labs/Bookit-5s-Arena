import { NextResponse } from "next/server";
import { getPremierLeagueStandings } from "@/lib/sports/premierLeagueStandings";
import {
  normalizePremierLeagueSeason,
  normalizePremierLeagueStandingsView,
} from "@/lib/sports/premierLeagueConfig";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
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
