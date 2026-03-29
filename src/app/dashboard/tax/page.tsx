"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";
import FunFactLoader from "@/components/FunFactLoader";
import styles from "../shared.module.css";

type Deduction = { section: string; name: string; limit: number; claimed: number; missed: number; suggestion: string };
type TaxData = {
  oldRegimeTax: number;
  newRegimeTax: number;
  recommendedRegime: string;
  savings: number;
  deductions: Deduction[];
  topTip: string;
};

export default function TaxWizard() {
  const { profile } = useUser();
  const [taxData, setTaxData] = useState<TaxData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxAnalysis = async () => {
      try {
        const userContext = `Name: ${profile.name}, Age: ${profile.age}, Monthly Income: ₹${profile.monthlyIncome}, Monthly Expenses: ₹${profile.monthlyExpenses}, Annual Income: ₹${profile.monthlyIncome * 12}, Savings: ₹${profile.savings}, Investments: ₹${profile.investments}, Debt: ₹${profile.debt}, Monthly SIP: ₹${profile.monthlySIP}, Insurance Premium: ₹18000/year, Current Tax Regime: ${profile.taxRegime}, Risk Profile: ${profile.riskProfile}, Has Home Loan: No, Rent Paid: ₹20000/month, HRA Received: ₹30000/month, NPS Contribution: ₹0`;

        const res = await fetch("/api/tax", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userContext }),
        });
        const data = await res.json();
        if (data.oldRegimeTax !== undefined) {
          setTaxData(data);
        }
      } catch (err) {
        console.error("Tax analysis fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaxAnalysis();
  }, [profile]);

  const income = profile.monthlyIncome * 12;

  if (loading) {
    return (
      <main className={styles.pageContainer} style={{ maxWidth: "1280px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <FunFactLoader title="Artha is analyzing your tax structure..." subtitle="Computing optimal regime comparison with AI" />
      </main>
    );
  }

  if (!taxData) {
    return (
      <main className={styles.pageContainer} style={{ maxWidth: "1280px" }}>
        <h1 className={styles.title} style={{ fontSize: "2rem" }}>Tax Wizard</h1>
        <p className={styles.description}>Unable to load AI tax analysis. Please check your API key and try again.</p>
      </main>
    );
  }

  const totalMissed = taxData.deductions?.reduce((s, d) => s + (d.missed || 0), 0) || 0;

  return (
    <main className={styles.pageContainer} style={{ maxWidth: "1280px" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title} style={{ fontSize: "2rem" }}>Tax Wizard <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 400 }}>· Powered by Artha AI</span></h1>
        <p className={styles.description}>AI-powered regime comparison and deduction finder tailored to your exact ₹{income.toLocaleString("en-IN")} annual income.</p>
      </motion.div>

      {/* Regime Comparison */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.grid2}>
        <div className={styles.glassCard} style={{ borderColor: taxData.recommendedRegime?.toLowerCase() === "old" ? "var(--success-color)" : "var(--surface-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3>Old Regime</h3>
            {taxData.recommendedRegime?.toLowerCase() === "old" && <span style={{ background: "rgba(16,185,129,0.15)", color: "var(--success-color)", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600 }}>AI RECOMMENDED</span>}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Total Tax Payable</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 700 }}>₹{(taxData.oldRegimeTax || 0).toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className={styles.glassCard} style={{ borderColor: taxData.recommendedRegime?.toLowerCase() === "new" ? "var(--success-color)" : "var(--surface-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3>New Regime</h3>
            {taxData.recommendedRegime?.toLowerCase() === "new" && <span style={{ background: "rgba(16,185,129,0.15)", color: "var(--success-color)", padding: "0.25rem 0.75rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600 }}>AI RECOMMENDED</span>}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Total Tax Payable</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 700 }}>₹{(taxData.newRegimeTax || 0).toLocaleString("en-IN")}</div>
          </div>
        </div>
      </motion.div>

      {/* Savings */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "1.5rem", margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
        <CheckCircle size={28} color="var(--success-color)" />
        <div>
          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{taxData.recommendedRegime} Regime saves you ₹{(taxData.savings || 0).toLocaleString("en-IN")} this year</div>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{taxData.topTip}</div>
        </div>
      </motion.div>

      {/* Deductions */}
      {taxData.deductions && taxData.deductions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.glassCard}>
          <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={18} color="var(--accent-color)" /> AI Deduction Finder
            {totalMissed > 0 && <span style={{ fontSize: "0.75rem", color: "var(--alert-color)", fontWeight: 600, marginLeft: "auto" }}>₹{totalMissed.toLocaleString("en-IN")} unclaimed</span>}
          </h3>
          {taxData.deductions.map((d) => (
            <div key={d.section} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {d.missed > 0 ? <AlertTriangle size={14} color="#F59E0B" /> : <CheckCircle size={14} color="var(--success-color)" />}
                  Section {d.section} — {d.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{d.suggestion}</div>
              </div>
              <div style={{ textAlign: "right", minWidth: "120px" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Claimed / Limit</div>
                <div style={{ fontWeight: 600 }}>₹{((d.claimed || 0) / 1000).toFixed(0)}K / ₹{((d.limit || 0) / 1000).toFixed(0)}K</div>
                {d.missed > 0 && <div style={{ fontSize: "0.75rem", color: "var(--alert-color)", fontWeight: 600 }}>₹{d.missed.toLocaleString("en-IN")} missed</div>}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
