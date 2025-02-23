import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Week 1', income: 3000, expenses: 2400 },
  { name: 'Week 2', income: 2500, expenses: 1398 },
  { name: 'Week 3', income: 3500, expenses: 2800 },
  { name: 'Week 4', income: 2800, expenses: 2000 },
];

interface AnalyticsProps {
  currency: { code: string; symbol: string; name: string };
}

export function Analytics({ currency }: AnalyticsProps) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-lg font-bold mb-6">Monthly Overview</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${currency.symbol}${value}`}
            />
            <Bar dataKey="income" fill="#4F46E5" name="Income" />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-indigo-50 p-4 rounded-xl">
          <p className="text-sm text-indigo-600 mb-1">Total Income</p>
          <p className="text-xl font-bold text-indigo-900">
            {currency.symbol}11,800
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl">
          <p className="text-sm text-red-600 mb-1">Total Expenses</p>
          <p className="text-xl font-bold text-red-900">
            {currency.symbol}8,598
          </p>
        </div>
      </div>
    </div>
  );
}