import { Expense } from '../../types';
import { 
  saveExpense, 
  getPendingSyncExpenses, 
  markExpenseAsSynced,
  getExpenses as getLocalExpenses
} from '../db/indexedDB';
import { api } from '../api/apiService';

class SyncService {
  private syncInProgress = false;
  private networkStatus: 'online' | 'offline' = 'online';

  constructor() {
    this.initNetworkListeners();
  }

  private initNetworkListeners() {
    window.addEventListener('online', () => {
      this.networkStatus = 'online';
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.networkStatus = 'offline';
    });
  }

  async syncData() {
    if (this.syncInProgress || this.networkStatus === 'offline') {
      return;
    }

    this.syncInProgress = true;

    try {
      const pendingExpenses = await getPendingSyncExpenses();
      
      if (pendingExpenses.length > 0) {
        const response = await api.post('/api/expenses/sync', { expenses: pendingExpenses });
        const syncedExpenses = response.data;
        
        // Update local database with synced expenses
        for (const expense of syncedExpenses) {
          await saveExpense({
            ...expense,
            synced: true
          });
          await markExpenseAsSynced(expense.id);
        }
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    await saveExpense({
      ...expense,
      synced: this.networkStatus === 'online'
    });

    if (this.networkStatus === 'online') {
      await this.syncData();
    }
  }

  async getExpenses(): Promise<Expense[]> {
    if (this.networkStatus === 'online') {
      try {
        const response = await api.get('/api/expenses');
        const expenses = response.data;
        
        // Update local database
        for (const expense of expenses) {
          await saveExpense({
            ...expense,
            synced: true
          });
        }
        
        return expenses;
      } catch (error) {
        console.error('Failed to fetch expenses from server:', error);
        // Fall back to local data
        return getLocalExpenses();
      }
    }
    
    return getLocalExpenses();
  }
}

export const syncService = new SyncService();