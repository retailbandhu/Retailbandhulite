import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Package, 
  Users, 
  Receipt, 
  TrendingDown, 
  Clock, 
  ArrowRight, 
  Zap 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { VoiceButton } from './VoiceButton';
import { Screen, Product, Customer, Bill } from '../types';

interface GlobalVoiceSearchProps {
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
  products: Product[];
  customers: Customer[];
  bills: Bill[];
  expenses?: any[];
}

type SearchResult = {
  id: string;
  type: 'product' | 'customer' | 'bill' | 'expense';
  title: string;
  subtitle: string;
  icon: any;
  action: () => void;
  color: string;
};

export function GlobalVoiceSearch({ 
  onClose, 
  onNavigate, 
  products, 
  customers, 
  bills,
  expenses = []
}: GlobalVoiceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    const recent = localStorage.getItem('recent-voice-searches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
    
    // Focus input
    inputRef.current?.focus();
  }, []);

  // Perform search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const foundResults: SearchResult[] = [];

    // Search Products
    products.forEach(product => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const skuMatch = product.sku?.toLowerCase().includes(query);
      
      if (nameMatch || skuMatch) {
        foundResults.push({
          id: `product-${product.id}`,
          type: 'product',
          title: product.name,
          subtitle: `₹${product.price} • Stock: ${product.stock || 0}`,
          icon: <Package className="w-5 h-5" />,
          color: 'bg-blue-100 text-blue-600',
          action: () => {
            saveRecentSearch(searchQuery);
            onNavigate('inventory');
            toast.success(`Opening ${product.name}`);
            onClose();
          }
        });
      }
    });

    // Search Customers
    customers.forEach(customer => {
      const nameMatch = customer.name.toLowerCase().includes(query);
      const phoneMatch = customer.phone?.includes(query);
      
      if (nameMatch || phoneMatch) {
        foundResults.push({
          id: `customer-${customer.id}`,
          type: 'customer',
          title: customer.name,
          subtitle: customer.phone || 'No phone',
          icon: <Users className="w-5 h-5" />,
          color: 'bg-green-100 text-green-600',
          action: () => {
            saveRecentSearch(searchQuery);
            onNavigate('customers');
            toast.success(`Opening ${customer.name}'s profile`);
            onClose();
          }
        });
      }
    });

    // Search Bills
    bills.forEach(bill => {
      const customerMatch = bill.customerName?.toLowerCase().includes(query);
      const amountMatch = bill.total?.toString().includes(query);
      const billNoMatch = bill.billNo?.toString().includes(query);
      
      if (customerMatch || amountMatch || billNoMatch) {
        foundResults.push({
          id: `bill-${bill.id}`,
          type: 'bill',
          title: `Bill #${bill.billNo || bill.id}`,
          subtitle: `${bill.customerName || 'Unknown'} • ₹${bill.total}`,
          icon: <Receipt className="w-5 h-5" />,
          color: 'bg-purple-100 text-purple-600',
          action: () => {
            saveRecentSearch(searchQuery);
            onNavigate('bills');
            toast.success(`Opening Bill #${bill.billNo || bill.id}`);
            onClose();
          }
        });
      }
    });

    // Search Expenses (if provided)
    expenses.forEach((expense: any) => {
      const nameMatch = expense.name?.toLowerCase().includes(query);
      const categoryMatch = expense.category?.toLowerCase().includes(query);
      
      if (nameMatch || categoryMatch) {
        foundResults.push({
          id: `expense-${expense.id}`,
          type: 'expense',
          title: expense.name || 'Unnamed expense',
          subtitle: `${expense.category} • ₹${expense.amount}`,
          icon: <TrendingDown className="w-5 h-5" />,
          color: 'bg-red-100 text-red-600',
          action: () => {
            saveRecentSearch(searchQuery);
            onNavigate('expenses');
            toast.success(`Opening ${expense.name}`);
            onClose();
          }
        });
      }
    });

    setResults(foundResults);
    setSelectedIndex(0);
    setIsSearching(false);
  }, [searchQuery, products, customers, bills, expenses]);

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-voice-searches', JSON.stringify(updated));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        results[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onClose]);

  // Handle voice input
  const handleVoiceInput = (transcript: string) => {
    setSearchQuery(transcript);
    toast.success('🎤 Voice search: ' + transcript);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // Use recent search
  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Group results by type
  const groupedResults = {
    products: results.filter(r => r.type === 'product'),
    customers: results.filter(r => r.type === 'customer'),
    bills: results.filter(r => r.type === 'bill'),
    expenses: results.filter(r => r.type === 'expense')
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, customers, bills... (Try voice! 🎤)"
              className="flex-1 text-lg outline-none"
            />
            
            {/* Voice Button */}
            <div onClick={(e) => e.stopPropagation()}>
              <VoiceButton
                onTranscript={handleVoiceInput}
                placeholder="Search"
                size="sm"
              />
            </div>

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={handleClear}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Quick tip */}
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Tip: Use voice to search faster! Press ESC to close
          </p>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading State */}
          {isSearching && (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600">Searching...</p>
            </div>
          )}

          {/* No Query State */}
          {!searchQuery && !isSearching && (
            <div className="p-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-700">Recent Searches</p>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentSearch(search)}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onNavigate('inventory');
                      onClose();
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <Package className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-sm font-medium">All Products</p>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('customers');
                      onClose();
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    <Users className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-sm font-medium">All Customers</p>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('bills');
                      onClose();
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                  >
                    <Receipt className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-sm font-medium">All Bills</p>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('expenses');
                      onClose();
                    }}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all"
                  >
                    <TrendingDown className="w-5 h-5 text-red-600 mb-2" />
                    <p className="text-sm font-medium">All Expenses</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {searchQuery && !isSearching && results.length > 0 && (
            <div className="p-6 space-y-6">
              {/* Products */}
              {groupedResults.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-gray-700">
                      Products ({groupedResults.products.length})
                    </p>
                  </div>
                  <div className="space-y-2">
                    {groupedResults.products.map((result, idx) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          onClick={result.action}
                          className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-4 ${
                            globalIndex === selectedIndex
                              ? 'bg-blue-50 border-2 border-blue-300'
                              : 'border-2 border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${result.color}`}>
                            {result.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{result.title}</p>
                            <p className="text-sm text-gray-600">{result.subtitle}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customers */}
              {groupedResults.customers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">
                      Customers ({groupedResults.customers.length})
                    </p>
                  </div>
                  <div className="space-y-2">
                    {groupedResults.customers.map((result) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          onClick={result.action}
                          className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-4 ${
                            globalIndex === selectedIndex
                              ? 'bg-green-50 border-2 border-green-300'
                              : 'border-2 border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${result.color}`}>
                            {result.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{result.title}</p>
                            <p className="text-sm text-gray-600">{result.subtitle}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bills */}
              {groupedResults.bills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-medium text-gray-700">
                      Bills ({groupedResults.bills.length})
                    </p>
                  </div>
                  <div className="space-y-2">
                    {groupedResults.bills.map((result) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          onClick={result.action}
                          className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-4 ${
                            globalIndex === selectedIndex
                              ? 'bg-purple-50 border-2 border-purple-300'
                              : 'border-2 border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${result.color}`}>
                            {result.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{result.title}</p>
                            <p className="text-sm text-gray-600">{result.subtitle}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Expenses */}
              {groupedResults.expenses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <p className="text-sm font-medium text-gray-700">
                      Expenses ({groupedResults.expenses.length})
                    </p>
                  </div>
                  <div className="space-y-2">
                    {groupedResults.expenses.map((result) => {
                      const globalIndex = results.indexOf(result);
                      return (
                        <button
                          key={result.id}
                          onClick={result.action}
                          className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-4 ${
                            globalIndex === selectedIndex
                              ? 'bg-red-50 border-2 border-red-300'
                              : 'border-2 border-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${result.color}`}>
                            {result.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{result.title}</p>
                            <p className="text-sm text-gray-600">{result.subtitle}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No Results */}
          {searchQuery && !isSearching && results.length === 0 && (
            <div className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No results found</p>
              <p className="text-sm text-gray-600 mb-4">
                Try searching with different keywords or use voice search
              </p>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">ESC</kbd>
                Close
              </span>
            </div>
            <span>{results.length} results</span>
          </div>
        </div>
      </div>
    </div>
  );
}