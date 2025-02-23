import React, { useState } from 'react';
import { Plus, CreditCard, ChevronRight } from 'lucide-react';
import { AddCard } from './AddCard';

interface Card {
  id: string;
  type: 'visa' | 'mastercard';
  number: string;
  balance: number;
  gradientFrom: string;
  gradientTo: string;
}

const mockCards = [
  {
    id: '1',
    type: 'visa',
    number: '•••• 4589',
    balance: 3257.00,
    gradientFrom: '#4F46E5',
    gradientTo: '#7C3AED',
  },
  {
    id: '2',
    type: 'mastercard',
    number: '•••• 1234',
    balance: 1850.50,
    gradientFrom: '#F59E0B',
    gradientTo: '#EF4444',
  },
];

export function CardManagement() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cards, setCards] = useState<Card[]>(mockCards);

  const handleAddCard = (card: Card) => {
    setCards([...cards, card]);
    setShowAddCard(false);
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">My Cards</h1>

        {/* Cards Grid */}
        <div className="grid gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative h-48 rounded-2xl p-6 text-white overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm opacity-80">Balance</p>
                  <p className="text-2xl font-bold">${card.balance.toFixed(2)}</p>
                </div>
                <CreditCard className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">{card.number}</p>
                <p className="text-sm opacity-80 uppercase">{card.type}</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16" />
            </div>
          ))}

          {/* Add Card Button */}
          <button
            onClick={() => setShowAddCard(true)}
            className="h-48 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center space-y-2 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Add New Card</span>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Recent Card Transactions</h2>
          <div className="bg-white rounded-xl divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Card Payment</p>
                    <p className="text-sm text-gray-500">Mar {i + 10}, 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-semibold text-red-500">-$89.99</p>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddCard && (
        <AddCard onClose={() => setShowAddCard(false)} onAddCard={handleAddCard} />
      )}
    </div>
  );
}