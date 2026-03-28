"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser, UserProfile } from "@/context/UserContext";
import { ArrowRight } from "lucide-react";
import styles from "./page.module.css";

const steps = [
  { id: "age", question: "Let's calibrate the engine. How old are you?", type: "number", prefix: "" },
  { id: "monthlyIncome", question: "What is your average monthly income?", type: "number", prefix: "₹" },
  { id: "monthlyExpenses", question: "What are your total monthly living expenses?", type: "number", prefix: "₹" },
  { id: "savings", question: "How much do you have in liquid savings (Emergency Fund)?", type: "number", prefix: "₹" },
  { id: "investments", question: "What's the current value of your investments?", type: "number", prefix: "₹" },
  { id: "debt", question: "Do you have any outstanding debt?", type: "number", prefix: "₹" }
];

export default function OnboardingFlow() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const step = steps[currentStep];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const handleNext = () => {
    if (!inputValue && inputValue !== "0") return;
    
    // Save current step data
    updateProfile({ [step.id as keyof UserProfile]: parseFloat(inputValue) });

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setInputValue("");
    } else {
      router.push("/dashboard");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.glow} />
      
      <div className={styles.stepContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className={styles.question}>{step.question}</h2>
            
            <div className={styles.inputWrapper}>
              {step.prefix && <span className={styles.currencySymbol}>{step.prefix}</span>}
              <input
                ref={inputRef}
                type="number"
                className={`${styles.input} ${step.prefix ? styles.inputWithCurrency : ''}`}
                placeholder="0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                min="0"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.controls}>
          <div className={styles.progressBar}>
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`${styles.progressDot} ${i <= currentStep ? styles.active : ''}`} 
              />
            ))}
          </div>
          
          <button 
            className={styles.nextButton} 
            onClick={handleNext}
            disabled={!inputValue && inputValue !== "0"}
          >
            {currentStep === steps.length - 1 ? "Initialize Engine" : "Next"}
            <ArrowRight size={18} style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </div>
    </main>
  );
}
