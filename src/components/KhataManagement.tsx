import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Users, TrendingUp, Clock, Phone, Wallet, CheckCircle, AlertCircle, Search, Filter, Download, MessageCircle, IndianRupee, History, X, Mic } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { VoiceInput } from './VoiceInput';
import { Screen } from '../types';
import { toast } from 'sonner@2.0.3';
import { storage } from '../utils/storage';
import { speak } from '../utils/speech';

interface KhataEntry {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  amount: number;
  type: 'credit' | 'payment';
  date: string;
  notes?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalCredit: number;
  lastTransaction: string;
  transactionCount: number;
  daysSinceLastTransaction?: number;
}

interface KhataManagementProps {
  onNavigate: (screen: Screen) => void;
}

export function KhataManagement({ onNavigate }: KhataManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [khataEntries, setKhataEntries] = useState<KhataEntry[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | '30days' | '60days' | '90days'>('all');
  const [sortBy, setSortBy] = useState<'amount' | 'name' | 'days'>('amount');
  
  // New customer form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerCredit, setNewCustomerCredit] = useState('');
  const [newCustomerNotes, setNewCustomerNotes] = useState('');

  useEffect(() => {
    const storedCustomers = storage.getCustomers() || [];
    const storedKhataEntries = storage.getKhataEntries() || [];
    setCustomers(storedCustomers);
    setKhataEntries(storedKhataEntries);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const totalOutstanding = customers.reduce((sum, c) => sum + c.totalCredit, 0);
  const customersWithCredit = customers.filter(c => c.totalCredit > 0).length;

  const handleSendReminder = (customer: Customer) => {
    const message = `Namaste ${customer.name} ji,%0A%0AYeh aapka khata reminder hai.%0ABaki raashi: ₹${customer.totalCredit}%0A%0AKripya jaldi payment karein.%0ADhanyavaad!%0A%0A- ${localStorage.getItem('storeName') || 'Your Store'}`;
    window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCollectPayment = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount(customer.totalCredit.toString());
    setShowPaymentModal(true);
  };

  const handleSavePayment = () => {
    if (!selectedCustomer || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter valid payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > selectedCustomer.totalCredit) {
      toast.error('Payment amount exceeds credit amount');
      return;
    }

    // Create payment entry
    const paymentEntry: KhataEntry = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      phone: selectedCustomer.phone,
      amount: amount,
      type: 'payment',
      date: new Date().toISOString(),
      notes: paymentNotes
    };

    // Update entries
    const updatedEntries = [...khataEntries, paymentEntry];
    setKhataEntries(updatedEntries);
    storage.setKhataEntries(updatedEntries);

    // Update customer credit
    const updatedCustomers = customers.map(c => 
      c.id === selectedCustomer.id 
        ? { ...c, totalCredit: c.totalCredit - amount }
        : c
    );
    setCustomers(updatedCustomers);
    storage.setCustomers(updatedCustomers);

    toast.success(`₹${amount} payment received from ${selectedCustomer.name}!`);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentNotes('');
    setSelectedCustomer(null);
  };

  const handleViewHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHistoryModal(true);
  };

  const handleExportKhata = () => {
    const csvContent = [
      ['Customer Name', 'Phone', 'Outstanding Amount', 'Last Transaction', 'Transaction Count'],
      ...customers
        .filter(c => c.totalCredit > 0)
        .map(c => [
          c.name,
          c.phone,
          c.totalCredit,
          c.lastTransaction,
          c.transactionCount
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khata_book_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Khata book exported!');
  };

  const handleBulkReminders = () => {
    const customersWithCredit = customers.filter(c => c.totalCredit > 0);
    toast.success(`Sending reminders to ${customersWithCredit.length} customers!`, { duration: 3000 });
  };

  const handleMarkPaid = (customer: Customer) => {
    if (confirm(`Mark ₹${customer.totalCredit} as paid for ${customer.name}?`)) {
      handleCollectPayment(customer);
    }
  };

  const handleAddCustomer = () => {
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      toast.error('Please enter customer name and phone');
      return;
    }

    if (!newCustomerCredit || parseFloat(newCustomerCredit) <= 0) {
      toast.error('Please enter valid credit amount');
      return;
    }

    const creditAmount = parseFloat(newCustomerCredit);

    // Create new customer
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      totalCredit: creditAmount,
      lastTransaction: new Date().toLocaleDateString('en-IN'),
      transactionCount: 1,
      daysSinceLastTransaction: 0
    };

    // Create khata entry
    const khataEntry: KhataEntry = {
      id: Date.now().toString(),
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      phone: newCustomer.phone,
      amount: creditAmount,
      type: 'credit',
      date: new Date().toISOString(),
      notes: newCustomerNotes.trim() || 'Initial credit entry'
    };

    // Update state
    const updatedCustomers = [...customers, newCustomer];
    const updatedEntries = [...khataEntries, khataEntry];
    
    setCustomers(updatedCustomers);
    setKhataEntries(updatedEntries);
    storage.setCustomers(updatedCustomers);
    storage.setKhataEntries(updatedEntries);

    toast.success(`${newCustomer.name} added to khata with ₹${creditAmount} credit!`);
    speak(`${newCustomer.name} ko khata mein add kar diya gaya`);

    // Reset form
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerCredit('');
    setNewCustomerNotes('');
    setShowAddCustomerModal(false);
  };

  // Filter and sort logic
  let processedCustomers = [...filteredCustomers];
  
  // Apply aging filter
  if (filterBy !== 'all') {
    const daysMap = { '30days': 30, '60days': 60, '90days': 90 };
    const days = daysMap[filterBy];
    processedCustomers = processedCustomers.filter(c => 
      c.daysSinceLastTransaction && c.daysSinceLastTransaction >= days
    );
  }

  // Apply sorting
  processedCustomers.sort((a, b) => {
    if (sortBy === 'amount') return b.totalCredit - a.totalCredit;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'days') return (b.daysSinceLastTransaction || 0) - (a.daysSinceLastTransaction || 0);
    return 0;
  });

  const customerHistory = selectedCustomer 
    ? khataEntries.filter(e => e.customerId === selectedCustomer.id).reverse()
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Khata Management</h1>
          <button 
            onClick={() => setShowAddCustomerModal(true)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Add Customer to Khata"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/90 text-center">Customer credit aur udhaar track karein</p>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-2xl mb-1">₹{totalOutstanding}</p>
            <p className="text-white/80 text-sm">Outstanding Amount</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-6 h-6" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-2xl mb-1">{customersWithCredit}</p>
            <p className="text-white/80 text-sm">Customers with Credit</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Customer name ya phone search karein..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white border-gray-200 rounded-xl"
          />
          <VoiceInput
            onResult={(result) => setSearchQuery(result)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-gray-900 mb-1">Bandhu ka Tip</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                WhatsApp reminder bhej kar apna outstanding amount jaldi recover karein!
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Actions Bar - NEW FEATURE */}
        <div className="bg-white rounded-xl shadow-sm p-3 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'amount' | 'name' | 'days')}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="amount">Sort: Amount</option>
              <option value="name">Sort: Name</option>
              <option value="days">Sort: Days Overdue</option>
            </select>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Customers</option>
              <option value="30days">30+ Days</option>
              <option value="60days">60+ Days</option>
              <option value="90days">90+ Days</option>
            </select>

            <button
              onClick={handleExportKhata}
              className="ml-auto flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            <button
              onClick={handleBulkReminders}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm hover:shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Bulk Reminders
            </button>
          </div>
        </div>

        {/* Customer List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">All Customers ({filteredCustomers.length})</h3>
            <button 
              onClick={() => setShowAddCustomerModal(true)}
              className="text-[#1E88E5] text-sm flex items-center gap-1 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>

          {processedCustomers.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1E88E5]/10 to-[#FF6F00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-[#1E88E5]" />
              </div>
              <h4 className="text-gray-900 text-lg mb-2">
                {customers.length === 0 ? 'No Khata Customers Yet' : 'No Customers Found'}
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                {customers.length === 0 
                  ? 'Add your first customer jisko credit dena hai'
                  : searchQuery 
                    ? 'Try different search terms'
                    : 'No customers match your filter'
                }
              </p>
              <Button
                onClick={() => setShowAddCustomerModal(true)}
                className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Customer
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {processedCustomers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] rounded-full flex items-center justify-center text-white">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{customer.name}</h4>
                        <p className="text-gray-500 text-sm mb-1">{customer.phone}</p>
                        <p className="text-gray-400 text-xs">{customer.transactionCount} transactions • {customer.lastTransaction}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {customer.totalCredit > 0 ? (
                        <>
                          <p className="text-red-600 mb-1">₹{customer.totalCredit.toLocaleString()}</p>
                          <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">Pending</span>
                        </>
                      ) : (
                        <>
                          <p className="text-green-600 mb-1">₹0</p>
                          <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">Clear</span>
                        </>
                      )}
                    </div>
                  </div>

                  {customer.totalCredit > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleCollectPayment(customer)}
                        className="bg-gradient-to-r from-[#1E88E5] to-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:shadow-md transition-all text-sm"
                      >
                        <IndianRupee className="w-4 h-4" />
                        Collect Payment
                      </button>
                      <button
                        onClick={() => handleViewHistory(customer)}
                        className="bg-gray-50 text-gray-700 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm"
                      >
                        <History className="w-4 h-4" />
                        History
                      </button>
                      <button
                        onClick={() => handleSendReminder(customer)}
                        className="bg-green-50 text-green-700 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-green-100 transition-colors text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Reminder
                      </button>
                      <button 
                        onClick={() => handleMarkPaid(customer)}
                        className="bg-purple-50 text-purple-700 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Paid
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Option */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-gray-900 mb-1">Export Khata Report</h4>
              <p className="text-gray-600 text-sm">Download complete credit report</p>
            </div>
            <Button 
              onClick={handleExportKhata}
              className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Collection Modal - NEW FEATURE */}
      {showPaymentModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl text-gray-900">Collect Payment</h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-green-600" />
                  Voice enabled - Type ya bolo!
                </p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Customer</p>
              <p className="text-lg text-gray-900">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
                <p className="text-2xl text-red-600">₹{selectedCustomer.totalCredit}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                Payment Amount (₹) *
                <Badge variant="outline" className="text-xs">Voice</Badge>
              </label>
              <VoiceInput
                type="number"
                placeholder="Type or speak amount..."
                value={paymentAmount}
                onChange={setPaymentAmount}
                className="h-12"
                voiceType="number"
                voiceLabel="Payment amount"
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setPaymentAmount((selectedCustomer.totalCredit / 2).toString())}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200"
                >
                  Half (₹{(selectedCustomer.totalCredit / 2).toFixed(0)})
                </button>
                <button
                  onClick={() => setPaymentAmount(selectedCustomer.totalCredit.toString())}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100"
                >
                  Full Amount
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                Notes (Optional)
                <Badge variant="outline" className="text-xs">Voice</Badge>
              </label>
              <VoiceInput
                type="text"
                placeholder="Type or speak notes..."
                value={paymentNotes}
                onChange={setPaymentNotes}
                className="h-12"
                voiceType="text"
                voiceLabel="Payment notes"
              />
            </div>

            {/* Voice Tips */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800 mb-2 flex items-center gap-1">
                <Mic className="w-3 h-3" />
                <strong>Voice Tips:</strong>
              </p>
              <ul className="text-xs text-green-700 space-y-1 ml-4">
                <li>• Use voice for amount: "500" or "paanch sau"</li>
                <li>• Use quick buttons for common amounts</li>
                <li>• Add notes via voice if needed</li>
              </ul>
            </div>

            <Button
              onClick={handleSavePayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Receive Payment
            </Button>
          </div>
        </div>
      )}

      {/* Payment History Modal - NEW FEATURE */}
      {showHistoryModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900">Payment History</h2>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <p className="text-gray-900 text-lg mb-1">{selectedCustomer.name}</p>
              <p className="text-gray-500 text-sm mb-3">{selectedCustomer.phone}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Current Outstanding</p>
                  <p className="text-xl text-red-600">₹{selectedCustomer.totalCredit}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Total Transactions</p>
                  <p className="text-xl text-gray-900">{customerHistory.length}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-gray-900">Transaction History</h3>
              {customerHistory.length > 0 ? (
                customerHistory.map((entry) => (
                  <div key={entry.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            entry.type === 'credit' 
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {entry.type === 'credit' ? 'Credit Given' : 'Payment Received'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-IN', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-gray-600 mt-1">{entry.notes}</p>
                        )}
                      </div>
                      <p className={`text-lg ${
                        entry.type === 'credit' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {entry.type === 'credit' ? '+' : '-'}₹{entry.amount}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No transaction history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal - NEW FEATURE */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900">Add Customer to Khata</h2>
              <button 
                onClick={() => setShowAddCustomerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Customer Name *</label>
                <Input
                  type="text"
                  placeholder="Enter customer name..."
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone Number *</label>
                <Input
                  type="text"
                  placeholder="Enter phone number..."
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Credit Amount *</label>
                <Input
                  type="number"
                  placeholder="Enter credit amount..."
                  value={newCustomerCredit}
                  onChange={(e) => setNewCustomerCredit(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Notes (Optional)</label>
                <Input
                  type="text"
                  placeholder="Enter notes..."
                  value={newCustomerNotes}
                  onChange={(e) => setNewCustomerNotes(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <Button
              onClick={handleAddCustomer}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}