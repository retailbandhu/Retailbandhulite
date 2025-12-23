import { useState } from 'react';
import { ArrowLeft, Search, Filter, Download, Eye, Printer, RefreshCw, Calendar, IndianRupee, ShoppingBag, User, Clock, CreditCard, X, Share2, Trash2, RotateCcw } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Screen } from '../types';
import { toast } from 'sonner@2.0.3';

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Transaction {
  id: string;
  billNumber: string;
  customerName: string;
  customerPhone?: string;
  items: BillItem[];
  itemCount: number;
  total: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'credit';
  date: string;
  time: string;
  status: 'completed' | 'voided' | 'returned';
}

interface SalesHistoryProps {
  onNavigate: (screen: Screen) => void;
}

export function SalesHistory({ onNavigate }: SalesHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cash' | 'upi' | 'card' | 'credit'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const transactions: Transaction[] = [
    {
      id: '1',
      billNumber: 'RB-001234',
      customerName: 'Ramesh Kumar',
      customerPhone: '+91 98765 43210',
      items: [
        { id: '1', name: 'Item 1', quantity: 2, price: 100, total: 200 },
        { id: '2', name: 'Item 2', quantity: 3, price: 50, total: 150 }
      ],
      itemCount: 5,
      total: 450,
      paymentMethod: 'upi',
      date: '2024-11-13',
      time: '10:30 AM',
      status: 'completed'
    },
    {
      id: '2',
      billNumber: 'RB-001233',
      customerName: 'Sunita Devi',
      items: [
        { id: '3', name: 'Item 3', quantity: 1, price: 280, total: 280 }
      ],
      itemCount: 3,
      total: 280,
      paymentMethod: 'cash',
      date: '2024-11-13',
      time: '09:45 AM',
      status: 'completed'
    },
    {
      id: '3',
      billNumber: 'RB-001232',
      customerName: 'Walk-in Customer',
      items: [
        { id: '4', name: 'Item 4', quantity: 4, price: 150, total: 600 },
        { id: '5', name: 'Item 5', quantity: 4, price: 5, total: 20 }
      ],
      itemCount: 8,
      total: 620,
      paymentMethod: 'upi',
      date: '2024-11-12',
      time: '06:20 PM',
      status: 'completed'
    },
    {
      id: '4',
      billNumber: 'RB-001231',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43213',
      items: [
        { id: '6', name: 'Item 6', quantity: 2, price: 75, total: 150 }
      ],
      itemCount: 2,
      total: 150,
      paymentMethod: 'credit',
      date: '2024-11-12',
      time: '04:15 PM',
      status: 'completed'
    },
    {
      id: '5',
      billNumber: 'RB-001230',
      customerName: 'Vijay Singh',
      items: [
        { id: '7', name: 'Item 7', quantity: 6, price: 200, total: 1200 },
        { id: '8', name: 'Item 8', quantity: 6, price: 5, total: 30 }
      ],
      itemCount: 12,
      total: 1250,
      paymentMethod: 'card',
      date: '2024-11-11',
      time: '02:30 PM',
      status: 'completed'
    },
    {
      id: '6',
      billNumber: 'RB-001229',
      customerName: 'Amit Patel',
      items: [
        { id: '9', name: 'Item 9', quantity: 4, price: 80, total: 320 }
      ],
      itemCount: 4,
      total: 320,
      paymentMethod: 'cash',
      date: '2024-11-11',
      time: '11:00 AM',
      status: 'completed'
    }
  ];

  const paymentMethodColors = {
    cash: 'bg-green-100 text-green-700',
    upi: 'bg-blue-100 text-blue-700',
    card: 'bg-purple-100 text-purple-700',
    credit: 'bg-orange-100 text-orange-700'
  };

  const paymentMethodIcons = {
    cash: '💵',
    upi: '📱',
    card: '💳',
    credit: '📝'
  };

  // Apply filters
  let processedTransactions = transactions.filter(t => 
    (t.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerPhone?.includes(searchQuery)) &&
    (paymentFilter === 'all' || t.paymentMethod === paymentFilter)
  );

  // Apply date range filter if set
  if (startDate && endDate) {
    processedTransactions = processedTransactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );
  }

  const handleExportExcel = () => {
    const csvContent = [
      ['Bill Number', 'Customer', 'Phone', 'Items', 'Total', 'Payment Method', 'Date', 'Time', 'Status'],
      ...processedTransactions.map(t => [
        t.billNumber,
        t.customerName,
        t.customerPhone || '',
        t.itemCount,
        t.total,
        t.paymentMethod,
        t.date,
        t.time,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Sales report exported!');
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowBillDetails(true);
  };

  const handleShareBill = (transaction: Transaction) => {
    const message = `Bill: ${transaction.billNumber}%0ACustomer: ${transaction.customerName}%0AItems: ${transaction.itemCount}%0ATotal: ₹${transaction.total}%0APayment: ${transaction.paymentMethod.toUpperCase()}%0ADate: ${transaction.date} ${transaction.time}`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleVoidBill = (transaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'voided' } : t
    );
    toast.success('Bill voided successfully!');
  };

  const handleReturnBill = (transaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id ? { ...t, status: 'returned' } : t
    );
    toast.success('Bill returned successfully!');
  };

  const handlePrintBill = (transaction: Transaction) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill: ${transaction.billNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 500px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .header h1 { font-size: 24px; }
              .header p { font-size: 14px; }
              .details { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .details p { font-size: 14px; }
              .items { margin-bottom: 20px; }
              .items table { width: 100%; border-collapse: collapse; }
              .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .items th { background-color: #f2f2f2; }
              .total { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .total p { font-size: 14px; }
              .footer { text-align: center; margin-top: 20px; }
              .footer p { font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Bill: ${transaction.billNumber}</h1>
                <p>Customer: ${transaction.customerName}</p>
                <p>Phone: ${transaction.customerPhone || 'N/A'}</p>
                <p>Date: ${transaction.date} ${transaction.time}</p>
              </div>
              <div class="details">
                <p>Payment Method: ${transaction.paymentMethod.toUpperCase()}</p>
                <p>Status: ${transaction.status.toUpperCase()}</p>
              </div>
              <div class="items">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${transaction.items.map(item => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price}</td>
                        <td>₹${item.total}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              <div class="total">
                <p>Total Items: ${transaction.itemCount}</p>
                <p>Total Amount: ₹${transaction.total}</p>
              </div>
              <div class="footer">
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const totalSales = processedTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalBills = processedTransactions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Sales History</h1>
          <button className="text-white">
            <Download className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/90 text-center">Apne saare bills yahan dekhein</p>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-[#1E88E5] to-blue-600 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-sm mb-1">Total Sales</p>
            <p className="text-2xl">₹{totalSales}</p>
          </div>
          <div className="bg-gradient-to-br from-[#FF6F00] to-orange-600 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-sm mb-1">Total Bills</p>
            <p className="text-2xl">{totalBills}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Bill number, customer name ya phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white border-gray-200 rounded-xl"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'All', icon: '📋' },
              { value: 'today', label: 'Today', icon: '📅' },
              { value: 'week', label: 'This Week', icon: '📆' },
              { value: 'month', label: 'This Month', icon: '🗓️' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterBy(filter.value as any)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  filterBy === filter.value
                    ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">All Transactions ({processedTransactions.length})</h3>
            <button className="text-[#1E88E5] text-sm flex items-center space-x-1">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          <div className="space-y-3">
            {processedTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-gray-900">{transaction.billNumber}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${paymentMethodColors[transaction.paymentMethod]}`}>
                          {paymentMethodIcons[transaction.paymentMethod]} {transaction.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{transaction.customerName}</p>
                      {transaction.customerPhone && (
                        <p className="text-gray-400 text-xs">{transaction.customerPhone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[#1E88E5] text-lg mb-1">₹{transaction.total}</p>
                      <p className="text-gray-400 text-xs">{transaction.itemCount} items</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-1 text-gray-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{transaction.date} • {transaction.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(transaction)}
                        className="text-[#1E88E5] hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleShareBill(transaction)}
                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePrintBill(transaction)}
                        className="text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        title="Print Bill"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleVoidBill(transaction)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Void Bill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleReturnBill(transaction)}
                        className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors"
                        title="Return Bill"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h4 className="text-gray-900 mb-3">Export Options</h4>
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-gradient-to-r from-green-500 to-green-600 h-10" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 h-10">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}