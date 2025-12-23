import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Screen, Product, StoreInfo } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  ArrowLeft,
  Share2,
  Eye,
  Plus,
  Edit,
  Trash2,
  Grid,
  List,
  Filter,
  Search,
  Download,
  MessageSquare,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Folder,
  Tag,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface CatalogCreatorProps {
  onNavigate: (screen: Screen) => void;
  products: Product[];
  storeInfo: StoreInfo;
}

interface CatalogItem extends Product {
  category?: string;
  description?: string;
  featured?: boolean;
  discount?: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export function CatalogCreator({ onNavigate, products, storeInfo }: CatalogCreatorProps) {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    // Convert products to catalog items
    const items: CatalogItem[] = products.map(p => ({
      ...p,
      category: p.category || 'Uncategorized',
      description: '',
      featured: false,
    }));
    setCatalogItems(items);

    // Generate categories
    const categoryMap = new Map<string, number>();
    items.forEach(item => {
      const cat = item.category || 'Uncategorized';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });

    const cats: Category[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      icon: getCategoryIcon(name),
      count,
    }));

    setCategories(cats);
  }, [products]);

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      'groceries': '🛒',
      'snacks': '🍿',
      'beverages': '🥤',
      'dairy': '🥛',
      'bakery': '🍞',
      'personal care': '🧴',
      'household': '🏠',
      'stationery': '✏️',
      'electronics': '📱',
      'uncategorized': '📦',
    };
    return icons[category.toLowerCase()] || '📦';
  };

  const filteredItems = catalogItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareCatalog = () => {
    const catalogText = `🏪 *${storeInfo.name}*\n${storeInfo.address}\n\n📱 *Digital Catalog*\n\n${
      filteredItems.slice(0, 10).map((item, i) => 
        `${i + 1}. *${item.name}*\n   ₹${item.price} ${item.stock > 0 ? '✅ In Stock' : '❌ Out of Stock'}`
      ).join('\n\n')
    }\n\n📞 Order करने के लिए:\n${storeInfo.phone}\n\n_Powered by Retail Bandhu_ 🚀`;

    const encodedText = encodeURIComponent(catalogText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    toast.success('WhatsApp se catalog share karein!');
  };

  const handleExportPDF = () => {
    toast.info('PDF export feature coming soon!');
  };

  const handleAddItem = (itemData: Partial<CatalogItem>) => {
    const newItem: CatalogItem = {
      id: Date.now().toString(),
      name: itemData.name || '',
      price: itemData.price || 0,
      stock: itemData.stock || 0,
      category: itemData.category,
      description: itemData.description,
      featured: itemData.featured || false,
      discount: itemData.discount,
    };

    setCatalogItems([newItem, ...catalogItems]);
    toast.success('Item added to catalog!');
    setShowAddModal(false);
  };

  const handleUpdateItem = (itemData: Partial<CatalogItem>) => {
    if (!editingItem) return;

    const updated = catalogItems.map(item =>
      item.id === editingItem.id ? { ...item, ...itemData } : item
    );
    setCatalogItems(updated);
    toast.success('Item updated successfully!');
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('Remove this item from catalog?')) return;
    setCatalogItems(catalogItems.filter(item => item.id !== id));
    toast.success('Item removed from catalog');
  };

  if (showPreview) {
    return (
      <CatalogPreview
        items={filteredItems}
        storeInfo={storeInfo}
        onBack={() => setShowPreview(false)}
        onShare={handleShareCatalog}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
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
              <h1 className="text-xl font-bold">Digital Catalog</h1>
              <p className="text-sm text-white/90">Create & Share</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowPreview(true)}
              size="sm"
              className="bg-white text-purple-600 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowAddModal(true);
              }}
              size="sm"
              className="bg-white text-purple-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white text-center">
            <div className="text-2xl font-bold">{catalogItems.length}</div>
            <div className="text-xs opacity-90">Total Items</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white text-center">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-xs opacity-90">Categories</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white text-center">
            <div className="text-2xl font-bold">
              {catalogItems.filter(i => i.stock > 0).length}
            </div>
            <div className="text-xs opacity-90">In Stock</div>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search & View Toggle */}
        <Card className="p-3">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              All ({catalogItems.length})
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
              >
                {cat.icon} {cat.name} ({cat.count})
              </Button>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={handleShareCatalog} variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-1 text-green-600" />
            WhatsApp
          </Button>
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1 text-blue-600" />
            Export PDF
          </Button>
          <Button onClick={() => setShowPreview(true)} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-1 text-purple-600" />
            Preview
          </Button>
        </div>

        {/* Items Display */}
        {filteredItems.length === 0 ? (
          <Card className="p-12 text-center">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              {searchQuery ? 'No items found' : 'No items in catalog'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchQuery 
                ? 'Try a different search term'
                : 'Add products to create your digital catalog'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            )}
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map(item => (
              <CatalogItemCard
                key={item.id}
                item={item}
                onEdit={() => {
                  setEditingItem(item);
                  setShowAddModal(true);
                }}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map(item => (
              <CatalogItemList
                key={item.id}
                item={item}
                onEdit={() => {
                  setEditingItem(item);
                  setShowAddModal(true);
                }}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddEditItemModal
          item={editingItem}
          categories={categories.map(c => c.name)}
          onSave={editingItem ? handleUpdateItem : handleAddItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// CATALOG ITEM CARD (GRID VIEW)
// ============================================

function CatalogItemCard({ item, onEdit, onDelete }: {
  item: CatalogItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {item.image ? (
          <ImageWithFallback 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            📦
          </div>
        )}
        {item.featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500">
            ⭐ Featured
          </Badge>
        )}
        {item.discount && item.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {item.discount}% OFF
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <Button onClick={onEdit} size="sm" className="bg-white text-gray-900 h-8 w-8 p-0">
            <Edit className="w-3 h-3" />
          </Button>
          <Button onClick={onDelete} size="sm" className="bg-red-600 text-white h-8 w-8 p-0">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
          {item.name}
        </h4>
        {item.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-blue-600">₹{item.price}</div>
            {item.discount && (
              <div className="text-xs text-gray-500 line-through">
                ₹{Math.round(item.price / (1 - item.discount / 100))}
              </div>
            )}
          </div>
          <Badge variant={item.stock > 0 ? 'default' : 'secondary'}>
            {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
          </Badge>
        </div>
        {item.category && (
          <div className="mt-2 text-xs text-gray-500">
            <Tag className="w-3 h-3 inline mr-1" />
            {item.category}
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================
// CATALOG ITEM LIST (LIST VIEW)
// ============================================

function CatalogItemList({ item, onEdit, onDelete }: {
  item: CatalogItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
          {item.image ? (
            <ImageWithFallback 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h4>
              {item.description && (
                <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-bold text-blue-600">₹{item.price}</div>
            {item.discount && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {item.discount}% OFF
              </Badge>
            )}
            <Badge variant={item.stock > 0 ? 'default' : 'secondary'}>
              {item.stock > 0 ? 'In Stock' : 'Out'}
            </Badge>
            {item.featured && (
              <Badge className="bg-orange-500">⭐</Badge>
            )}
          </div>

          {item.category && (
            <div className="text-xs text-gray-500 mt-1">
              <Tag className="w-3 h-3 inline mr-1" />
              {item.category}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <Button onClick={onEdit} variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button onClick={onDelete} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ============================================
// ADD/EDIT ITEM MODAL
// ============================================

function AddEditItemModal({ item, categories, onSave, onClose }: {
  item: CatalogItem | null;
  categories: string[];
  onSave: (data: Partial<CatalogItem>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    price: item?.price || 0,
    stock: item?.stock || 0,
    category: item?.category || '',
    description: item?.description || '',
    featured: item?.featured || false,
    discount: item?.discount || 0,
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter item name');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Please enter valid price');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {item ? 'Edit Item' : 'Add to Catalog'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="new">+ Add New Category</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description (optional)"
              rows={3}
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
            <Input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
              placeholder="0"
              max={100}
              min={0}
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <label className="font-medium text-gray-900 text-sm">Mark as Featured</label>
              <p className="text-xs text-gray-600">Show this item prominently in catalog</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            {item ? 'Update' : 'Add'} Item
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// CATALOG PREVIEW
// ============================================

function CatalogPreview({ items, storeInfo, onBack, onShare }: {
  items: CatalogItem[];
  storeInfo: StoreInfo;
  onBack: () => void;
  onShare: () => void;
}) {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <h1 className="text-lg font-bold">Catalog Preview</h1>
          <Button
            onClick={onShare}
            size="sm"
            className="bg-white text-purple-600 hover:bg-blue-50"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Store Header */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 text-center border-b">
        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">🏪</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{storeInfo.name}</h2>
        <p className="text-gray-600 mb-2">{storeInfo.address}</p>
        <p className="text-gray-700 font-medium">📞 {storeInfo.phone}</p>
        <Badge className="mt-3 bg-green-500">
          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
          Online Available
        </Badge>
      </div>

      {/* Products */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Our Products ({items.length})
          </h3>
          <Badge variant="secondary">{items.filter(i => i.stock > 0).length} Available</Badge>
        </div>

        {/* Featured Items */}
        {items.filter(i => i.featured).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2">
              ⭐ Featured Items
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {items.filter(i => i.featured).map(item => (
                <PreviewItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* All Items */}
        <div className="grid grid-cols-2 gap-3">
          {items.filter(i => !i.featured).map(item => (
            <PreviewItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button onClick={onShare} className="w-full bg-green-600 hover:bg-green-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          Share on WhatsApp
        </Button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Powered by Retail Bandhu 🚀
        </p>
      </div>
    </div>
  );
}

function PreviewItemCard({ item }: { item: CatalogItem }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {item.image ? (
          <ImageWithFallback 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}
        {item.discount && item.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {item.discount}% OFF
          </Badge>
        )}
        {item.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
          {item.name}
        </h4>
        {item.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-blue-600">₹{item.price}</div>
            {item.discount && item.discount > 0 && (
              <div className="text-xs text-gray-500 line-through">
                ₹{Math.round(item.price / (1 - item.discount / 100))}
              </div>
            )}
          </div>
          {item.stock > 0 && (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          )}
        </div>
      </div>
    </Card>
  );
}