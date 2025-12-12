import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { Screen, Product } from '../App';
import {
  ArrowLeft,
  Camera,
  Scan,
  Package,
  Plus,
  Search,
  X,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Keyboard,
  History,
  Trash2,
  ShoppingCart,
  Edit,
  IndianRupee,
  Box,
} from 'lucide-react';

interface BarcodeScannerProps {
  onNavigate: (screen: Screen) => void;
  products: Product[];
  onProductScanned?: (product: Product) => void;
}

interface ScanHistory {
  id: string;
  code: string;
  product?: Product;
  time: string;
  status: 'found' | 'not-found';
}

export function BarcodeScanner({ onNavigate, products, onProductScanned }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);

  // Mock barcode database (in production, this would be in backend/database)
  const barcodeDatabase: { [key: string]: string } = {
    '8901058843729': '1', // Example product IDs
    '8901396311720': '2',
    '8901063100602': '3',
    '8902719001234': '4',
    '8901234567890': '5',
  };

  // Auto-generate barcodes for products that don't have them
  useEffect(() => {
    products.forEach((product, index) => {
      if (!barcodeDatabase[`890100000${index + 1000}`]) {
        barcodeDatabase[`890100000${index + 1000}`] = product.id;
      }
    });
  }, [products]);

  const handleCameraScan = () => {
    setIsScanning(true);
    
    // Simulate camera scanning (in real app, use camera API or library)
    setTimeout(() => {
      // Pick a random barcode from the database
      const codes = Object.keys(barcodeDatabase);
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      handleCodeScanned(randomCode);
      setIsScanning(false);
    }, 2000);
  };

  const handleManualScan = () => {
    if (!manualCode.trim()) {
      toast.error('Please enter a barcode');
      return;
    }
    handleCodeScanned(manualCode);
    setManualCode('');
  };

  const handleCodeScanned = (code: string) => {
    const productId = barcodeDatabase[code];
    const product = products.find(p => p.id === productId);
    
    const historyEntry: ScanHistory = {
      id: Date.now().toString(),
      code,
      product,
      time: new Date().toLocaleTimeString(),
      status: product ? 'found' : 'not-found',
    };

    setScanHistory([historyEntry, ...scanHistory]);
    setFoundProduct(product || null);
    setShowProductDetails(true);

    if (product) {
      toast.success(`Product found: ${product.name}`);
      
      // Auto-add to cart if callback provided
      if (onProductScanned) {
        onProductScanned(product);
      }
    } else {
      toast.error('Product not found in database');
    }
  };

  const handleAddToInventory = () => {
    if (!foundProduct) return;
    onNavigate('inventory');
    toast.info('Navigate to inventory to update stock');
  };

  const handleQuickCheckout = () => {
    if (!foundProduct) return;
    onNavigate('quick-pos');
  };

  const clearHistory = () => {
    if (!confirm('Clear scan history?')) return;
    setScanHistory([]);
    toast.success('History cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sticky top-0 z-10 shadow-lg">
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
              <h1 className="text-xl font-bold">Barcode Scanner</h1>
              <p className="text-sm text-white/90">Quick Product Lookup</p>
            </div>
          </div>
          <Button
            onClick={() => setShowHistory(true)}
            size="sm"
            className="bg-white text-indigo-600 hover:bg-indigo-50"
          >
            <History className="w-4 h-4 mr-1" />
            History
          </Button>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            onClick={() => setScanMode('camera')}
            variant={scanMode === 'camera' ? 'secondary' : 'ghost'}
            size="sm"
            className={scanMode === 'camera' ? 'bg-white text-indigo-600 flex-1' : 'text-white hover:bg-white/20 flex-1'}
          >
            <Camera className="w-4 h-4 mr-1" />
            Camera Scan
          </Button>
          <Button
            onClick={() => setScanMode('manual')}
            variant={scanMode === 'manual' ? 'secondary' : 'ghost'}
            size="sm"
            className={scanMode === 'manual' ? 'bg-white text-indigo-600 flex-1' : 'text-white hover:bg-white/20 flex-1'}
          >
            <Keyboard className="w-4 h-4 mr-1" />
            Manual Entry
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Scanner Area */}
        {scanMode === 'camera' ? (
          <Card className="p-6">
            <div className="aspect-square bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border-2 border-dashed border-indigo-300">
              {isScanning ? (
                <>
                  <div className="absolute inset-0 bg-indigo-600/10 animate-pulse" />
                  <Scan className="w-24 h-24 text-indigo-600 animate-bounce mb-4" />
                  <p className="font-medium text-indigo-900">Scanning...</p>
                  <p className="text-sm text-indigo-600">Point camera at barcode</p>
                  
                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent animate-scan" />
                </>
              ) : (
                <>
                  <Camera className="w-24 h-24 text-indigo-400 mb-4" />
                  <p className="font-medium text-gray-900 mb-2">Ready to Scan</p>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Position barcode within the frame
                  </p>
                  <Button
                    onClick={handleCameraScan}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Start Scanning
                  </Button>
                </>
              )}
            </div>

            {/* Tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 text-sm mb-2">📱 Scanning Tips:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Hold steady and ensure good lighting</li>
                <li>• Keep barcode flat and visible</li>
                <li>• Try different angles if not detecting</li>
              </ul>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Keyboard className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Manual Barcode Entry</h3>
              <p className="text-sm text-gray-600">Type or paste the barcode number</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode Number
                </label>
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                  placeholder="Enter barcode (e.g., 8901058843729)"
                  className="text-center text-lg tracking-wider font-mono"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleManualScan}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Product
              </Button>
            </div>

            {/* Common Barcodes for Testing */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 text-sm mb-2">🧪 Test Barcodes:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(barcodeDatabase).slice(0, 3).map(code => (
                  <Button
                    key={code}
                    onClick={() => {
                      setManualCode(code);
                      handleCodeScanned(code);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs font-mono"
                  >
                    {code}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Recent Scans */}
        {scanHistory.length > 0 && !showHistory && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Recent Scans</h3>
              <Button onClick={() => setShowHistory(true)} variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {scanHistory.slice(0, 3).map(scan => (
                <ScanHistoryItem
                  key={scan.id}
                  scan={scan}
                  onProductClick={() => {
                    setFoundProduct(scan.product || null);
                    setShowProductDetails(true);
                  }}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-indigo-600">{scanHistory.length}</div>
            <div className="text-xs text-gray-600">Total Scans</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {scanHistory.filter(s => s.status === 'found').length}
            </div>
            <div className="text-xs text-gray-600">Found</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-red-600">
              {scanHistory.filter(s => s.status === 'not-found').length}
            </div>
            <div className="text-xs text-gray-600">Not Found</div>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-600" />
            How it Works
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Scan product barcodes to instantly lookup details</li>
            <li>• Add scanned products directly to billing</li>
            <li>• Update inventory with quick stock entry</li>
            <li>• Track scan history for analytics</li>
          </ul>
        </Card>
      </div>

      {/* Product Details Modal */}
      {showProductDetails && (
        <ProductDetailsModal
          product={foundProduct}
          onClose={() => {
            setShowProductDetails(false);
            setFoundProduct(null);
          }}
          onAddToCart={handleQuickCheckout}
          onUpdateInventory={handleAddToInventory}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <HistoryModal
          history={scanHistory}
          onClose={() => setShowHistory(false)}
          onClear={clearHistory}
          onProductClick={(product) => {
            setFoundProduct(product);
            setShowHistory(false);
            setShowProductDetails(true);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// SCAN HISTORY ITEM
// ============================================

function ScanHistoryItem({ scan, onProductClick }: {
  scan: ScanHistory;
  onProductClick: () => void;
}) {
  return (
    <Card
      className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
        scan.status === 'found' ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
      }`}
      onClick={scan.product ? onProductClick : undefined}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          scan.status === 'found' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {scan.status === 'found' ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {scan.product ? (
            <>
              <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                {scan.product.name}
              </h4>
              <p className="text-xs text-gray-600">₹{scan.product.price} • Stock: {scan.product.stock}</p>
            </>
          ) : (
            <>
              <h4 className="font-medium text-red-900 text-sm">Product Not Found</h4>
              <p className="text-xs text-red-600 font-mono">{scan.code}</p>
            </>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {scan.time}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================
// PRODUCT DETAILS MODAL
// ============================================

function ProductDetailsModal({ product, onClose, onAddToCart, onUpdateInventory }: {
  product: Product | null;
  onClose: () => void;
  onAddToCart: () => void;
  onUpdateInventory: () => void;
}) {
  if (!product) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md bg-white rounded-2xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-4">
              This barcode is not registered in your inventory
            </p>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Close
              </Button>
              <Button onClick={onUpdateInventory} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Add to Inventory
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">Product Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          {/* Product Info */}
          <div className="text-center mb-4">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h4>
            <div className="text-3xl font-bold text-indigo-600 mb-2">₹{product.price}</div>
            <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'outline'}
                   className={product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Product ID</span>
              <span className="font-mono text-sm font-medium">{product.id}</span>
            </div>
            {product.category && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Category</span>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <Button
            onClick={onAddToCart}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart & Checkout
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onUpdateInventory} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Update Stock
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// HISTORY MODAL
// ============================================

function HistoryModal({ history, onClose, onClear, onProductClick }: {
  history: ScanHistory[];
  onClose: () => void;
  onClear: () => void;
  onProductClick: (product: Product) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Scan History</h3>
            <p className="text-sm text-gray-600">{history.length} total scans</p>
          </div>
          <div className="flex gap-2">
            {history.length > 0 && (
              <Button onClick={onClear} variant="ghost" size="sm" className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No scan history yet</p>
              <p className="text-sm text-gray-500">Scanned items will appear here</p>
            </div>
          ) : (
            history.map(scan => (
              <ScanHistoryItem
                key={scan.id}
                scan={scan}
                onProductClick={() => scan.product && onProductClick(scan.product)}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

// Add scanning animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(400px); }
  }
  .animate-scan {
    animation: scan 2s linear infinite;
  }
`;
document.head.appendChild(style);
