import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Activity,
  Wifi,
  WifiOff,
  Zap,
  Clock,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';

interface PerformanceMetrics {
  isOnline: boolean;
  loadTime: number;
  memoryUsage: number;
  cacheSize: number;
  lastSync: string;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    isOnline: navigator.onLine,
    loadTime: 0,
    memoryUsage: 0,
    cacheSize: 0,
    lastSync: new Date().toLocaleString(),
  });
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Track page load time
    if (performance && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime / 1000) }));
    }

    // Listen for online/offline status
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check memory usage (if available)
    const checkMemory = () => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        const usedMB = Math.round(mem.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memoryUsage: usedMB }));
      }
    };

    checkMemory();
    const memoryInterval = setInterval(checkMemory, 5000);

    // Check cache size
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        const usedMB = Math.round((estimate.usage || 0) / 1048576);
        setMetrics(prev => ({ ...prev, cacheSize: usedMB }));
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(memoryInterval);
    };
  }, []);

  // Offline indicator (always visible)
  if (!metrics.isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You are offline</span>
        </div>
        <span className="text-xs">Changes will sync when online</span>
      </div>
    );
  }

  // Performance monitor toggle button
  if (!showMonitor) {
    return (
      <Button
        onClick={() => setShowMonitor(true)}
        className="fixed bottom-20 right-4 z-40 rounded-full w-12 h-12 p-0 shadow-lg"
        variant="secondary"
      >
        <Activity className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 w-72">
      <Card className="p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Performance Monitor
          </h3>
          <button onClick={() => setShowMonitor(false)}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {/* Online Status */}
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-green-600" />
              <span>Network</span>
            </div>
            <Badge className="bg-green-500 text-xs">Online</Badge>
          </div>

          {/* Load Time */}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Load Time</span>
            </div>
            <span className="font-medium">{metrics.loadTime}s</span>
          </div>

          {/* Memory Usage */}
          {metrics.memoryUsage > 0 && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-orange-600" />
                <span>Memory</span>
              </div>
              <span className="font-medium">{metrics.memoryUsage} MB</span>
            </div>
          )}

          {/* Cache Size */}
          {metrics.cacheSize > 0 && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <HardDrive className="w-3 h-3 text-purple-600" />
                <span>Cache</span>
              </div>
              <span className="font-medium">{metrics.cacheSize} MB</span>
            </div>
          )}

          {/* Last Sync */}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
              <span>Last Sync</span>
            </div>
            <span className="text-[10px]">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700">
              {metrics.memoryUsage > 100 
                ? 'Memory usage high. Consider closing other tabs.'
                : metrics.loadTime > 5
                ? 'Slow load detected. Check your connection.'
                : 'App running smoothly! 🚀'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
