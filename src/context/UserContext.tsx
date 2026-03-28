"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type HealthDimension = {
  name: string;
  score: number;
  label: string;
  icon: string;
};

export type UserProfile = {
  name: string;
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  investments: number;
  debt: number;
  monthlySIP: number;
  insuranceCoverage: number;
  taxRegime: "old" | "new";
  riskProfile: "conservative" | "moderate" | "aggressive";
  goals: string[];
  // Family
  partnerName: string;
  partnerIncome: number;
  partnerAge: number;
  hasPartner: boolean;
};

export const mockProfile: UserProfile = {
  name: "Diptesh",
  age: 28,
  monthlyIncome: 120000,
  monthlyExpenses: 50000,
  savings: 300000,
  investments: 4782500,
  debt: 0,
  monthlySIP: 35000,
  insuranceCoverage: 500000,
  taxRegime: "old",
  riskProfile: "moderate",
  goals: ["FIRE by 45", "Buy House by 35", "Child Education Fund"],
  partnerName: "",
  partnerIncome: 0,
  partnerAge: 0,
  hasPartner: false,
};

type UserContextType = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  calculateHealthScore: () => number;
  getHealthDimensions: () => HealthDimension[];
  getPortfolioDiversity: () => { subject: string; value: number; fullMark: number }[];
  getFireProjection: () => { age: number; year: number; netWorth: number }[];
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const getHealthDimensions = (): HealthDimension[] => {
    const income = profile.monthlyIncome || 1;
    const expenses = profile.monthlyExpenses || 1;

    const emergencyMonths = profile.savings / expenses;
    const emergencyScore = Math.min(Math.round((emergencyMonths / 6) * 100), 100);

    const idealInsurance = income * 12 * 10;
    const insuranceScore = Math.min(Math.round((profile.insuranceCoverage / idealInsurance) * 100), 100);

    const diversificationScore = 72; // Would need real portfolio data
    const dti = profile.debt / (income * 12);
    const debtScore = Math.min(Math.round((1 - dti) * 100), 100);
    const savingsRate = (income - expenses) / income;
    const taxScore = profile.taxRegime === "old" ? 68 : 72;
    const retirementScore = Math.min(Math.round((profile.investments / (income * 12 * 25)) * 100), 100);

    return [
      { name: "Emergency Fund", score: emergencyScore, label: emergencyScore >= 80 ? `${Math.round(emergencyMonths)} months covered ✓` : `Only ${Math.round(emergencyMonths)} months`, icon: "🛡️" },
      { name: "Insurance Coverage", score: insuranceScore, label: insuranceScore >= 70 ? "Adequately covered" : `Underinsured by ₹${((idealInsurance - profile.insuranceCoverage) / 100000).toFixed(0)}L`, icon: "⚡" },
      { name: "Investment Diversification", score: diversificationScore, label: "Add more debt allocation", icon: "📊" },
      { name: "Debt Health", score: debtScore, label: debtScore >= 80 ? "Low debt-to-income ratio" : "High debt load", icon: "💳" },
      { name: "Tax Efficiency", score: taxScore, label: `${profile.taxRegime === "old" ? "Old" : "New"} regime active`, icon: "📋" },
      { name: "Retirement Readiness", score: retirementScore, label: retirementScore >= 60 ? "On track" : "Needs attention", icon: "🎯" },
    ];
  };

  const calculateHealthScore = () => {
    const dims = getHealthDimensions();
    const total = dims.reduce((acc, d) => acc + d.score, 0);
    return Math.round(total / dims.length);
  };

  const getPortfolioDiversity = () => [
    { subject: "Large Cap", value: 35, fullMark: 100 },
    { subject: "Mid Cap", value: 25, fullMark: 100 },
    { subject: "Small Cap", value: 15, fullMark: 100 },
    { subject: "International", value: 8, fullMark: 100 },
    { subject: "Debt", value: 12, fullMark: 100 },
    { subject: "Gold/Comm.", value: 5, fullMark: 100 },
  ];

  const getFireProjection = () => {
    const data = [];
    const currentAge = profile.age;
    const currentYear = new Date().getFullYear();
    let netWorth = profile.investments / 100000; // in lakhs
    const monthlySIP = profile.monthlySIP;
    const annualReturn = 0.12;

    for (let i = 0; i <= 22; i++) {
      data.push({
        age: currentAge + i,
        year: currentYear + i,
        netWorth: Math.round(netWorth),
      });
      netWorth = netWorth * (1 + annualReturn) + (monthlySIP * 12) / 100000;
    }
    return data;
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, calculateHealthScore, getHealthDimensions, getPortfolioDiversity, getFireProjection }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
