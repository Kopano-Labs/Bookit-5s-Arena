import { NextResponse } from "next/server";
import { getLeagueMeta } from "@/lib/sports/football";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const meta = await getLeagueMeta(slug);
    return NextResponse.json(meta);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to load league meta" },
      { status: 500 },
    );
  }
}
