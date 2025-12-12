import { api } from './api';

export interface SyncItem {
  id: string;
  type: 'product' | 'customer' | 'bill' | 'khata' | 'expense' | 'party';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

const SYNC_QUEUE_KEY = 'retail_bandhu_sync_queue';
const MAX_RETRIES = 3;

let syncInProgress = false;
let onlineListenerAdded = false;

const getQueue = (): SyncItem[] => {
  try {
    const data = localStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveQueue = (queue: SyncItem[]) => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
};

export const addToSyncQueue = (item: Omit<SyncItem, 'timestamp' | 'retries'>) => {
  const queue = getQueue();
  const existingIndex = queue.findIndex(
    q => q.id === item.id && q.type === item.type
  );
  
  if (existingIndex >= 0) {
    queue[existingIndex] = { ...item, timestamp: Date.now(), retries: 0 };
  } else {
    queue.push({ ...item, timestamp: Date.now(), retries: 0 });
  }
  
  saveQueue(queue);
  
  if (navigator.onLine) {
    processSyncQueue();
  }
};

export const removeFromSyncQueue = (id: string, type: string) => {
  const queue = getQueue().filter(item => !(item.id === id && item.type === type));
  saveQueue(queue);
};

export const getSyncQueueStatus = () => {
  const queue = getQueue();
  return {
    pending: queue.length,
    items: queue,
    isOnline: navigator.onLine,
    syncInProgress,
  };
};

const syncItem = async (item: SyncItem, storeId: number): Promise<boolean> => {
  try {
    const endpoint = `/api/stores/${storeId}/${item.type}s`;
    
    switch (item.action) {
      case 'create':
        const createData = { ...item.data };
        delete createData.id;
        const created = await api.post<{ id: number | string }>(endpoint, createData);
        if (created && created.id) {
          updateLocalIdMapping(item.type, item.id, created.id.toString());
        }
        return true;
        
      case 'update':
        await api.put(`${endpoint}/${item.id}`, item.data);
        return true;
        
      case 'delete':
        await api.delete(`${endpoint}/${item.id}`);
        return true;
        
      default:
        return false;
    }
  } catch (error) {
    console.error(`Sync failed for ${item.type} ${item.id}:`, error);
    return false;
  }
};

const updateLocalIdMapping = (type: string, localId: string, serverId: string) => {
  const cacheKey = `retail_bandhu_${type}s`;
  try {
    const data = localStorage.getItem(cacheKey);
    if (data) {
      const items = JSON.parse(data);
      const updatedItems = items.map((item: any) => 
        item.id === localId ? { ...item, id: serverId } : item
      );
      localStorage.setItem(cacheKey, JSON.stringify(updatedItems));
    }
  } catch (error) {
    console.error('Failed to update local ID mapping:', error);
  }
};

export const processSyncQueue = async (): Promise<{ synced: number; failed: number }> => {
  if (syncInProgress || !navigator.onLine) {
    return { synced: 0, failed: 0 };
  }
  
  syncInProgress = true;
  const queue = getQueue();
  let synced = 0;
  let failed = 0;
  
  const storeId = localStorage.getItem('retail_bandhu_store_id');
  if (!storeId) {
    syncInProgress = false;
    return { synced: 0, failed: 0 };
  }
  
  const remainingItems: SyncItem[] = [];
  
  for (const item of queue) {
    const success = await syncItem(item, parseInt(storeId));
    
    if (success) {
      synced++;
    } else {
      item.retries++;
      if (item.retries < MAX_RETRIES) {
        remainingItems.push(item);
      } else {
        failed++;
        console.warn(`Sync permanently failed for ${item.type} ${item.id} after ${MAX_RETRIES} retries`);
      }
    }
  }
  
  saveQueue(remainingItems);
  syncInProgress = false;
  
  window.dispatchEvent(new CustomEvent('syncComplete', { 
    detail: { synced, failed, pending: remainingItems.length } 
  }));
  
  return { synced, failed };
};

export const initSyncListener = () => {
  if (onlineListenerAdded) return;
  
  window.addEventListener('online', () => {
    console.log('Back online - processing sync queue...');
    processSyncQueue();
  });
  
  onlineListenerAdded = true;
  
  if (navigator.onLine) {
    setTimeout(() => processSyncQueue(), 2000);
  }
};

export const clearSyncQueue = () => {
  saveQueue([]);
};
