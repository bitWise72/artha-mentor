# Artha Mentor: AI Architecture & Technical Workflow

Artha is not just a wrapper for a large language model; it is a multi-layered financial intelligence engine that integrates real-time market data, mathematical simulation, and resilient AI execution pipelines.

## 1. Intelligence Core: Multi-API Fallback Logic
Located in `src/lib/gemini.ts`, Artha implements a high-availability "Key Rotation" mechanism to ensure 100% uptime, bridging the gap between free-tier API limits and production demands.
- **Rotation Mechanism**: The system cycles through `GEMINI_API_KEY`, `FALL_BACK_API_1`, and `FALL_BACK_API_2`.
- **Error Handling**: If an API returns a 429 (Rate Limit) or 403 (Quota Exhausted), the system intelligently switches to the next available key without interrupting the user session.
- **Exponential Backoff**: Implemented on the frontend (`MascotTutor.tsx`) to handle Vercel's 60s serverless timeout, retrying failed requests up to 5 times.

## 2. Real-Time Market Intelligence (Tavily + ET)
Artha is market-aware. It doesn't rely on static training data but pulls live events via the `/api/news` endpoint.
- **Search Engine**: Uses **Tavily AI** to crawl `economictimes.indiatimes.com`.
- **Synthesis Layer**: The raw headlines are passed through a specific prompt engineering pipeline that translates global macroeconomic news into "Personalized Retail Investor Insights." 
- **Example**: If ET reports an RBI repo rate change, Artha's prompt identifies the impact on the user's specific `homeLoan` or `savingsAccount` interest rates.

## 3. The Onboarding & Money Health Engine
The "Money Health Score" uses a strict JSON schema enforcement to grade users across 6 dimensions:
1. **Emergency Prep**: (Savings / Monthly Expenses) ratio.
2. **Insurance Coverage**: AI-calculated gap analysis.
3. **Diversification**: X-Ray of the "Mutual Fund Portfolio" via CAMS extraction.
4. **Debt Health**: Analysis of the Debt-to-Income ratio.
5. **Tax Efficiency**: AI comparison of Old vs. New Tax Regimes.
6. **Retirement Readiness**: Probability of achieving FIRE based on current SIP pace.

## 4. Mathematical Simulation Node (FIRE)
The `simulate/page.tsx` does not use hardcoded age milestones.
- **Dynamic Age Nodes**: Milestones are computed as `profile.age + X` years.
- **Variable Impact**: Financial "Life Events" (Marriage, New Baby, Job Switch) exert a dynamic percentage impact on `currentNetWorth` rather than static sums, ensuring scalability for both low and high earners.

## 5. Technical Stack & Integrity
- **Framework**: Next.js 15 (App Router)
- **Styling**: Cyber-Cyan Custom CSS Modules (no generic Tailwind)
- **Generative AI**: Google Gemini 2.5 Flash / Pro
- **Real-time Data**: Tavily Search Core (focused on Economic Times domain)
- **Frontend Architecture**: Framer Motion for high-fidelity animations and `useMemo` for high-performance financial math.

---
*Built for the Economic Times AI Hackathon.*
