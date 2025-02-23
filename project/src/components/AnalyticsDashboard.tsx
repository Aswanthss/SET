import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', income: 4500, expenses: 3200 },
  { month: 'Feb', income: 5200, expenses: 4100 },
  { month: 'Mar', income: 4800, expenses: 3800 },
  { month: 'Apr', income: 6000, expenses: 4500 },
  { month: 'May', income: 5500, expenses: 4200 },
  { month: 'Jun', income: 5800, expenses: 4600 },
];

const expensesByCategory = [
  { name: 'Food & Drinks', value: 1200, color: '#4F46E5' },
  { name: 'Shopping', value: 800, color: '#7C3AED' },
  { name: 'Transport', value: 600, color: '#EC4899' },
  { name: 'Bills', value: 900, color: '#F59E0B' },
  { name: 'Entertainment', value: 500, color: '#10B981' },
];

const savingsData = [
  { month: 'Jan', amount: 800 },
  { month: 'Feb', amount: 1200 },
  { month: 'Mar', amount: 1000 },
  { month: 'Apr', amount: 1500 },
  { month: 'May', amount: 1300 },
  { month: 'Jun', amount: 1800 },
];

export function AnalyticsDashboard() {
  const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1);

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Financial Analytics</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-sm text-gray-600 mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-sm text-gray-600 mb-2">Savings Rate</h3>
            <p className="text-2xl font-bold text-indigo-600">{savingsRate}%</p>
          </div>
        </div>

        {/* Income vs Expenses Chart */}
        <div className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Income vs Expenses</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Expense Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings Trend */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Savings Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    name="Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-indigo-50 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Key Insights</h2>
          <div className="space-y-3">
            <p className="flex items-center text-indigo-800">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Your highest spending category is Food & Drinks (${expensesByCategory[0].value})
            </p>
            <p className="flex items-center text-indigo-800">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Savings have increased by 125% compared to January
            </p>
            <p className="flex items-center text-indigo-800">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Your average monthly savings is ${(savingsData.reduce((sum, item) => sum + item.amount, 0) / savingsData.length).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}