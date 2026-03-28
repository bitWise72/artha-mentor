"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Landmark, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../shared.module.css";

export default function GovSchemes() {
  const router = useRouter();

  return (
    <main className={styles.pageContainer}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <ArrowLeft size={16} /> Back to Board
      </button>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}>Sovereign Advantage</h1>
        <p className={styles.description}>
          AI-filtered government schemes precisely matching your demographic and income profile. Maximize sovereign-backed returns with ZERO credit risk.
        </p>

        <div className={styles.grid2}>
          <div className={styles.glassCard}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={20} color="var(--accent-color)" /> SGB Tranche
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Sovereign Gold Bonds offer 2.5% fixed interest + gold appreciation. Crucially, capital gains are entirely tax-exempt on maturity. You are currently under-allocated in gold hedges.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Tax-Free Return</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>~11.5% CAGR</p>
              </div>
              <button className={styles.btnPrimary} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Allocate Now</button>
            </div>
          </div>

          <div className={styles.glassCard}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--accent-color)" /> NPS Tier-1 Optimization
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              You have not claimed the additional ₹50,000 deduction under Section 80CCD(1B). This is pure tax leakage. Routing ₹4,166/month plugs this leak immediately.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Tax Saved</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹15,600 / yr</p>
              </div>
              <button className={styles.btnPrimary} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Lock In</button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
