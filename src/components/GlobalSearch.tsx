import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Screen, Product } from '../types';
import {
  Search,
  X,
  TrendingUp,
  Package,
  Users,
  FileText,
  ShoppingCart,
  Settings,
  Clock,
  Command,
} from 'lucide-react';

interface SearchResult {
  type: 'product' | 'screen' | 'action' | 'customer';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  products: Product[];
}

export function GlobalSearch({ isOpen, onClose, onNavigate, products }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // All searchable screens and actions
  const searchableItems: Omit<SearchResult, 'action'>[] = [
    // Screens
    { type: 'screen', title: 'Dashboard', subtitle: 'Home screen', icon: <TrendingUp className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Billing', subtitle: 'Create new bill', icon: <FileText className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Inventory', subtitle: 'Manage products', icon: <Package className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Quick POS', subtitle: 'Fast checkout', icon: <ShoppingCart className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Parties', subtitle: 'Customer & suppliers', icon: <Users className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Reports', subtitle: 'Business analytics', icon: <TrendingUp className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Settings', subtitle: 'App settings', icon: <Settings className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Catalog', subtitle: 'Digital catalog', icon: <Package className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'WhatsApp Automation', subtitle: 'Bulk messages', icon: <FileText className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Business Insights', subtitle: 'Analytics & reports', icon: <TrendingUp className="w-4 h-4" />, category: 'Navigation' },
    { type: 'screen', title: 'Barcode Scanner', subtitle: 'Scan products', icon: <Package className="w-4 h-4" />, category: 'Navigation' },
    
    // Quick Actions
    { type: 'action', title: 'New Bill', subtitle: 'Create a new bill', icon: <FileText className="w-4 h-4" />, category: 'Quick Actions' },
    { type: 'action', title: 'Add Product', subtitle: 'Add to inventory', icon: <Package className="w-4 h-4" />, category: 'Quick Actions' },
    { type: 'action', title: 'View Sales', subtitle: 'Today\'s sales', icon: <TrendingUp className="w-4 h-4" />, category: 'Quick Actions' },
  ];

  // Search function with fuzzy matching
  const searchItems = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const matches: SearchResult[] = [];

    // Search screens and actions
    searchableItems.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const subtitleMatch = item.subtitle?.toLowerCase().includes(query);
      
      if (titleMatch || subtitleMatch) {
        matches.push({
          ...item,
          action: () => {
            if (item.type === 'screen') {
              const screenMap: { [key: string]: Screen } = {
                'dashboard': 'dashboard',
                'billing': 'billing',
                'inventory': 'inventory',
                'quick pos': 'quick-pos',
                'parties': 'parties',
                'reports': 'reports',
                'settings': 'settings',
                'catalog': 'catalog',
                'whatsapp automation': 'whatsapp',
                'business insights': 'business-insights',
                'barcode scanner': 'barcode-scanner',
              };
              const screen = screenMap[item.title.toLowerCase()];
              if (screen) {
                onNavigate(screen);
                onClose();
              }
            } else if (item.type === 'action') {
              const actionMap: { [key: string]: Screen } = {
                'new bill': 'billing',
                'add product': 'inventory',
                'view sales': 'sales-history',
              };
              const screen = actionMap[item.title.toLowerCase()];
              if (screen) {
                onNavigate(screen);
                onClose();
              }
            }
          },
        });
      }
    });

    // Search products
    products.forEach(product => {
      if (product.name.toLowerCase().includes(query)) {
        matches.push({
          type: 'product',
          title: product.name,
          subtitle: `₹${product.price} • Stock: ${product.stock}`,
          icon: <Package className="w-4 h-4" />,
          category: 'Products',
          action: () => {
            onNavigate('inventory');
            onClose();
          },
        });
      }
    });

    return matches.slice(0, 10); // Limit to 10 results
  };

  // Update results when query changes
  useEffect(() => {
    const matches = searchItems(query);
    setResults(matches);
    setSelectedIndex(0);
  }, [query, products]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  if (!isOpen) return null;

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as { [key: string]: SearchResult[] });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <Card className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, screens, actions..."
            className="border-0 focus-visible:ring-0 text-lg"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query && results.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No results found</p>
              <p className="text-sm text-gray-500">Try a different search term</p>
            </div>
          ) : query ? (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <h3 className="text-xs font-medium text-gray-500 uppercase">{category}</h3>
                </div>
                {items.map((result, index) => {
                  const globalIndex = results.indexOf(result);
                  return (
                    <button
                      key={globalIndex}
                      onClick={result.action}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        globalIndex === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        result.type === 'product' ? 'bg-green-100 text-green-600' :
                        result.type === 'screen' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {result.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-sm text-gray-600">{result.subtitle}</div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {result.type}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="p-8">
              <div className="text-center mb-6">
                <Command className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Quick Search</h3>
                <p className="text-sm text-gray-600">
                  Type to search products, screens, and actions
                </p>
              </div>

              {/* Recent/Popular searches could go here */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Popular Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Dashboard', 'New Bill', 'Inventory', 'Quick POS', 'Reports'].map(term => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border rounded text-xs">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border rounded text-xs">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border rounded text-xs">Esc</kbd>
                Close
              </span>
            </div>
            <span>{results.length} results</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Keyboard shortcut to open search (Cmd+K or Ctrl+K)
export function useGlobalSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}