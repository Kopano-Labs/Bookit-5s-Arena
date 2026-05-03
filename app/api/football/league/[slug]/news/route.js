import { NextResponse } from "next/server";
import { getLeagueNews } from "@/lib/sports/football";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || new Date().getFullYear();
    const payload = await getLeagueNews(slug, season);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load news" },
      { status: 500 },
    );
  }
}
