"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../shared.module.css";

export default function UnconventionalAlpha() {
  const router = useRouter();

  return (
    <main className={styles.pageContainer}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <ArrowLeft size={16} /> Back to Board
      </button>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}>Unconventional Alpha</h1>
        <p className={styles.description}>
          High-yield, heavily vetted alternative assets that are strictly non-correlated with the stock market. Engineered for sophisticated capital deployment without extreme downside risk.
        </p>

        <div className={styles.grid2}>
          <div className={styles.glassCard} style={{ background: 'linear-gradient(145deg, rgba(18,18,18,0.8), rgba(91,95,216,0.05))' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="var(--accent-color)" /> Fractional Commercial Real Estate (REITs/InvITs)
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Gain exposure to Grade-A commercial office spaces across Bangalore & Mumbai for as little as ₹10,000. Regulated, stable rental yields distributed quarterly.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ 7-9% Target Yield</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ 5-7% Capital Appreciation</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Low Liquidity Risk</li>
            </ul>
            <button className={styles.btnPrimary} style={{ width: '100%' }}>View Vetted Listings</button>
          </div>

          <div className={styles.glassCard}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-color)" /> Structured Debt & P2P Pools
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              RBI-regulated alternative debt platforms offering fixed returns by pooling highly vetted MSME invoice discounting or extremely diversified prime borrower loans.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}>✓ 10-12% Fixed Returns</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Extremely Low M-to-M Volatility</li>
              <li style={{ marginBottom: '0.5rem' }}>✓ Escrow Mechanism Security</li>
            </ul>
            <button className={styles.btnPrimary} style={{ width: '100%' }}>Evaluate Opportunities</button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
