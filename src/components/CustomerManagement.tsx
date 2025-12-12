import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Phone, Mail, MapPin, ShoppingBag, Calendar, TrendingUp, Edit, Trash2, Download, MessageCircle, Filter, X } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  totalSpent: number;
  lastVisit: string;
  visits: number;
  status: 'regular' | 'vip' | 'new';
}

interface CustomerManagementProps {
  onNavigate: (screen: Screen) => void;
}

export function CustomerManagement({ onNavigate }: CustomerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'vip' | 'regular' | 'new'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  // Load customers from storage
  useEffect(() => {
    const savedCustomers = storage.getCustomers();
    if (savedCustomers.length > 0) {
      setCustomers(savedCustomers);
    } else {
      // Set default customers on first load
      const defaultCustomers: Customer[] = [
        {
          id: '1',
          name: 'Ramesh Kumar',
          phone: '+91 98765 43210',
          email: 'ramesh@email.com',
          address: 'Shop 12, Main Market, Delhi',
          totalPurchases: 45,
          totalSpent: 12500,
          lastVisit: '2024-11-13',
          visits: 45,
          status: 'vip'
        },
        {
          id: '2',
          name: 'Sunita Devi',
          phone: '+91 98765 43211',
          address: 'House 23, Green Colony',
          totalPurchases: 28,
          totalSpent: 8900,
          lastVisit: '2024-11-12',
          visits: 28,
          status: 'regular'
        },
        {
          id: '3',
          name: 'Priya Sharma',
          phone: '+91 98765 43212',
          email: 'priya@email.com',
          totalPurchases: 12,
          totalSpent: 3400,
          lastVisit: '2024-11-11',
          visits: 12,
          status: 'regular'
        },
        {
          id: '4',
          name: 'Vijay Singh',
          phone: '+91 98765 43213',
          totalPurchases: 3,
          totalSpent: 850,
          lastVisit: '2024-11-10',
          visits: 3,
          status: 'new'
        }
      ];
      setCustomers(defaultCustomers);
      storage.setCustomers(defaultCustomers);
    }
  }, []);

  const handleAddCustomer = () => {
    // Validation
    if (!newCustomerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }
    if (!newCustomerPhone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    // Create new customer
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      email: newCustomerEmail.trim() || undefined,
      address: newCustomerAddress.trim() || undefined,
      totalPurchases: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      visits: 0,
      status: 'new'
    };

    // Add to list
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    storage.setCustomers(updatedCustomers);

    // Reset form
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerEmail('');
    setNewCustomerAddress('');
    setShowAddModal(false);

    toast.success(`${newCustomer.name} added successfully! 🎉`);
  };

  const handleDeleteCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer && confirm(`Delete ${customer.name}?`)) {
      const updatedCustomers = customers.filter(c => c.id !== id);
      setCustomers(updatedCustomers);
      storage.setCustomers(updatedCustomers);
      setSelectedCustomer(null);
      toast.success('Customer deleted');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'Address', 'Total Purchases', 'Total Spent', 'Last Visit', 'Status'],
      ...customers.map(c => [
        c.name,
        c.phone,
        c.email || '',
        c.address || '',
        c.totalPurchases,
        c.totalSpent,
        c.lastVisit,
        c.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Customer list exported!');
  };

  const handleBulkWhatsApp = () => {
    const message = `Namaste! 🙏%0A%0ASpecial offer sirf aapke liye!%0A%0AVisit our store today.%0A%0ARegards,%0A${localStorage.getItem('storeName') || 'Retail Bandhu'}`;
    
    // This would open WhatsApp for each customer - in real app, would use WhatsApp Business API
    toast.success(`WhatsApp blast ready for ${filteredCustomers.length} customers!`, { duration: 3000 });
  };

  const statusColors = {
    vip: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
    regular: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    new: 'bg-gradient-to-r from-green-500 to-green-600 text-white'
  };

  const statusIcons = {
    vip: '⭐',
    regular: '👤',
    new: '🆕'
  };

  // Apply status filter
  let filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  if (filterStatus !== 'all') {
    filteredCustomers = filteredCustomers.filter(c => c.status === filterStatus);
  }

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Customer Management</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/90 text-center">Apne customers ko manage karein</p>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow-md p-3 text-center">
            <p className="text-2xl text-[#1E88E5] mb-1">{totalCustomers}</p>
            <p className="text-gray-600 text-xs">Total Customers</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-3 text-center">
            <p className="text-2xl text-yellow-600 mb-1">{vipCustomers}</p>
            <p className="text-gray-600 text-xs">VIP Customers</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-3 text-center">
            <p className="text-lg text-green-600 mb-1">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-gray-600 text-xs">Total Revenue</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white border-gray-200 rounded-xl"
          />
        </div>

        {/* Filter & Export Bar - NEW FEATURE */}
        <div className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <div className="flex gap-2 flex-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                filterStatus === 'all'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setFilterStatus('vip')}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                filterStatus === 'vip'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              ⭐ VIP ({vipCustomers})
            </button>
            <button
              onClick={() => setFilterStatus('regular')}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                filterStatus === 'regular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Regular
            </button>
            <button
              onClick={() => setFilterStatus('new')}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                filterStatus === 'new'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              🆕 New
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={handleBulkWhatsApp}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm hover:shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Bulk WhatsApp
          </button>
        </div>

        {/* Customers List */}
        <div className="space-y-3">
          <h3 className="text-gray-900">All Customers ({filteredCustomers.length})</h3>
          {filteredCustomers.map((customer) => (
            <div 
              key={customer.id} 
              onClick={() => setSelectedCustomer(customer)}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-gray-900">{customer.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[customer.status]}`}>
                      {statusIcons[customer.status]} {customer.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="w-3 h-3 mr-2" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <Mail className="w-3 h-3 mr-2" />
                        {customer.email}
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <MapPin className="w-3 h-3 mr-2" />
                        {customer.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-[#1E88E5]">{customer.totalPurchases}</p>
                  <p className="text-gray-500 text-xs">Purchases</p>
                </div>
                <div className="text-center">
                  <p className="text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-purple-600">{customer.visits}</p>
                  <p className="text-gray-500 text-xs">Visits</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-gray-500 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Last visit: {customer.lastVisit}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-[#1E88E5] hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-1">Customer Insights</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Aapke VIP customers average ₹{(totalRevenue / vipCustomers).toFixed(0)} kharch karte hain. 
                Inhe special offers bhejkar retention badhayein!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Customer Name *</label>
                <Input 
                  type="text" 
                  placeholder="Enter name" 
                  className="h-12"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Phone Number *</label>
                <Input 
                  type="tel" 
                  placeholder="+91 XXXXX XXXXX" 
                  className="h-12"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Email (Optional)</label>
                <Input 
                  type="email" 
                  placeholder="customer@email.com" 
                  className="h-12"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Address (Optional)</label>
                <Input 
                  type="text" 
                  placeholder="Enter address" 
                  className="h-12"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCustomer}
                className="flex-1 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
              >
                Add Customer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">{selectedCustomer.name}</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className={`px-4 py-2 rounded-xl ${statusColors[selectedCustomer.status]} inline-block`}>
                {statusIcons[selectedCustomer.status]} {selectedCustomer.status.toUpperCase()} Customer
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-3 text-[#1E88E5]" />
                  {selectedCustomer.phone}
                </div>
                {selectedCustomer.email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-[#1E88E5]" />
                    {selectedCustomer.email}
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-[#1E88E5]" />
                    {selectedCustomer.address}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl text-blue-600 mb-1">{selectedCustomer.totalPurchases}</p>
                  <p className="text-gray-600 text-sm">Total Purchases</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl text-green-600 mb-1">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="text-gray-900 mb-2">Purchase History</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Visit</span>
                    <span className="text-gray-900">{selectedCustomer.lastVisit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Visits</span>
                    <span className="text-gray-900">{selectedCustomer.visits} times</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg. Spend</span>
                    <span className="text-gray-900">₹{(selectedCustomer.totalSpent / selectedCustomer.totalPurchases).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}