"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export const FUN_FACTS = [
  "Did you know? The Nifty 50 has historically returned around 12-14% CAGR.",
  "Fun Fact: Even a ₹5,000 monthly SIP can grow to ₹1.7 Crores in 30 years at 12% returns!",
  "Tax Hack: Section 80CCD(1B) offers an extra ₹50,000 deduction exclusively for NPS investments.",
  "Market Insight: Sovereign Gold Bonds pay fixed interest annually on top of actual gold appreciation!",
  "Artha AI is mapping thousands of data points... hang tight!"
];

const IMAGES = [
  "/images/coin.png",
  "/images/chart.png",
  "/images/shield.png"
];

interface FunFactLoaderProps {
  title?: string;
  subtitle?: string;
  isSmall?: boolean;
}

export default function FunFactLoader({ title = "Generating personalized insights...", subtitle = "Artha is analyzing live market data...", isSmall = false }: FunFactLoaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(p => (p + 1) % FUN_FACTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const imgIndex = index % IMAGES.length;

  if (isSmall) {
    return (
      <div style={{ alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: "1rem", marginBottom: "1rem", maxWidth: "80%" }}>
        <img src={IMAGES[imgIndex]} style={{ height: "64px", width: "64px", objectFit: "contain", marginBottom: "8px", animation: "pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)" }} />
        <div style={{ fontSize: "0.75rem", color: "var(--accent-color)", fontStyle: "italic", marginBottom: "8px" }}>
          {FUN_FACTS[index]}
        </div>
        <div style={{ display: "flex", gap: "4px", margin: "0 auto" }}>
          <div style={{ width: 6, height: 6, background: "var(--text-secondary)", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
          <div style={{ width: 6, height: 6, background: "var(--text-secondary)", borderRadius: "50%", animation: "pulse 1.5s infinite 0.2s" }} />
          <div style={{ width: 6, height: 6, background: "var(--text-secondary)", borderRadius: "50%", animation: "pulse 1.5s infinite 0.4s" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <img src={IMAGES[imgIndex]} style={{ height: "80px", width: "80px", objectFit: "contain", marginBottom: "1.5rem", animation: "pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)" }} />
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{title}</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{subtitle}</p>
      
      <div style={{ padding: "1rem", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "12px", maxWidth: "500px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "0.5rem" }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite", color: "var(--accent-color)" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--accent-color)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Artha Insight</span>
        </div>
        <p style={{ fontSize: "0.95rem", color: "white", margin: 0, fontStyle: "italic" }}>
          "{FUN_FACTS[index]}"
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
