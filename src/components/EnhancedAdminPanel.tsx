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

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4099df5/admin`;

interface AdminPanelProps {
  onNavigate: (screen: Screen) => void;
}

type AdminTab = 
  | 'overview'
  | 'users'
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

  // Mock data - replace with real API calls
  const [stats, setStats] = useState({
    totalUsers: 15847,
    activeUsers: 12653,
    totalRevenue: 847250,
    monthlyRevenue: 124580,
    freeUsers: 8245,
    proUsers: 5892,
    automationUsers: 1710,
    averageSessionTime: '12.5 min',
    errorRate: 0.3,
    apiResponseTime: '245ms',
    systemUptime: '99.98%',
    storageUsed: '34.2 GB',
    apiCalls: 1245680,
    conversionRate: 4.2,
  });

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
    // Simulate live metrics update
    setStats(prev => ({
      ...prev,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
      apiResponseTime: `${Math.floor(Math.random() * 100 + 200)}ms`,
    }));
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
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <Badge className="bg-blue-600">+12%</Badge>
          </div>
          <div className="text-3xl font-bold text-blue-900 mb-1">
            {stats.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">Total Users</div>
          <div className="text-xs text-blue-600 mt-2">
            {stats.activeUsers.toLocaleString()} active today
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <Badge className="bg-green-600">+8%</Badge>
          </div>
          <div className="text-3xl font-bold text-green-900 mb-1">
            ₹{stats.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-green-700">Monthly Revenue</div>
          <div className="text-xs text-green-600 mt-2">
            ₹{stats.totalRevenue.toLocaleString()} total
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-purple-600" />
            <Badge className="bg-green-600">Good</Badge>
          </div>
          <div className="text-3xl font-bold text-purple-900 mb-1">
            {stats.errorRate}%
          </div>
          <div className="text-sm text-purple-700">Error Rate</div>
          <div className="text-xs text-purple-600 mt-2">
            {stats.apiResponseTime} avg response
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <Badge className="bg-orange-600">Active</Badge>
          </div>
          <div className="text-3xl font-bold text-orange-900 mb-1">
            {stats.averageSessionTime}
          </div>
          <div className="text-sm text-orange-700">Avg Session Time</div>
          <div className="text-xs text-orange-600 mt-2">Per user engagement</div>
        </Card>
      </div>

      {/* Subscription Distribution */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Subscription Distribution
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Free Plan</span>
              <span className="text-sm text-gray-600">
                {stats.freeUsers} users ({((stats.freeUsers / stats.totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400"
                style={{ width: `${(stats.freeUsers / stats.totalUsers) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pro Plan</span>
              <span className="text-sm text-gray-600">
                {stats.proUsers} users ({((stats.proUsers / stats.totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${(stats.proUsers / stats.totalUsers) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Automation Plan</span>
              <span className="text-sm text-gray-600">
                {stats.automationUsers} users ({((stats.automationUsers / stats.totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${(stats.automationUsers / stats.totalUsers) * 100}%` }}
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
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">All Users ({users.length})</h3>
          <Button size="sm" className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{user.name}</span>
                      <Badge
                        className={
                          user.plan === 'automation'
                            ? 'bg-orange-500'
                            : user.plan === 'pro'
                            ? 'bg-blue-500'
                            : 'bg-gray-400'
                        }
                      >
                        {user.plan.toUpperCase()}
                      </Badge>
                      <Badge
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={
                          user.status === 'active'
                            ? 'bg-green-500'
                            : user.status === 'trial'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-0.5">
                      <div>{user.storeName}</div>
                      <div className="flex items-center gap-4">
                        <span>{user.email}</span>
                        <span>{user.phone}</span>
                        <span>Joined: {user.joinedDate}</span>
                        <span>Last active: {user.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-4">
                    <div className="font-bold text-green-600">₹{user.revenue}</div>
                    <div className="text-xs text-gray-500">Total Revenue</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info('Viewing user details...')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => suspendUser(user.id)}
                  >
                    {user.status === 'suspended' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
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

      {Object.entries(
        featureFlags.reduce((acc, flag) => {
          if (!acc[flag.category]) acc[flag.category] = [];
          acc[flag.category].push(flag);
          return acc;
        }, {} as Record<string, FeatureFlag[]>)
      ).map(([category, flags]) => (
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
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          Database Management
        </h3>

        <div className="space-y-6">
          {/* Database Health */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900">Database Health</h4>
                <p className="text-sm text-gray-600">
                  Check the status of the database
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
                {stats.activeUsers.toLocaleString()} online
              </Badge>
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
            {activeTab === 'features' && renderFeatures()}
            {activeTab === 'system' && renderSystem()}
            {activeTab === 'content' && <AdminContentCMS />}
            {activeTab === 'subscriptions' && <AdminSubscriptionManagement />}
            {activeTab === 'analytics' && <AdminAnalyticsAdvanced />}
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