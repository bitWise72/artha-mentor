"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText, PieChart, ActivitySquare } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../shared.module.css";
import { useState, useEffect } from "react";

export default function PortfolioXRay() {
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleUpload = () => {
    setAnalyzing(true);
    // Simulate complex AI analysis
    setTimeout(() => {
      setAnalyzing(false);
      setComplete(true);
    }, 2500);
  };

  return (
    <main className={styles.pageContainer}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <ArrowLeft size={16} /> Back to Board
      </button>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}>Mutual Fund X-Ray</h1>
        <p className={styles.description}>
          Upload your CAMS or KFintech statement. Within seconds, our AI reconstructs your true portfolio, exposing hidden overlap, real Extended Internal Rate of Return (XIRR), and Expense Ratio drag.
        </p>

        {!analyzing && !complete && (
          <div className={styles.uploadArea} onClick={handleUpload}>
            <div className={styles.uploadIcon}><FileText size={48} style={{ margin: '0 auto' }} /></div>
            <h3>Drop your CAS PDF here</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Encrypted AES-256 local parsing.</p>
          </div>
        )}

        {analyzing && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--accent-color)' }}
            >
              <ActivitySquare size={48} />
            </motion.div>
            <h2>Running deep overlap parsing...</h2>
          </div>
        )}

        {complete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.grid2}>
              <div className={styles.glassCard}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PieChart size={20} color="var(--alert-color)" /> Critical Overlap Detected
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Your Axis Bluechip and HDFC Top 100 funds share 68% of the exact same underlying large-cap stocks. You are paying dual Expense Ratios for identical beta exposure.
                </p>
                <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--alert-color)' }}>Expense Drag</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>₹14,500/year bleed</div>
                </div>
              </div>

              <div className={styles.glassCard}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ActivitySquare size={20} color="var(--success-color)" /> True XIRR Verification
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Broker dashboards inflate returns by omitting early redemptions. Our reconstructed timeline reveals your actual Realized + Unrealized IRR.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Broker Shown</span>
                    <div style={{ fontSize: '1.25rem' }}>18.2%</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>True XIRR</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success-color)' }}>14.8%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button className={styles.btnPrimary} style={{ marginTop: '2rem', width: '100%' }}>
              Download Rebalancing Blueprint
            </button>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
