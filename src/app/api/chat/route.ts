export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import { generateFinancialAdvice } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, userContext } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await generateFinancialAdvice(message, userContext || "");
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response", details: error.message },
      { status: 500 }
    );
  }
}
