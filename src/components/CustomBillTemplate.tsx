import { ArrowLeft, Upload, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Screen, StoreInfo } from '../App';

interface CustomBillTemplateProps {
  onNavigate: (screen: Screen) => void;
  storeInfo: StoreInfo;
  setStoreInfo: (info: StoreInfo) => void;
}

export function CustomBillTemplate({ onNavigate, storeInfo, setStoreInfo }: CustomBillTemplateProps) {
  const colorOptions = [
    { name: 'Blue', value: '#1E88E5' },
    { name: 'Orange', value: '#FF6F00' },
    { name: 'Green', value: '#4CAF50' },
    { name: 'Purple', value: '#9C27B0' },
    { name: 'Red', value: '#F44336' },
    { name: 'Teal', value: '#009688' }
  ];

  const handleSave = () => {
    // Save template settings
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('settings')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Bill Template Customize</h1>
          <button onClick={handleSave} className="text-white">
            <Save className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/90 text-center text-sm">
          Apne bill ko unique aur professional banayein
        </p>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Live Preview */}
        <div>
          <h3 className="text-gray-900 mb-3">Live Preview</h3>
          <div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm mx-auto">
            {/* Preview Header */}
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
              <div 
                className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: storeInfo.billColor }}
              >
                <span className="text-3xl">🏪</span>
              </div>
              <h2 className="text-lg text-gray-900 mb-1">{storeInfo.name}</h2>
              <p className="text-gray-600 text-xs mb-0.5">{storeInfo.address}</p>
              <p className="text-gray-600 text-xs">{storeInfo.phone}</p>
            </div>

            {/* Sample Items */}
            <div className="text-xs space-y-2 mb-3">
              <div className="flex justify-between">
                <span>Maggie x2</span>
                <span>₹24</span>
              </div>
              <div className="flex justify-between">
                <span>Pepsi x1</span>
                <span>₹20</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Total:</span>
                <span className="text-lg" style={{ color: storeInfo.billColor }}>₹44</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="border-t-2 border-dashed border-gray-300 pt-3 text-center">
              <div className="w-20 h-20 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-1">
                <span className="text-3xl">📱</span>
              </div>
              <p className="text-gray-500 text-xs">Scan for Payment</p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 mt-3 pt-3 text-center">
              <p className="text-gray-400 text-xs">Powered by Retail Bandhu</p>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-4">
          {/* Logo Upload */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h4 className="text-gray-900 mb-3">Store Logo</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#1E88E5] transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Logo upload karein</p>
              <p className="text-xs text-gray-400">PNG, JPG (Max 2MB)</p>
            </div>
          </div>

          {/* Color Selection */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h4 className="text-gray-900 mb-3">Bill Color Theme</h4>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setStoreInfo({ ...storeInfo, billColor: color.value })}
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    storeInfo.billColor === color.value 
                      ? 'border-gray-900 scale-110' 
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Footer Text */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h4 className="text-gray-900 mb-3">Bill Footer Text</h4>
            <Input
              type="text"
              placeholder="e.g., Thank you! Visit again"
              defaultValue="Dhanyavaad! Phir se aayein 🙏"
              className="h-10"
            />
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h4 className="text-gray-900 mb-3">Payment QR Code</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">UPI ID</label>
                <Input
                  type="text"
                  placeholder="yourname@paytm"
                  defaultValue={`${storeInfo.phone}@paytm`}
                  className="h-10"
                />
              </div>
              <Button variant="outline" className="w-full">
                Upload Custom QR Code
              </Button>
            </div>
          </div>

          {/* Font Style */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h4 className="text-gray-900 mb-3">Font Style</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 border-2 border-[#1E88E5] rounded-lg text-sm">
                Default
              </button>
              <button className="p-3 border border-gray-300 rounded-lg text-sm">
                Bold
              </button>
            </div>
          </div>

          {/* Template Presets */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h4 className="text-gray-900 mb-3">Quick Templates</h4>
            <div className="grid grid-cols-3 gap-2">
              <button className="p-3 border border-gray-300 rounded-lg hover:border-[#1E88E5] transition-colors">
                <div className="text-2xl mb-1">📄</div>
                <p className="text-xs text-gray-700">Simple</p>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:border-[#1E88E5] transition-colors">
                <div className="text-2xl mb-1">🎨</div>
                <p className="text-xs text-gray-700">Colorful</p>
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:border-[#1E88E5] transition-colors">
                <div className="text-2xl mb-1">💼</div>
                <p className="text-xs text-gray-700">Professional</p>
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-gray-900 mb-1">Bandhu ka Tip</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Professional looking bill se customer trust badhta hai. Logo aur QR code zaroor add karein!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('settings')}
            className="h-11"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-11"
          >
            Save Template
          </Button>
        </div>
      </div>
    </div>
  );
}
