import { NextResponse } from "next/server";
import { getPremierLeagueMeta } from "@/lib/sports/premierLeague";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const meta = await getPremierLeagueMeta();
    return NextResponse.json(meta);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load league meta" },
      { status: 500 },
    );
  }
}
