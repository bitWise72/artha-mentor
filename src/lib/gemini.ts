import { GoogleGenAI } from "@google/genai";

const getKeys = () => [
  process.env.GEMINI_API_KEY,
  process.env.FALL_BACK_API_1,
  process.env.FALL_BACK_API_2
].filter(Boolean) as string[];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(fn: (client: GoogleGenAI) => Promise<T>, maxRetries = 5, initialDelayMs = 2000): Promise<T> {
  const keys = getKeys();
  let attempt = 0;
  let keyIndex = 0;
  
  while (attempt < maxRetries) {
    try {
      const client = new GoogleGenAI({ apiKey: keys[keyIndex]! });
      return await fn(client);
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || "";
      if (err?.status === 429 || msg.includes("429") || msg.includes("quota") || msg.includes("rate") || msg.includes("fetch failed")) {
        attempt++;
        if (attempt >= maxRetries) throw err;
        keyIndex = (keyIndex + 1) % keys.length; // Cycle Key
        const delay = initialDelayMs * Math.pow(2, attempt - 1); // Exact Exponential backoff
        console.warn(`[Artha API] Rate limited (429). Shifting to fallback API Key ${keyIndex}. Retrying ${attempt}/${maxRetries} in ${delay}ms...`);
        await sleep(delay);
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

export async function generateFinancialAdvice(prompt: string, userContext: string): Promise<string> {
  return withRetry(async (client) => {
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are Artha AI, an expert Indian personal finance advisor embedded in the Economic Times. You give concise, actionable, India-specific financial advice. Always reference exact sections (80C, 80D, 80CCD), specific fund names, and real tax slabs. Be warm but data-driven. Use ₹ for currency. Keep responses under 200 words unless the user asks for detail.
  
  USER FINANCIAL CONTEXT:
  ${userContext}
  
  USER QUESTION:
  ${prompt}`,
            },
          ],
        },
      ],
    });
    return result.text || "I'm sorry, I couldn't generate a response right now. Please try again.";
  });
}

export async function generateHealthAnalysis(userContext: string): Promise<string> {
  return withRetry(async (client) => {
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are Artha AI. Analyze this Indian user's financial health and provide a JSON response with exactly this structure (no markdown, no code fences, just raw JSON):
  {
    "overallScore": <number 0-100>,
    "dimensions": [
      {"name": "Emergency Fund", "score": <number>, "label": "<short status>"},
      {"name": "Insurance Coverage", "score": <number>, "label": "<short status>"},
      {"name": "Investment Diversification", "score": <number>, "label": "<short status>"},
      {"name": "Debt Health", "score": <number>, "label": "<short status>"},
      {"name": "Tax Efficiency", "score": <number>, "label": "<short status>"},
      {"name": "Retirement Readiness", "score": <number>, "label": "<short status>"}
    ],
    "topInsight": "<one-line actionable insight>"
  }
  
  USER DATA:
  ${userContext}`,
            },
          ],
        },
      ],
      config: { responseMimeType: "application/json" }
    });
    return result.text || "{}";
  });
}

export async function generateTaxAnalysis(userContext: string): Promise<string> {
  return withRetry(async (client) => {
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are Artha AI, an expert Indian tax advisor. Analyze this user's data and provide a JSON response (no markdown, no code fences, just raw JSON):
  {
    "oldRegimeTax": <number>,
    "newRegimeTax": <number>,
    "recommendedRegime": "old" | "new",
    "savings": <number>,
    "deductions": [
      {"section": "80C", "name": "<desc>", "limit": <number>, "claimed": <number>, "missed": <number>, "suggestion": "<actionable tip>"},
      ... (include 80C, 80D, 80CCD1B, 24b, HRA, 80TTA at minimum)
    ],
    "topTip": "<one-line tax saving tip>"
  }
  
  USER DATA:
  ${userContext}`,
            },
          ],
        },
      ],
      config: { responseMimeType: "application/json" }
    });
    return result.text || "{}";
  });
}

export async function generateFamilyAnalysis(familyContext: string): Promise<string> {
  return withRetry(async (client) => {
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are Artha AI. Analyze this Indian family's combined financial data and provide a JSON response (no markdown, no code fences, just raw JSON):
  {
    "combinedIncome": <number>,
    "totalTaxSaved": <number>,
    "optimizations": [
      {"area": "<e.g. HRA Split>", "currentLoss": <number>, "potentialSaving": <number>, "action": "<specific action>"},
      ...
    ],
    "sipSplit": {"partner1": <number>, "partner2": <number>, "reason": "<why this split>"},
    "insuranceGap": "<description of gap>",
    "topInsight": "<one-line family finance tip>"
  }
  
  FAMILY DATA:
  ${familyContext}`,
            },
          ],
        },
      ],
      config: { responseMimeType: "application/json" }
    });
    return result.text || "{}";
  });
}

export async function generatePortfolioXRay(userContext: string): Promise<string> {
  return withRetry(async (client) => {
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are Artha AI, an expert Indian mutual fund analyst. Given this user's profile, generate a realistic portfolio analysis as JSON (no markdown, no code fences, just raw JSON):
  {
    "funds": [
      {"name": "<real Indian MF name>", "type": "<category>", "value": <number>, "xirr": <number>, "overlapRisk": "High"|"Medium"|"Low"|"None"},
      ... (6-8 funds)
    ],
    "totalValue": <number>,
    "trueXIRR": <number>,
    "brokerShownXIRR": <number>,
    "expenseRatioDrag": <number per year>,
    "overlapPairs": [{"fund1": "<name>", "fund2": "<name>", "overlapPercent": <number>}],
    "rebalancingActions": ["<action 1>", "<action 2>", "<action 3>"],
    "allocation": [
      {"category": "Large Cap", "percentage": <number>},
      {"category": "Mid Cap", "percentage": <number>},
      {"category": "Small Cap", "percentage": <number>},
      {"category": "Debt", "percentage": <number>},
      {"category": "International", "percentage": <number>},
      {"category": "Gold/Commodities", "percentage": <number>}
    ]
  }
  
  USER DATA:
  ${userContext}`,
            },
          ],
        },
      ],
      config: { responseMimeType: "application/json" }
    });
    return result.text || "{}";
  });
}

export async function generateInsights(userContext: string): Promise<string> {
  return withRetry(async (client) => {
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are Artha AI. Generate personalized financial insights for this Indian user as JSON (no markdown, no code fences, just raw JSON):
  {
    "lifeEvents": [
      {"event": "<e.g. Marriage>", "estimatedAge": <number>, "estimatedCost": <number>, "preparedness": "Ready"|"Partial"|"Unprepared", "action": "<specific advice>"},
      ... (4-5 relevant life events)
    ],
    "govSchemes": [
      {"name": "<scheme name>", "benefit": "<what user gains>", "eligibility": "Eligible"|"Check", "potentialReturn": "<e.g. 11.5% CAGR>", "action": "<how to apply>"},
      ... (3-4 schemes)
    ],
    "unconventionalAlpha": [
      {"name": "<investment type>", "expectedReturn": "<range>", "riskLevel": "Low"|"Medium", "minInvestment": "<amount>", "description": "<why it's good for this user>"},
      ... (2-3 options)
    ],
    "customizedPath": [
      {"year": <number>, "age": <number>, "milestone": "<what to achieve>", "monthlyAction": "<SIP/investment amount>"},
      ... (5-6 milestones)
    ]
  }
  
  USER DATA:
  ${userContext}`,
            },
          ],
        },
      ],
      config: { responseMimeType: "application/json" }
    });
    return result.text || "{}";
  });
}
