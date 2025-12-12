import { useState } from 'react';
import { ArrowLeft, Bell, Package, TrendingUp, AlertCircle, MessageCircle, Check, Trash2, Settings as SettingsIcon, X, Filter } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: string;
  type: 'low_stock' | 'payment_due' | 'sales_milestone' | 'whatsapp' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: string;
  icon: JSX.Element;
  color: string;
}

interface NotificationCenterProps {
  onNavigate: (screen: Screen) => void;
}

export function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'Maggie ki stock kam hai - sirf 8 packets bache hain',
      time: '10 minutes ago',
      read: false,
      action: 'Add Stock',
      icon: <Package className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: '2',
      type: 'payment_due',
      title: 'Payment Due Reminder',
      message: 'Ramesh Kumar ka ₹450 pending hai - 2 din se',
      time: '1 hour ago',
      read: false,
      action: 'Send Reminder',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'from-red-500 to-red-600'
    },
    {
      id: '3',
      type: 'sales_milestone',
      title: 'Sales Milestone! 🎉',
      message: 'Aaj aapki sales ₹5,000 cross kar gayi!',
      time: '2 hours ago',
      read: false,
      action: 'View Report',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: '4',
      type: 'whatsapp',
      title: 'WhatsApp Broadcast Sent',
      message: '50 customers ko offer message bhej diya gaya',
      time: '3 hours ago',
      read: true,
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'from-green-400 to-green-500'
    },
    {
      id: '5',
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'Pepsi 250ml ki stock kam hai - sirf 5 bottles',
      time: '5 hours ago',
      read: true,
      action: 'Add Stock',
      icon: <Package className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: '6',
      type: 'system',
      title: 'Pro Features Available',
      message: 'WhatsApp automation aur advanced reports try karein',
      time: '1 day ago',
      read: true,
      action: 'Upgrade',
      icon: <Bell className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationAction = (notification: Notification) => {
    if (notification.type === 'low_stock') {
      onNavigate('inventory');
    } else if (notification.type === 'payment_due') {
      onNavigate('khata');
    } else if (notification.type === 'sales_milestone') {
      onNavigate('reports');
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Notifications</h1>
          <div className="w-6" />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Bell className="w-5 h-5 text-white" />
          <p className="text-white/90">{unreadCount} unread notifications</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-4">
        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <h3 className="text-gray-700">New Notifications</h3>
            <button className="text-[#1E88E5] text-sm flex items-center space-x-1" onClick={markAllAsRead}>
              <Check className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                !notification.read ? 'ring-2 ring-[#1E88E5]/20' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${notification.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#1E88E5] rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs">{notification.time}</p>
                  </div>
                </div>

                {notification.action && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button
                      onClick={() => handleNotificationAction(notification)}
                      className="w-full bg-gradient-to-r from-[#1E88E5]/10 to-[#FF6F00]/10 text-[#1E88E5] hover:from-[#1E88E5]/20 hover:to-[#FF6F00]/20 h-9"
                    >
                      {notification.action}
                    </Button>
                  </div>
                )}
              </div>
              <div className="absolute top-2 right-2">
                <button className="text-gray-400 hover:text-gray-500" onClick={() => deleteNotification(notification.id)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for all read */}
        {notifications.every(n => n.read) && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 text-center border border-green-200 mt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600 text-sm">
              Koi naya notification nahi hai
            </p>
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-md p-4 mt-6">
          <h4 className="text-gray-900 mb-3">Notification Preferences</h4>
          <div className="space-y-3">
            {[
              { label: 'Low Stock Alerts', enabled: true },
              { label: 'Payment Due Reminders', enabled: true },
              { label: 'Sales Milestones', enabled: true },
              { label: 'WhatsApp Updates', enabled: false },
              { label: 'System Notifications', enabled: false }
            ].map((pref, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-gray-700 text-sm">{pref.label}</span>
                <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  pref.enabled ? 'bg-[#1E88E5]' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${
                    pref.enabled ? 'translate-x-6 ml-1' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}