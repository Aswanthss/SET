import { api } from '../api/apiService';
import {
  getPendingSyncExpenses,
  markExpenseAsSynced,
  getPendingChatMessages,
  markChatMessageAsSynced,
  getOfflineQueue,
  clearOfflineQueue,
} from '../db/indexedDB';

class SyncService {
  private syncInProgress = false;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.startSync());
    window.addEventListener('offline', () => {
      console.log('App is offline. Changes will be synced when connection is restored.');
    });
  }

  async startSync() {
    if (this.syncInProgress || !navigator.onLine) return;

    try {
      this.syncInProgress = true;
      console.log('Starting sync...');

      // Sync expenses
      await this.syncExpenses();

      // Sync chat messages
      await this.syncChatMessages();

      // Process offline queue
      await this.processOfflineQueue();

      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncExpenses() {
    const pendingExpenses = await getPendingSyncExpenses();
    if (pendingExpenses.length === 0) return;

    try {
      const response = await api.post('/expenses/sync', { expenses: pendingExpenses });
      const syncedExpenses = response.data;

      // Mark expenses as synced
      for (const expense of syncedExpenses) {
        await markExpenseAsSynced(expense.id);
      }
    } catch (error) {
      console.error('Failed to sync expenses:', error);
      throw error;
    }
  }

  private async syncChatMessages() {
    const pendingMessages = await getPendingChatMessages();
    if (pendingMessages.length === 0) return;

    try {
      for (const message of pendingMessages) {
        if (message.is_admin_message) {
          await api.post('/chat/admin/message', message);
        } else {
          await api.post('/chat/message', message);
        }
        await markChatMessageAsSynced(message.id);
      }
    } catch (error) {
      console.error('Failed to sync chat messages:', error);
      throw error;
    }
  }

  private async processOfflineQueue() {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;

    try {
      for (const item of queue) {
        switch (item.action) {
          case 'DELETE_EXPENSE':
            await api.delete(`/expenses/${item.data.id}`);
            break;
          case 'UPDATE_EXPENSE':
            await api.put(`/expenses/${item.data.id}`, item.data);
            break;
          case 'CLOSE_CHAT':
            await api.post(`/chat/sessions/${item.data.sessionId}/close`);
            break;
          // Add more cases as needed
        }
      }

      // Clear the queue after successful processing
      await clearOfflineQueue();
    } catch (error) {
      console.error('Failed to process offline queue:', error);
      throw error;
    }
  }
}

export const syncService = new SyncService();
