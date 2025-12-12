import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Screen } from '../App';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Upload,
  MessageSquare,
  ChevronRight,
  IndianRupee,
  Calendar,
  User,
  Building2,
  X,
  Save,
  ChevronLeft,
} from 'lucide-react';

interface PartyManagementProps {
  onNavigate: (screen: Screen) => void;
}

interface Party {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'customer' | 'supplier';
  address?: string;
  gstin?: string;
  balance: number;
  balanceType: 'receivable' | 'payable';
  lastTransaction?: string;
  totalTransactions: number;
  createdAt: string;
}

export function PartyManagement({ onNavigate }: PartyManagementProps) {
  const [parties, setParties] = useState<Party[]>([]);
  const [filteredParties, setFilteredParties] = useState<Party[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadParties();
  }, []);

  useEffect(() => {
    filterParties();
  }, [searchQuery, filterType, parties]);

  const loadParties = () => {
    // Mock data - in production, this would fetch from backend
    const mockParties: Party[] = [
      {
        id: '1',
        name: 'Ramesh Kumar',
        phone: '+91-9876543210',
        email: 'ramesh@gmail.com',
        type: 'customer',
        address: 'Shop 12, Nehru Market, Delhi',
        balance: 5000,
        balanceType: 'receivable',
        totalTransactions: 45,
        lastTransaction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'Priya Enterprises',
        phone: '+91-9876543211',
        type: 'supplier',
        address: 'Warehouse 5, Industrial Area, Gurgaon',
        gstin: '07AABCU9603R1ZM',
        balance: 12000,
        balanceType: 'payable',
        totalTransactions: 23,
        lastTransaction: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        name: 'Amit Sharma',
        phone: '+91-9876543212',
        type: 'customer',
        address: 'B-45, Lajpat Nagar, Delhi',
        balance: 0,
        balanceType: 'receivable',
        totalTransactions: 12,
        lastTransaction: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        name: 'Sunita Devi',
        phone: '+91-9876543213',
        type: 'customer',
        address: 'C-78, Karol Bagh, Delhi',
        balance: 2500,
        balanceType: 'receivable',
        totalTransactions: 67,
        lastTransaction: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        name: 'Delhi Distributors',
        phone: '+91-9876543214',
        email: 'info@delhidist.com',
        type: 'supplier',
        address: 'Plot 23, Okhla Industrial Estate',
        gstin: '07AABCX9603R1ZM',
        balance: 8000,
        balanceType: 'payable',
        totalTransactions: 34,
        lastTransaction: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setParties(mockParties);
  };

  const filterParties = () => {
    let filtered = parties;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        p.email?.toLowerCase().includes(query)
      );
    }

    setFilteredParties(filtered);
  };

  const handleAddParty = (partyData: Partial<Party>) => {
    const newParty: Party = {
      id: Date.now().toString(),
      name: partyData.name || '',
      phone: partyData.phone || '',
      email: partyData.email,
      type: partyData.type || 'customer',
      address: partyData.address,
      gstin: partyData.gstin,
      balance: 0,
      balanceType: 'receivable',
      totalTransactions: 0,
      createdAt: new Date().toISOString(),
    };

    setParties([newParty, ...parties]);
    toast.success(`${newParty.type === 'customer' ? 'Customer' : 'Supplier'} added successfully!`);
    setShowAddModal(false);
  };

  const handleEditParty = (partyData: Partial<Party>) => {
    if (!selectedParty) return;
    
    const updated = parties.map(p => 
      p.id === selectedParty.id 
        ? { ...p, ...partyData }
        : p
    );
    setParties(updated);
    toast.success('Party updated successfully!');
    setShowAddModal(false);
    setSelectedParty(null);
  };

  const handleDeleteParty = (id: string) => {
    if (!confirm('Are you sure you want to delete this party?')) return;
    
    setParties(parties.filter(p => p.id !== id));
    toast.success('Party deleted successfully!');
    if (showDetails && selectedParty?.id === id) {
      setShowDetails(false);
      setSelectedParty(null);
    }
  };

  const handleViewDetails = (party: Party) => {
    setSelectedParty(party);
    setShowDetails(true);
  };

  const calculateStats = () => {
    const customers = parties.filter(p => p.type === 'customer');
    const suppliers = parties.filter(p => p.type === 'supplier');
    
    const totalReceivable = customers.reduce((sum, p) => 
      p.balanceType === 'receivable' ? sum + p.balance : sum, 0
    );
    
    const totalPayable = suppliers.reduce((sum, p) => 
      p.balanceType === 'payable' ? sum + p.balance : sum, 0
    );

    return {
      totalCustomers: customers.length,
      totalSuppliers: suppliers.length,
      totalReceivable,
      totalPayable,
    };
  };

  const stats = calculateStats();

  if (showDetails && selectedParty) {
    return (
      <PartyDetails 
        party={selectedParty}
        onBack={() => {
          setShowDetails(false);
          setSelectedParty(null);
        }}
        onEdit={() => {
          setShowDetails(false);
          setShowAddModal(true);
        }}
        onDelete={handleDeleteParty}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onNavigate('home')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Party Management</h1>
              <p className="text-sm text-white/90">Customers & Suppliers</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSelectedParty(null);
              setShowAddModal(true);
            }}
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Party
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs opacity-90">Customers</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <div className="text-xs opacity-75 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              ₹{stats.totalReceivable.toLocaleString()} to receive
            </div>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-xs opacity-90">Suppliers</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
            <div className="text-xs opacity-75 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              ₹{stats.totalPayable.toLocaleString()} to pay
            </div>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search & Filter */}
        <Card className="p-3">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, email..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterType('all')}
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              All ({parties.length})
            </Button>
            <Button
              onClick={() => setFilterType('customer')}
              variant={filterType === 'customer' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              Customers ({parties.filter(p => p.type === 'customer').length})
            </Button>
            <Button
              onClick={() => setFilterType('supplier')}
              variant={filterType === 'supplier' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              Suppliers ({parties.filter(p => p.type === 'supplier').length})
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-1" />
            WhatsApp
          </Button>
        </div>

        {/* Party List */}
        <div className="space-y-3">
          {filteredParties.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">
                {searchQuery ? 'No parties found' : 'No parties yet'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Add your first customer or supplier to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Party
                </Button>
              )}
            </Card>
          ) : (
            filteredParties.map(party => (
              <PartyCard
                key={party.id}
                party={party}
                onView={() => handleViewDetails(party)}
                onEdit={() => {
                  setSelectedParty(party);
                  setShowAddModal(true);
                }}
                onDelete={() => handleDeleteParty(party.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddEditPartyModal
          party={selectedParty}
          onSave={selectedParty ? handleEditParty : handleAddParty}
          onClose={() => {
            setShowAddModal(false);
            setSelectedParty(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// PARTY CARD COMPONENT
// ============================================

function PartyCard({ party, onView, onEdit, onDelete }: {
  party: Party;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const getTimeSince = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 truncate">{party.name}</h3>
            <Badge variant={party.type === 'customer' ? 'default' : 'secondary'} className="text-xs">
              {party.type === 'customer' ? 'Customer' : 'Supplier'}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{party.phone}</span>
            </div>
            {party.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-3 h-3" />
                <span className="truncate">{party.email}</span>
              </div>
            )}
            {party.lastTransaction && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Last txn: {getTimeSince(party.lastTransaction)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 ml-2">
          <Button onClick={onEdit} variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={onDelete} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Balance Display */}
      {party.balance > 0 && (
        <div className={`p-3 rounded-lg mb-3 ${
          party.balanceType === 'receivable' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className={`w-4 h-4 ${
                party.balanceType === 'receivable' ? 'text-green-600' : 'text-red-600'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {party.balanceType === 'receivable' ? 'To Receive' : 'To Pay'}
              </span>
            </div>
            <span className={`text-lg font-bold ${
              party.balanceType === 'receivable' ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{party.balance.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* View Details Button */}
      <Button onClick={onView} variant="outline" size="sm" className="w-full">
        View Details
        <ChevronRight className="w-4 h-4 ml-auto" />
      </Button>
    </Card>
  );
}

// ============================================
// ADD/EDIT PARTY MODAL
// ============================================

function AddEditPartyModal({ party, onSave, onClose }: {
  party: Party | null;
  onSave: (data: Partial<Party>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: party?.name || '',
    phone: party?.phone || '',
    email: party?.email || '',
    type: party?.type || 'customer',
    address: party?.address || '',
    gstin: party?.gstin || '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter party name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {party ? 'Edit Party' : 'Add Party'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Party Type</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setFormData({ ...formData, type: 'customer' })}
                variant={formData.type === 'customer' ? 'default' : 'outline'}
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Customer
              </Button>
              <Button
                onClick={() => setFormData({ ...formData, type: 'supplier' })}
                variant={formData.type === 'supplier' ? 'default' : 'outline'}
                className="w-full"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Supplier
              </Button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter party name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91-XXXXXXXXXX"
              type="tel"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              type="email"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete address"
              rows={3}
            />
          </div>

          {/* GSTIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN (Optional)</label>
            <Input
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
              placeholder="07AABCU9603R1ZM"
              maxLength={15}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {party ? 'Update' : 'Add'} Party
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// PARTY DETAILS VIEW
// ============================================

function PartyDetails({ party, onBack, onEdit, onDelete }: {
  party: Party;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}) {
  // Mock transaction history
  const transactions = [
    { id: '1', date: '2024-12-08', type: 'Sale', amount: 5000, status: 'paid' },
    { id: '2', date: '2024-12-05', type: 'Sale', amount: 3000, status: 'pending' },
    { id: '3', date: '2024-12-01', type: 'Sale', amount: 2500, status: 'paid' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{party.name}</h1>
              <Badge variant="secondary" className="mt-1">
                {party.type === 'customer' ? 'Customer' : 'Supplier'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete(party.id)}
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        {party.balance > 0 && (
          <Card className="bg-white/10 backdrop-blur border-white/20 p-4 text-white">
            <div className="text-center">
              <div className="text-sm opacity-90 mb-1">
                {party.balanceType === 'receivable' ? 'Amount to Receive' : 'Amount to Pay'}
              </div>
              <div className="text-3xl font-bold">₹{party.balance.toLocaleString()}</div>
            </div>
          </Card>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Contact Information */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-medium text-gray-900">{party.phone}</div>
              </div>
              <Button size="sm" variant="outline">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>

            {party.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium text-gray-900">{party.email}</div>
                </div>
              </div>
            )}

            {party.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="font-medium text-gray-900">{party.address}</div>
                </div>
              </div>
            )}

            {party.gstin && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">GSTIN</div>
                  <div className="font-medium text-gray-900 font-mono">{party.gstin}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Transaction Stats */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-3">Transaction Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{party.totalTransactions}</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {party.lastTransaction ? new Date(party.lastTransaction).toLocaleDateString() : '-'}
              </div>
              <div className="text-sm text-gray-600">Last Transaction</div>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-3">Recent Transactions</h3>
          <div className="space-y-2">
            {transactions.map(txn => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{txn.type}</div>
                  <div className="text-sm text-gray-600">{new Date(txn.date).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">₹{txn.amount.toLocaleString()}</div>
                  <Badge variant={txn.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}
