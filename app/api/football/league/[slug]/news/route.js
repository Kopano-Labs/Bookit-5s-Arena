import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getLeagueNews } from "@/lib/sports/football";

/** Vercel Hobby plan has a strict 10-second limit; removing maxDuration=60 to prevent deployment failure. */
export async function GET(request, context) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const season = String(
      searchParams.get("season") || new Date().getFullYear(),
    );

    const payload = await unstable_cache(
      () => getLeagueNews(slug, season),
      ["football-league-news", slug, season],
      { revalidate: 180 },
    )();

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load news" },
      { status: 500 },
    );
  }
}
