import { NextRequest, NextResponse } from "next/server";
import { contactSearchService } from "@/services/contactSearchService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ results: [] }, { status: 400 });
    }

    const results = await contactSearchService.search(query);
    return NextResponse.json({ results, status: "success" });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return NextResponse.json(
      { error: "Failed to perform contact search", results: [] },
      { status: 500 }
    );
  }
}
