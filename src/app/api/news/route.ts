export const maxDuration = 60;
import { NextResponse } from "next/server";
import { generateContentFromNews } from "@/lib/gemini";

export async function GET() {
  try {
     const tRes = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           api_key: process.env.TAVILY_API_KEY,
           query: "Economic Times India personal finance market update news",
           search_depth: "basic",
           include_images: true,
           include_domains: ["economictimes.indiatimes.com"],
           max_results: 3
         })
     });
     
     if (!tRes.ok) throw new Error("Tavily Fetch Failed");
     const tData = await tRes.json();
     
     const newsItems = tData.results?.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        image: r.image || "/images/image.png"
     })) || [];

     // If empty just return mock ET news so UI doesn't break
     if (newsItems.length === 0) {
        return NextResponse.json({
           news: [
             { title: "Sensex crosses 85,000 mark! Bank Nifty surges.", url: "https://economictimes.indiatimes.com/", image: "/images/image.png" }
           ],
           insight: "The broader market remains buoyant. Consider increasing equity allocations towards large-caps."
        });
     }

     // Generate a fast AI insight summarizing the top 3 news
     const insight = await generateContentFromNews(JSON.stringify(newsItems));

     return NextResponse.json({ news: newsItems, insight });

  } catch (error: any) {
    console.error("News API error:", error);
    return NextResponse.json(
      { 
         news: [
           { title: "Market Volatility peaks ahead of RBI Policy", url: "https://economictimes.indiatimes.com/", image: "/images/image.png" }
         ],
         insight: "Monitor RBI policy updates closely as they might influence short-term deposit rates."
      },
      { status: 500 }
    );
  }
}
