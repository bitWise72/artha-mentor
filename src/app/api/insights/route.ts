import { NextRequest, NextResponse } from "next/server";
import { generateInsights } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { userContext } = await req.json();
    const response = await generateInsights(userContext || "");

    let parsed;
    try {
      const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { error: "Failed to parse AI response", raw: response };
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Insights API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
