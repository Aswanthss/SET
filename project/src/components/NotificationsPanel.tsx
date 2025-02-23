import React from 'react';
import { X, Bell, Calendar, CreditCard, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'bill' | 'alert' | 'card' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'bill',
    title: 'Upcoming Bill',
    message: 'Your electricity bill is due in 3 days',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'alert',
    title: 'Budget Alert',
    message: 'You have exceeded your shopping budget by 15%',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'card',
    title: 'New Card Added',
    message: 'Your new credit card has been successfully linked',
    time: '1 day ago',
    read: true,
  },
];

interface NotificationsPanelProps {
  onClose: () => void;
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'bill':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'card':
        return <CreditCard className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full animate-slide-from-right">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}