import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react'; // Added React import
import { Button } from './ui/button';
import type { Screen } from '../types';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { useReports } from '../hooks/useReports';
import { LoadingSpinner, ErrorMessage } from './LoadingStates';
import { VoiceButton } from './VoiceButton'; // Added voice support
import { speak } from '../utils/speech'; // Added TTS support
import { ArrowLeft, Download, Calendar, TrendingUp, DollarSign, ShoppingCart, Package, Mic } from 'lucide-react'; // Added icons

interface ReportsScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function ReportsScreen({ onNavigate }: ReportsScreenProps) {
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [isListening, setIsListening] = useState(false); // Added voice state

  // Use the new reports hook
  const { data: reportsData, loading, error, refresh, dateRange, setDateRange } = useReports();

  // Map dateRange to display period
  const selectedPeriod = dateRange === 'today' ? 'Today' : 
                        dateRange === 'week' ? 'Week' : 
                        dateRange === 'month' ? 'Month' : 'All Time';

  // Voice command handler
  const handleVoiceCommand = async (transcript: string) => {
    const lower = transcript.toLowerCase();
    
    try {
      // Period selection commands
      if (lower.includes('today') || lower.includes('aaj')) {
        setDateRange('today');
        await speak('Aaj ki report dikha raha hoon. Ho gaya!');
        toast.success('Showing today\'s report');
      } else if (lower.includes('week') || lower.includes('hafte') || lower.includes('saptah')) {
        setDateRange('week');
        await speak('Is hafte ki report dikha raha hoon. Ho gaya!');
        toast.success('Showing this week\'s report');
      } else if (lower.includes('month') || lower.includes('mahine') || lower.includes('maas')) {
        setDateRange('month');
        await speak('Is mahine ki report dikha raha hoon. Ho gaya!');
        toast.success('Showing this month\'s report');
      } else if (lower.includes('export') || lower.includes('download') || lower.includes('save')) {
        if (lower.includes('csv')) {
          handleExportReport('csv');
          await speak('CSV report download ho gaya. Ho gaya!');
        } else if (lower.includes('pdf')) {
          handleExportReport('pdf');
          await speak('PDF report jaldi aayega. Ho gaya!');
        } else {
          handleExportReport('csv');
          await speak('Report download ho gaya. Ho gaya!');
        }
      } else if (lower.includes('refresh') || lower.includes('reload') || lower.includes('update')) {
        refresh();
        await speak('Report refresh kar diya. Ho gaya!');
        toast.success('Report refreshed');
      } else {
        await speak('Samajh nahi aaya. Kripya phir se boliye.');
        toast.error('Command not recognized. Try: "today", "week", "month", or "export"');
      }
    } catch (error) {
      console.error('Voice command error:', error);
      toast.error('Error processing voice command');
    }
  };

