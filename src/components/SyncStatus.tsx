import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';
import { getSyncQueueStatus, processSyncQueue, initSyncListener } from '../utils/syncQueue';

export function SyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  useEffect(() => {
    initSyncListener();
    
    const updateStatus = () => {
      const status = getSyncQueueStatus();
      setIsOnline(status.isOnline);
      setPending(status.pending);
      setSyncing(status.syncInProgress);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    const handleOnline = () => {
      setIsOnline(true);
      updateStatus();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleSyncComplete = (e: CustomEvent) => {
      if (e.detail.synced > 0) {
        setLastSynced(new Date());
      }
      updateStatus();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('syncComplete', handleSyncComplete as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('syncComplete', handleSyncComplete as EventListener);
    };
  }, []);

  const handleManualSync = async () => {
    if (!isOnline || syncing) return;
    setSyncing(true);
    await processSyncQueue();
    setSyncing(false);
    setLastSynced(new Date());
  };

  if (isOnline && pending === 0 && !syncing) {
    return (
      <div className="flex items-center gap-1 text-green-600 text-xs">
        <Check className="w-3 h-3" />
        <span>Synced</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1 text-amber-600 text-xs">
        <CloudOff className="w-3 h-3" />
        <span>Offline{pending > 0 ? ` (${pending} pending)` : ''}</span>
      </div>
    );
  }

  if (syncing) {
    return (
      <div className="flex items-center gap-1 text-blue-600 text-xs">
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span>Syncing...</span>
      </div>
    );
  }

  if (pending > 0) {
    return (
      <button 
        onClick={handleManualSync}
        className="flex items-center gap-1 text-amber-600 text-xs hover:text-amber-700"
      >
        <Cloud className="w-3 h-3" />
        <span>{pending} to sync</span>
      </button>
    );
  }

  return null;
}
