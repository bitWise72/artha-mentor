export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { generateFamilyAnalysis } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { familyContext } = await req.json();
    const response = await generateFamilyAnalysis(familyContext || "");

    let parsed;
    try {
      const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { error: "Failed to parse AI response", raw: response };
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Family API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
