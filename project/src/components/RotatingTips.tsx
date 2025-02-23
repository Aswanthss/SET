import React, { useState, useEffect } from 'react';
import { LightbulbIcon } from 'lucide-react';

const tips = [
  {
    id: 1,
    text: "Save 20% of your income for long-term goals",
    category: "Savings"
  },
  {
    id: 2,
    text: "Track daily expenses to identify spending patterns",
    category: "Budgeting"
  },
  {
    id: 3,
    text: "Set up automatic payments for recurring bills",
    category: "Bills"
  },
  {
    id: 4,
    text: "Use cash for discretionary spending to stay within budget",
    category: "Spending"
  },
  {
    id: 5,
    text: "Review your subscriptions monthly to avoid unnecessary expenses",
    category: "Optimization"
  },
  {
    id: 6,
    text: "Keep an emergency fund of 3-6 months of expenses",
    category: "Emergency"
  },
  {
    id: 7,
    text: "Invest in low-cost index funds for long-term growth",
    category: "Investing"
  },
  {
    id: 8,
    text: "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    category: "Budgeting"
  },
  {
    id: 9,
    text: "Compare prices before making large purchases",
    category: "Shopping"
  },
  {
    id: 10,
    text: "Pay off high-interest debt first",
    category: "Debt"
  }
];

export function RotatingTips() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 60000); // Change every minute

    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[currentTipIndex];

  return (
    <div className="bg-indigo-50 rounded-xl p-4 animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-indigo-100 rounded-full">
          <LightbulbIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-indigo-600">{currentTip.category}</p>
          <p className="text-sm text-indigo-900 mt-1">{currentTip.text}</p>
        </div>
      </div>
    </div>
  );
}