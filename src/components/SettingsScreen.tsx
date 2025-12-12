import { ArrowLeft, Store, Bell, Palette, Printer, CreditCard, Globe, ChevronRight, LogOut, Database, Download, Upload, Trash2, Receipt, Award, AlertTriangle, Activity, Shield } from 'lucide-react';
import { Screen, StoreInfo } from '../App';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  storeInfo: StoreInfo;
  setStoreInfo: (info: StoreInfo) => void;
}

export function SettingsScreen({ onNavigate, storeInfo, setStoreInfo }: SettingsScreenProps) {
  const settingsOptions = [
    {
      icon: <Store className="w-5 h-5" />,
      title: 'Store Information',
      subtitle: 'Edit store details',
      action: () => onNavigate('store-setup'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: 'GST Settings',
      subtitle: 'Configure GST invoices',
      action: () => onNavigate('gst-settings'),
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'Bill Customization',
      subtitle: 'Logo, colors, template',
      action: () => onNavigate('bill-template'),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Loyalty Program',
      subtitle: 'Reward your customers',
      action: () => onNavigate('loyalty-program'),
      color: 'bg-amber-100 text-amber-600'
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Reorder Alerts',
      subtitle: 'Stock alerts & reminders',
      action: () => onNavigate('reorder-alerts'),
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Data Backup & Export',
      subtitle: 'Secure your business data',
      action: () => onNavigate('data-backup'),
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: 'System Health',
      subtitle: 'Monitor app performance',
      action: () => onNavigate('system-health'),
      color: 'bg-teal-100 text-teal-600'
    },
    {
      icon: <Printer className="w-5 h-5" />,
      title: 'Connect Printer',
      subtitle: 'Bluetooth / POS printer',
      action: () => onNavigate('printer-setup'),
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Subscription Plans',
      subtitle: 'Free / Pro / Automation',
      action: () => onNavigate('subscription'),
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Language / भाषा',
      subtitle: 'Hindi / English / Hinglish',
      action: () => onNavigate('language-switcher'),
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '🔐 Admin Control Panel',
      subtitle: 'Full system management & analytics',
      action: () => onNavigate('admin-panel'),
      color: 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600'
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Notifications',
      subtitle: 'Alert preferences',
      action: () => onNavigate('notifications'),
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const [backupData, setBackupData] = useState<string | null>(null);

  const handleBackup = () => {
    const data = JSON.stringify(storeInfo);
    setBackupData(data);
    toast.success('Backup created successfully!');
  };

  const handleRestore = () => {
    if (backupData) {
      const parsedData: StoreInfo = JSON.parse(backupData);
      setStoreInfo(parsedData);
      toast.success('Data restored successfully!');
    } else {
      toast.error('No backup data available!');
    }
  };

  const handleDeleteBackup = () => {
    setBackupData(null);
    toast.success('Backup deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Settings</h1>
          <div className="w-6" />
        </div>

        {/* Profile Card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
            <span className="text-3xl">🏪</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg">{storeInfo.name}</h3>
            <p className="text-white/80 text-sm">{storeInfo.owner}</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="px-2 py-0.5 bg-green-500 rounded text-white text-xs">Free Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-4">
        {/* Settings Options */}
        <div className="space-y-3">
          {settingsOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center`}>
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-900 mb-0.5">{option.title}</h3>
                  <p className="text-gray-600 text-sm">{option.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-gray-900 mb-3">App Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="text-gray-900">1.0.0 (Lite)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900">12 Nov 2025</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
          <h3 className="text-gray-900 mb-2">Need Help? 🤝</h3>
          <p className="text-gray-600 text-sm mb-3">
            Koi problem hai? Hum yahan madad ke liye hain!
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-white rounded-lg p-3 text-sm text-gray-900 hover:shadow-md transition-shadow">
              📞 Call Support
            </button>
            <button className="bg-white rounded-lg p-3 text-sm text-gray-900 hover:shadow-md transition-shadow">
              💬 Chat Support
            </button>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </button>

        <div className="text-center pt-4 pb-4">
          <p className="text-gray-500 text-xs">
            Powered by Retail Bandhu — Har Dukaan, Digital Dukaan.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Made with ❤️ for Bharat's Retailers
          </p>
        </div>
      </div>
    </div>
  );
}