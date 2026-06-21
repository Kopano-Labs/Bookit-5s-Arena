import { NextResponse } from "next/server";
import { getFeaturedMatches } from "@/lib/sports/football";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getFeaturedMatches();
    return NextResponse.json(Array.isArray(matches) ? matches : []);
  } catch (error) {
    console.error("[api/football/featured]", error);
    // Empty array keeps the home strip graceful when upstream or config fails during events.
    return NextResponse.json([]);
  }
}
