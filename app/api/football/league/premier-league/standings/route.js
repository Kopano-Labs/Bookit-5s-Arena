import { NextResponse } from "next/server";
import { getPremierLeagueStandings } from "@/lib/sports/premierLeagueStandings";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season");
    const view = searchParams.get("view") || "overall";
    const payload = await getPremierLeagueStandings(season, view);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load standings" },
      { status: 500 },
    );
  }
}
