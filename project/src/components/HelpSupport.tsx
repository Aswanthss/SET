import React, { useState } from 'react';
import { X, HelpCircle, Mail, MessageCircle, FileText, ExternalLink } from 'lucide-react';
import UserChat from './chat/UserChat';

interface HelpSupportProps {
  onClose: () => void;
}

export function HelpSupport({ onClose }: HelpSupportProps) {
  const [activeView, setActiveView] = useState<'menu' | 'chat' | 'email'>('menu');
  const adminEmail = 'aswanth31370@gmail.com';

  const handleEmailSupport = () => {
    // For mobile, this will open the default email app
    const mailtoLink = `mailto:${adminEmail}?subject=Support Request - Smart Expense Tracker`;
    window.location.href = mailtoLink;
  };

  const helpItems = [
    {
      icon: MessageCircle,
      title: 'Chat Support',
      description: 'Talk to our support team',
      action: () => setActiveView('chat'),
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email',
      action: handleEmailSupport,
    },
    {
      icon: FileText,
      title: 'FAQs',
      description: 'Find answers to common questions',
      action: () => window.open('/faqs', '_blank'),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {activeView === 'menu' ? 'Help & Support' : 
             activeView === 'chat' ? 'Chat Support' : 'Email Support'}
          </h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {activeView === 'menu' ? (
          <>
            <div className="space-y-4">
              {helpItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={item.action}
                    className="w-full bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <Icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <HelpCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-indigo-900">Need more help?</h3>
                  <p className="text-sm text-indigo-700 mt-1">
                    Our support team is available 24/7 to assist you with any questions or concerns.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : activeView === 'chat' ? (
          <div className="h-[500px]">
            <UserChat />
          </div>
        ) : null}
      </div>
    </div>
  );
}