import { Input } from './ui/input';
import { VoiceButton } from './VoiceButton';
import { Screen, Product, BillItem } from '../types';

interface BillingScreenProps {
  onNavigate: (screen: Screen) => void;
  products: Product[];
  currentBill: BillItem[];
  setCurrentBill: (bill: BillItem[]) => void;
}

export function BillingScreen({ onNavigate, products, currentBill, setCurrentBill }: BillingScreenProps) {
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [showAddManual, setShowAddManual] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleVoiceInput = (text: string) => {
    setVoiceText(text);
    setShowVoiceOverlay(true);
    
    // Simulate processing voice input
    setTimeout(() => {
      const item: BillItem = {
        id: Date.now().toString(),
        productName: 'Pepsi 250ml',
        quantity: 2,
        price: 20,
        total: 40
      };
      setCurrentBill([...currentBill, item]);
      setShowVoiceOverlay(false);
      setVoiceText('');
    }, 1500);
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
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    setCurrentBill(currentBill.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return currentBill.reduce((sum, item) => sum + item.total, 0);
  };

  const handlePreviewBill = () => {
    if (currentBill.length > 0) {
      onNavigate('bill-preview');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Naya Bill Banayein</h1>
          <div className="w-6" />
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <p className="text-white/80 text-xs mb-1">Bill Total</p>
          <p className="text-white text-2xl">₹{calculateTotal()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-4">
        {/* Voice Input Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg mb-1">🎙️ Voice se Add Karein</h3>
              <p className="text-white/90 text-sm">Bas bolo, Bandhu samajh jayega</p>
            </div>
            <VoiceButton onVoiceInput={handleVoiceInput} size="md" />
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-sm">
            Example: "2 Maggie ₹12 each" ya "1 Pepsi 20 rupees"
          </div>
        </div>

        {/* Manual Add Button */}
        <button
          onClick={() => setShowAddManual(!showAddManual)}
          className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1E88E5] rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900">Manual Item Add Karein</span>
          </div>
        </button>

        {/* Manual Add Form */}
        {showAddManual && (
          <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Product Select Karein</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
              >
                <option value="">Select product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="h-10"
              />
            </div>
            <Button
              onClick={handleAddManual}
              disabled={!selectedProduct}
              className="w-full bg-[#1E88E5] text-white"
            >
              Add to Bill
            </Button>
          </div>
        )}

        {/* Bill Items */}
        <div className="space-y-3">
          <h3 className="text-gray-900">Bill Items ({currentBill.length})</h3>
          
          {currentBill.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-600 mb-2">Bill khali hai</p>
              <p className="text-gray-500 text-sm">
                Voice ya manual se items add karein
              </p>
            </div>
          ) : (
            currentBill.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">{item.productName}</h4>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} × ₹{item.price} = ₹{item.total}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      {currentBill.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-2xl text-[#1E88E5]">₹{calculateTotal()}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="flex flex-col items-center py-3 h-auto">
              <Save className="w-5 h-5 mb-1" />
              <span className="text-xs">Save</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center py-3 h-auto">
              <Printer className="w-5 h-5 mb-1" />
              <span className="text-xs">Print</span>
            </Button>
            <Button 
              onClick={handlePreviewBill}
              className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white flex flex-col items-center py-3 h-auto"
            >
              <MessageCircle className="w-5 h-5 mb-1" />
              <span className="text-xs">WhatsApp</span>
            </Button>
          </div>
        </div>
      )}

      {/* Voice Overlay */}
      {showVoiceOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] flex items-center justify-center animate-pulse">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">Bandhu sun raha hai...</h3>
            <p className="text-gray-600 mb-4">"{voiceText}"</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-[#1E88E5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#1E88E5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#1E88E5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}