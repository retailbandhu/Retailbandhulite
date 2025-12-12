/**
 * Data Sync Manager
 * Handles offline data storage and sync when online
 */

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity: 'product' | 'bill' | 'customer' | 'expense';
  data: any;
  timestamp: number;
  synced: boolean;
}

class SyncManager {
  private queue: SyncQueueItem[] = [];
  private readonly QUEUE_KEY = 'retail_bandhu_sync_queue';
  private isSyncing = false;

  constructor() {
    this.loadQueue();
    this.setupOnlineListener();
  }

  /**
   * Load sync queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save sync queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  /**
   * Add item to sync queue
   */
  addToQueue(
    action: SyncQueueItem['action'],
    entity: SyncQueueItem['entity'],
    data: any
  ): void {
    const item: SyncQueueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      entity,
      data,
      timestamp: Date.now(),
      synced: false,
    };

    this.queue.push(item);
    this.saveQueue();

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncNow();
    }
  }

  /**
   * Get pending sync count
   */
  getPendingCount(): number {
    return this.queue.filter(item => !item.synced).length;
  }

  /**
   * Sync all pending items
   */
  async syncNow(): Promise<void> {
    if (this.isSyncing || !navigator.onLine) {
      return;
    }

    this.isSyncing = true;
    const pendingItems = this.queue.filter(item => !item.synced);

    for (const item of pendingItems) {
      try {
        // In production, this would call your backend API
        await this.syncItem(item);
        
        // Mark as synced
        item.synced = true;
      } catch (error) {
        console.error('Failed to sync item:', item, error);
        // Keep in queue for retry
      }
    }

    // Remove synced items older than 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this.queue = this.queue.filter(
      item => !item.synced || item.timestamp > sevenDaysAgo
    );

    this.saveQueue();
    this.isSyncing = false;
  }

  /**
   * Sync individual item (mock implementation)
   */
  private async syncItem(item: SyncQueueItem): Promise<void> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Synced:', item.entity, item.action, item.data);
        resolve();
      }, 100);
    });
  }

  /**
   * Setup listener for online/offline events
   */
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      console.log('Back online! Syncing data...');
      this.syncNow();
    });

    window.addEventListener('offline', () => {
      console.log('Offline mode. Changes will sync when online.');
    });
  }

  /**
   * Get sync queue for debugging
   */
  getQueue(): SyncQueueItem[] {
    return [...this.queue];
  }

  /**
   * Clear sync queue (use with caution)
   */
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }
}

// Export singleton instance
export const syncManager = new SyncManager();
