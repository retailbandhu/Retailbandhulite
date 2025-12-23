import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, CloudOff, Cloud } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      toast.success('Back online! 🎉', {
        description: 'Your connection has been restored'
      });
      
      // Hide indicator after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
      toast.error('You are offline', {
        description: 'Working in offline mode. Changes will sync when online.'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Always show when offline, hide after 3s when online
  if (!showIndicator && isOnline) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 ${
        isOnline
          ? 'bg-green-500/90 text-white'
          : 'bg-red-500/90 text-white'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-5 h-5 animate-pulse" />
          <span className="font-medium text-sm">Back Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-5 h-5 animate-pulse" />
          <span className="font-medium text-sm">Offline Mode</span>
        </>
      )}
    </div>
  );
}

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  return isOnline;
}
