import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getLeagueNews } from "@/lib/sports/football";

/** Vercel: allow RSS + OG enrichment time (was hitting 504 when PL path loaded all fixtures first). */
export const maxDuration = 60;

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
