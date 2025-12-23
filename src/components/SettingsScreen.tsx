import { ArrowLeft, Store, Bell, Palette, Printer, CreditCard, Globe, ChevronRight, LogOut, Database, Download, Upload, Trash2, Receipt, Award, AlertTriangle, Activity, Shield, Mic } from 'lucide-react';
import { Screen, StoreInfo } from '../types';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';
import { VoiceSettings } from './VoiceSettings';
import { logout } from '../utils/auth';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  storeInfo: StoreInfo;
  setStoreInfo: (info: StoreInfo) => void;
  onLogout?: () => void; // Add logout callback prop
}

export function SettingsScreen({ onNavigate, storeInfo, setStoreInfo, onLogout }: SettingsScreenProps) {
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [versionTapCount, setVersionTapCount] = useState(0);
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add loading state for logout

  // Reset tap count after 3 seconds of inactivity
  useEffect(() => {
    if (versionTapCount > 0 && versionTapCount < 7) {
      const timeout = setTimeout(() => {
        setVersionTapCount(0);
      }, 3000);
      setTapTimeout(timeout);
      
      return () => clearTimeout(timeout);
    }
  }, [versionTapCount]);

  // Auto-lock admin mode after 5 minutes
  useEffect(() => {
    if (adminUnlocked) {
      const timeout = setTimeout(() => {
        setAdminUnlocked(false);
        toast.info('🔒 Admin mode locked');
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearTimeout(timeout);
    }
  }, [adminUnlocked]);

  const handleVersionTap = () => {
    const newCount = versionTapCount + 1;
    setVersionTapCount(newCount);

    if (newCount === 7) {
      setAdminUnlocked(true);
      setVersionTapCount(0);
      toast.success('🔓 Admin Mode Unlocked!', {
        description: 'Admin control panel is now available. Auto-locks in 5 minutes.',
        duration: 4000
      });
    } else if (newCount >= 4) {
      // Give a hint after 4 taps
      toast.info(`${7 - newCount} more taps to unlock admin mode...`, {
        duration: 1000
      });
    }
  };
  
  const baseSettingsOptions = [
    {
      icon: <Mic className="w-5 h-5" />,
      title: '🎤 Voice Settings',
      subtitle: 'Control voice features & preferences',
      action: () => setShowVoiceSettings(true),
      color: 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600',
      badge: 'NEW'
    },
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
      icon: <Bell className="w-5 h-5" />,
      title: 'Notifications',
      subtitle: 'Alert preferences',
      action: () => onNavigate('notifications'),
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  // Admin option (only shown when unlocked)
  const adminOption = {
    icon: <Shield className="w-5 h-5" />,
    title: '🔐 Admin Control Panel',
    subtitle: 'Full system management & analytics',
    action: () => onNavigate('admin-panel'),
    color: 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600',
    badge: 'ADMIN'
  };

  // Combine options - add admin only if unlocked
  const settingsOptions = adminUnlocked 
    ? [...baseSettingsOptions, adminOption]
    : baseSettingsOptions;

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-xl">Settings</h1>
            {adminUnlocked && (
              <div className="px-2 py-1 bg-purple-500 rounded-full text-white text-xs font-medium animate-pulse flex items-center gap-1">
                <Shield className="w-3 h-3" />
                ADMIN
              </div>
            )}
          </div>
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
                {option.badge && <div className="px-2 py-0.5 bg-red-500 rounded text-white text-xs">{option.badge}</div>}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-gray-900 mb-3">App Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Version</span>
              <button 
                onClick={handleVersionTap}
                className="text-gray-900 hover:text-blue-600 transition-colors cursor-pointer select-none"
              >
                1.0.0 (Lite)
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900">17 Dec 2024</span>
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
        <button className="w-full bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" onClick={handleLogout}>
          <div className="flex items-center justify-center space-x-2 text-red-600">
            {isLoggingOut ? (
              <div className="animate-spin">
                <LogOut className="w-5 h-5" />
              </div>
            ) : (
              <LogOut className="w-5 h-5" />
            )}
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

      {/* Voice Settings Modal */}
      {showVoiceSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <VoiceSettings onClose={() => setShowVoiceSettings(false)} />
          </div>
        </div>
      )}
    </div>
  );
}