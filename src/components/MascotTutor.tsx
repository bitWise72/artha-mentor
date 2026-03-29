"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";
import styles from "./MascotTutor.module.css";
import { useUser } from "@/context/UserContext";

const FUN_FACTS = [
  "Did you know? The Nifty 50 has historically returned around 12-14% CAGR. (2026)",
  "Fun Fact: Even a ₹5,000 monthly SIP can grow to ₹1.7 Crores in 30 years at 12% returns!",
  "Tax Hack: Section 80CCD(1B) offers an extra ₹50,000 deduction exclusively for NPS investments.",
  "Market Insight 2026: Sovereign Gold Bonds pay fixed interest annually on top of actual gold appreciation!",
  "Artha is iterating through nodes to bypass server limits, hang tight! Processing..."
];

const OVERVIEWS: Record<string, string> = {
  "/dashboard": "Welcome to your Financial Dashboard! I'm your AI Mentor. Here you can see your real-time 6-dimension health score and raw Net Worth.",
  "/dashboard/simulate": "This is the Play Engine! Hit 'Play' below to scrub through your timeline and simulate major financial milestones.",
  "/dashboard/goals": "This is the FIRE Mapping tool. Enter early retirement goals to track your monthly trajectory vs. inflation.",
  "/dashboard/portfolio": "AI Portfolio X-Ray! I analyze your funds for dangerous overlapping and invisible expense drag.",
  "/dashboard/tax": "Tax Wizard! I compare Old vs New regimes simultaneously and spot missing deductions so you keep your own money.",
  "/dashboard/family": "Family OS! Add your partner's income here and I'll optimize your joint tax filing efficiently.",
  "/dashboard/insights": "Your personalized Life Path insights! I found government schemes and alpha opportunities matching your exact risk profile."
};

export default function MascotTutor() {
  const pathname = usePathname();
  const { profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  
  // Chat State
  const [messages, setMessages] = useState<{ role: "ai" | "user"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setFactIndex(p => (p + 1) % FUN_FACTS.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isLoading]);

  // Trigger contextual overview when navigating
  useEffect(() => {
    if (!isOpen) { // Only show overview bubble if chat is closed
      const text = OVERVIEWS[pathname] || " Need help optimizing your finances? Click me!";
      setBubbleText(text);
      
      // Auto-hide the intro bubble after 7 seconds if it's an overview
      const timer = setTimeout(() => {
        setBubbleText("");
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setBubbleText("");
    }
  }, [pathname, isOpen]);

  // Handle auto-scroll inside chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);
    
    const userContext = `Name: ${profile.name}, Age: ${profile.age}, Monthly Income: ${profile.monthlyIncome}, Investments: ${profile.investments}, SIP: ${profile.monthlySIP}`;
    
    let attempts = 0;
    while (attempts < 5) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg, userContext })
        });

        if (!res.ok) {
           attempts++;
           await new Promise(r => setTimeout(r, 4500));
           continue; 
        }

        const data = await res.json();
        const newMessages = Array.isArray(data.response) 
          ? data.response.map((msg: string) => ({ role: "ai" as const, content: msg }))
          : [{ role: "ai" as const, content: data.response || "Error generating response." }];
        
        setMessages((prev) => [...prev, ...newMessages]);
        setIsLoading(false);
        return;
      } catch (err) {
        attempts++;
        await new Promise(r => setTimeout(r, 4500));
      }
    }

    setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I'm fetching a lot of data and timed out completely. Please try again!" }]);
    setIsLoading(false);
  };

  return (
    <div className={styles.mascotContainer}>
      
      <AnimatePresence>
        {/* The Intercom-style Chat Window */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={styles.chatWidget}
          >
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderTitle}><Bot size={18} /> Artha Tutor</div>
              <button className={styles.closeBtn} onClick={toggleChat}><X size={18} /></button>
            </div>
            
            <div className={styles.chatMessages} ref={scrollRef}>
              {messages.length === 0 && (
                <div className={styles.message} style={{ alignSelf: "center", textAlign: "center", color: "var(--text-secondary)", marginTop: "2rem" }}>
                  I'm your embedded AI Tutor. Ask me any personal finance question!
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.message} ${msg.role === "ai" ? styles.aiMessage : styles.userMessage}`}>
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div style={{ alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: "1rem", marginBottom: "1rem", maxWidth: "80%" }}>
                  <img src="/images/nano_banana.png" style={{ height: "64px", width: "64px", objectFit: "contain", marginBottom: "8px", animation: "pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1)" }} />
                  <div style={{ fontSize: "0.75rem", color: "var(--accent-color)", fontStyle: "italic", marginBottom: "8px" }}>
                    {FUN_FACTS[factIndex]}
                  </div>
                  <div className={styles.typingIndicator} style={{ margin: "0 auto" }}>
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.chatInput}>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask your AI Tutor..."
                className={styles.inputField} 
              />
              <button className={styles.sendBtn} onClick={sendMessage} disabled={!input || isLoading}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* The contextual Speech Bubble */}
        {bubbleText && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={styles.speechBubble}
          >
            {bubbleText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Actual Floating Mascot Avatar */}
      <motion.div 
         className={styles.mascotImageWrapper}
         onClick={toggleChat}
         animate={{ y: [0, -8, 0] }}
         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Used standard img tag so we don't have next/image sizing issues */}
        {/* The CSS heavily uses mix-blend-mode: screen to nuke the black bounding box entirely */}
        <img src="/images/mascot.png" alt="AI Mascot Tutor" className={styles.mascotImage} />
      </motion.div>
    </div>
  );
}
