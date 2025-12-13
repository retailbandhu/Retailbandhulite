import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Download,
  Calendar,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalStores: number;
  totalProducts: number;
  totalCustomers: number;
  totalBills: number;
  totalRevenue: number;
  todayBills: number;
}

interface Bill {
  id: number;
  billNumber: string;
  total: string | number;
  createdAt: string;
  storeId: number;
  store?: {
    name: string;
  };
}

interface AdminAnalyticsAdvancedProps {
  onClose?: () => void;
  stats?: AdminStats;
  bills?: Bill[];
  stores?: any[];
  users?: any[];
}

export function AdminAnalyticsAdvanced({ onClose, stats, bills = [], stores = [], users = [] }: AdminAnalyticsAdvancedProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(!stats);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getRevenueByWeek = () => {
    if (!bills || bills.length === 0) return [];
    
    const now = new Date();
    const weeks: { date: string; revenue: number; bills: number }[] = [];
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekBills = bills.filter(bill => {
        const billDate = new Date(bill.createdAt);
        return billDate >= weekStart && billDate < weekEnd;
      });
      
      const revenue = weekBills.reduce((sum, bill) => sum + parseFloat(String(bill.total || 0)), 0);
      
      weeks.push({
        date: `Week ${8 - i}`,
        revenue,
        bills: weekBills.length,
      });
    }
    
    return weeks;
  };

  const getTopStores = () => {
    if (!stores || stores.length === 0) return [];
    
    return [...stores]
      .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
      .slice(0, 5)
      .map(store => ({
        name: store.name || 'Unnamed Store',
        revenue: store.totalRevenue || 0,
        bills: store.billCount || 0,
        products: store.productCount || 0,
      }));
  };

  const revenueData = getRevenueByWeek();
  const topStores = getTopStores();
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
  const maxStoreRevenue = Math.max(...topStores.map(s => s.revenue), 1);

  const totalRevenue = stats?.totalRevenue || 0;
  const totalUsers = stats?.totalUsers || 0;
  const totalBills = stats?.totalBills || 0;
  const todayBills = stats?.todayBills || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-sm text-gray-600">Real-time insights from your database</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500">Live Data</Badge>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-blue-600">Live</Badge>
          </div>
          <div className="text-2xl font-bold text-blue-900">{totalUsers.toLocaleString()}</div>
          <div className="text-sm text-blue-700">Total Users</div>
          <div className="text-xs text-blue-600 mt-1">{stores.length} stores created</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-green-600">Live</Badge>
          </div>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</div>
          <div className="text-sm text-green-700">Total Revenue</div>
          <div className="text-xs text-green-600 mt-1">From {totalBills.toLocaleString()} bills</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-purple-600">Live</Badge>
          </div>
          <div className="text-2xl font-bold text-purple-900">{totalBills.toLocaleString()}</div>
          <div className="text-sm text-purple-700">Total Bills</div>
          <div className="text-xs text-purple-600 mt-1">
            Avg: {totalBills > 0 ? formatCurrency(totalRevenue / totalBills) : '₹0'}/bill
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-orange-600">Today</Badge>
          </div>
          <div className="text-2xl font-bold text-orange-900">{todayBills}</div>
          <div className="text-sm text-orange-700">Bills Today</div>
          <div className="text-xs text-orange-600 mt-1">
            {stats?.totalProducts?.toLocaleString() || 0} products tracked
          </div>
        </Card>
      </div>

      {revenueData.length > 0 && revenueData.some(d => d.revenue > 0) ? (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 8 Weeks)</h3>
          <div className="space-y-3">
            {revenueData.map((item) => (
              <div key={item.date}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.date}</span>
                  <span className="text-sm font-bold text-blue-600">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-end pr-3"
                    style={{ width: `${Math.max((item.revenue / maxRevenue) * 100, 2)}%` }}
                  >
                    {item.bills > 0 && (
                      <span className="text-xs text-white font-medium">{item.bills} bills</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No billing data available yet</p>
            <p className="text-sm">Revenue trends will appear as bills are created</p>
          </div>
        </Card>
      )}

      {topStores.length > 0 ? (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Stores</h3>
          <div className="space-y-4">
            {topStores.map((store, index) => (
              <div key={store.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{store.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(store.revenue)}</div>
                    <div className="text-sm text-gray-600">{store.bills} bills • {store.products} products</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    style={{ width: `${(store.revenue / maxStoreRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Store Performance</h3>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No stores with revenue data</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Users</span>
              <span className="font-bold text-gray-900">{totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Stores</span>
              <span className="font-bold text-gray-900">{stores.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Products</span>
              <span className="font-bold text-gray-900">{stats?.totalProducts?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Customers</span>
              <span className="font-bold text-gray-900">{stats?.totalCustomers?.toLocaleString() || 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          {bills.length > 0 ? (
            <div className="space-y-3">
              {bills.slice(0, 5).map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Bill #{bill.billNumber}</div>
                    <div className="text-sm text-gray-600">
                      {bill.store?.name || 'Unknown Store'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ₹{parseFloat(String(bill.total || 0)).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No recent bills</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Platform Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <div className="text-sm text-gray-600">Registered Users</div>
          </div>
          <div className="p-3 bg-white rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stores.length}</div>
            <div className="text-sm text-gray-600">Active Stores</div>
          </div>
          <div className="p-3 bg-white rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{totalBills}</div>
            <div className="text-sm text-gray-600">Bills Generated</div>
          </div>
          <div className="p-3 bg-white rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total GMV</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
