import { NextResponse } from "next/server";
import { getPremierLeagueMatches } from "@/lib/sports/premierLeague";
import { getFootballNewsFeed } from "@/lib/media/news";
import { normalizePremierLeagueSeason } from "@/lib/sports/premierLeagueConfig";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { seasonYear } = normalizePremierLeagueSeason(searchParams.get("season"));
    const matches = await getPremierLeagueMatches(seasonYear);
    const newsFeed = await getFootballNewsFeed({
      seasonLabel: matches.season.label,
    });

    return NextResponse.json({
      season: matches.season,
      provider: newsFeed.providers,
      articles: newsFeed.articles,
      videos: newsFeed.videos,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load league news" },
      { status: 500 },
    );
  }
}
