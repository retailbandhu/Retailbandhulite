import React, { useState } from 'react';
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
} from 'lucide-react';

interface AdminAnalyticsAdvancedProps {
  onClose?: () => void;
}

export function AdminAnalyticsAdvanced({ onClose }: AdminAnalyticsAdvancedProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Revenue data
  const revenueData = [
    { date: 'Week 1', revenue: 28500, users: 450 },
    { date: 'Week 2', revenue: 32100, users: 520 },
    { date: 'Week 3', revenue: 29800, users: 490 },
    { date: 'Week 4', revenue: 35600, users: 580 },
    { date: 'Week 5', revenue: 38200, users: 625 },
    { date: 'Week 6', revenue: 41500, users: 680 },
    { date: 'Week 7', revenue: 44800, users: 730 },
    { date: 'Week 8', revenue: 48200, users: 785 },
  ];

  // User growth data
  const userGrowthData = [
    { month: 'May', free: 3200, pro: 1800, automation: 450 },
    { month: 'Jun', free: 4100, pro: 2350, automation: 620 },
    { month: 'Jul', free: 5300, pro: 3100, automation: 890 },
    { month: 'Aug', free: 6500, pro: 4200, automation: 1150 },
    { month: 'Sep', free: 7200, pro: 4850, automation: 1380 },
    { month: 'Oct', free: 7800, pro: 5350, automation: 1540 },
    { month: 'Nov', free: 8245, pro: 5892, automation: 1710 },
  ];

  // Feature usage data
  const featureUsageData = [
    { name: 'Voice Billing', usage: 92, color: '#1E88E5' },
    { name: 'WhatsApp', usage: 78, color: '#25D366' },
    { name: 'Inventory', usage: 85, color: '#FF6F00' },
    { name: 'Reports', usage: 68, color: '#9C27B0' },
    { name: 'Catalog', usage: 72, color: '#00BCD4' },
    { name: 'Khata', usage: 81, color: '#F44336' },
  ];

  // Revenue by plan
  const revenuePieData = [
    { name: 'Free Plan', value: 0, color: '#9E9E9E' },
    { name: 'Pro Plan', value: 583308, color: '#1E88E5' },
    { name: 'Automation Plan', value: 409908, color: '#FF6F00' },
  ];

  // Geographic distribution
  const geoData = [
    { state: 'Maharashtra', users: 3245, revenue: 185600 },
    { state: 'Gujarat', users: 2890, revenue: 168200 },
    { state: 'Karnataka', users: 2150, revenue: 142500 },
    { state: 'Delhi NCR', users: 1980, revenue: 138900 },
    { state: 'Uttar Pradesh', users: 2540, revenue: 124800 },
    { state: 'Rajasthan', users: 1650, revenue: 98500 },
    { state: 'Tamil Nadu', users: 1392, revenue: 87300 },
  ];

  // Peak hours data
  const peakHoursData = [
    { hour: '6 AM', activity: 15 },
    { hour: '8 AM', activity: 45 },
    { hour: '10 AM', activity: 78 },
    { hour: '12 PM', activity: 95 },
    { hour: '2 PM', activity: 88 },
    { hour: '4 PM', activity: 92 },
    { hour: '6 PM', activity: 98 },
    { hour: '8 PM', activity: 85 },
    { hour: '10 PM', activity: 42 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
  const totalRevenue = revenuePieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-sm text-gray-600">Deep insights into your business performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === '1y' && 'Last Year'}
              </button>
            ))}
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15.3%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-blue-900">15,847</div>
          <div className="text-sm text-blue-700">Total Users</div>
          <div className="text-xs text-blue-600 mt-1">+2,045 this month</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +22.8%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-green-900">₹9.93L</div>
          <div className="text-sm text-green-700">Total Revenue</div>
          <div className="text-xs text-green-600 mt-1">₹1.24L this month</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18.5%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-purple-900">47.8%</div>
          <div className="text-sm text-purple-700">Conversion Rate</div>
          <div className="text-xs text-purple-600 mt-1">Free to Paid</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-green-500">
              <TrendingUp className="w-3 h-3 mr-1" />
              +31.2%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-orange-900">12.5K</div>
          <div className="text-sm text-orange-700">Bills Created</div>
          <div className="text-xs text-orange-600 mt-1">This month</div>
        </Card>
      </div>

      {/* Revenue Trend Bar Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 8 Weeks)</h3>
        <div className="space-y-3">
          {revenueData.map((item) => (
            <div key={item.date}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.date}</span>
                <span className="text-sm font-bold text-blue-600">₹{item.revenue.toLocaleString()}</span>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-end pr-3"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">{item.users} users</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* User Growth by Plan */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth by Subscription Plan</h3>
        <div className="space-y-4">
          {userGrowthData.map((item) => {
            const total = item.free + item.pro + item.automation;
            return (
              <div key={item.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.month}</span>
                  <span className="text-sm text-gray-600">{total.toLocaleString()} total</span>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg overflow-hidden flex">
                  <div
                    className="bg-gray-400 flex items-center justify-center"
                    style={{ width: `${(item.free / total) * 100}%` }}
                    title={`Free: ${item.free}`}
                  >
                    <span className="text-xs text-white font-medium">{item.free}</span>
                  </div>
                  <div
                    className="bg-blue-500 flex items-center justify-center"
                    style={{ width: `${(item.pro / total) * 100}%` }}
                    title={`Pro: ${item.pro}`}
                  >
                    <span className="text-xs text-white font-medium">{item.pro}</span>
                  </div>
                  <div
                    className="bg-orange-500 flex items-center justify-center"
                    style={{ width: `${(item.automation / total) * 100}%` }}
                    title={`Automation: ${item.automation}`}
                  >
                    <span className="text-xs text-white font-medium">{item.automation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-400" />
            <span>Free Plan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Pro Plan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>Automation Plan</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {revenuePieData.map((item) => {
              const percentage = totalRevenue > 0 ? (item.value / totalRevenue) * 100 : 0;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">₹{item.value.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Feature Usage */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Usage (%)</h3>
          <div className="space-y-3">
            {featureUsageData.map((feature) => (
              <div key={feature.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                  <span className="text-sm font-bold" style={{ color: feature.color }}>
                    {feature.usage}%
                  </span>
                </div>
                <div className="h-6 bg-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-2"
                    style={{ 
                      width: `${feature.usage}%`,
                      backgroundColor: feature.color
                    }}
                  >
                    {feature.usage > 30 && (
                      <span className="text-xs text-white font-medium">{feature.usage}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Distribution (Top States)</h3>
        <div className="space-y-3">
          {geoData.map((state, index) => {
            const maxUsers = Math.max(...geoData.map((s) => s.users));
            const percentage = (state.users / maxUsers) * 100;
            return (
              <div key={state.state}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{state.state}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{state.users.toLocaleString()} users</div>
                    <div className="text-sm text-green-600">₹{(state.revenue / 1000).toFixed(1)}K revenue</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Peak Activity Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Peak Activity Hours</h3>
        <div className="flex items-end gap-2 h-48">
          {peakHoursData.map((item) => {
            const maxActivity = Math.max(...peakHoursData.map(d => d.activity));
            const heightPercent = (item.activity / maxActivity) * 100;
            return (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex flex-col justify-end">
                  <div
                    className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all hover:from-orange-600 hover:to-orange-500 relative group"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {item.activity}%
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 whitespace-nowrap">{item.hour}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-900">
            <strong>Peak Hours:</strong> 6 PM - 8 PM (98% activity) • Best time to send notifications
          </p>
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🧠 AI-Powered Insights</h3>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Strong Growth in Automation Plan</h4>
                <p className="text-sm text-gray-700">
                  Automation plan subscribers grew 31% this month. Consider expanding automation features.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Maharashtra Leading in Users</h4>
                <p className="text-sm text-gray-700">
                  3,245 users from Maharashtra (20.5% of total). Focus marketing efforts here.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">High Feature Adoption</h4>
                <p className="text-sm text-gray-700">
                  Voice Billing at 92% usage, Inventory at 85%. Users love core features!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
