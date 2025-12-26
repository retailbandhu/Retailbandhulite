import { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  HardDrive, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  ArrowLeft,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  databaseManager,
  runDatabaseHealthCheck,
  migrateToDatabase,
  enableDatabase,
  disableDatabase,
  isDatabaseSyncEnabled 
} from '../utils/databaseIntegration';
import type { Screen } from '../types';

interface DatabaseSettingsProps {
  onNavigate: (screen: Screen) => void;
}

export function DatabaseSettings({ onNavigate }: DatabaseSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [syncEnabled, setSyncEnabled] = useState(isDatabaseSyncEnabled());

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const status = await runDatabaseHealthCheck();
      setHealthStatus(status);
      console.log('📊 Database Health Status:', status);
    } catch (error) {
      console.error('Health check error:', error);
      toast.error('Failed to check database health');
    } finally {
      setLoading(false);
    }
  };

  const handleMigrate = async () => {
    if (!confirm('This will migrate all your data from local storage to the cloud database. Continue?')) {
      return;
    }

    setMigrating(true);
    try {
      const result = await migrateToDatabase();
      
      if (result.success) {
        toast.success(
          `Migration complete! Migrated ${result.migrated.products} products, ` +
          `${result.migrated.customers} customers, ${result.migrated.bills} bills`
        );
        enableDatabase();
        setSyncEnabled(true);
        await checkHealth();
      } else {
        toast.error(`Migration completed with errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  const handleToggleSync = () => {
    if (syncEnabled) {
      disableDatabase();
      setSyncEnabled(false);
      toast.success('Database sync disabled - using local storage only');
    } else {
      enableDatabase();
      setSyncEnabled(true);
      toast.success('Database sync enabled - data will sync to cloud');
    }
  };

  const handleSyncNow = async () => {
    setLoading(true);
    try {
      await databaseManager.syncFromDatabase();
      toast.success('Data synced from database!');
      await checkHealth();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const backup = await databaseManager.createBackup();
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `retail-bandhu-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Backup downloaded!');
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Backup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate('settings')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Database & Sync</h1>
            <p className="text-sm text-white/90">Manage your cloud database connection</p>
          </div>
          <Database className="w-8 h-8" />
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        {/* Connection Status Card */}
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Connection Status
            </h2>
            <Button
              onClick={checkHealth}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {healthStatus && (
            <div className="space-y-3">
              {/* Server Health */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Server Health</span>
                {healthStatus.serverHealthy ? (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                ) : (
                  <Badge className="bg-red-500">
                    <XCircle className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>

              {/* Database Connected */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Database Connected</span>
                {healthStatus.connected ? (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge className="bg-red-500">
                    <XCircle className="w-3 h-3 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </div>

              {/* Last Sync */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Last Sync</span>
                <span className="text-sm text-gray-600">
                  {healthStatus.lastSync 
                    ? new Date(healthStatus.lastSync).toLocaleString()
                    : 'Never'
                  }
                </span>
              </div>

              {/* Pending Changes */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Pending Changes</span>
                <Badge variant="outline">
                  {healthStatus.pendingChanges} changes
                </Badge>
              </div>

              {/* Feature Status */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Feature Availability</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(healthStatus.features).map(([feature, available]) => (
                    <div key={feature} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      {available ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs capitalize">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Errors */}
              {healthStatus.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-900">Errors</span>
                  </div>
                  <ul className="text-xs text-red-700 space-y-1">
                    {healthStatus.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Sync Settings Card */}
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            Sync Settings
          </h2>

          {/* Sync Toggle */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold">Cloud Sync</h3>
                <p className="text-sm text-gray-600">
                  {syncEnabled 
                    ? 'Data automatically syncs to cloud database'
                    : 'Using local storage only (offline mode)'
                  }
                </p>
              </div>
              <Button
                onClick={handleToggleSync}
                variant={syncEnabled ? 'default' : 'outline'}
                className={syncEnabled ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {syncEnabled ? (
                  <>
                    <Cloud className="w-4 h-4 mr-2" />
                    Enabled
                  </>
                ) : (
                  <>
                    <HardDrive className="w-4 h-4 mr-2" />
                    Disabled
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sync Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleSyncNow}
              disabled={loading || !syncEnabled}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync Now from Cloud
            </Button>

            <Button
              onClick={handleMigrate}
              disabled={migrating || !healthStatus?.connected}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Upload className={`w-4 h-4 mr-2 ${migrating ? 'animate-bounce' : ''}`} />
              {migrating ? 'Migrating...' : 'Migrate Local Data to Cloud'}
            </Button>
          </div>

          {databaseManager.isMigrationNeeded() && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-900">Migration Available</span>
              </div>
              <p className="text-xs text-orange-700">
                You have local data that hasn't been migrated to the cloud. Click "Migrate" to upload it.
              </p>
            </div>
          )}
        </Card>

        {/* Backup & Restore Card */}
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Backup & Restore
          </h2>

          <div className="space-y-3">
            <Button
              onClick={handleBackup}
              disabled={loading || !healthStatus?.features.backup}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Backup
            </Button>

            <p className="text-xs text-gray-600 text-center">
              Creates a JSON file with all your data (products, customers, bills, settings)
            </p>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How Database Sync Works</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• <strong>Cloud Sync ON:</strong> All changes saved to cloud instantly</li>
                <li>• <strong>Cloud Sync OFF:</strong> Data stored locally on your device only</li>
                <li>• <strong>Offline Mode:</strong> Works offline, syncs when online</li>
                <li>• <strong>Migration:</strong> One-time upload of existing local data</li>
                <li>• <strong>Backup:</strong> Download complete copy of your data</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Technical Details */}
        {healthStatus && (
          <Card className="p-4 bg-gray-50">
            <details className="text-xs text-gray-600">
              <summary className="font-semibold cursor-pointer">Technical Details</summary>
              <pre className="mt-2 p-2 bg-white rounded overflow-auto">
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            </details>
          </Card>
        )}
      </div>
    </div>
  );
}
