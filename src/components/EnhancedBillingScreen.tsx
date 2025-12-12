import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, MessageCircle, Printer, Save, Mic, User, Award, Receipt, Phone, Search, Zap, CreditCard, Banknote, Smartphone, BookOpen, MinusCircle, PlusCircle, StickyNote } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { VoiceButton } from './VoiceButton';
import { toast } from 'sonner';
import { gstStorage, calculateGST, type ProductWithGST } from '../utils/gst';
import { storage } from '../utils/storage';
import { loyaltyStorage, awardPointsForPurchase, getCurrentTier } from '../utils/loyalty';
import type { Screen, Product, BillItem } from '../App';
import type { ParsedVoiceItem } from '../hooks/useVoiceRecognition';

interface EnhancedBillingScreenProps {
  onNavigate: (screen: Screen) => void;
  products: Product[];
  currentBill: BillItem[];
  setCurrentBill: (bill: BillItem[]) => void;
  setProducts: (products: Product[]) => void;
}

interface BillItemWithGST extends BillItem {
  gstRate: number;
  hsnCode?: string;
}

export function EnhancedBillingScreen({ onNavigate, products, currentBill, setCurrentBill, setProducts }: EnhancedBillingScreenProps) {
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [showAddManual, setShowAddManual] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [enableGST, setEnableGST] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerMobile, setCustomerMobile] = useState('');
  const [isListeningForMobile, setIsListeningForMobile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'khata'>('cash');
  const [enableRoundOff, setEnableRoundOff] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [billNotes, setBillNotes] = useState('');
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedCustomers = storage.getCustomers();
    setCustomers(storedCustomers);
  }, []);

  useEffect(() => {
    const topProds = storage.getTopProducts();
    setTopProducts(topProds);
  }, [products]);

  // Auto-fill mobile number when customer is selected
  useEffect(() => {
    if (selectedCustomer && selectedCustomer !== 'walkin') {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer && customer.phone) {
        setCustomerMobile(customer.phone);
      }
    } else {
      setCustomerMobile('');
    }
  }, [selectedCustomer, customers]);

  const handleVoiceInput = useCallback((text: string) => {
    setVoiceText(text);
    setShowVoiceOverlay(true);
    
    setTimeout(() => {
      setShowVoiceOverlay(false);
      setVoiceText('');
    }, 2000);
  }, []);

  const handleParsedVoiceItems = useCallback((items: ParsedVoiceItem[]) => {
    const newItems: BillItem[] = [];
    
    for (const item of items) {
      if (item.matchedProduct) {
        const product = products.find(p => p.id === item.matchedProduct!.id);
        if (product) {
          const billItem: BillItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            productName: product.name,
            quantity: item.quantity,
            price: product.price,
            total: product.price * item.quantity
          };
          newItems.push(billItem);
        }
      }
    }

    if (newItems.length > 0) {
      setCurrentBill([...currentBill, ...newItems]);
      const itemNames = newItems.map(i => `${i.quantity}x ${i.productName}`).join(', ');
      toast.success(`Bill mein add ho gaya: ${itemNames}`);
    } else {
      toast.error('Product nahi mila. Dobara try karein.');
    }
  }, [currentBill, products, setCurrentBill]);

  const handleVoiceMobileInput = () => {
    setIsListeningForMobile(true);
    toast.info('Bolo mobile number...');
    
    // Mock voice recognition for demo
    setTimeout(() => {
      const mockNumber = '9876543210';
      setCustomerMobile(mockNumber);
      setIsListeningForMobile(false);
      toast.success('Mobile number samajh aa gaya! ✓');
    }, 2000);
  };

  const validateMobileNumber = (mobile: string): boolean => {
    // Indian mobile number validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const handleAddManual = () => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        const item: BillItem = {
          id: Date.now().toString(),
          productName: product.name,
          quantity: parseInt(quantity),
          price: product.price,
          total: product.price * parseInt(quantity)
        };
        setCurrentBill([...currentBill, item]);
        setSelectedProduct('');
        setQuantity('1');
        setShowAddManual(false);
        toast.success(`${product.name} added to bill!`);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    setCurrentBill(currentBill.filter(item => item.id !== id));
    toast.info('Item removed from bill');
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCurrentBill(currentBill.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));
  };

  const handleQuickAdd = (product: Product) => {
    const item: BillItem = {
      id: Date.now().toString(),
      productName: product.name,
      quantity: 1,
      price: product.price,
      total: product.price
    };
    setCurrentBill([...currentBill, item]);
    toast.success(`${product.name} added!`, { duration: 1500 });
  };

  const handleSearchSelect = (product: Product) => {
    handleQuickAdd(product);
    setProductSearch('');
    setShowSearchResults(false);
  };

  const calculateSubtotal = () => {
    return currentBill.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;

    if (enableGST) {
      const gstConfig = gstStorage.getConfig();
      const productsWithGST: ProductWithGST[] = currentBill.map(item => ({
        id: item.id,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        gstRate: item.gstRate,
        hsnCode: item.hsnCode
      }));
      
      const gstCalc = calculateGST(productsWithGST, gstConfig, false);
      return gstCalc.grandTotal - discountAmount;
    }

    return afterDiscount;
  };

  const getGSTBreakdown = () => {
    if (!enableGST) return null;

    const gstConfig = gstStorage.getConfig();
    const productsWithGST: ProductWithGST[] = currentBill.map(item => ({
      id: item.id,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      gstRate: item.gstRate,
      hsnCode: item.hsnCode
    }));
    
    return calculateGST(productsWithGST, gstConfig, false);
  };

  const getRoundOffAmount = () => {
    if (!enableRoundOff) return 0;
    const total = calculateFinalTotal();
    const rounded = Math.round(total);
    return rounded - total;
  };

  const getFinalAmountWithRoundOff = () => {
    const total = calculateFinalTotal();
    if (enableRoundOff) {
      return Math.round(total);
    }
    return total;
  };

  const handleGenerateBill = () => {
    if (currentBill.length === 0) {
      toast.error('Please add items to the bill');
      return;
    }

    // Validate mobile number if provided
    if (customerMobile && !validateMobileNumber(customerMobile)) {
      toast.error('Galat mobile number! 10 digits enter karein');
      return;
    }

    const billNumber = `RB${Date.now().toString().slice(-8)}`;
    const finalAmount = calculateFinalTotal();

    // Deduct stock from inventory
    const updatedProducts = products.map(product => {
      const billItem = currentBill.find(item => item.productName === product.name);
      if (billItem) {
        const newStock = product.stock - billItem.quantity;
        if (newStock < 0) {
          toast.error(`Not enough stock for ${product.name}`);
          return product;
        }
        return { ...product, stock: newStock };
      }
      return product;
    });
    
    // Check if any stock issues
    const hasStockIssues = updatedProducts.some((product, index) => {
      const billItem = currentBill.find(item => item.productName === product.name);
      return billItem && products[index].stock < billItem.quantity;
    });
    
    if (hasStockIssues) {
      toast.error('Cannot generate bill - insufficient stock!');
      return;
    }
    
    // Update products in state and storage
    setProducts(updatedProducts);
    storage.setProducts(updatedProducts);

    // Award loyalty points if customer selected
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (customer) {
        const loyaltyConfig = loyaltyStorage.getConfig();
        if (loyaltyConfig.enabled) {
          const pointsEarned = awardPointsForPurchase(
            customer.id,
            customer.name,
            finalAmount,
            billNumber
          );
          if (pointsEarned > 0) {
            toast.success(`${customer.name} earned ${pointsEarned} loyalty points! 🎉`);
          }
        }
      }
    }

    // Save bill
    const bill = {
      billNumber,
      date: new Date().toISOString(),
      items: currentBill,
      subtotal: calculateSubtotal(),
      discount,
      total: finalAmount,
      customerName: selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.name : 'Walk-in',
      customerId: selectedCustomer,
      customerMobile: customerMobile || null,
      gstEnabled: enableGST,
      gstBreakdown: enableGST ? getGSTBreakdown() : null,
      paymentMethod,
      enableRoundOff,
      notes: billNotes
    };

    const existingBills = storage.getBills();
    storage.setBills([...existingBills, bill]);

    if (customerMobile && validateMobileNumber(customerMobile)) {
      toast.success(`Bill ready! WhatsApp par bhejne ke liye tayyar hai 📱`, { duration: 3000 });
    } else {
      toast.success('Bill generated successfully! 🎉');
    }
    
    // Navigate to preview (don't clear bill yet - preview needs it)
    onNavigate('bill-preview');
  };

  const selectedCustomerData = selectedCustomer ? customers.find(c => c.id === selectedCustomer) : null;
  const customerLoyalty = selectedCustomerData ? loyaltyStorage.getCustomerLoyalty(selectedCustomer) : null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pb-40">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-4 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('dashboard')} className="text-white hover:scale-110 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Create Bill</h1>
          <div className="w-6" />
        </div>

        {/* Integrated Customer Info Card */}
        <Card className="p-4 bg-white/98 backdrop-blur shadow-md">
          {/* Customer Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <Label className="text-sm">Customer Details</Label>
              {customerLoyalty && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  <Award className="w-3 h-3 mr-1 inline" />
                  {getCurrentTier(customerLoyalty.lifetimeSpend, loyaltyStorage.getConfig()).name}
                </Badge>
              )}
            </div>

            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Walk-in Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walkin">Walk-in Customer</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Loyalty Points Inline */}
            {customerLoyalty && (
              <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-900">{customerLoyalty.totalPoints} points</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Number Section - Integrated */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </div>
                <Label className="text-sm">Mobile Number</Label>
              </div>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                WhatsApp Ready
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="98765 43210"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`pl-12 h-11 ${customerMobile && !validateMobileNumber(customerMobile) ? 'border-red-300 focus:border-red-400' : customerMobile ? 'border-green-300 focus:border-green-400' : ''}`}
                  maxLength={10}
                />
              </div>
              <button
                onClick={handleVoiceMobileInput}
                disabled={isListeningForMobile}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                  isListeningForMobile 
                    ? 'bg-blue-600 animate-pulse shadow-lg' 
                    : 'bg-gradient-to-br from-blue-600 to-blue-500 hover:shadow-md hover:scale-105 active:scale-95'
                }`}
              >
                <Mic className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Validation Feedback */}
            <div className="mt-2">
              {customerMobile ? (
                validateMobileNumber(customerMobile) ? (
                  <p className="text-xs text-green-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                    Bill WhatsApp par directly share hoga
                  </p>
                ) : (
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    Valid 10-digit number enter karein (6-9 se start)
                  </p>
                )
              ) : (
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Type karein ya mic se bolo (optional)
                </p>
              )}
            </div>
          </div>

          {/* GST Toggle - Integrated */}
          {gstStorage.getConfig().enableGST && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <Label className="text-sm">GST Invoice</Label>
                    <p className="text-xs text-gray-500">Tax-compliant billing</p>
                  </div>
                </div>
                <Switch checked={enableGST} onCheckedChange={setEnableGST} />
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {/* Voice Billing - Compact & Modern (MOVED TO TOP) */}
        <Card className="p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-md">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-orange-50 p-3 rounded-lg border border-blue-200">
            <div className="relative flex-shrink-0">
              <VoiceButton 
                onVoiceInput={handleVoiceInput} 
                onParsedItems={handleParsedVoiceItems}
                products={products.map(p => ({ id: p.id, name: p.name, price: p.price }))}
                showBetaBadge={false}
              />
              <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 h-4 border-2 border-white shadow-sm">
                BETA
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Mic className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <h3 className="text-xs text-gray-900">
                  Voice Billing
                </h3>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-white/80">
                  🇮🇳 Hinglish
                </Badge>
              </div>
              <p className="text-[11px] text-gray-600 truncate">
                🎙️ Try: "2 Maggi aur 1 Pepsi"
              </p>
            </div>
          </div>
        </Card>

        {/* Product Search Bar - NEW FEATURE */}
        <Card className="p-4 shadow-sm">
          <Label className="text-xs text-gray-600 mb-2 block flex items-center gap-2">
            <Search className="w-4 h-4" />
            Quick Search Product
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Type product name..."
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => setShowSearchResults(productSearch.length > 0)}
              className="h-11 pr-10"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            
            {/* Search Results Dropdown */}
            {showSearchResults && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSearchSelect(product)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </div>
                      <span className="text-sm text-blue-600">₹{product.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Add Hot Items - NEW FEATURE */}
        {topProducts.length > 0 && (
          <Card className="p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-orange-500" />
              <Label className="text-xs text-gray-600">Fast-Moving Items</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {topProducts.slice(0, 6).map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleQuickAdd(product)}
                  className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg text-xs transition-all hover:shadow-md active:scale-95"
                >
                  <div className="flex items-center gap-1.5">
                    <Plus className="w-3 h-3" />
                    <span>{product.name}</span>
                  </div>
                  <div className="text-[10px] text-blue-600 mt-0.5">₹{product.price}</div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Manual Add - Cleaner Design */}
        <div>
          <Button
            onClick={() => setShowAddManual(!showAddManual)}
            variant={showAddManual ? "default" : "outline"}
            className={`w-full h-12 ${showAddManual ? 'bg-gradient-to-r from-blue-600 to-blue-500' : ''}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item Manually
          </Button>

          {showAddManual && (
            <Card className="p-4 mt-3 space-y-4 shadow-md">
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ₹{product.price} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="h-11"
                  placeholder="Enter quantity"
                />
              </div>

              <Button
                onClick={handleAddManual}
                disabled={!selectedProduct}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-orange-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Bill
              </Button>
            </Card>
          )}
        </div>

        {/* Bill Items - Enhanced */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2">
              <span>Bill Items</span>
              <Badge variant="secondary" className="rounded-full">
                {currentBill.length}
              </Badge>
            </h3>
            {discount > 0 && (
              <Badge className="bg-green-600 text-white">{discount}% OFF</Badge>
            )}
          </div>

          {currentBill.length === 0 ? (
            <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-600 mb-1">Bill khali hai</p>
              <p className="text-gray-500 text-xs">
                Voice ya manual se items add karein
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {currentBill.map((item) => (
                <Card key={item.id} className="p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-2 truncate">{item.productName}</h4>
                      
                      {/* Quantity Controls - NEW FEATURE */}
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <MinusCircle className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg min-w-[3rem] text-center">
                          <span className="text-sm text-blue-700">{item.quantity}</span>
                        </div>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-blue-600" />
                        </button>
                        <span className="text-xs text-gray-500 ml-1">× ₹{item.price}</span>
                        <span className="text-sm text-blue-600 ml-auto">= ₹{item.total}</span>
                      </div>
                      
                      {enableGST && item.gstRate && (
                        <p className="text-xs text-purple-600 flex items-center gap-1">
                          <Receipt className="w-3 h-3" />
                          GST {item.gstRate}% • HSN: {item.hsnCode}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-9 h-9 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Discount - Enhanced */}
        {currentBill.length > 0 && (
          <>
            <Card className="p-4 shadow-sm">
              <Label className="text-sm mb-2 block flex items-center justify-between">
                <span>Discount</span>
                {discount > 0 && (
                  <span className="text-green-600 text-xs">-₹{((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
                )}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="h-11 flex-1"
                  placeholder="Enter discount %"
                />
                <div className="w-12 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                  %
                </div>
              </div>
            </Card>

            {/* Payment Method - NEW FEATURE */}
            <Card className="p-4 shadow-sm">
              <Label className="text-xs text-gray-600 mb-3 block">Payment Method</Label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <Banknote className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-500'}`} />
                  <p className={`text-[10px] ${paymentMethod === 'cash' ? 'text-green-700' : 'text-gray-600'}`}>Cash</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <Smartphone className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'upi' ? 'text-blue-600' : 'text-gray-500'}`} />
                  <p className={`text-[10px] ${paymentMethod === 'upi' ? 'text-blue-700' : 'text-gray-600'}`}>UPI</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-500'}`} />
                  <p className={`text-[10px] ${paymentMethod === 'card' ? 'text-purple-700' : 'text-gray-600'}`}>Card</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('khata')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'khata'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <BookOpen className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'khata' ? 'text-orange-600' : 'text-gray-500'}`} />
                  <p className={`text-[10px] ${paymentMethod === 'khata' ? 'text-orange-700' : 'text-gray-600'}`}>Khata</p>
                </button>
              </div>
              {paymentMethod === 'khata' && (
                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-orange-600 rounded-full"></span>
                  Credit entry Khata Book mein save hoga
                </p>
              )}
            </Card>

            {/* Bill Notes - NEW FEATURE */}
            <Card className="p-4 shadow-sm">
              <Label className="text-xs text-gray-600 mb-2 block flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                Notes (Optional)
              </Label>
              <Input
                type="text"
                placeholder="e.g., Delivery address, special instructions..."
                value={billNotes}
                onChange={(e) => setBillNotes(e.target.value)}
                className="h-11"
                maxLength={100}
              />
            </Card>

            {/* Round Off Toggle - NEW FEATURE */}
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Round Off</Label>
                  <p className="text-xs text-gray-500">
                    {enableRoundOff 
                      ? `₹${calculateFinalTotal().toFixed(2)} → ₹${getFinalAmountWithRoundOff()}`
                      : 'Exact amount'
                    }
                  </p>
                </div>
                <Switch checked={enableRoundOff} onCheckedChange={setEnableRoundOff} />
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Summary & Actions - Enhanced */}
      {currentBill.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
          <div className="p-4 space-y-3">
            {/* Summary - Better Layout */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
                </div>
              )}
              {enableGST && getGSTBreakdown() && (
                <>
                  <div className="flex justify-between text-purple-600 text-xs">
                    <span>CGST:</span>
                    <span>₹{getGSTBreakdown()!.cgst}</span>
                  </div>
                  <div className="flex justify-between text-purple-600 text-xs">
                    <span>SGST:</span>
                    <span>₹{getGSTBreakdown()!.sgst}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
                <span className="text-base">Total:</span>
                <span className="text-xl text-blue-600">₹{calculateFinalTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Actions - Improved */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="flex flex-col items-center py-3 h-auto hover:bg-gray-50">
                <Save className="w-5 h-5 mb-1" />
                <span className="text-xs">Save</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-3 h-auto hover:bg-gray-50">
                <Printer className="w-5 h-5 mb-1" />
                <span className="text-xs">Print</span>
              </Button>
              <Button
                onClick={handleGenerateBill}
                className="bg-gradient-to-r from-blue-600 to-orange-500 text-white flex flex-col items-center py-3 h-auto hover:shadow-lg transition-shadow"
              >
                <MessageCircle className="w-5 h-5 mb-1" />
                <span className="text-xs">Generate</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Overlay - Enhanced */}
      {showVoiceOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <Card className="p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center animate-pulse shadow-xl">
              <Mic className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl mb-2">Bandhu sun raha hai...</h3>
            <p className="text-gray-600 mb-6 text-sm italic">\"{voiceText}\"</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}