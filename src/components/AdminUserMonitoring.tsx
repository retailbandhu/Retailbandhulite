import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import {
  Users,
  Activity,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ShoppingCart,
  Package,
  MessageSquare,
  Download,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle,
  Star,
  Gift,
  RefreshCw,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  plan: 'free' | 'pro' | 'automation';
  status: 'active' | 'suspended' | 'trial' | 'churned';
  joinedDate: string;
  lastActive: string;
  totalRevenue: number;
  billsCreated: number;
  productsAdded: number;
  whatsappSent: number;
  avgOrderValue: number;
  state: string;
  city: string;
  loginCount: number;
  sessionTime: string;
  features: string[];
  rating: number;
}

export function AdminUserMonitoring() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [realUsers, setRealUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setRealUsers(data);
        const mappedUsers: User[] = data.map((user: any) => ({
          id: user.id,
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || 'Unknown',
          email: user.email || '',
          phone: user.stores?.[0]?.phone || '',
          storeName: user.stores?.[0]?.name || 'No Store',
          plan: 'free' as const,
          status: 'active' as const,
          joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
          lastActive: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A',
          totalRevenue: 0,
          billsCreated: 0,
          productsAdded: 0,
          whatsappSent: 0,
          avgOrderValue: 0,
          state: '',
          city: '',
          loginCount: 0,
          sessionTime: '0 min',
          features: ['voice-billing', 'inventory'],
          rating: 0,
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const mockUsers: User[] = [
    {
      id: '4',
      name: 'Anjali Verma',
      email: 'anjali@example.com',
      phone: '+91 98765 43213',
      storeName: 'Verma Super Market',
      plan: 'pro',
      status: 'active',
      joinedDate: '2024-09-20',
      lastActive: '30 minutes ago',
      totalRevenue: 1499,
      billsCreated: 1890,
      productsAdded: 520,
      whatsappSent: 450,
      avgOrderValue: 142.30,
      state: 'Delhi',
      city: 'New Delhi',
      loginCount: 185,
      sessionTime: '16.8 min',
      features: ['voice-billing', 'whatsapp', 'inventory', 'reports', 'catalog'],
      rating: 4.6,
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '+91 98765 43214',
      storeName: 'Singh Provision Store',
      plan: 'free',
      status: 'churned',
      joinedDate: '2024-08-10',
      lastActive: '15 days ago',
      totalRevenue: 0,
      billsCreated: 250,
      productsAdded: 180,
      whatsappSent: 0,
      avgOrderValue: 88.50,
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      loginCount: 48,
      sessionTime: '6.2 min',
      features: ['voice-billing'],
      rating: 3.5,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro' | 'automation'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'trial' | 'suspended' | 'churned'>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesOnline = !showOnlineOnly || user.lastActive.includes('minutes ago') || user.lastActive.includes('hour');

    return matchesSearch && matchesPlan && matchesStatus && matchesOnline;
  });

  // Stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'active').length,
    onlineNow: users.filter((u) => u.lastActive.includes('minutes ago')).length,
    trialUsers: users.filter((u) => u.status === 'trial').length,
    churnedUsers: users.filter((u) => u.status === 'churned').length,
    avgRevenue: users.reduce((sum, u) => sum + u.totalRevenue, 0) / users.filter((u) => u.totalRevenue > 0).length,
    avgRating: users.reduce((sum, u) => sum + u.rating, 0) / users.length,
  };

  const suspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
      )
    );
    toast.success('User status updated');
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('User deleted');
      setSelectedUser(null);
    }
  };

  const upgradePlan = (userId: string, newPlan: 'free' | 'pro' | 'automation') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u)));
    toast.success(`User upgraded to ${newPlan.toUpperCase()} plan`);
  };

  const sendMessage = (user: User) => {
    toast.info(`Sending message to ${user.name}...`);
  };

  const getPlanColor = (plan: string) => {
    if (plan === 'automation') return 'bg-orange-500';
    if (plan === 'pro') return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-500';
    if (status === 'trial') return 'bg-yellow-500';
    if (status === 'suspended') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <Badge className="bg-blue-600">{stats.totalUsers}</Badge>
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.activeUsers}</div>
          <div className="text-sm text-blue-700">Active Users</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-green-600" />
            <Badge className="bg-green-600 animate-pulse">LIVE</Badge>
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.onlineNow}</div>
          <div className="text-sm text-green-700">Online Now</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <Badge className="bg-yellow-600">{stats.trialUsers}</Badge>
          </div>
          <div className="text-2xl font-bold text-yellow-900">Trial</div>
          <div className="text-sm text-yellow-700">Free Trial Users</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <Badge className="bg-red-600">{stats.churnedUsers}</Badge>
          </div>
          <div className="text-2xl font-bold text-red-900">Churned</div>
          <div className="text-sm text-red-700">Inactive Users</div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, store, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700">Plan:</span>
              {(['all', 'free', 'pro', 'automation'] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setFilterPlan(plan)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterPlan === plan
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {plan === 'all' ? 'All' : plan.charAt(0).toUpperCase() + plan.slice(1)}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-300" />

            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {(['all', 'active', 'trial', 'suspended', 'churned'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-300" />

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Online only</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">
            Users ({filteredUsers.length} {filteredUsers.length !== users.length && `of ${users.length}`})
          </h3>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className={`p-4 hover:shadow-lg transition-all cursor-pointer ${
                selectedUser?.id === user.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {user.name.charAt(0)}
                  </div>
                  {user.lastActive.includes('minutes ago') && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{user.name}</h4>
                    <Badge className={getPlanColor(user.plan)}>{user.plan.toUpperCase()}</Badge>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    {user.rating >= 4.5 && (
                      <Badge className="bg-yellow-500">
                        <Star className="w-3 h-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">{user.storeName}</div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {user.city}, {user.state}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last active: {user.lastActive}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">₹{user.totalRevenue}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{user.billsCreated}</div>
                    <div className="text-xs text-gray-500">Bills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{user.productsAdded}</div>
                    <div className="text-xs text-gray-500">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{user.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      sendMessage(user);
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      suspendUser(user.id);
                    }}
                  >
                    {user.status === 'suspended' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Ban className="w-4 h-4 text-red-600" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedUser.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Store:</span>
                        <span className="font-medium">{selectedUser.storeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">
                          {selectedUser.city}, {selectedUser.state}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">{selectedUser.joinedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Active:</span>
                        <span className="font-medium">{selectedUser.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3">Subscription</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getPlanColor(selectedUser.plan)}>
                          {selectedUser.plan.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(selectedUser.status)}>
                          {selectedUser.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => upgradePlan(selectedUser.id, 'free')}
                        >
                          Free
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => upgradePlan(selectedUser.id, 'pro')}
                        >
                          Pro
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => upgradePlan(selectedUser.id, 'automation')}
                        >
                          Automation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-3">Usage Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-3 bg-green-50 border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700">Revenue</span>
                      </div>
                      <div className="text-xl font-bold text-green-900">
                        ₹{selectedUser.totalRevenue}
                      </div>
                    </Card>

                    <Card className="p-3 bg-blue-50 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700">Bills Created</span>
                      </div>
                      <div className="text-xl font-bold text-blue-900">
                        {selectedUser.billsCreated}
                      </div>
                    </Card>

                    <Card className="p-3 bg-purple-50 border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-purple-700">Products</span>
                      </div>
                      <div className="text-xl font-bold text-purple-900">
                        {selectedUser.productsAdded}
                      </div>
                    </Card>

                    <Card className="p-3 bg-orange-50 border-orange-200">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                        <span className="text-xs text-orange-700">WhatsApp</span>
                      </div>
                      <div className="text-xl font-bold text-orange-900">
                        {selectedUser.whatsappSent}
                      </div>
                    </Card>
                  </div>

                  <div className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Order Value:</span>
                      <span className="font-bold text-green-600">
                        ₹{selectedUser.avgOrderValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Login Count:</span>
                      <span className="font-medium">{selectedUser.loginCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Session:</span>
                      <span className="font-medium">{selectedUser.sessionTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{selectedUser.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Used */}
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">Features Used</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Button className="flex-1 bg-blue-600" onClick={() => sendMessage(selectedUser)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => suspendUser(selectedUser.id)}
                  className={selectedUser.status === 'suspended' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}
                >
                  {selectedUser.status === 'suspended' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => deleteUser(selectedUser.id)}>
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
