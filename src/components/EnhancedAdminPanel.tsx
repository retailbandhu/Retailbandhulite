import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Screen } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { AdminAnalyticsAdvanced } from './AdminAnalyticsAdvanced';
import { AdminUserMonitoring } from './AdminUserMonitoring';
import { AdminBulkOperations } from './AdminBulkOperations';
import { AdminSecurityPanel } from './AdminSecurityPanel';
import { AdminCommandPalette } from './AdminCommandPalette';
import { AdminSubscriptionManagement } from './AdminSubscriptionManagement';
import { AdminAPIIntegrations } from './AdminAPIIntegrations';
import { AdminContentCMS } from './AdminContentCMS';
import { AdminDataManagement } from './AdminDataManagement';
import { AdminAnnouncementCenter } from './AdminAnnouncementCenter';
import { AdminCouponManager } from './AdminCouponManager';
import { AdminTransactionViewer } from './AdminTransactionViewer';
import { AdminSupportTickets } from './AdminSupportTickets';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  DollarSign,
  Bell,
  Shield,
  Zap,
  Package,
  MessageSquare,
  FileText,
  Globe,
  Activity,
  Database,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  MoreVertical,
  Copy,
  ExternalLink,
  Target,
  Layers,
  Clock,
  Server,
  Terminal,
  Code,
  Webhook,
  Command,
} from 'lucide-react';

const API_BASE_URL = '/api/admin';

interface AdminPanelProps {
  onNavigate: (screen: Screen) => void;
}

type AdminTab = 
  | 'overview'
  | 'users'
  | 'stores'
  | 'features'
  | 'subscriptions'
  | 'content'
  | 'analytics'
  | 'system'
  | 'security'
  | 'notifications'
  | 'api'
  | 'database'
  | 'logs';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  plan: 'free' | 'pro' | 'automation';
  status: 'active' | 'suspended' | 'trial';
  joinedDate: string;
  lastActive: string;
  revenue: number;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  userPercentage: number;
  category: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  target: string;
  details: string;
  status: 'success' | 'failure';
}

