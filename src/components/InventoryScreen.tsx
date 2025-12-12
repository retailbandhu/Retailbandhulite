import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, AlertTriangle, Edit2, Mic, Download, Upload, SlidersHorizontal, Trash2, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { storage } from '../utils/storage';
import { Screen, Product } from '../App';
import { VoiceButton } from './VoiceButton';

interface InventoryScreenProps {
  onNavigate: (screen: Screen) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export function InventoryScreen({ onNavigate, products, setProducts }: InventoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVoiceAdd, setShowVoiceAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'low' | 'high'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const lowStockProducts = products.filter(p => p.stock < 20);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', stock: '' });
      setShowAddModal(false);
    }
  };

  const handleVoiceAdd = () => {
    setShowVoiceAdd(true);
    // Simulate voice input
    setTimeout(() => {
      const product: Product = {
        id: Date.now().toString(),
        name: 'Cadbury Dairy Milk',
        price: 45,
        stock: 30
      };
      setProducts([...products, product]);
      setShowVoiceAdd(false);
    }, 2000);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      storage.setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      toast.success('Product updated!');
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Product delete karna hai?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      storage.setProducts(updatedProducts);
      toast.success('Product deleted!');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Product Name', 'Price', 'Stock'],
      ...products.map(p => [p.name, p.price, p.stock])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Inventory exported!');
  };

  // Filter and sort logic
  let filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply filter
  if (filterBy === 'low') {
    filteredProducts = filteredProducts.filter(p => p.stock < 20);
  } else if (filterBy === 'high') {
    filteredProducts = filteredProducts.filter(p => p.stock >= 50);
  }

  // Apply sort
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'stock') return b.stock - a.stock;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Inventory Management</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white/80 text-xs mb-1">Total Items</p>
            <p className="text-white text-xl">{products.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white/80 text-xs mb-1">Low Stock</p>
            <p className="text-white text-xl">{lowStockProducts.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white/80 text-xs mb-1">Total Value</p>
            <p className="text-white text-xl">
              ₹{products.reduce((sum, p) => sum + (p.price * p.stock), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Product search karein..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-white shadow-md"
          />
        </div>

        {/* Voice Add Option */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1">🎙️ Voice se Product Add</h3>
              <p className="text-white/90 text-sm">Bolo product ka naam aur details</p>
            </div>
            <VoiceButton onVoiceInput={handleVoiceAdd} size="md" />
          </div>
        </div>

        {/* Sort, Filter & Export Bar - NEW FEATURE */}
        <div className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="ml-auto flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Filter Options Panel */}
        {showFilters && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Filter by Stock Level:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterBy('all')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterBy === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterBy('low')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterBy === 'low'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Low Stock (&lt; 20)
              </button>
              <button
                onClick={() => setFilterBy('high')}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterBy === 'high'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                High Stock (≥ 50)
              </button>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-orange-900 mb-1">Low Stock Alert!</h4>
                <p className="text-orange-700 text-sm">
                  {lowStockProducts.length} products ki stock kam hai
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div>
          <h3 className="text-gray-900 mb-3">All Products ({filteredProducts.length})</h3>
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{product.name}</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">Price: ₹{product.price}</span>
                      <span className={`${product.stock < 20 ? 'text-orange-600' : 'text-gray-600'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="w-9 h-9 bg-[#1E88E5] bg-opacity-10 rounded-lg flex items-center justify-center text-[#1E88E5] hover:bg-opacity-20 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {product.stock < 20 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-orange-600 text-xs flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Stock jaldi khatam hone wala hai
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900">Naya Product Add Karein</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Product Name *</label>
              <Input
                type="text"
                placeholder="e.g., Maggie Masala"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Price (₹) *</label>
                <Input
                  type="number"
                  placeholder="12"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock (Qty) *</label>
                <Input
                  type="number"
                  placeholder="50"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <Button
              onClick={handleAddProduct}
              disabled={!newProduct.name || !newProduct.price || !newProduct.stock}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
            >
              Add Product
            </Button>
          </div>
        </div>
      )}

      {/* Voice Add Overlay */}
      {showVoiceAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] flex items-center justify-center animate-pulse">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Bandhu sun raha hai...</h3>
            <p className="text-gray-600">Product details bataiye</p>
          </div>
        </div>
      )}

      {/* Edit Product Modal - NEW FEATURE */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-900">Edit Product</h2>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Product Name *</label>
              <Input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Price (₹) *</label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  className="h-10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Stock (Qty) *</label>
                <Input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                  className="h-10"
                />
              </div>
            </div>

            <Button
              onClick={handleUpdateProduct}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}