"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { Play, Pause, FastForward, Activity, ShieldAlert, Users, TrendingUp, Sparkles, MapPin } from "lucide-react";
import Image from "next/image";
import styles from "./page.module.css";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

type DecisionNode = {
  ageTrigger: number;
  id: string;
  icon: any;
  title: string;
  description: string;
  choices: {
    label: string;
    impactLabel: string;
    isPrimary?: boolean;
    netWorthDelta: number;
    sipDelta: number;
  }[];
};

const GAME_NODES: DecisionNode[] = [
  {
    ageTrigger: 30,
    id: "tax_check",
    icon: ShieldAlert,
    title: "Tax Bleed Detected!",
    description: "Artha AI noticed you're in the Old Regime without enough 80C deductions. You're losing ₹45,000 to taxes every year.",
    choices: [
      { label: "Switch to New Regime", impactLabel: "+₹45k/yr to investments", isPrimary: true, netWorthDelta: 0, sipDelta: 3750 },
      { label: "Stay in Old Regime", impactLabel: "Ignore and pay higher tax", netWorthDelta: 0, sipDelta: 0 }
    ]
  },
  {
    ageTrigger: 33,
    id: "family_os",
    icon: Users,
    title: "Life Event: Marriage 💍",
    description: "It's time to merge finances! Will you optimize Joint HRA and match NPS contributions across both incomes with Family OS?",
    choices: [
      { label: "Run Joint Optimization", impactLabel: "+₹1.2L/yr tax saved", isPrimary: true, netWorthDelta: 0, sipDelta: 10000 },
      { label: "File Separately", impactLabel: "Miss out on family efficiencies", netWorthDelta: 0, sipDelta: 0 }
    ]
  },
  {
    ageTrigger: 38,
    id: "portfolio_xray",
    icon: Activity,
    title: "Portfolio Overlap Warning",
    description: "Your broker shows 18% XIRR, but AI Portfolio X-Ray found a 65% overlap in your mutual funds and high expense ratios.",
    choices: [
      { label: "Rebalance automatically", impactLabel: "Removes drag, shifts to Alpha", isPrimary: true, netWorthDelta: 500000, sipDelta: 0 },
      { label: "Keep current funds", impactLabel: "Suffer long-term TER drag", netWorthDelta: -300000, sipDelta: 0 }
    ]
  },
  {
    ageTrigger: 43,
    id: "alpha_invest",
    icon: TrendingUp,
    title: "Unlock Sovereign Advantage",
    description: "You have accumulated enough capital to access Sovereign Gold Bonds and Fractional Commercial Real Estate for passive yield.",
    choices: [
      { label: "Allocate to Alpha", impactLabel: "+2% average portfolio yield", isPrimary: true, netWorthDelta: 1500000, sipDelta: 0 },
      { label: "Stick to FDs & standard MFs", impactLabel: "Lower passive income", netWorthDelta: 0, sipDelta: 0 }
    ]
  }
];

// Custom tiny tooltip for the top-right mini graph
const MiniTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(0,0,0,0.8)", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.1)" }}>
        Age {payload[0].payload.age}: ₹{payload[0].value}L
      </div>
    );
  }
  return null;
};

