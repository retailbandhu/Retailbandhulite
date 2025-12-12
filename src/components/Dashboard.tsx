import image_4d93b3d1b087e58174e0c66cc9a52e892bfab633 from 'figma:asset/4d93b3d1b087e58174e0c66cc9a52e892bfab633.png';
import { 
  Mic, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Bell, 
  Zap, 
  Wallet, 
  Receipt, 
  TrendingDown, 
  ShoppingCart, 
  Users, 
  Scan, 
  Building2, 
  AlertTriangle, 
  MessageCircle, 
  Plus,
  LogOut
} from 'lucide-react';
import { Screen, StoreInfo, Product } from '../App';
import { storage } from '../utils/storage';
import { useState, useEffect } from 'react';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
  storeInfo: StoreInfo;
  onToggleAI?: () => void;
  onToggleQuickActions?: () => void;
  products?: Product[];
  onLogout?: () => void;
}

export function Dashboard({ onNavigate, storeInfo, onToggleAI, onToggleQuickActions, products: productsProp, onLogout }: DashboardProps) {
  const [lowStockCount, setLowStockCount] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [todayBills, setTodayBills] = useState(0);
  const [khataPending, setKhataPending] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  useEffect(() => {
    // Calculate low stock count
    const products = productsProp || storage.getProducts();
    const lowStock = products.filter(p => p.stock <= 10).length;
    setLowStockCount(lowStock);

    // Calculate today's sales and bills
    const bills = storage.getBills();
    const today = new Date().toISOString().split('T')[0];
    const todaysBills = bills.filter(b => {
      const billDate = new Date(b.date).toISOString().split('T')[0];
      return billDate === today;
    });
    
    const sales = todaysBills.reduce((sum, b) => sum + (b.total || 0), 0);
    setTodaySales(sales);
    setTodayBills(todaysBills.length);

    // Calculate khata pending amount
    const khataEntries = storage.getKhataEntries();
    const pending = khataEntries
      .filter(e => e.type === 'credit')
      .reduce((sum, e) => sum + e.amount, 0);
    setKhataPending(pending);

    // Calculate monthly expenses
    const expenses = storage.getExpenses();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthExpenses = expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
    setMonthlyExpenses(monthExpenses);
  }, [productsProp]);

  const menuCards = [
    {
      id: 'billing',
      icon: <Mic className="w-8 h-8" />,
      title: 'Bill Banao',
      titleHindi: '🎙️ Voice Billing',
      description: 'Bolo aur bill tayar',
      gradient: 'from-[#1E88E5] to-blue-600',
      screen: 'billing' as Screen
    },
    {
      id: 'inventory',
      icon: <Package className="w-8 h-8" />,
      title: 'Inventory',
      titleHindi: '📦 Stock Management',
      description: 'Products & stock',
      gradient: 'from-[#FF6F00] to-orange-600',
      screen: 'inventory' as Screen
    },
    {
      id: 'catalog',
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'My Catalog',
      titleHindi: '🛍️ Digital Catalog',
      description: 'Online dukaan',
      gradient: 'from-purple-500 to-purple-700',
      screen: 'catalog' as Screen
    },
    {
      id: 'reports',
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Reports',
      titleHindi: '📊 Sales Summary',
      description: 'Business insights',
      gradient: 'from-green-500 to-green-700',
      screen: 'reports' as Screen
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-12 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏪</span>
            </div>
            <div>
              <h1 className="text-white text-lg">{storeInfo.name}</h1>
              <p className="text-white/80 text-sm">{storeInfo.owner}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
              onClick={() => onNavigate('subscription')}
            >
              <Zap className="w-5 h-5 text-white" />
            </button>
            <button 
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
              onClick={() => onNavigate('notifications')}
            >
              <div className="relative">
                <Bell className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              </div>
            </button>
            <button 
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white/80 text-xs mb-1">Aaj ka Sale</p>
            <p className="text-white text-xl">₹{todaySales.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white/80 text-xs mb-1">Bills</p>
            <p className="text-white text-xl">{todayBills}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white/80 text-xs mb-1">Items Low</p>
            <p className="text-white text-xl">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Main Cards */}
      <div className="px-6 -mt-6 space-y-4">
        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <div 
            onClick={() => onNavigate('reorder-alerts')}
            className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg p-4 text-white cursor-pointer hover:shadow-xl transition-shadow animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="mb-1">⚠️ Stock Khatam Ho Raha Hai!</h3>
                  <p className="text-white/90 text-sm">
                    {lowStockCount} items low stock mein hain
                  </p>
                </div>
              </div>
              <div className="bg-white text-red-600 rounded-full px-3 py-1">
                <span className="text-xs">View</span>
              </div>
            </div>
          </div>
        )}

        {menuCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.screen)}
            className="w-full bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}>
                {card.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-gray-900 text-lg mb-1">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{card.titleHindi}</p>
                <p className="text-gray-500 text-xs">{card.description}</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}

        {/* WhatsApp Automation Banner */}
        <div 
          onClick={() => onNavigate('whatsapp')}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-5 text-white cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">💬</span>
                <h3 className="text-lg">WhatsApp Automation</h3>
              </div>
              <p className="text-white/90 text-sm">
                Bulk messages aur offers bhejiye
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs">Pro</span>
            </div>
          </div>
        </div>

        {/* Khata & Expenses Row */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => onNavigate('khata')}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-4 text-white cursor-pointer hover:shadow-xl transition-shadow"
          >
            <Wallet className="w-8 h-8 mb-2" />
            <h3 className="mb-1">Khata Book</h3>
            <p className="text-white/90 text-xs mb-2">Customer credit track</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs inline-block">
              ₹{khataPending.toLocaleString()} pending
            </div>
          </div>
          <div 
            onClick={() => onNavigate('expenses')}
            className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-lg p-4 text-white cursor-pointer hover:shadow-xl transition-shadow"
          >
            <TrendingDown className="w-8 h-8 mb-2" />
            <h3 className="mb-1">Expenses</h3>
            <p className="text-white/90 text-xs mb-2">Track kharche</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs inline-block">
              ₹{monthlyExpenses.toLocaleString()} this month
            </div>
          </div>
        </div>

        {/* More Features Row */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            onClick={() => onNavigate('sales-history')}
            className="bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow text-center"
          >
            <Receipt className="w-6 h-6 mx-auto mb-2 text-[#1E88E5]" />
            <p className="text-gray-900 text-xs">Sales History</p>
          </div>
          <div 
            onClick={() => onNavigate('parties')}
            className="bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow text-center"
          >
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-gray-900 text-xs">Parties</p>
          </div>
          <div 
            onClick={() => onNavigate('business-insights')}
            className="bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow text-center"
          >
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-[#FF6F00]" />
            <p className="text-gray-900 text-xs">Business Insights</p>
          </div>
        </div>

        {/* Additional Features Row */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => onNavigate('quick-pos')}
            className="bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-900 text-sm flex-1">Quick POS</p>
          </div>
          <div 
            onClick={() => onNavigate('customers')}
            className="bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 text-sm">Customers</p>
              <p className="text-gray-500 text-xs">Customer database</p>
            </div>
          </div>
        </div>

        {/* Scanner Feature */}
        <div 
          onClick={() => onNavigate('barcode-scanner')}
          className="bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Scan className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 text-sm">Barcode Scanner</p>
            <p className="text-gray-500 text-xs">Quick product scan</p>
          </div>
        </div>

        {/* Bill Template */}
        <div 
          onClick={() => onNavigate('bill-template')}
          className="bg-white rounded-2xl shadow-lg p-5 border-2 border-dashed border-gray-300 hover:border-[#1E88E5] transition-colors cursor-pointer"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">🎨</div>
            <h3 className="text-gray-900 mb-1">Bill Template Customize Karein</h3>
            <p className="text-gray-600 text-sm">Logo, color, QR code add karein</p>
          </div>
        </div>

        {/* Bandhu Tips */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="text-gray-900 mb-1">Bandhu ka Tip</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Apna catalog WhatsApp par share karke sales badhayein. Digital catalog se customers ko browsing asaan hoti hai!"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 text-center bg-white/80 backdrop-blur-sm">
        <p className="text-gray-500 text-xs">
          Powered by Retail Bandhu — Har Dukaan, Digital Dukaan.
        </p>
      </div>

      {/* Floating Action Buttons */}
      {onToggleAI && (
        <button
          onClick={onToggleAI}
          className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-[#1E88E5] to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 overflow-hidden p-1"
          aria-label="AI Assistant"
        >
          <img src={image_4d93b3d1b087e58174e0c66cc9a52e892bfab633} alt="Bandhu AI" className="w-full h-full object-contain" />
        </button>
      )}

      {onToggleQuickActions && (
        <button
          onClick={onToggleQuickActions}
          className="fixed bottom-24 left-6 w-14 h-14 bg-gradient-to-r from-[#FF6F00] to-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
          aria-label="Quick Actions"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}