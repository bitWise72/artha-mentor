"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/onboarding");
  };

  return (
    <main className={styles.container}>
      <div className={styles.backgroundGlow} />
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.badge}>
          Private Wealth Intelligence
        </div>
        
        <h1 className={styles.title}>
          Command Your <br /> Financial Future
        </h1>
        
        <p className={styles.subtitle}>
          An intelligent, fiercely private financial simulation engine that turns complex life decisions into a brilliantly clear, achievable path.
        </p>

        <button onClick={handleStart} className={styles.ctaButton}>
          Start Your Simulation
          <ArrowRight style={{ marginLeft: "8px" }} size={18} />
        </button>

        <motion.div 
          className={styles.features}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className={styles.featureItem}>
            <Shield size={18} /> Bank-level Privacy
          </div>
          <div className={styles.featureItem}>
            <Target size={18} /> Precision Planning
          </div>
          <div className={styles.featureItem}>
            <TrendingUp size={18} /> Optimized Growth
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