export function EnhancedAdminPanel({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowNotifications(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Real data from database
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalBills: 0,
    totalRevenue: 0,
    todayBills: 0,
    averageSessionTime: '12.5 min',
    errorRate: 0.3,
    apiResponseTime: '245ms',
    systemUptime: '99.98%',
    storageUsed: '34.2 GB',
  });

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [allBills, setAllBills] = useState<any[]>([]);

  // Check if user is admin on mount
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/check`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
          if (data.isAdmin) {
            fetchAllData();
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, usersRes, storesRes, billsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/stats`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/users`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/stores`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/bills`, { credentials: 'include' }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(prev => ({ ...prev, ...statsData }));
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAllUsers(usersData);
      }
      if (storesRes.ok) {
        const storesData = await storesRes.json();
        setAllStores(storesData);
      }
      if (billsRes.ok) {
        const billsData = await billsRes.json();
        setAllBills(billsData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to fetch admin data');
    }
  };

  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    database: 'operational',
    api: 'operational', 
    storage: 'operational',
    cache: 'operational',
    lastCheck: new Date().toISOString(),
  });

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    if (activeTab === 'overview') {
      const interval = setInterval(() => {
        refreshMetrics();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const refreshMetrics = async () => {
    if (isAdmin) {
      await fetchAllData();
      toast.success('Data refreshed');
    }
  };

  const logAction = (action: string, target: string, details: string, status: 'success' | 'failure' = 'success') => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      admin: 'Super Admin',
      action,
      target,
      details,
      status,
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ramesh Sharma',
      email: 'ramesh@example.com',
      phone: '+91 98765 43210',
      storeName: 'Sharma Kirana Store',
      plan: 'pro',
      status: 'active',
      joinedDate: '2024-10-15',
      lastActive: '2 hours ago',
      revenue: 999,
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      storeName: 'Patel General Store',
      plan: 'automation',
      status: 'active',
      joinedDate: '2024-11-01',
      lastActive: '5 minutes ago',
      revenue: 1998,
    },
    {
      id: '3',
      name: 'Suresh Kumar',
      email: 'suresh@example.com',
      phone: '+91 98765 43212',
      storeName: 'Kumar Provision Store',
      plan: 'free',
      status: 'trial',
      joinedDate: '2024-12-08',
      lastActive: '1 day ago',
      revenue: 0,
    },
  ]);

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'voice-billing',
      name: 'Voice Billing',
      description: 'AI-powered voice input for creating bills',
      enabled: true,
      userPercentage: 100,
      category: 'Core Features',
    },
    {
      id: 'whatsapp-automation',
      name: 'WhatsApp Automation',
      description: 'Automated WhatsApp marketing campaigns',
      enabled: true,
      userPercentage: 75,
      category: 'Marketing',
    },
    {
      id: 'barcode-scanner',
      name: 'Barcode Scanner',
      description: 'Camera-based barcode scanning',
      enabled: true,
      userPercentage: 90,
      category: 'Inventory',
    },
    {
      id: 'ai-insights',
      name: 'AI Business Insights',
      description: 'AI-powered business recommendations',
      enabled: false,
      userPercentage: 10,
      category: 'Analytics',
    },
    {
      id: 'loyalty-program',
      name: 'Loyalty Program',
      description: 'Customer rewards and points system',
      enabled: true,
      userPercentage: 50,
      category: 'Customer Management',
    },
    {
      id: 'multi-store',
      name: 'Multi-Store Management',
      description: 'Manage multiple store locations',
      enabled: false,
      userPercentage: 0,
      category: 'Core Features',
    },
  ]);

  const [appConfig, setAppConfig] = useState({
    maintenanceMode: false,
    forceUpdate: false,
    minVersion: '1.0.0',
    maxProductsPerStore: 5000,
    maxBillsPerMonth: 1000,
    enableSignup: true,
    enableSocialLogin: true,
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'hi', 'hinglish'],
    whatsappApiEnabled: true,
    smsNotificationsEnabled: true,
    emailNotificationsEnabled: true,
  });

  const toggleFeature = (featureId: string) => {
    setFeatureFlags(prev =>
      prev.map(f =>
        f.id === featureId ? { ...f, enabled: !f.enabled } : f
      )
    );
    toast.success('Feature flag updated');
  };

  const updateUserPercentage = (featureId: string, percentage: number) => {
    setFeatureFlags(prev =>
      prev.map(f =>
        f.id === featureId ? { ...f, userPercentage: percentage } : f
      )
    );
  };

  const toggleMaintenanceMode = () => {
    setAppConfig(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    toast.success(
      appConfig.maintenanceMode
        ? 'Maintenance mode disabled'
        : 'Maintenance mode enabled'
    );
  };

  const suspendUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u
      )
    );
    toast.success('User status updated');
  };

  const changeUserPlan = (userId: string, plan: 'free' | 'pro' | 'automation') => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, plan } : u)));
    toast.success('User plan updated');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'stores', label: 'Store Management', icon: Package },
    { id: 'features', label: 'Feature Flags', icon: Zap },
    { id: 'subscriptions', label: 'Subscriptions', icon: DollarSign },
    { id: 'content', label: 'Content CMS', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'system', label: 'System Config', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API & Integrations', icon: Database },
    { id: 'database', label: 'Database Management', icon: Server },
    { id: 'logs', label: 'Audit Logs', icon: Terminal },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats - Real Data from Database */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <Badge className="bg-blue-600">Live</Badge>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-1">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">Total Users</div>
          <div className="text-xs text-blue-600 mt-2">
            {stats.totalStores.toLocaleString()} stores created
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <Badge className="bg-green-600">Live</Badge>
          </div>
          <div className="text-3xl font-bold text-green-900 mb-1">
            ₹{stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-green-700">Total Revenue</div>
          <div className="text-xs text-green-600 mt-2">
            {stats.totalBills.toLocaleString()} bills generated
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-purple-600" />
            <Badge className="bg-purple-600">Live</Badge>
          </div>
          <div className="text-3xl font-bold text-purple-900 mb-1">
            {stats.totalProducts.toLocaleString()}
          </div>
          <div className="text-sm text-purple-700">Total Products</div>
          <div className="text-xs text-purple-600 mt-2">
            {stats.totalCustomers.toLocaleString()} customers
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <Badge className="bg-orange-600">Today</Badge>
          </div>
          <div className="text-3xl font-bold text-orange-900 mb-1">
            {stats.todayBills}
          </div>
          <div className="text-sm text-orange-700">Bills Today</div>
          <div className="text-xs text-orange-600 mt-2">System uptime: {stats.systemUptime}</div>
        </Card>
      </div>

      {/* Store Distribution */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Platform Overview
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Active Stores</span>
              <span className="text-sm text-gray-600">
                {allStores.length} stores
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: allStores.length > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Registered Users</span>
              <span className="text-sm text-gray-600">
                {allUsers.length} users
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: allUsers.length > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Recent Transactions</span>
              <span className="text-sm text-gray-600">
                {allBills.length} bills (last 100)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{ width: allBills.length > 0 ? `${Math.min(allBills.length, 100)}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-start"
            onClick={() => setActiveTab('users')}
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-start"
            onClick={() => setActiveTab('features')}
          >
            <Zap className="w-4 h-4" />
            Feature Flags
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-start"
            onClick={toggleMaintenanceMode}
          >
            {appConfig.maintenanceMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {appConfig.maintenanceMode ? 'Disable' : 'Enable'} Maintenance
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-start"
            onClick={() => toast.info('Export started...')}
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </Card>
    </div>
  );

  const filteredUsers = allUsers.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    return fullName.includes(query) || 
           (user.email || '').toLowerCase().includes(query) ||
           user.stores?.some((s: any) => s.name.toLowerCase().includes(query));
  });

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users by name, email, store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={refreshMetrics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Users Table - Real Data */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">All Users ({allUsers.length})</h3>
          <Badge className="bg-green-600">Live Data</Badge>
        </div>

        {allUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No users found in database</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {(user.firstName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.email || 'Unknown User'}
                        </span>
                        <Badge className="bg-blue-500">
                          {user.storeCount} store{user.storeCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <div>{user.email || 'No email'}</div>
                        <div className="flex items-center gap-4">
                          <span>Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                          {user.stores?.length > 0 && (
                            <span>Store: {user.stores[0].name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (user.stores?.length > 0) {
                          toast.info(`User has ${user.storeCount} store(s): ${user.stores.map((s: any) => s.name).join(', ')}`);
                        } else {
                          toast.info('User has no stores');
                        }
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');

  const filteredStores = allStores.filter(store => {
    if (!storeSearchQuery) return true;
    const query = storeSearchQuery.toLowerCase();
    return store.name?.toLowerCase().includes(query) || 
           store.owner?.toLowerCase().includes(query) ||
           store.address?.toLowerCase().includes(query);
  });

  const updateStore = async (storeId: number, updates: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        toast.success('Store updated successfully');
        fetchAllData();
        setSelectedStore(null);
      } else {
        toast.error('Failed to update store');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('Failed to update store');
    }
  };

  const renderStores = () => (
    <div className="space-y-6">
      {/* Search & Filters */}
      <Card className="p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search stores by name, owner, address..."
              value={storeSearchQuery}
              onChange={(e) => setStoreSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={refreshMetrics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Stores Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-900">{allStores.length}</div>
              <div className="text-sm text-blue-700">Total Stores</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-900">
                ₹{allStores.reduce((sum, s) => sum + (s.totalRevenue || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-green-700">Total Revenue</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {allStores.reduce((sum, s) => sum + (s.billCount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Total Bills</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Store Edit Modal */}
      {selectedStore && (
        <Card className="p-6 border-2 border-blue-500 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-600" />
              Edit Store: {selectedStore.name}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedStore(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Store Name</label>
              <Input
                value={selectedStore.name || ''}
                onChange={(e) => setSelectedStore({ ...selectedStore, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Owner Name</label>
              <Input
                value={selectedStore.owner || ''}
                onChange={(e) => setSelectedStore({ ...selectedStore, owner: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={selectedStore.phone || ''}
                onChange={(e) => setSelectedStore({ ...selectedStore, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">GSTIN</label>
              <Input
                value={selectedStore.gstin || ''}
                onChange={(e) => setSelectedStore({ ...selectedStore, gstin: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <Textarea
                value={selectedStore.address || ''}
                onChange={(e) => setSelectedStore({ ...selectedStore, address: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              className="bg-blue-600"
              onClick={() => updateStore(selectedStore.id, {
                name: selectedStore.name,
                owner: selectedStore.owner,
                phone: selectedStore.phone,
                gstin: selectedStore.gstin,
                address: selectedStore.address,
              })}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setSelectedStore(null)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Stores Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">All Stores ({allStores.length})</h3>
          <Badge className="bg-green-600">Live Data</Badge>
        </div>

        {allStores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No stores found in database</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStores.map((store) => (
              <Card key={store.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: store.billColor || '#1E88E5' }}
                    >
                      {(store.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{store.name || 'Unnamed Store'}</span>
                        <Badge className="bg-blue-500">ID: {store.id}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        <div className="flex items-center gap-4">
                          <span>Owner: {store.owner || 'N/A'}</span>
                          <span>Phone: {store.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{store.productCount || 0} products</span>
                          <span>{store.customerCount || 0} customers</span>
                          <span>{store.billCount || 0} bills</span>
                          <span className="font-medium text-green-600">₹{(store.totalRevenue || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStore(store)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.info(`Store Details:\nProducts: ${store.productCount}\nCustomers: ${store.customerCount}\nBills: ${store.billCount}\nRevenue: ₹${store.totalRevenue?.toLocaleString()}`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Feature Flags Control</h3>
            <p className="text-sm text-blue-700">
              Enable/disable features and control rollout percentage. Changes take effect immediately.
            </p>
          </div>
        </div>
      </Card>

      {(Object.entries(
        featureFlags.reduce((acc, flag) => {
          if (!acc[flag.category]) acc[flag.category] = [];
          acc[flag.category].push(flag);
          return acc;
        }, {} as Record<string, FeatureFlag[]>)
      ) as [string, FeatureFlag[]][]).map(([category, flags]) => (
        <Card key={category} className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            {category}
          </h3>
          <div className="space-y-4">
            {flags.map((flag) => (
              <div key={flag.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{flag.name}</h4>
                      {flag.enabled ? (
                        <Badge className="bg-green-500">Enabled</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{flag.description}</p>
                  </div>
                  <Button
                    onClick={() => toggleFeature(flag.id)}
                    variant={flag.enabled ? 'default' : 'outline'}
                    className={flag.enabled ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {flag.enabled ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rollout Percentage</span>
                    <span className="font-bold text-gray-900">{flag.userPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={flag.userPercentage}
                      onChange={(e) => updateUserPercentage(flag.id, parseInt(e.target.value))}
                      className="flex-1"
                      disabled={!flag.enabled}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={flag.userPercentage}
                      onChange={(e) =>
                        updateUserPercentage(flag.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))
                      }
                      className="w-20"
                      disabled={!flag.enabled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          System Configuration
        </h3>

        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Maintenance Mode</h4>
                <p className="text-sm text-gray-600">
                  Enable to block user access during updates
                </p>
              </div>
              <Button
                onClick={toggleMaintenanceMode}
                variant={appConfig.maintenanceMode ? 'default' : 'outline'}
                className={appConfig.maintenanceMode ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {appConfig.maintenanceMode ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            </div>
            {appConfig.maintenanceMode && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                ⚠️ App is currently in maintenance mode. Users cannot access the app.
              </div>
            )}
          </div>

          {/* Force Update */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Force Update</h4>
                <p className="text-sm text-gray-600">
                  Require users to update to minimum version
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setAppConfig(prev => ({ ...prev, forceUpdate: !prev.forceUpdate }));
                  toast.success('Force update toggled');
                }}
              >
                {appConfig.forceUpdate ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium text-gray-700">Minimum Version</label>
              <Input
                value={appConfig.minVersion}
                onChange={(e) => setAppConfig(prev => ({ ...prev, minVersion: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Limits */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Resource Limits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Max Products Per Store</label>
                <Input
                  type="number"
                  value={appConfig.maxProductsPerStore}
                  onChange={(e) =>
                    setAppConfig(prev => ({ ...prev, maxProductsPerStore: parseInt(e.target.value) }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Max Bills Per Month</label>
                <Input
                  type="number"
                  value={appConfig.maxBillsPerMonth}
                  onChange={(e) =>
                    setAppConfig(prev => ({ ...prev, maxBillsPerMonth: parseInt(e.target.value) }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Authentication */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Authentication</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={appConfig.enableSignup}
                  onChange={(e) =>
                    setAppConfig(prev => ({ ...prev, enableSignup: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Enable User Signups</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={appConfig.enableSocialLogin}
                  onChange={(e) =>
                    setAppConfig(prev => ({ ...prev, enableSocialLogin: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Enable Social Login (Google, Facebook)</span>
              </label>
            </div>
          </div>

          {/* Integrations */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">Integrations</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={appConfig.whatsappApiEnabled}
                  onChange={(e) =>
                    setAppConfig(prev => ({ ...prev, whatsappApiEnabled: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">WhatsApp API Integration</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={appConfig.smsNotificationsEnabled}
                  onChange={(e) =>
                    setAppConfig(prev => ({ ...prev, smsNotificationsEnabled: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">SMS Notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={appConfig.emailNotificationsEnabled}
                  onChange={(e) =>
                    setAppConfig(prev => ({ ...prev, emailNotificationsEnabled: e.target.checked }))
                  }
                  className="rounded"
                />
                <span className="text-sm">Email Notifications</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-600">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Content Management</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onNavigate('admin-panel')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Edit Landing Page
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Manage Blog Posts
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp Templates
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Bell className="w-4 h-4 mr-2" />
            Notification Templates
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderDatabase = () => (
    <div className="space-y-6">
      {/* Database Stats - Real Data */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Database Statistics
          </h3>
          <Badge className="bg-green-500">Live Data</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Users</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalStores}</div>
            <div className="text-sm text-gray-600">Stores</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalProducts.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalCustomers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Customers</div>
          </div>
          <div className="p-4 bg-pink-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.totalBills.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Bills</div>
          </div>
          <div className="p-4 bg-teal-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-teal-600">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.todayBills}</div>
            <div className="text-sm text-gray-600">Bills Today</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{allBills.length}</div>
            <div className="text-sm text-gray-600">Recent Bills</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          System Health
        </h3>

        <div className="space-y-6">
          {/* Database Health */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Database Health</h4>
                <p className="text-sm text-gray-600">
                  PostgreSQL database status
                </p>
              </div>
              <Badge
                className={
                  systemHealth.database === 'operational'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }
              >
                {systemHealth.database}
              </Badge>
            </div>
          </div>

          {/* API Health */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">API Health</h4>
                <p className="text-sm text-gray-600">
                  Check the status of the API
                </p>
              </div>
              <Badge
                className={
                  systemHealth.api === 'operational'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }
              >
                {systemHealth.api}
              </Badge>
            </div>
          </div>

          {/* Storage Health */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Storage Health</h4>
                <p className="text-sm text-gray-600">
                  Check the status of the storage
                </p>
              </div>
              <Badge
                className={
                  systemHealth.storage === 'operational'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }
              >
                {systemHealth.storage}
              </Badge>
            </div>
          </div>

          {/* Cache Health */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Cache Health</h4>
                <p className="text-sm text-gray-600">
                  Check the status of the cache
                </p>
              </div>
              <Badge
                className={
                  systemHealth.cache === 'operational'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }
              >
                {systemHealth.cache}
              </Badge>
            </div>
          </div>

          {/* Last Check */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Last Check</h4>
                <p className="text-sm text-gray-600">
                  Last health check timestamp
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(systemHealth.lastCheck).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Health
            </Button>
            <Button variant="outline">
              <Terminal className="w-4 h-4 mr-2" />
              Open Terminal
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600" />
          Audit Logs
        </h3>

        <div className="space-y-6">
          {/* Auto Refresh */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Auto Refresh</h4>
                <p className="text-sm text-gray-600">
                  Enable to automatically refresh logs
                </p>
              </div>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? 'default' : 'outline'}
                className={autoRefresh ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {autoRefresh ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="p-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <Badge
                      className={
                        log.status === 'success'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-bold">{log.admin}</span> {log.action} <span className="font-bold">{log.target}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Logs
            </Button>
            <Button variant="outline">
              <Terminal className="w-4 h-4 mr-2" />
              Open Terminal
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the Admin Panel. 
            Only the first registered user or designated admins can access this area.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/api/login'} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Login with Replit
            </Button>
            <Button onClick={() => onNavigate('marketing')} variant="outline" className="w-full">
              ← Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => onNavigate('marketing')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                ← Back
              </Button>
              <div className="h-8 w-px bg-white/30" />
              <div>
                <h1 className="text-xl font-bold">Admin Control Panel</h1>
                <p className="text-xs text-white/80">Retail Bandhu Lite Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white">
                <Activity className="w-3 h-3 mr-1" />
                {stats.totalUsers} users
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={refreshMetrics}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              {appConfig.maintenanceMode && (
                <Badge className="bg-red-500">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Maintenance Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <Card className="p-2 sticky top-24">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && <AdminUserMonitoring />}
            {activeTab === 'stores' && renderStores()}
            {activeTab === 'features' && renderFeatures()}
            {activeTab === 'system' && renderSystem()}
            {activeTab === 'content' && <AdminContentCMS />}
            {activeTab === 'subscriptions' && <AdminSubscriptionManagement />}
            {activeTab === 'analytics' && <AdminAnalyticsAdvanced stats={stats} bills={allBills} stores={allStores} users={allUsers} />}
            {activeTab === 'security' && <AdminSecurityPanel />}
            {activeTab === 'notifications' && <AdminBulkOperations />}
            {activeTab === 'api' && <AdminAPIIntegrations />}
            {activeTab === 'database' && renderDatabase()}
            {activeTab === 'logs' && renderLogs()}
          </div>
        </div>
      </div>
    </div>
  );
}