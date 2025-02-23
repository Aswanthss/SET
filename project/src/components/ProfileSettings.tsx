import React from 'react';
import { ChevronRight, Bell, Shield, CreditCard, HelpCircle, LogOut } from 'lucide-react';

const menuItems = [
  { icon: Bell, label: 'Notifications', badge: '2' },
  { icon: Shield, label: 'Security' },
  { icon: CreditCard, label: 'Payment Methods', badge: 'New' },
  { icon: HelpCircle, label: 'Help & Support' },
];

export function ProfileSettings() {
  return (
    <div className="h-full bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white px-6 py-8">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold">Alex Johnson</h1>
            <p className="text-gray-600">alex.johnson@example.com</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6 text-gray-500" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {item.badge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.badge === 'New' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button className="mt-6 w-full bg-red-50 text-red-600 rounded-xl py-4 font-semibold flex items-center justify-center space-x-2">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}