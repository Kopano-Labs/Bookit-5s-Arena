import { NextResponse } from "next/server";
import { getFeaturedMatches } from "@/lib/sports/football";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getFeaturedMatches();
    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load featured matches" },
      { status: 500 },
    );
  }
}
