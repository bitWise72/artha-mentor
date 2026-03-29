"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Lightbulb, Landmark, Sparkles, Calendar, Globe } from "lucide-react";
import FunFactLoader from "@/components/FunFactLoader";
import styles from "../shared.module.css";

type LifeEvent = { event: string; estimatedAge: number; estimatedCost: number; preparedness: string; action: string };
type GovScheme = { name: string; benefit: string; eligibility: string; potentialReturn: string; action: string };
type AlphaOpp = { name: string; expectedReturn: string; riskLevel: string; minInvestment: string; description: string };
type PathStep = { year: number; age: number; milestone: string; monthlyAction: string };
type InsightsData = {
  lifeEvents: LifeEvent[];
  govSchemes: GovScheme[];
  unconventionalAlpha: AlphaOpp[];
  customizedPath: PathStep[];
};

export default function InsightsPage() {
  const { profile } = useUser();
  const [data, setData] = useState<InsightsData | null>(null);
  const [marketUpdates, setMarketUpdates] = useState<{news: any[], insight: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const userContext = `Name: ${profile.name}, Age: ${profile.age}, Monthly Income: ₹${profile.monthlyIncome}, Monthly Expenses: ₹${profile.monthlyExpenses}, Savings: ₹${profile.savings}, Investments: ₹${profile.investments}, Debt: ₹${profile.debt}, Monthly SIP: ₹${profile.monthlySIP}, Insurance: ₹${profile.insuranceCoverage}, Tax Regime: ${profile.taxRegime}, Risk Profile: ${profile.riskProfile}, Goals: ${profile.goals.join(", ")}, Marital Status: ${profile.hasPartner ? "Married" : "Single"}`;
        const res = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userContext }),
        });
        const result = await res.json();
        if (result.lifeEvents || result.govSchemes || result.customizedPath) {
          setData(result);
        }
      } catch (err) {
        console.error("Insights fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchMarketNews = async () => {
      try {
        const res = await fetch("/api/news");
        const nData = await res.json();
        if (nData.news) setMarketUpdates(nData);
      } catch (err) { }
    };

    fetchInsights();
    fetchMarketNews();
  }, [profile]);

  if (loading) {
    return (
      <main className={styles.pageContainer} style={{ maxWidth: "1280px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <FunFactLoader title="Synthesizing personalized insights..." subtitle="Artha is analyzing live market data, life events, and alpha opportunities." />
      </main>
    );
  }

  if (!data) {
    return (
      <main className={styles.pageContainer} style={{ maxWidth: "1280px" }}>
        <h1 className={styles.title} style={{ fontSize: "2rem" }}>AI Insights</h1>
        <p className={styles.description}>Unable to load insights. Please try again.</p>
      </main>
    );
  }

  const getBadgeColor = (status: string) => {
    if (status === "Ready" || status === "Eligible") return { bg: "rgba(16,185,129,0.15)", color: "var(--success-color)" };
    if (status === "Partial" || status === "Check") return { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" };
    return { bg: "rgba(244,63,94,0.15)", color: "var(--alert-color)" };
  };

  return (
    <main className={styles.pageContainer} style={{ maxWidth: "1280px" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title} style={{ fontSize: "2rem" }}>AI Insights & Opportunities <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 400 }}>· Powered by Artha & Economic Times</span></h1>
        <p className={styles.description}>Personalized life event planning, government schemes, alternative investments, and live market integrations.</p>
      </motion.div>

      {/* Economic Times Updates */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1.5rem", width: "100%" }}>
        <div className={styles.glassCard} style={{ flex: "1 1 100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px", marginBottom: "1rem" }}>
            <img src="/images/image.png" alt="The Economic Times" style={{ height: "32px", objectFit: "contain" }} />
            <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: "0.85rem", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "12px", fontWeight: 500 }}>Live Market Updates</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ color: "white", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "0.5rem", fontStyle: "italic", borderLeft: "3px solid var(--accent-color)", paddingLeft: "10px" }}>
              💡 {marketUpdates?.insight || "Synthesizing market impacts..."}
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {marketUpdates ? marketUpdates.news.map((n, i) => (
                <a key={i} href={n.url} target="_blank" rel="noreferrer" style={{ flex: "1 1 200px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", textDecoration: "none", transition: "transform 0.2s", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={n.image} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                  <p style={{ fontSize: "0.85rem", color: "white", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{n.title}</p>
                </a>
              )) : (
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Fetching ET headlines...</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Customized Financial Path */}
      {data.customizedPath && data.customizedPath.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.glassCard} style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={18} color="var(--accent-color)" /> Your Customized Financial Path
          </h3>
          <div style={{ position: "relative", paddingLeft: "2rem" }}>
            <div style={{ position: "absolute", left: "0.5rem", top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, var(--accent-color), rgba(255,255,255,0.05))" }} />
            {data.customizedPath.map((step, i) => (
              <div key={i} style={{ position: "relative", marginBottom: "2rem" }}>
                <div style={{ position: "absolute", left: "-1.75rem", top: "0.25rem", width: 12, height: 12, borderRadius: "50%", background: i === 0 ? "var(--accent-color)" : "var(--bg-color)", border: "3px solid var(--accent-color)" }} />
                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{step.milestone}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Year {step.year} · Age {step.age}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Monthly Action: {step.monthlyAction}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Life Events */}
      {data.lifeEvents && data.lifeEvents.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={styles.glassCard} style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lightbulb size={18} color="var(--accent-color)" /> Life Event Preparedness
          </h3>
          {data.lifeEvents.map((le, i) => {
            const badge = getBadgeColor(le.preparedness);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{le.event} <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>· Age {le.estimatedAge}</span></div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{le.action}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 700 }}>₹{(le.estimatedCost || 0).toLocaleString("en-IN")}</div>
                  <span style={{ padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.6875rem", fontWeight: 600, background: badge.bg, color: badge.color }}>{le.preparedness}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Gov Schemes + Alpha */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.grid2}>
        {data.govSchemes && data.govSchemes.length > 0 && (
          <div className={styles.glassCard}>
            <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Landmark size={18} color="var(--accent-color)" /> Gov Schemes For You
            </h3>
            {data.govSchemes.map((gs, i) => {
              const badge = getBadgeColor(gs.eligibility);
              return (
                <div key={i} style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ fontWeight: 600 }}>{gs.name}</div>
                    <span style={{ padding: "0.2rem 0.5rem", borderRadius: "99px", fontSize: "0.6875rem", fontWeight: 600, background: badge.bg, color: badge.color }}>{gs.eligibility}</span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{gs.benefit}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                    <span style={{ color: "var(--success-color)", fontWeight: 600 }}>{gs.potentialReturn}</span>
                    <span style={{ color: "var(--text-secondary)" }}>{gs.action}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {data.unconventionalAlpha && data.unconventionalAlpha.length > 0 && (
          <div className={styles.glassCard}>
            <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={18} color="var(--accent-color)" /> Unconventional Alpha
            </h3>
            {data.unconventionalAlpha.map((alpha, i) => (
              <div key={i} style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)", marginBottom: "0.75rem" }}>
                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{alpha.name}</div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{alpha.description}</p>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <span>Return: <strong style={{ color: "var(--success-color)" }}>{alpha.expectedReturn}</strong></span>
                  <span>Risk: <strong>{alpha.riskLevel}</strong></span>
                  <span>Min: <strong>{alpha.minInvestment}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