export default function GameSimulationEngine() {
  const { profile } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAge, setCurrentAge] = useState(profile.age);
  const [targetFireAge] = useState(45);
  
  // Game State
  const [activeNode, setActiveNode] = useState<DecisionNode | null>(null);
  const [handledNodeEffects, setHandledNodeEffects] = useState<Record<string, {netWorthDelta: number, sipDelta: number}>>({});
  
  // Projection Chart Data
  const [projectionData, setProjectionData] = useState<{age: number, worth: number}[]>([]);

  // We map (targetFireAge - startAge) mapped to 10000px of scrolling for the background
  const totalYears = targetFireAge - profile.age;
  const progressPercent = ((currentAge - profile.age) / totalYears) * 100;

  // Real-time calculation using explicit iteration
  const calculateStateAtAge = (age: number) => {
    let loopNW = profile.investments;
    let loopSIP = profile.monthlySIP;
    const returnRate = 0.12;
    for (let yr = profile.age; yr < age; yr++) {
        const node = GAME_NODES.find(n => n.ageTrigger === yr);
        if (node && handledNodeEffects[node.id]) {
            loopNW += handledNodeEffects[node.id].netWorthDelta;
            loopSIP += handledNodeEffects[node.id].sipDelta;
        }
        loopNW = loopNW * (1 + returnRate) + (loopSIP * 12);
    }
    // Apply decision at current age
    const activeCurrentNode = GAME_NODES.find(n => n.ageTrigger === age);
    if (activeCurrentNode && handledNodeEffects[activeCurrentNode.id]) {
        loopNW += handledNodeEffects[activeCurrentNode.id].netWorthDelta;
        loopSIP += handledNodeEffects[activeCurrentNode.id].sipDelta;
    }
    return { loopNW, loopSIP };
  };

  const { loopNW: netWorth, loopSIP: monthlySIP } = calculateStateAtAge(currentAge);

  // Calculate Target
  const fireTargetGoal = useMemo(() => {
    let baseNW = profile.investments;
    for (let yr = profile.age; yr < targetFireAge; yr++) baseNW = baseNW * 1.12 + (profile.monthlySIP * 12);
    
    let optNW = profile.investments;
    let optSIP = profile.monthlySIP;
    for (let yr = profile.age; yr < targetFireAge; yr++) {
        const node = GAME_NODES.find(n => n.ageTrigger === yr);
        if (node) {
            const bestChoice = node.choices.find(c => c.isPrimary) || node.choices[0];
            optNW += bestChoice.netWorthDelta;
            optSIP += bestChoice.sipDelta;
        }
        optNW = optNW * 1.12 + (optSIP * 12);
    }
    return baseNW + (optNW - baseNW) * 0.5; 
  }, [profile, targetFireAge]);

  const isFireAchieved = netWorth >= fireTargetGoal;

  useEffect(() => {
    const data = [];
    let loopNW = profile.investments;
    let loopSIP = profile.monthlySIP;
    const returnRate = 0.12;

    for (let a = profile.age; a <= targetFireAge; a++) {
      const node = GAME_NODES.find(n => n.ageTrigger === a);
      if (node && handledNodeEffects[node.id]) {
          loopNW += handledNodeEffects[node.id].netWorthDelta;
          loopSIP += handledNodeEffects[node.id].sipDelta;
      }
      data.push({ age: a, worth: Math.round(loopNW / 100000) });

      if (a < targetFireAge) {
          loopNW = loopNW * (1 + returnRate) + (loopSIP * 12);
      }
    }
    setProjectionData(data);
  }, [handledNodeEffects, profile.age, targetFireAge, profile.investments, profile.monthlySIP]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !activeNode) {
      timerRef.current = setInterval(() => {
        setCurrentAge((prev) => {
          if (prev >= targetFireAge) {
            setIsPlaying(false);
            return prev;
          }
          const nextAge = prev + 1;
          const node = GAME_NODES.find(n => n.ageTrigger === nextAge && !handledNodeEffects[n.id]);
          if (node) {
            setActiveNode(node);
            setIsPlaying(false);
          }
          return nextAge;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, activeNode, handledNodeEffects, targetFireAge]);

  const handleDecision = (netWorthDelta: number, sipDelta: number, nodeId: string) => {
    setHandledNodeEffects(prev => ({ ...prev, [nodeId]: { netWorthDelta, sipDelta } }));
    setActiveNode(null);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (currentAge >= targetFireAge) {
      setCurrentAge(profile.age);
      setHandledNodeEffects({});
      setActiveNode(null);
    }
    setIsPlaying(!isPlaying);
  };

  const setAgeManually = (newAge: number) => {
    if (activeNode) return;
    setIsPlaying(false);
    setCurrentAge(newAge);
  };

  // Convert age to a pixel position for the signboards based on progress (0 left, 100vw right initially, moves left)
  // Our character sits at 15vw. So when currentAge == nodeAge, the sign should be exactly at 15vw.
  const getSignLeftPosition = (nodeAge: number) => {
    const nodeProgressPct = ((nodeAge - profile.age) / totalYears); 
    const currentProgressPct = ((currentAge - profile.age) / totalYears);
    // If currentProgress == nodeProgress, left should be 15vw.
    // If currentProgress is 0 and nodeProgress is 100, it should be way offscreen right.
    const diff = nodeProgressPct - currentProgressPct;
    return `${15 + (diff * 150)}vw`; // Speed up approaching factor
  };

  return (
    <div className={styles.engineContainer}>
      
      {/* 2D Viewport Section */}
      <div className={styles.viewport}>
        {/* Parallax Background */}
        <div 
          className={styles.scrollingBackground} 
          style={{ backgroundPositionX: `-${progressPercent * 20}px` }} 
        />
        <div className={styles.viewportOverlay} />

        {/* Player Avatar static on Left */}
        <div className={styles.playerInfo}>
          <div className={styles.playerAvatar}>{profile.name.charAt(0)}</div>
          <div>
            <div className={styles.playerName}>{profile.name}</div>
            <div className={styles.playerAge}>Age: {currentAge} / {targetFireAge}</div>
          </div>
        </div>

        {/* Top Right HUD (Mini Graph + Stats) */}
        <div className={styles.gameHud}>
          <div className={styles.hudStatCard}>
            <div className={styles.hudLabel}>Net Worth HUD</div>
            <div className={`${styles.hudValue} ${styles.accent}`}>₹{Math.round(netWorth).toLocaleString("en-IN")}</div>
          </div>
          <div className={styles.hudStatCard}>
            <div className={styles.hudLabel}>SIP Engine</div>
            <div className={`${styles.hudValue} ${styles.success}`}>₹{monthlySIP.toLocaleString("en-IN")}</div>
          </div>
          <div className={styles.miniGraphCard}>
            <div className={styles.miniGraphTitle}>Trajectory</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                   <linearGradient id="colorWorthMini" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.6}/>
                     <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                <XAxis dataKey="age" hide />
                <Tooltip content={<MiniTooltip />} />
                <Area type="monotone" dataKey="worth" stroke="var(--accent-color)" strokeWidth={2} fillOpacity={1} fill="url(#colorWorthMini)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Player Sprite (Driving the car) - Animate bobbing effect */}
        <motion.div 
          className={styles.playerCharacter}
          animate={{ y: isPlaying ? [0, -5, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
        >
          {/* Fallback styling directly on the image element via public path */}
          <img src="/images/player_car.png" alt="Player Vehicle" className={styles.carSprite} />
        </motion.div>

        {/* Coming Milestones (Signposts rendering dynamically) */}
        <div className={styles.milestonesContainer}>
          {GAME_NODES.map(node => (
            <div key={node.id} className={styles.signpost} style={{ left: getSignLeftPosition(node.ageTrigger) }}>
               <div className={styles.signpostAge}>Age {node.ageTrigger}</div>
               <div className={styles.signpostTitle}>{node.title.split(":")[0]}</div>
            </div>
          ))}
          <div className={styles.signpost} style={{ left: getSignLeftPosition(targetFireAge), borderColor: "var(--success-color)" }}>
             <div className={styles.signpostAge} style={{ background: "var(--success-color)" }}>Age {targetFireAge}</div>
             <div className={styles.signpostTitle}>FIRE Finish Line 🏁</div>
          </div>
        </div>

        {/* Dialog Overlays (when node hits) */}
        <AnimatePresence>
          {activeNode && (
            <motion.div 
              className={styles.dialogOverlay}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div 
                className={styles.nodeCard}
                initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: -20 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <div className={styles.nodeIcon}>
                  <activeNode.icon size={32} />
                </div>
                <h2 className={styles.nodeTitle}>{activeNode.title}</h2>
                <p className={styles.nodeDescription}>{activeNode.description}</p>
                
                <div className={styles.nodeChoices}>
                  {activeNode.choices.map((choice, i) => (
                    <button 
                      key={i}
                      onClick={() => handleDecision(choice.netWorthDelta, choice.sipDelta, activeNode.id)}
                      className={`${styles.choiceBtn} ${choice.isPrimary ? styles.primary : ''}`}
                    >
                      <span>{choice.label}</span>
                      <span className={styles.choiceImpact}>{choice.impactLabel}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentAge >= targetFireAge && !activeNode && (
             <motion.div 
               className={styles.dialogOverlay}
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             >
               <motion.div 
                  className={styles.nodeCard}
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  style={{ 
                    border: `1px solid ${isFireAchieved ? 'var(--success-color)' : 'var(--alert-color)'}`, 
                    boxShadow: `0 0 40px ${isFireAchieved ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}` 
                  }}
               >
                 <div className={styles.nodeIcon} style={{ background: isFireAchieved ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)", color: isFireAchieved ? "var(--success-color)" : "var(--alert-color)" }}>
                   {isFireAchieved ? <Sparkles size={32} /> : <ShieldAlert size={32} />}
                 </div>
                 <h2 className={styles.nodeTitle}>{isFireAchieved ? "FIRE Achieved! 🔥" : "FIRE Missed! 📉"}</h2>
                 
                 <p className={styles.nodeDescription}>
                    {isFireAchieved 
                     ? `Congratulations! By adopting AI financial optimization, you've smoothly navigated the road to early retirement at age ${targetFireAge}.` 
                     : `You fell short of your FIRE goal exactly by ignoring crucial AI optimisations. Rethink your choices.`}
                 </p>

                 <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Final Net Worth</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: isFireAchieved ? "var(--success-color)" : "var(--alert-color)" }}>₹{Math.round(netWorth).toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ textAlign: "right", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "0.25rem" }}>FIRE Goal Target</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>₹{Math.round(fireTargetGoal).toLocaleString("en-IN")}</div>
                    </div>
                 </div>
                 <button className={`${styles.choiceBtn} ${styles.primary}`} onClick={handlePlayPause}>Play Simulation Again</button>
               </motion.div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Control Scrubber */}
      <div className={styles.videoControls}>
        <button className={styles.playBtn} onClick={handlePlayPause}>
          {currentAge >= targetFireAge ? <FastForward size={20} /> : isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
        </button>

        <div className={styles.scrubberWrapper}>
          <div className={styles.scrubberTime}>Age {currentAge}</div>
          
          <div className={styles.scrubberTrack} onClick={(e) => {
            if(activeNode) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const newAge = Math.round(profile.age + (totalYears) * pct);
            setAgeManually(Math.max(profile.age, Math.min(targetFireAge, newAge)));
          }}>
            <div className={styles.scrubberFill} style={{ width: `${progressPercent}%` }} />
            <div className={styles.scrubberHandle} style={{ left: `${progressPercent}%` }} />
            
            {GAME_NODES.map(node => {
              const nodePct = ((node.ageTrigger - profile.age) / totalYears) * 100;
              return (
                <div 
                  key={node.id} 
                  className={`${styles.nodeMarker} ${currentAge >= node.ageTrigger ? styles.passed : ''}`}
                  style={{ left: `${nodePct}%` }}
                />
              );
            })}
          </div>
          
          <div className={styles.scrubberTime}>FIRE ({targetFireAge})</div>
        </div>
      </div>
      
    </div>
  );
}