  const handleExportReport = (format: 'pdf' | 'csv') => {
    if (format === 'csv') {
      const csvContent = [
        ['Period', 'Total Sales', 'Total Bills', 'Avg Bill Value', 'Items Sold'],
        [selectedPeriod, '15200', '87', '175', '234']
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success('Report exported to CSV!');
    } else {
      toast.success('PDF export coming soon!');
    }
  };

  const handlePeriodChange = (period: string) => {
    if (period === 'Custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      // Map period to dateRange
      if (period === 'Today') setDateRange('today');
      else if (period === 'Week') setDateRange('week');
      else if (period === 'Month') setDateRange('month');
      else setDateRange('all');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => onNavigate('dashboard')} className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl">Reports & Analytics</h1>
            <div className="w-6 h-6" />
          </div>
        </div>
        <div className="px-6 pt-6">
          <LoadingSpinner message="Loading reports..." />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => onNavigate('dashboard')} className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl">Reports & Analytics</h1>
            <div className="w-6 h-6" />
          </div>
        </div>
        <div className="px-6 pt-6">
          <ErrorMessage message={error} retry={refresh} />
        </div>
      </div>
    );
  }

  // Use real data from hook (with fallback to mock data for now)
  const totalSales = reportsData?.totalSales || 15200;
  const totalBills = reportsData?.totalBills || 87;
  const averageBillValue = reportsData?.averageBillValue || 175;
  const topProducts = reportsData?.topProducts?.slice(0, 5).map(p => ({
    name: p.name,
    qty: p.quantity,
    revenue: p.revenue,
    profit: p.revenue * 0.2 // Assume 20% profit margin
  })) || [
    { name: 'Maggie', qty: 45, revenue: 900, profit: 180 },
    { name: 'Pepsi', qty: 38, revenue: 760, profit: 152 },
    { name: 'Parle-G', qty: 35, revenue: 350, profit: 70 },
    { name: 'Tata Tea', qty: 28, revenue: 1120, profit: 224 },
    { name: 'Lays', qty: 22, revenue: 440, profit: 88 }
  ];

  const dailySalesData = reportsData?.salesByDate?.slice(-7).map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    sales: d.amount,
    lastWeek: d.amount * 0.9 // Mock comparison
  })) || [
    { day: 'Mon', sales: 1200, lastWeek: 1100 },
    { day: 'Tue', sales: 1800, lastWeek: 1600 },
    { day: 'Wed', sales: 1500, lastWeek: 1400 },
    { day: 'Thu', sales: 2200, lastWeek: 1900 },
    { day: 'Fri', sales: 2800, lastWeek: 2500 },
    { day: 'Sat', sales: 3200, lastWeek: 3000 },
    { day: 'Sun', sales: 2400, lastWeek: 2200 }
  ];

  const categoryData = [
    { name: 'Snacks', value: 4500, color: '#FF6F00' },
    { name: 'Beverages', value: 3800, color: '#1E88E5' },
    { name: 'Groceries', value: 3200, color: '#4CAF50' },
    { name: 'Personal Care', value: 2100, color: '#9C27B0' },
    { name: 'Others', value: 1600, color: '#FFC107' }
  ];

  const paymentMethodsData = [
    { name: 'UPI', value: 6200, color: '#1E88E5' },
    { name: 'Cash', value: 5400, color: '#4CAF50' },
    { name: 'Card', value: 2800, color: '#9C27B0' },
    { name: 'Credit', value: 800, color: '#FF6F00' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Reports & Analytics</h1>
          <div className="flex items-center gap-2">
            <VoiceButton 
              onVoiceInput={handleVoiceCommand}
              onListeningChange={setIsListening}
              size="sm"
              showBetaBadge={false}
            />
          </div>
        </div>

        {/* Voice Status Banner */}
        {isListening && (
          <div className="mb-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 animate-pulse">
            <Mic className="w-5 h-5 text-white animate-pulse" />
            <div className="flex-1">
              <p className="text-white text-sm">🎤 Listening...</p>
              <p className="text-white/80 text-xs">Say: "today", "week", "month", or "export"</p>
            </div>
          </div>
        )}

        {/* Period Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {['Today', 'Week', 'Month', 'All Time', 'Custom'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                period === selectedPeriod 
                  ? 'bg-white text-[#1E88E5]' 
                  : 'bg-white/20 text-white'
              }`}
              onClick={() => handlePeriodChange(period)}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {showCustomDateRange && (
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white"
            />
            <Button
              onClick={() => setShowComparison(true)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white"
            >
              Compare
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Sales</p>
            </div>
            <p className="text-2xl text-gray-900">₹{totalSales.toLocaleString()}</p>
            <p className="text-green-600 text-xs mt-1">↑ 12% from last week</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Bills</p>
            </div>
            <p className="text-2xl text-gray-900">{totalBills}</p>
            <p className="text-blue-600 text-xs mt-1">This week</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-2">Avg Bill Value</p>
            <p className="text-2xl text-gray-900">₹{averageBillValue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-gray-600 text-sm mb-2">Items Sold</p>
            <p className="text-2xl text-gray-900">234</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="text-gray-900 mb-4">Weekly Sales Trend</h3>
          <div style={{ width: '100%', height: 256, minHeight: 256 }}>
            <ResponsiveContainer width="100%" height={256} minHeight={256}>
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1E88E5" 
                  strokeWidth={3}
                  dot={{ fill: '#1E88E5', r: 4 }}
                />
                {showComparison && (
                  <Line 
                    type="monotone" 
                    dataKey="lastWeek" 
                    stroke="#FF6F00" 
                    strokeWidth={3}
                    dot={{ fill: '#FF6F00', r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="text-gray-900 mb-4">Top Selling Products</h3>
          <div style={{ width: '100%', height: 256, minHeight: 256 }}>
            <ResponsiveContainer width="100%" height={256} minHeight={256}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" stroke="#666" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px' 
                  }}
                />
                <Bar dataKey="qty" fill="#FF6F00" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h3 className="text-lg mb-2">Bandhu ka Analysis</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-3">
                "Maggie is your top-selling item this week! Stock maintain karein kyunki weekend pe demand badhegi."
              </p>
              <div className="space-y-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm">✓ Peak sales time: 5 PM - 8 PM</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm">✓ Saturday pe sabse zyada sales hoti hai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="text-gray-900 mb-4">Payment Methods</h3>
          <div style={{ width: '100%', height: 256, minHeight: 256 }}>
            <ResponsiveContainer width="100%" height={256} minHeight={256}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#FF6F00"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category-wise Sales - NEW FEATURE */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="text-gray-900 mb-4">Category-wise Sales</h3>
          <div className="space-y-3">
            {categoryData.map((category) => {
              const total = categoryData.reduce((sum, c) => sum + c.value, 0);
              const percentage = ((category.value / total) * 100).toFixed(1);
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900 text-sm">{category.name}</span>
                    <span className="text-gray-900">₹{category.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentage}% of total sales</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profit Margin Analysis - NEW FEATURE */}
        <div className="bg-white rounded-xl shadow-lg p-5">
          <h3 className="text-gray-900 mb-4">Profit Margin Analysis</h3>
          <div className="space-y-3">
            {topProducts.map((product) => {
              const margin = ((product.profit / product.revenue) * 100).toFixed(1);
              return (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">Revenue: ₹{product.revenue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">₹{product.profit}</p>
                    <p className="text-xs text-gray-500">{margin}% margin</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Options - NEW FEATURE */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="text-gray-900 mb-3">Export Full Report</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => handleExportReport('csv')}
              className="bg-gradient-to-r from-green-500 to-green-600 h-10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => handleExportReport('pdf')}
              className="bg-gradient-to-r from-red-500 to-red-600 h-10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}