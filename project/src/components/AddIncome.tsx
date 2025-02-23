import React, { useState } from 'react';
import { X, Plus, Calendar } from 'lucide-react';

interface AddIncomeProps {
  onClose: () => void;
  currency: { code: string; symbol: string; name: string };
}

const categories = [
  { id: '1', name: 'Salary', icon: '💰' },
  { id: '2', name: 'Freelance', icon: '💻' },
  { id: '3', name: 'Investments', icon: '📈' },
  { id: '4', name: 'Other', icon: '💵' },
];

export function AddIncome({ onClose, currency }: AddIncomeProps) {
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle income submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fade-in">
      <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Income</h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold">
                {currency.symbol}
              </span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full bg-gray-50 rounded-xl py-4 px-12 text-2xl font-bold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`p-4 rounded-xl flex flex-col items-center ${
                    selectedCategory.id === category.id
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1">{category.icon}</span>
                  <span className="text-xs font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 rounded-xl py-3 pl-10 pr-4"
              />
            </div>
          </div>

          {/* Note Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 rounded-xl py-3 px-4"
              placeholder="Add note"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white rounded-xl py-4 font-semibold"
          >
            Save Income
          </button>
        </form>
      </div>
    </div>
  );
}