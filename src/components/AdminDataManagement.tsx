import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  Database,
  HardDrive,
  FileDown,
  FileUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Trash2,
  RefreshCw,
  Calendar,
  Users,
  DollarSign,
  Package,
  Settings,
  Save,
} from 'lucide-react';

interface Backup {
  id: string;
  name: string;
  type: 'automatic' | 'manual';
  size: string;
  date: string;
  status: 'completed' | 'in-progress' | 'failed';
  includes: string[];
}

export function AdminDataManagement() {
  const [backups, setBackups] = useState<Backup[]>([
    {
      id: 'bk-1',
      name: 'Daily Automatic Backup',
      type: 'automatic',
      size: '2.4 GB',
      date: '2024-12-10 03:00 AM',
      status: 'completed',
      includes: ['Users', 'Products', 'Bills', 'Settings'],
    },
    {
      id: 'bk-2',
      name: 'Pre-Update Backup',
      type: 'manual',
      size: '2.3 GB',
      date: '2024-12-09 02:15 PM',
      status: 'completed',
      includes: ['Users', 'Products', 'Bills', 'Settings', 'Media'],
    },
    {
      id: 'bk-3',
      name: 'Weekly Backup',
      type: 'automatic',
      size: '2.5 GB',
      date: '2024-12-08 03:00 AM',
      status: 'completed',
      includes: ['Users', 'Products', 'Bills', 'Settings'],
    },
  ]);

  const [exportSettings, setExportSettings] = useState({
    users: true,
    products: true,
    bills: true,
    transactions: true,
    analytics: false,
    settings: false,
  });

  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    toast.loading(`Exporting data as ${format.toUpperCase()}...`, { id: 'export' });
    
    setTimeout(() => {
      const selectedData = Object.entries(exportSettings)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      
      toast.success(
        `Exported ${selectedData.length} data types as ${format.toUpperCase()}`,
        { id: 'export' }
      );
    }, 2000);
  };

  const handleImport = (type: string) => {
    toast.loading(`Importing ${type} data...`, { id: 'import' });
    
    setTimeout(() => {
      toast.success(`${type} data imported successfully!`, { id: 'import' });
    }, 2000);
  };

  const createBackup = () => {
    toast.loading('Creating backup...', { id: 'backup' });
    
    setTimeout(() => {
      const newBackup: Backup = {
        id: `bk-${Date.now()}`,
        name: 'Manual Backup',
        type: 'manual',
        size: '2.4 GB',
        date: new Date().toLocaleString(),
        status: 'completed',
        includes: ['Users', 'Products', 'Bills', 'Settings'],
      };
      
      setBackups([newBackup, ...backups]);
      toast.success('Backup created successfully!', { id: 'backup' });
    }, 3000);
  };

  const restoreBackup = (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;

    toast.loading(`Restoring backup from ${backup.date}...`, { id: 'restore' });
    
    setTimeout(() => {
      toast.success('Backup restored successfully!', { id: 'restore' });
    }, 3000);
  };

  const deleteBackup = (backupId: string) => {
    setBackups(backups.filter(b => b.id !== backupId));
    toast.success('Backup deleted');
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{backups.length}</div>
              <div className="text-sm text-blue-700">Total Backups</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {backups.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">7.2 GB</div>
              <div className="text-sm text-purple-700">Total Size</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">Daily</div>
              <div className="text-sm text-orange-700">Auto Backup</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Export Data */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileDown className="w-5 h-5 text-blue-600" />
          Export Data
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-3">
              Select data types to export. Exported files will be available for download.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {Object.entries(exportSettings).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setExportSettings({ ...exportSettings, [key]: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleExport('csv')}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
              <Button
                onClick={() => handleExport('json')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export as JSON
              </Button>
              <Button
                onClick={() => handleExport('excel')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export as Excel
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Import Data */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileUp className="w-5 h-5 text-green-600" />
          Import Data
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Warning: Importing data will overwrite existing records
                </p>
                <p className="text-xs text-yellow-700">
                  Always create a backup before importing data
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => handleImport('Users')}
            >
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-sm">Import Users</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => handleImport('Products')}
            >
              <Package className="w-6 h-6 text-green-600" />
              <span className="text-sm">Import Products</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => handleImport('Transactions')}
            >
              <DollarSign className="w-6 h-6 text-purple-600" />
              <span className="text-sm">Import Transactions</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => handleImport('Settings')}
            >
              <Settings className="w-6 h-6 text-orange-600" />
              <span className="text-sm">Import Settings</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Backup & Restore */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Backup & Restore
          </h3>
          <Button onClick={createBackup} className="bg-blue-600">
            <Save className="w-4 h-4 mr-2" />
            Create Backup Now
          </Button>
        </div>

        <div className="space-y-3">
          {backups.map((backup) => (
            <Card key={backup.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-900">{backup.name}</h4>
                    <Badge
                      className={
                        backup.type === 'automatic' ? 'bg-blue-500' : 'bg-purple-500'
                      }
                    >
                      {backup.type}
                    </Badge>
                    <Badge
                      className={
                        backup.status === 'completed'
                          ? 'bg-green-500'
                          : backup.status === 'in-progress'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }
                    >
                      {backup.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-600">Date</div>
                      <div className="text-sm font-medium text-gray-900">
                        {backup.date}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Size</div>
                      <div className="text-sm font-medium text-gray-900">
                        {backup.size}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-600 mb-1">Includes</div>
                      <div className="flex flex-wrap gap-1">
                        {backup.includes.map((item) => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="text-xs bg-gray-50"
                          >
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreBackup(backup.id)}
                    disabled={backup.status !== 'completed'}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Restore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Downloading backup...')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBackup(backup.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Automatic Backup Settings */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Automatic Backup Settings
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Backup Frequency
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option>Daily at 3:00 AM</option>
                <option>Every 12 hours</option>
                <option>Every 6 hours</option>
                <option>Weekly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Retention Period
              </label>
              <select className="w-full p-2 border rounded-lg">
                <option>Keep last 7 backups</option>
                <option>Keep last 14 backups</option>
                <option>Keep last 30 backups</option>
                <option>Keep all backups</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">Enable automatic backups</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">Email notification on backup completion</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Upload backups to cloud storage</span>
            </label>
          </div>

          <Button className="bg-blue-600">
            <Save className="w-4 h-4 mr-2" />
            Save Backup Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
