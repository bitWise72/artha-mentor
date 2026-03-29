"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Wallet, TrendingUp, Heart, Flame, Target, FileText, Users, MessageCircle, Loader2, Globe } from "lucide-react";
import Link from "next/link";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import styles from "./page.module.css";

type AIDimension = { name: string; score: number; label: string };
type AIHealth = { 
  overallScore: number; 
  fireProgress: number;
  fireStatus: string;
  portfolioDiversity: { subject: string; A: number; fullMark: number }[];
  dimensions: AIDimension[]; 
  topInsight: string 
};

export default function Dashboard() {
  const { profile, calculateHealthScore, getHealthDimensions, getPortfolioDiversity } = useUser();
  const [aiHealth, setAiHealth] = useState<AIHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState<{news: any[], insight: string} | null>(null);

  // Fallback local data
  const localScore = calculateHealthScore();
  const localDimensions = getHealthDimensions();
  const portfolioData = getPortfolioDiversity();

  useEffect(() => {
    const fetchAIHealth = async () => {
      try {
        const userContext = `Name: ${profile.name}, Age: ${profile.age}, Monthly Income: ₹${profile.monthlyIncome}, Monthly Expenses: ₹${profile.monthlyExpenses}, Savings: ₹${profile.savings}, Investments: ₹${profile.investments}, Debt: ₹${profile.debt}, Monthly SIP: ₹${profile.monthlySIP}, Insurance Coverage: ₹${profile.insuranceCoverage}, Tax Regime: ${profile.taxRegime}, Risk Profile: ${profile.riskProfile}`;

        const res = await fetch("/api/health", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userContext }),
        });
        const data = await res.json();
        if (data.overallScore && data.dimensions) {
          setAiHealth(data);
        }
      } catch (err) {
        console.error("AI Health fetch failed, using local calc:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchMarketNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.news) setMarketUpdates(data);
      } catch (err) { }
    };

    fetchAIHealth();
    fetchMarketNews();
  }, [profile]);

  const score = aiHealth?.overallScore ?? localScore;
  const dimensions = aiHealth?.dimensions?.map((d, i) => ({
    ...d,
    icon: ["🛡️", "⚡", "📊", "💳", "📋", "🎯"][i] || "📌",
  })) ?? localDimensions;

  const finalPortfolioData = aiHealth?.portfolioDiversity?.map(d => ({ ...d, value: d.A })) || portfolioData;
  const fireScore = aiHealth?.fireProgress ?? 34;
  const fireText = aiHealth?.fireStatus ?? "On Track";

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "var(--success-color)";
    if (score >= 50) return "#F59E0B";
    return "var(--alert-color)";
  };

  return (
    <main className={styles.container}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className={styles.greeting}>{getTimeGreeting()}, {profile.name} 👋</h1>
        <p className={styles.greetingSub}>Here&apos;s your financial snapshot for today</p>
      </motion.div>

      {/* Economic Times Updates */}
      <motion.div className={styles.middleRow} style={{ marginTop: "1rem", marginBottom: "1.5rem" }} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className={styles.panel} style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px", marginBottom: "1rem" }}>
            <img src="/images/image.png" alt="The Economic Times" style={{ height: "32px", objectFit: "contain" }} />
            <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontSize: "0.85rem", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "12px", fontWeight: 500 }}>Live Market Updates</span>
          </div>
          
          {marketUpdates && (
            <p style={{ color: "white", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1rem", fontStyle: "italic", borderLeft: "3px solid var(--accent-color)", paddingLeft: "12px" }}>
              💡 {marketUpdates.insight}
            </p>
          )}

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {marketUpdates ? marketUpdates.news.map((n, i) => (
              <a key={i} href={n.url} target="_blank" rel="noreferrer" className={styles.glassCard} style={{ flex: "1 1 200px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", textDecoration: "none", transition: "transform 0.2s", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <img src={n.image} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                <p style={{ fontSize: "0.85rem", color: "white", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{n.title}</p>
              </a>
            )) : (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", padding: "1rem" }}>Loading ET headlines & synthesis...</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className={styles.statCards} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statCardLabel}>Net Worth</span>
            <div className={styles.statCardIcon}><Wallet size={18} /></div>
          </div>
          <div className={styles.statCardValue}>₹{profile.investments.toLocaleString("en-IN")}</div>
          <div className={`${styles.statCardChange} ${styles.positive}`}>+12.4%</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statCardLabel}>Monthly SIP</span>
            <div className={styles.statCardIcon}><TrendingUp size={18} /></div>
          </div>
          <div className={styles.statCardValue}>₹{profile.monthlySIP.toLocaleString("en-IN")}</div>
          <div className={`${styles.statCardChange} ${styles.neutral}`}>Active</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statCardLabel}>Financial Health</span>
            <div className={styles.statCardIcon}><Heart size={18} /></div>
          </div>
          <div className={styles.statCardValue}>{loading ? "..." : `${score}/100`}</div>
          <div className={`${styles.statCardChange} ${score >= 70 ? styles.positive : styles.warning}`}>
            {loading ? "Analyzing..." : score >= 70 ? "Good" : "Needs Work"}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statCardLabel}>FIRE Progress</span>
            <div className={styles.statCardIcon}><Flame size={18} /></div>
          </div>
          <div className={styles.statCardValue}>{loading ? "..." : `${fireScore}%`}</div>
          <div className={`${styles.statCardChange} ${fireScore >= 50 ? styles.positive : styles.warning}`}>{loading ? "Analyzing..." : fireText}</div>
        </div>
      </motion.div>

      {/* Health + Radar */}
      <motion.div className={styles.middleRow} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className={styles.panel}>
          <div className={styles.healthHeader}>
            <h2 className={styles.panelTitle}>🏥 Financial Health Score {loading && <Loader2 size={16} className="animate-spin" style={{ display: "inline", marginLeft: 8 }} />}</h2>
            <div className={styles.scoreCircle}>
              <div className={styles.scoreCircleTrack} style={{ "--score-deg": `${(score / 100) * 360}deg` } as React.CSSProperties} />
              <div className={styles.scoreCircleInner}>{loading ? "..." : score}</div>
            </div>
          </div>
          {aiHealth?.topInsight && (
            <div style={{ background: "rgba(91,95,216,0.08)", border: "1px solid rgba(91,95,216,0.2)", borderRadius: "12px", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              💡 <strong style={{ color: "var(--text-primary)" }}>AI Insight:</strong> {aiHealth.topInsight}
            </div>
          )}
          <div className={styles.dimensionsGrid}>
            {dimensions.map((dim: any) => (
              <div key={dim.name} className={styles.dimension}>
                <div className={styles.dimensionHeader}>
                  <span className={styles.dimensionName}><span>{dim.icon}</span> {dim.name}</span>
                  <span className={styles.dimensionScore}>{dim.score}</span>
                </div>
                <div className={styles.dimensionBar}>
                  <div className={styles.dimensionBarFill} style={{ width: `${dim.score}%`, background: getBarColor(dim.score) }} />
                </div>
                <span className={styles.dimensionLabel}>{dim.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>🔮 Portfolio Diversity</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>How diversified your portfolio is</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={finalPortfolioData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="Allocation" dataKey="value" stroke="var(--accent-color)" fill="var(--accent-color)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div className={styles.quickActions} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <Link href="/dashboard/goals" className={styles.actionCard}>
          <div className={styles.actionIcon}><Target size={22} /></div>
          <div className={styles.actionTitle}>FIRE Path Planner</div>
          <div className={styles.actionDesc}>Visualize your journey to financial independence with AI projections.</div>
        </Link>
        <Link href="/dashboard/tax" className={styles.actionCard}>
          <div className={styles.actionIcon}><FileText size={22} /></div>
          <div className={styles.actionTitle}>Tax Wizard</div>
          <div className={styles.actionDesc}>AI-powered regime comparison and deduction finder.</div>
        </Link>
        <Link href="/dashboard/chat" className={styles.actionCard}>
          <div className={styles.actionIcon}><MessageCircle size={22} /></div>
          <div className={styles.actionTitle}>Chat with AI</div>
          <div className={styles.actionDesc}>Ask anything about your finances — powered by Artha Core.</div>
        </Link>
      </motion.div>
    </main>
  );
}
