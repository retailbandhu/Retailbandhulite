import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Screen } from '../types';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  IndianRupee,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BusinessInsightsProps {
  onNavigate: (screen: Screen) => void;
}

type TimeRange = 'today' | 'week' | 'month' | 'year';

export function BusinessInsights({ onNavigate }: BusinessInsightsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // Sales vs Expenses Data
  const salesVsExpensesData = [
    { month: 'Jan', sales: 45000, expenses: 28000, profit: 17000 },
    { month: 'Feb', sales: 52000, expenses: 30000, profit: 22000 },
    { month: 'Mar', sales: 48000, expenses: 29000, profit: 19000 },
    { month: 'Apr', sales: 61000, expenses: 32000, profit: 29000 },
    { month: 'May', sales: 55000, expenses: 31000, profit: 24000 },
    { month: 'Jun', sales: 67000, expenses: 35000, profit: 32000 },
  ];

  // Payment Methods Distribution
  const paymentMethodsData = [
    { name: 'Cash', value: 45, color: '#10B981' },
    { name: 'UPI', value: 35, color: '#3B82F6' },
    { name: 'Card', value: 15, color: '#8B5CF6' },
    { name: 'Credit', value: 5, color: '#F59E0B' },
  ];

  // Top Selling Products
  const topProductsData = [
    { name: 'Maggie', sales: 1250, revenue: 15000 },
    { name: 'Pepsi', sales: 980, revenue: 19600 },
    { name: 'Lays', sales: 850, revenue: 17000 },
    { name: 'Parle-G', sales: 2100, revenue: 10500 },
    { name: 'Tata Tea', sales: 420, revenue: 50400 },
  ];

  // Daily Sales Trend (Last 7 days)
  const dailySalesData = [
    { day: 'Mon', sales: 8500, transactions: 45 },
    { day: 'Tue', sales: 9200, transactions: 52 },
    { day: 'Wed', sales: 7800, transactions: 38 },
    { day: 'Thu', sales: 10500, transactions: 58 },
    { day: 'Fri', sales: 12000, transactions: 67 },
    { day: 'Sat', sales: 15500, transactions: 85 },
    { day: 'Sun', sales: 13200, transactions: 72 },
  ];

  // Hourly sales pattern
  const hourlySalesData = [
    { hour: '6 AM', sales: 500 },
    { hour: '9 AM', sales: 1200 },
    { hour: '12 PM', sales: 2800 },
    { hour: '3 PM', sales: 1800 },
    { hour: '6 PM', sales: 3500 },
    { hour: '9 PM', sales: 2200 },
  ];

  // Category-wise sales
  const categoryData = [
    { category: 'Groceries', sales: 45000, percentage: 35 },
    { category: 'Snacks', sales: 28000, percentage: 22 },
    { category: 'Beverages', sales: 25000, percentage: 19 },
    { category: 'Personal Care', sales: 18000, percentage: 14 },
    { category: 'Others', sales: 13000, percentage: 10 },
  ];

  const currentMonthProfit = 32000;
  const lastMonthProfit = 24000;
  const profitGrowth = ((currentMonthProfit - lastMonthProfit) / lastMonthProfit * 100).toFixed(1);

  // Key metrics
  const metrics = {
    totalRevenue: 67000,
    totalExpenses: 35000,
    netProfit: 32000,
    profitMargin: 47.8,
    totalTransactions: 417,
    avgTransactionValue: 161,
    totalCustomers: 234,
    repeatCustomers: 145,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Business Insights</h1>
              <p className="text-sm text-white/90">Analytics & Reports</p>
            </div>
          </div>
          <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['today', 'week', 'month', 'year'] as TimeRange[]).map(range => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              variant={timeRange === range ? 'secondary' : 'ghost'}
              size="sm"
              className={timeRange === range ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'}
            >
              {range === 'today' ? 'Today' : range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'This Year'}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-600">Revenue</div>
                <div className="text-lg font-bold text-gray-900">₹{metrics.totalRevenue.toLocaleString()}</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">
              +{profitGrowth}% vs last month
            </Badge>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-600">Net Profit</div>
                <div className="text-lg font-bold text-gray-900">₹{metrics.netProfit.toLocaleString()}</div>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700 text-xs">
              {metrics.profitMargin}% margin
            </Badge>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-600">Transactions</div>
                <div className="text-lg font-bold text-gray-900">{metrics.totalTransactions}</div>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-700 text-xs">
              ₹{metrics.avgTransactionValue} avg
            </Badge>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-600">Customers</div>
                <div className="text-lg font-bold text-gray-900">{metrics.totalCustomers}</div>
              </div>
            </div>
            <Badge className="bg-orange-100 text-orange-700 text-xs">
              {Math.round((metrics.repeatCustomers / metrics.totalCustomers) * 100)}% repeat
            </Badge>
          </Card>
        </div>

        {/* Sales Trend */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Daily Sales Trend</h3>
            <Badge variant="secondary">Last 7 Days</Badge>
          </div>
          <div style={{ width: '100%', height: 200, minHeight: 200 }}>
            <ResponsiveContainer width="100%" height={200} minHeight={200}>
              <AreaChart data={dailySalesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sales vs Expenses */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Sales vs Expenses</h3>
            <Badge variant="secondary">Last 6 Months</Badge>
          </div>
          <div style={{ width: '100%', height: 250, minHeight: 250 }}>
            <ResponsiveContainer width="100%" height={250} minHeight={250}>
              <BarChart data={salesVsExpensesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="profit" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods & Hourly Pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Methods */}
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
            <div className="flex items-center justify-center mb-4" style={{ width: '100%', height: 180, minHeight: 180 }}>
              <ResponsiveContainer width="100%" height={180} minHeight={180}>
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {paymentMethodsData.map(method => (
                <div key={method.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: method.color }}
                    />
                    <span className="text-sm text-gray-700">{method.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{method.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Hourly Pattern */}
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 mb-4">Peak Hours</h3>
            <div style={{ width: '100%', height: 200, minHeight: 200 }}>
              <ResponsiveContainer width="100%" height={200} minHeight={200}>
                <LineChart data={hourlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Clock className="w-4 h-4" />
                <span>Peak hours: 6 PM - 9 PM</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProductsData.map((product, index) => {
              const maxRevenue = Math.max(...topProductsData.map(p => p.revenue));
              const percentage = (product.revenue / maxRevenue) * 100;

              return (
                <div key={product.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-600">{index + 1}</Badge>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">{product.sales} units</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">Category-wise Sales</h3>
          <div className="space-y-3">
            {categoryData.map(cat => (
              <div key={cat.category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{cat.category}</span>
                    <span className="text-sm text-gray-600">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="font-bold text-gray-900">₹{cat.sales.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Insights & Recommendations */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            AI Insights & Recommendations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Strong Performance</h4>
                <p className="text-sm text-gray-600">
                  Your profit margin of {metrics.profitMargin}% is excellent. Keep it up!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Stock Alert</h4>
                <p className="text-sm text-gray-600">
                  Top products like Tata Tea are selling fast. Consider restocking soon.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Growth Opportunity</h4>
                <p className="text-sm text-gray-600">
                  Weekend sales are 40% higher. Plan special promotions for Saturdays.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <Users className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Customer Retention</h4>
                <p className="text-sm text-gray-600">
                  {Math.round((metrics.repeatCustomers / metrics.totalCustomers) * 100)}% repeat customer rate is good. Implement loyalty program to boost it further.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-3">
            <div className="text-center">
              <Download className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div className="text-xs">Export Report</div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-3">
            <div className="text-center">
              <BarChart3 className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-xs">Custom Report</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}