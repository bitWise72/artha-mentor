"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { BarChart3, PieChart as PieChartIcon, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "../shared.module.css";

const CHART_COLORS = ["#5b5fd8", "#818cf8", "#a78bfa", "#10B981", "#F59E0B", "#06B6D4"];

type Fund = { name: string; type: string; value: number; xirr: number; overlapRisk: string };
type OverlapPair = { fund1: string; fund2: string; overlapPercent: number };
type Allocation = { category: string; percentage: number };
type PortfolioData = {
  funds: Fund[];
  totalValue: number;
  trueXIRR: number;
  brokerShownXIRR: number;
  expenseRatioDrag: number;
  overlapPairs: OverlapPair[];
  rebalancingActions: string[];
  allocation: Allocation[];
};

export default function PortfolioPage() {
  const { profile } = useUser();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const userContext = `Name: ${profile.name}, Age: ${profile.age}, Monthly Income: ₹${profile.monthlyIncome}, Monthly SIP: ₹${profile.monthlySIP}, Total Investments: ₹${profile.investments}, Risk Profile: ${profile.riskProfile}, Goals: ${profile.goals.join(", ")}`;
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userContext }),
        });
        const result = await res.json();
        if (result.funds || result.allocation) {
          setData(result);
        }
      } catch (err) {
        console.error("Portfolio fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [profile]);

  if (loading) {
    return (
      <main className={styles.pageContainer} style={{ maxWidth: "1280px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={48} style={{ animation: "spin 1s linear infinite", color: "var(--accent-color)", marginBottom: "1rem" }} />
          <h2>Running AI Portfolio X-Ray...</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Artha is analyzing allocation, overlap & XIRR</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className={styles.pageContainer} style={{ maxWidth: "1280px" }}>
        <h1 className={styles.title} style={{ fontSize: "2rem" }}>Portfolio & Investments</h1>
        <p className={styles.description}>Unable to load AI portfolio analysis. Please try again.</p>
      </main>
    );
  }

  const pieData = data.allocation?.map((a, i) => ({ name: a.category, value: a.percentage, color: CHART_COLORS[i % CHART_COLORS.length] })) || [];

  return (
    <main className={styles.pageContainer} style={{ maxWidth: "1280px" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title} style={{ fontSize: "2rem" }}>Portfolio & Investments <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 400 }}>· AI X-Ray by Artha</span></h1>
        <p className={styles.description}>Complete AI-generated portfolio analysis with overlap detection, true XIRR, and rebalancing plan.</p>
      </motion.div>

      {/* XIRR Discrepancy Banner */}
      {data.trueXIRR && data.brokerShownXIRR && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: "16px", padding: "1.5rem", margin: "0 0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: "0.25rem", color: "var(--alert-color)" }}>⚠️ XIRR Discrepancy Detected</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>Broker dashboards inflate returns. AI has reconstructed your true performance.</div>
          </div>
          <div style={{ display: "flex", gap: "2rem", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Broker Shown</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{data.brokerShownXIRR}%</div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>True XIRR</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--success-color)" }}>{data.trueXIRR}%</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Allocation + Holdings */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.grid2}>
        <div className={styles.glassCard}>
          <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PieChartIcon size={18} color="var(--accent-color)" /> AI-Analyzed Allocation
          </h3>
          {pieData.length > 0 && (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((entry: any, i: number) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(18,18,18,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.5rem" }}>
                {pieData.map((d: any) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                    {d.name} ({d.value}%)
                  </div>
                ))}
              </div>
            </>
          )}
          {data.expenseRatioDrag && (
            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(244,63,94,0.08)", borderRadius: "10px", fontSize: "0.8125rem" }}>
              <strong style={{ color: "var(--alert-color)" }}>Expense Ratio Drag:</strong> ₹{data.expenseRatioDrag.toLocaleString("en-IN")}/year
            </div>
          )}
        </div>

        <div className={styles.glassCard}>
          <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BarChart3 size={18} color="var(--accent-color)" /> Fund Holdings
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 0.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Fund</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 0.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Value</th>
                  <th style={{ textAlign: "right", padding: "0.75rem 0.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>XIRR</th>
                  <th style={{ textAlign: "center", padding: "0.75rem 0.5rem", color: "var(--text-secondary)", fontWeight: 500 }}>Overlap</th>
                </tr>
              </thead>
              <tbody>
                {(data.funds || []).map((f) => (
                  <tr key={f.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <div style={{ fontWeight: 500 }}>{f.name}</div>
                      <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>{f.type}</div>
                    </td>
                    <td style={{ textAlign: "right", padding: "0.75rem 0.5rem", fontWeight: 600 }}>₹{(f.value || 0).toLocaleString("en-IN")}</td>
                    <td style={{ textAlign: "right", padding: "0.75rem 0.5rem", color: "var(--success-color)" }}>{f.xirr}%</td>
                    <td style={{ textAlign: "center", padding: "0.75rem 0.5rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.6875rem", fontWeight: 600,
                        background: f.overlapRisk === "High" ? "rgba(244,63,94,0.15)" : f.overlapRisk === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
                        color: f.overlapRisk === "High" ? "var(--alert-color)" : f.overlapRisk === "Medium" ? "#F59E0B" : "var(--success-color)",
                      }}>{f.overlapRisk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Rebalancing Actions */}
      {data.rebalancingActions && data.rebalancingActions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.glassCard} style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>🔄 AI Rebalancing Plan</h3>
          {data.rebalancingActions.map((action, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(91,95,216,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-color)", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: "0.9375rem" }}>{action}</div>
            </div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
