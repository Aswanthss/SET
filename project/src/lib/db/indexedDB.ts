import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Expense } from '../../types';

interface ExpenseTrackerDB extends DBSchema {
  expenses: {
    key: string;
    value: Expense & {
      synced: boolean;
      lastModified: number;
    };
    indexes: { 'by-date': Date };
  };
  chatMessages: {
    key: string;
    value: {
      id: string;
      message: string;
      timestamp: number;
      synced: boolean;
    };
    indexes: { 'by-timestamp': number };
  };
  offlineQueue: {
    key: string;
    value: {
      id: string;
      action: string;
      data: any;
      timestamp: number;
    };
  };
}

const DB_NAME = 'expenseTrackerDB';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<ExpenseTrackerDB>>;

async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Expenses store
        const expenseStore = db.createObjectStore('expenses', {
          keyPath: 'id',
          autoIncrement: true
        });
        expenseStore.createIndex('by-date', 'date');

        // Chat messages store
        const chatStore = db.createObjectStore('chatMessages', {
          keyPath: 'id',
          autoIncrement: true
        });
        chatStore.createIndex('by-timestamp', 'timestamp');

        // Offline queue store
        db.createObjectStore('offlineQueue', {
          keyPath: 'id',
          autoIncrement: true
        });
      },
    });
  }
  return dbPromise;
}

export async function saveExpense(expense: Expense): Promise<void> {
  const db = await getDB();
  await db.put('expenses', {
    ...expense,
    synced: false,
    lastModified: Date.now()
  });
}

export async function getExpenses(): Promise<Expense[]> {
  const db = await getDB();
  return db.getAllFromIndex('expenses', 'by-date');
}

export async function getPendingSyncExpenses(): Promise<Expense[]> {
  const db = await getDB();
  const expenses = await db.getAll('expenses');
  return expenses.filter(expense => !expense.synced);
}

export async function markExpenseAsSynced(id: string): Promise<void> {
  const db = await getDB();
  const expense = await db.get('expenses', id);
  if (expense) {
    expense.synced = true;
    await db.put('expenses', expense);
  }
}

export async function getPendingChatMessages() {
  const db = await getDB();
  const messages = await db.getAll('chatMessages');
  return messages.filter(msg => !msg.synced);
}

export async function markChatMessageAsSynced(id: string) {
  const db = await getDB();
  const message = await db.get('chatMessages', id);
  if (message) {
    message.synced = true;
    await db.put('chatMessages', message);
  }
}

export async function getOfflineQueue() {
  const db = await getDB();
  return db.getAll('offlineQueue');
}

export async function clearOfflineQueue() {
  const db = await getDB();
  await db.clear('offlineQueue');
}

export async function saveChatMessage(message: {
  message: string;
  is_admin_message: boolean;
  user_id?: number;
}) {
  const db = await getDB();
  await db.put('chatMessages', {
    ...message,
    synced: false,
    timestamp: Date.now()
  });
}

export async function getChatMessages() {
  const db = await getDB();
  return db.getAllFromIndex('chatMessages', 'by-timestamp');
}

export async function addToOfflineQueue(action: string, data: any) {
  const db = await getDB();
  await db.add('offlineQueue', {
    action,
    data,
    timestamp: Date.now()
  });
}