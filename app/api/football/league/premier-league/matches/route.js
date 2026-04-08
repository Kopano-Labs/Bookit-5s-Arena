import { NextResponse } from "next/server";
import { getPremierLeagueMatches } from "@/lib/sports/premierLeague";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");
    const payload = await getPremierLeagueMatches(season);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load matches" },
      { status: 500 },
    );
  }
}
