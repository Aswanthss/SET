import React, { useState } from 'react';
import { Home, CreditCard, PieChart, Settings, Plus } from 'lucide-react';
import { AddExpense } from './AddExpense';
import { ProfileSettings } from './ProfileSettings';
import { CardManagement } from './CardManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [currentTab, setCurrentTab] = useState('home');
  const [showAddExpense, setShowAddExpense] = useState(false);

  const currency = { code: 'USD', symbol: '$', name: 'US Dollar' };

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {currentTab === 'home' && children}
        {currentTab === 'cards' && <CardManagement />}
        {currentTab === 'analytics' && <AnalyticsDashboard />}
        {currentTab === 'settings' && <ProfileSettings />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentTab('home')}
            className={`p-2 ${currentTab === 'home' ? 'text-indigo-600' : 'text-gray-600'}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentTab('cards')}
            className={`p-2 ${currentTab === 'cards' ? 'text-indigo-600' : 'text-gray-600'}`}
          >
            <CreditCard className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="p-2 bg-indigo-600 rounded-full text-white -mt-8 shadow-lg border-4 border-white"
          >
            <Plus className="w-8 h-8" />
          </button>
          <button 
            onClick={() => setCurrentTab('analytics')}
            className={`p-2 ${currentTab === 'analytics' ? 'text-indigo-600' : 'text-gray-600'}`}
          >
            <PieChart className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`p-2 ${currentTab === 'settings' ? 'text-indigo-600' : 'text-gray-600'}`}
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpense onClose={() => setShowAddExpense(false)} currency={currency} />
      )}
    </div>
  );
}