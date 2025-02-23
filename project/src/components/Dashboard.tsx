import React, { useState } from 'react';
import { 
  ChevronDown, 
  Bell, 
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  AlertCircle,
  HelpCircle,
  Settings,
  Filter
} from 'lucide-react';
import { AddExpense } from './AddExpense';
import { AddIncome } from './AddIncome';
import { Analytics } from './Analytics';
import { NotificationsPanel } from './NotificationsPanel';
import { HelpSupport } from './HelpSupport';
import { VoiceCommand } from './VoiceCommand';
import { TransactionFilters } from './TransactionFilters';
import { AddCard } from './AddCard';
import { RotatingTips } from './RotatingTips';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const mockTransactions = [
  { id: '1', type: 'expense', amount: 450, title: 'Shopping', date: '12:30 PM', icon: '🛍️', category: 'Shopping' },
  { id: '2', type: 'income', amount: 1200, title: 'Salary', date: '10:00 AM', icon: '💰', category: 'Income' },
  { id: '3', type: 'expense', amount: 150, title: 'Transport', date: '09:15 AM', icon: '🚗', category: 'Transport' },
];

const budgetCategories = [
  { name: 'Food & Drinks', spent: 450, budget: 600, icon: '🍔' },
  { name: 'Shopping', spent: 850, budget: 1000, icon: '🛍️' },
  { name: 'Transport', spent: 200, budget: 300, icon: '🚗' },
];

const savingsGoals = [
  { name: 'New Laptop', target: 2000, current: 1500, icon: '💻' },
  { name: 'Vacation', target: 5000, current: 2000, icon: '✈️' },
];

const tips = [
  "Save 20% of your income for long-term goals",
  "Track daily expenses to identify spending patterns",
  "Set up automatic payments for recurring bills",
];

export function Dashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showCurrencySelect, setShowCurrencySelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showVoiceCommand, setShowVoiceCommand] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const handleVoiceCommand = (text: string) => {
    // Process voice command
    console.log('Voice command:', text);
    setShowVoiceCommand(false);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Apply filters to transactions
  };

  const handleAddCard = (card: any) => {
    console.log('New card added:', card);
    setShowAddCard(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-sm font-medium text-gray-700">Good {getTimeOfDay()},</h2>
              <h1 className="text-lg font-bold text-gray-900">Alex Johnson</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              className="p-2"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-sm"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Balance Card */}
        <div className="px-6 py-4">
          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm opacity-90">Total Balance</span>
                <button
                  onClick={() => setShowCurrencySelect(!showCurrencySelect)}
                  className="flex items-center space-x-1 bg-white/20 rounded-lg px-2 py-1"
                >
                  <span>{selectedCurrency.code}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {selectedCurrency.symbol}3,257.00
              </h1>
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <div>
                    <p className="text-sm opacity-90">Income</p>
                    <p className="text-lg font-semibold">{selectedCurrency.symbol}2,350.00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4" />
                  <div>
                    <p className="text-sm opacity-90">Expenses</p>
                    <p className="text-lg font-semibold">{selectedCurrency.symbol}950.00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Selector Dropdown */}
            {showCurrencySelect && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-10">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setShowCurrencySelect(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span className="text-xl">{currency.symbol}</span>
                    <div>
                      <p className="font-medium">{currency.code}</p>
                      <p className="text-sm text-gray-500">{currency.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowAddIncome(true)}
              className="flex-1 bg-green-500 text-white rounded-xl py-3 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Income</span>
            </button>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-3 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Rotating Tips */}
        <div className="px-6 mb-6">
          <RotatingTips />
        </div>

        {/* Budget Overview */}
        <div className="px-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Budget Overview</h2>
            <button className="text-sm text-indigo-600 font-medium">See All</button>
          </div>
          <div className="space-y-4">
            {budgetCategories.map((category) => {
              const percentage = (category.spent / category.budget) * 100;
              return (
                <div key={category.name} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {selectedCurrency.symbol}{category.spent}/{selectedCurrency.symbol}{category.budget}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 bg-gray-100 rounded-lg"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
              <button className="text-sm text-indigo-600 font-medium">See All</button>
            </div>
          </div>
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                    {transaction.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.title}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {selectedCurrency.symbol}{transaction.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Help & Support */}
        <div className="px-6 pb-6">
          <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Need Help?</span>
            </div>
            <button 
              onClick={() => setShowHelp(true)}
              className="text-indigo-600 font-medium"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddExpense && (
        <AddExpense 
          onClose={() => setShowAddExpense(false)} 
          currency={selectedCurrency}
        />
      )}
      {showAddIncome && (
        <AddIncome 
          onClose={() => setShowAddIncome(false)} 
          currency={selectedCurrency}
        />
      )}
      {showNotifications && (
        <NotificationsPanel 
          onClose={() => setShowNotifications(false)} 
        />
      )}
      {showHelp && (
        <HelpSupport 
          onClose={() => setShowHelp(false)} 
        />
      )}
      {showVoiceCommand && (
        <VoiceCommand 
          onClose={() => setShowVoiceCommand(false)}
          onCommand={handleVoiceCommand}
        />
      )}
      {showAddCard && (
        <AddCard 
          onClose={() => setShowAddCard(false)}
          onAddCard={handleAddCard}
        />
      )}
      {showFilters && (
        <TransactionFilters 
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
}