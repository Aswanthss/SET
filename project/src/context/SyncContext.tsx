import React, { createContext, useContext, useEffect, useState } from 'react';
import { syncService } from '../lib/sync/syncService';
import { Expense } from '../types';

interface SyncContextType {
  addExpense: (expense: Expense) => Promise<void>;
  getExpenses: () => Promise<Expense[]>;
  isOnline: boolean;
  isSyncing: boolean;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addExpense = async (expense: Expense) => {
    setIsSyncing(true);
    try {
      await syncService.addExpense(expense);
    } finally {
      setIsSyncing(false);
    }
  };

  const getExpenses = async () => {
    setIsSyncing(true);
    try {
      return await syncService.getExpenses();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SyncContext.Provider value={{ addExpense, getExpenses, isOnline, isSyncing }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}