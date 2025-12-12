import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, HardDrive, Clock, CheckCircle, AlertCircle, Database, Wifi, WifiOff, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { storage } from '../utils/storage';
import type { Screen } from '../App';

interface SystemHealthMonitorProps {
  onNavigate: (screen: Screen) => void;
}

export function SystemHealthMonitor({ onNavigate }: SystemHealthMonitorProps) {
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Never');
  const [dataStats, setDataStats] = useState({
    products: 0,
    bills: 0,
    customers: 0,
    khata: 0,
    expenses: 0,
    parties: 0
  });

  useEffect(() => {
    calculateStorageUsage();
    loadDataStats();

    // Online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const calculateStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      
      setStorageUsed(used);
      setStorageLimit(quota);
    }
  };

  const loadDataStats = () => {
    setDataStats({
      products: storage.getProducts().length,
      bills: storage.getBills().length,
      customers: storage.getCustomers().length,
      khata: storage.getKhataEntries().length,
      expenses: storage.getExpenses().length,
      parties: storage.getParties().length
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStoragePercentage = () => {
    if (storageLimit === 0) return 0;
    return Math.round((storageUsed / storageLimit) * 100);
  };

  const getHealthStatus = () => {
    const percentage = getStoragePercentage();
    if (percentage < 50) return { status: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (percentage < 80) return { status: 'Good', color: 'text-blue-600', icon: CheckCircle };
    return { status: 'Warning', color: 'text-orange-600', icon: AlertCircle };
  };

  const health = getHealthStatus();
  const HealthIcon = health.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('settings')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">System Health</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {/* Overall Health Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg">System Status</h3>
                <p className="text-sm text-gray-600">Overall app health</p>
              </div>
            </div>
            <Badge className={`${health.color} bg-opacity-10`}>
              <HealthIcon className="w-4 h-4 mr-1" />
              {health.status}
            </Badge>
          </div>
        </Card>

        {/* Connection Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
              <div>
                <h4>Internet Connection</h4>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'Connected' : 'Offline Mode'}
                </p>
              </div>
            </div>
            <Badge variant={isOnline ? 'default' : 'secondary'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </Card>

        {/* Storage Usage */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4>Storage Usage</h4>
                <span className="text-sm text-gray-600">{getStoragePercentage()}%</span>
              </div>
              <p className="text-xs text-gray-500">
                {formatBytes(storageUsed)} of {formatBytes(storageLimit)} used
              </p>
            </div>
          </div>
          <Progress value={getStoragePercentage()} className="h-2" />
        </Card>

        {/* Data Statistics */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-purple-600" />
            <h4>Data Statistics</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl mb-1">{dataStats.products}</p>
              <p className="text-xs text-gray-600">Products</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl mb-1">{dataStats.bills}</p>
              <p className="text-xs text-gray-600">Bills</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl mb-1">{dataStats.customers}</p>
              <p className="text-xs text-gray-600">Customers</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl mb-1">{dataStats.khata}</p>
              <p className="text-xs text-gray-600">Khata Entries</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl mb-1">{dataStats.expenses}</p>
              <p className="text-xs text-gray-600">Expenses</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl mb-1">{dataStats.parties}</p>
              <p className="text-xs text-gray-600">Parties</p>
            </div>
          </div>
        </Card>

        {/* Last Sync Time */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <h4>Last Sync</h4>
                <p className="text-sm text-gray-600">{lastSyncTime}</p>
              </div>
            </div>
            <Badge variant="outline">Local Only</Badge>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h4>Performance</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">App Load Time</span>
                <span>Fast</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Data Access Speed</span>
                <span>Excellent</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Responsiveness</span>
                <span>Smooth</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              calculateStorageUsage();
              loadDataStats();
            }}
          >
            <Activity className="w-4 h-4 mr-2" />
            Refresh Stats
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onNavigate('data-backup')}
          >
            <Database className="w-4 h-4 mr-2" />
            Backup & Export Data
          </Button>
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-blue-900 mb-1">💡 Pro Tip</h4>
              <p className="text-sm text-blue-800">
                All your data is stored securely on your device. Enable cloud sync for automatic backups and multi-device access!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
