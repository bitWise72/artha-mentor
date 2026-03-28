"use client";

import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Flame, Map } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import styles from "./page.module.css";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(18,18,18,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "0.75rem 1rem",
      }}>
        <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Age {label} ({2026 + (label - 28)})</p>
        <p style={{ color: "var(--accent-color)", fontWeight: 600 }}>₹{payload[0].value}L Net Worth</p>
      </div>
    );
  }
  return null;
};

export default function GoalsPage() {
  const { profile, getFireProjection } = useUser();
  const fireData = getFireProjection();
  const currentYear = new Date().getFullYear();

  return (
    <main className={styles.container}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.pageTitle}>Goals & Planning</h1>
      </motion.div>

      {/* FIRE Path Planner */}
      <motion.div className={styles.fireCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className={styles.fireHeader}>
          <Flame size={24} color="var(--accent-color)" />
          🔥 FIRE Path Planner
        </div>

        <div className={styles.fireStats}>
          <div className={styles.fireStat}>
            <div className={styles.fireStatLabel}>Target FIRE Age</div>
            <div className={styles.fireStatValue}>45</div>
          </div>
          <div className={styles.fireStat}>
            <div className={styles.fireStatLabel}>Monthly SIP Required</div>
            <div className={`${styles.fireStatValue} ${styles.accent}`}>₹{profile.monthlySIP.toLocaleString("en-IN")}</div>
          </div>
          <div className={styles.fireStat}>
            <div className={styles.fireStatLabel}>Retirement Corpus</div>
            <div className={`${styles.fireStatValue} ${styles.success}`}>₹5.2 Cr</div>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fireData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="fireGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="age"
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
              />
              <YAxis
                tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                label={{ value: "₹ Lakhs", angle: -90, position: "insideLeft", fill: "var(--text-secondary)", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={profile.age} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" label={{ value: "Now", fill: "var(--text-secondary)", fontSize: 11 }} />
              <ReferenceLine x={45} stroke="var(--success-color)" strokeDasharray="3 3" label={{ value: "FIRE", fill: "var(--success-color)", fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="netWorth"
                stroke="var(--accent-color)"
                fill="url(#fireGradient)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className={styles.fireTip}>💡 Increase SIP by ₹5,000 to retire 3 years earlier</p>
      </motion.div>

      {/* Financial Roadmap */}
      <motion.div className={styles.roadmapCard} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className={styles.roadmapTitle}>
          <Map size={22} color="var(--accent-color)" />
          📋 Financial Roadmap
        </div>
        <div className={styles.roadmapTimeline}>
          <div className={styles.roadmapItem}>
            <div className={`${styles.roadmapDot} ${styles.done}`} />
            <div className={styles.roadmapItemTitle}>Emergency Fund Target</div>
            <div className={styles.roadmapItemYear}>{currentYear} · Age {profile.age}</div>
            <div className={styles.roadmapItemDesc}>Build 6 months of expenses (₹3L) in liquid funds. Current: ₹{(profile.savings / 100000).toFixed(1)}L</div>
          </div>
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapDot} />
            <div className={styles.roadmapItemTitle}>Term Insurance + Health Cover</div>
            <div className={styles.roadmapItemYear}>{currentYear + 1} · Age {profile.age + 1}</div>
            <div className={styles.roadmapItemDesc}>Secure ₹1Cr term plan + ₹10L super top-up health. Currently underinsured by ₹50L.</div>
          </div>
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapDot} />
            <div className={styles.roadmapItemTitle}>Max Tax Efficiency</div>
            <div className={styles.roadmapItemYear}>{currentYear + 2} · Age {profile.age + 2}</div>
            <div className={styles.roadmapItemDesc}>Exhaust full 80C (₹1.5L), 80D (₹25K), and 80CCD(1B) (₹50K). Estimated savings: ₹55,000/yr.</div>
          </div>
          <div className={styles.roadmapItem}>
            <div className={styles.roadmapDot} />
            <div className={styles.roadmapItemTitle}>Home Purchase</div>
            <div className={styles.roadmapItemYear}>{currentYear + 7} · Age {profile.age + 7}</div>
            <div className={styles.roadmapItemDesc}>Target ₹25L down-payment. Start a dedicated Balanced Advantage SIP of ₹15,000/mo now.</div>
          </div>
          <div className={styles.roadmapItem}>
            <div className={`${styles.roadmapDot} ${styles.success}`} />
            <div className={styles.roadmapItemTitle}>🔥 F.I.R.E. Achieved</div>
            <div className={styles.roadmapItemYear}>{currentYear + 17} · Age 45</div>
            <div className={styles.roadmapItemDesc}>Projected corpus ₹5.2Cr generating ₹1.7L/mo passive income. Work becomes optional.</div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
