import { NextResponse } from "next/server";
import { getLeagueMatches } from "@/lib/sports/football";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || new Date().getFullYear();
    const payload = await getLeagueMatches(slug, season);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load matches" },
      { status: 500 },
    );
  }
}
