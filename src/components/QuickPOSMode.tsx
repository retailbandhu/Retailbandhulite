import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { Screen, Product } from '../App';
import {
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Wallet,
  Smartphone,
  Receipt,
  Search,
  Grid,
  List,
  DollarSign,
  ShoppingCart,
  User,
  Clock,
  CheckCircle2,
  Printer,
  ChevronLeft,
  Calculator,
  IndianRupee,
  Scan,
} from 'lucide-react';

interface QuickPOSModeProps {
  onNavigate: (screen: Screen) => void;
  products: Product[];
}

interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

type PaymentMethod = 'cash' | 'upi' | 'card' | 'credit';

export function QuickPOSMode({ onNavigate, products }: QuickPOSModeProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  // Get unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && p.stock > 0;
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const change = receivedAmount - total;

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error('Product out of stock!');
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('Not enough stock!');
        return;
      }
      updateQuantity(product.id, 1);
    } else {
      setCart([...cart, {
        product,
        quantity: 1,
        total: product.price,
      }]);
      toast.success(`${product.name} added to cart`);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return item;
          if (newQuantity > item.product.stock) {
            toast.error('Not enough stock!');
            return item;
          }
          return {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.product.price,
          };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    if (!confirm('Clear entire cart?')) return;
    setCart([]);
    setDiscount(0);
    setCustomerName('');
    toast.info('Cart cleared');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    setReceivedAmount(total);
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (paymentMethod !== 'credit' && receivedAmount < total) {
      toast.error('Insufficient payment amount!');
      return;
    }

    // Process payment
    setShowPayment(false);
    setShowSuccess(true);
    
    // Auto-close success and reset
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
      setDiscount(0);
      setCustomerName('');
      setReceivedAmount(0);
      toast.success('Transaction completed!');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Quick POS</h1>
              <p className="text-xs text-white/90">Fast Checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white text-purple-600">
              {cart.length} items
            </Badge>
            <Button
              onClick={() => onNavigate('barcode-scanner')}
              size="sm"
              className="bg-white text-purple-600 hover:bg-purple-50 h-8"
            >
              <Scan className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)]">
        {/* Left: Products */}
        <div className="flex-1 p-3 overflow-y-auto">
          {/* Search & Categories */}
          <Card className="p-3 mb-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <Button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {cat === 'all' ? 'All' : cat}
                </Button>
              ))}
            </div>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {filteredProducts.map(product => (
                <Card
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="p-3 cursor-pointer hover:shadow-lg hover:border-purple-500 transition-all active:scale-95"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 flex items-center justify-center text-3xl">
                    📦
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-purple-600">₹{product.price}</div>
                    <Badge variant={product.stock > 10 ? 'default' : 'secondary'} className="text-xs">
                      {product.stock}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right: Cart */}
        <div className="w-full lg:w-96 bg-white border-l flex flex-col">
          {/* Cart Header */}
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">Cart</h3>
              {cart.length > 0 && (
                <Button onClick={clearCart} variant="ghost" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Customer Name */}
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name (optional)"
              className="text-sm"
            />
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Cart is empty</p>
                <p className="text-gray-500 text-xs">Add products to start</p>
              </div>
            ) : (
              cart.map(item => (
                <Card key={item.product.id} className="p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-600">₹{item.product.price} each</p>
                    </div>
                    <Button
                      onClick={() => removeFromCart(item.product.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <div className="w-12 text-center font-medium text-sm">
                        {item.quantity}
                      </div>
                      <Button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="font-bold text-purple-600">₹{item.total}</div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border-t p-3 space-y-2">
              {/* Discount */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 w-20">Discount</label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                  placeholder="0"
                  className="flex-1 h-8 text-sm"
                  min={0}
                  max={100}
                />
                <span className="text-sm text-gray-600">%</span>
              </div>

              {/* Totals */}
              <div className="space-y-1 pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Discount ({discount}%)</span>
                    <span className="font-medium text-green-600">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-lg font-bold pt-1 border-t">
                  <span>Total</span>
                  <span className="text-purple-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          paymentMethod={paymentMethod}
          receivedAmount={receivedAmount}
          change={change}
          onMethodChange={setPaymentMethod}
          onAmountChange={setReceivedAmount}
          onConfirm={handlePayment}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          total={total}
          paymentMethod={paymentMethod}
          change={change}
          customerName={customerName}
        />
      )}
    </div>
  );
}

// ============================================
// PAYMENT MODAL
// ============================================

function PaymentModal({ total, paymentMethod, receivedAmount, change, onMethodChange, onAmountChange, onConfirm, onClose }: {
  total: number;
  paymentMethod: PaymentMethod;
  receivedAmount: number;
  change: number;
  onMethodChange: (method: PaymentMethod) => void;
  onAmountChange: (amount: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const quickAmounts = [
    total,
    Math.ceil(total / 100) * 100,
    Math.ceil(total / 500) * 500,
    Math.ceil(total / 1000) * 1000,
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">Payment</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Amount Due */}
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Amount Due</div>
            <div className="text-3xl font-bold text-purple-600">₹{total.toFixed(2)}</div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => onMethodChange('cash')}
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className="flex-col h-auto py-3"
              >
                <Wallet className="w-5 h-5 mb-1" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button
                onClick={() => onMethodChange('upi')}
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                className="flex-col h-auto py-3"
              >
                <Smartphone className="w-5 h-5 mb-1" />
                <span className="text-xs">UPI</span>
              </Button>
              <Button
                onClick={() => onMethodChange('card')}
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="flex-col h-auto py-3"
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs">Card</span>
              </Button>
              <Button
                onClick={() => onMethodChange('credit')}
                variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                className="flex-col h-auto py-3"
              >
                <Clock className="w-5 h-5 mb-1" />
                <span className="text-xs">Credit</span>
              </Button>
            </div>
          </div>

          {/* Amount Received (for cash) */}
          {paymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount Received</label>
              <div className="relative mb-2">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => onAmountChange(Number(e.target.value))}
                  placeholder="0"
                  className="pl-10 text-lg font-bold"
                />
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map(amount => (
                  <Button
                    key={amount}
                    onClick={() => onAmountChange(amount)}
                    variant="outline"
                    size="sm"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              {/* Change */}
              {receivedAmount >= total && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Change to Return</span>
                    <span className="text-lg font-bold text-green-600">₹{change.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={paymentMethod !== 'credit' && receivedAmount < total}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm Payment
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// SUCCESS MODAL
// ============================================

function SuccessModal({ total, paymentMethod, change, customerName }: {
  total: number;
  paymentMethod: PaymentMethod;
  change: number;
  customerName: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm bg-white rounded-2xl p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">
          {customerName ? `Thank you, ${customerName}!` : 'Thank you for your purchase!'}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="font-bold text-gray-900">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Payment Method</span>
            <Badge>{paymentMethod.toUpperCase()}</Badge>
          </div>
          {paymentMethod === 'cash' && change > 0 && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-700">Change Returned</span>
              <span className="font-bold text-green-600">₹{change.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Button className="w-full mb-2" variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
        
        <p className="text-xs text-gray-500">Redirecting in 3 seconds...</p>
      </Card>
    </div>
  );
}
