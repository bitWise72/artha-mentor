"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Users, CheckCircle, ArrowRight } from "lucide-react";
import FunFactLoader from "@/components/FunFactLoader";
import styles from "../shared.module.css";

type FamilyData = {
  combinedIncome: number;
  totalTaxSaved: number;
  optimizations: { area: string; currentLoss: number; potentialSaving: number; action: string }[];
  sipSplit: { partner1: number; partner2: number; reason: string };
  insuranceGap: string;
  topInsight: string;
};

export default function FamilyPage() {
  const { profile, updateProfile } = useUser();
  const [partnerName, setPartnerName] = useState(profile.partnerName || "");
  const [partnerIncome, setPartnerIncome] = useState(profile.partnerIncome || 0);
  const [partnerAge, setPartnerAge] = useState(profile.partnerAge || 0);
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnalyze = async () => {
    if (!partnerName || !partnerIncome) return;
    setLoading(true);
    setSubmitted(true);
    updateProfile({ partnerName, partnerIncome, partnerAge, hasPartner: true });

    try {
      const familyContext = `Partner 1: ${profile.name}, Age ${profile.age}, Monthly Income ₹${profile.monthlyIncome}, Monthly Expenses ₹${profile.monthlyExpenses}, Savings ₹${profile.savings}, Investments ₹${profile.investments}, SIP ₹${profile.monthlySIP}, Tax Regime: ${profile.taxRegime}, Insurance ₹${profile.insuranceCoverage}. Partner 2: ${partnerName}, Age ${partnerAge}, Monthly Income ₹${partnerIncome}. Currently filing taxes separately. Not optimizing HRA across partners. No NPS contributions from either. No joint investment strategy.`;

      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyContext }),
      });
      const data = await res.json();
      if (data.combinedIncome !== undefined || data.optimizations) {
        setFamilyData(data);
      }
    } catch (err) {
      console.error("Family analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.pageContainer} style={{ maxWidth: "1280px" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title} style={{ fontSize: "2rem" }}>Family Investment Hub <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 400 }}>· Powered by Artha AI</span></h1>
        <p className={styles.description}>
          India&apos;s first AI-powered joint financial planning tool. Enter your partner&apos;s details and let Artha Core discover hidden tax efficiencies across your combined household.
        </p>
      </motion.div>

      {/* Your Profile Summary */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.glassCard} style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Users size={18} color="var(--accent-color)" /> Your Profile
        </h3>
        <div className={styles.grid2}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Name</div>
            <div style={{ fontWeight: 600 }}>{profile.name}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Monthly Income</div>
            <div style={{ fontWeight: 600 }}>₹{profile.monthlyIncome.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </motion.div>

      {/* Partner Input */}
      {!submitted && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={styles.glassCard}>
          <h3 style={{ marginBottom: "1.5rem" }}>Partner&apos;s Details</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Partner&apos;s Name</label>
              <input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Enter name" style={{ width: "100%", padding: "0.875rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--surface-border)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "1rem", fontFamily: "inherit", outline: "none" }} />
            </div>
            <div className={styles.grid2}>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Monthly Income (₹)</label>
                <input type="number" value={partnerIncome || ""} onChange={(e) => setPartnerIncome(Number(e.target.value))} placeholder="0" style={{ width: "100%", padding: "0.875rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--surface-border)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "1rem", fontFamily: "inherit", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>Age</label>
                <input type="number" value={partnerAge || ""} onChange={(e) => setPartnerAge(Number(e.target.value))} placeholder="0" style={{ width: "100%", padding: "0.875rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--surface-border)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "1rem", fontFamily: "inherit", outline: "none" }} />
              </div>
            </div>
            <button className={styles.btnPrimary} onClick={handleAnalyze} style={{ width: "100%" }} disabled={!partnerName || !partnerIncome}>
              Run AI Joint Optimization <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <FunFactLoader title="Artha AI is optimizing your family finances..." subtitle="Analyzing HRA splits, NPS matching, SIP distribution." />
      )}

      {/* Results */}
      {familyData && !loading && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          {/* Top Insight */}
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "1.5rem", margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <CheckCircle size={28} color="var(--success-color)" />
            <div>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Total Tax Savings Found: ₹{(familyData.totalTaxSaved || 0).toLocaleString("en-IN")}/year</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{familyData.topInsight}</div>
            </div>
          </div>

          {/* Optimizations */}
          {familyData.optimizations && (
            <div className={styles.glassCard} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ marginBottom: "1.5rem" }}>🔍 AI-Discovered Optimizations</h3>
              {familyData.optimizations.map((opt, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{opt.area}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{opt.action}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--alert-color)" }}>Current Loss: ₹{(opt.currentLoss || 0).toLocaleString("en-IN")}</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--success-color)" }}>Save ₹{(opt.potentialSaving || 0).toLocaleString("en-IN")}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SIP Split */}
          {familyData.sipSplit && (
            <div className={styles.grid2}>
              <div className={styles.glassCard}>
                <h3 style={{ marginBottom: "1rem" }}>💰 Optimal SIP Split</h3>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>{profile.name}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>₹{(familyData.sipSplit.partner1 || 0).toLocaleString("en-IN")}/mo</div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>{partnerName}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>₹{(familyData.sipSplit.partner2 || 0).toLocaleString("en-IN")}/mo</div>
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{familyData.sipSplit.reason}</div>
              </div>
              <div className={styles.glassCard}>
                <h3 style={{ marginBottom: "1rem" }}>🛡️ Insurance Gap</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.9375rem" }}>{familyData.insuranceGap}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </main>
  );
}
