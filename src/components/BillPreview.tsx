import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Screen, BillItem, StoreInfo } from '../types';
import { storage } from '../utils/storage';
import { useEffect, useState } from 'react';

interface BillPreviewProps {
  onNavigate: (screen: Screen) => void;
  bill: BillItem[];
  storeInfo: StoreInfo;
}

export function BillPreview({ onNavigate, bill, storeInfo }: BillPreviewProps) {
  const [latestBillData, setLatestBillData] = useState<any>(null);

  useEffect(() => {
    // Get the latest saved bill from storage (includes customerMobile)
    const bills = storage.getBills();
    if (bills.length > 0) {
      setLatestBillData(bills[bills.length - 1]);
    }
  }, []);

  const calculateTotal = () => {
    return bill.reduce((sum, item) => sum + item.total, 0);
  };

  const handleWhatsAppShare = () => {
    const message = `*${storeInfo.name}*%0A${storeInfo.address}%0A%0ABill Details:%0A${bill.map(item => 
      `${item.productName} x${item.quantity} - ₹${item.total}`
    ).join('%0A')}%0A%0ATotal: ₹${calculateTotal()}%0A%0APowered by Retail Bandhu`;
    
    // If customer mobile is available, use it directly
    if (latestBillData?.customerMobile) {
      const mobileNumber = latestBillData.customerMobile;
      // Add country code if not present
      const formattedNumber = mobileNumber.startsWith('91') ? mobileNumber : `91${mobileNumber}`;
      window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
    } else {
      // Fallback to general share if no mobile number
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  const billDate = new Date().toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('billing')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Bill Preview</h1>
          <button className="text-white">
            <Download className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bill Preview */}
      <div className="px-6 pt-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
          {/* Store Header */}
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] rounded-xl flex items-center justify-center">
              <span className="text-3xl">🏪</span>
            </div>
            <h2 className="text-xl text-gray-900 mb-1">{storeInfo.name}</h2>
            <p className="text-gray-600 text-sm mb-1">{storeInfo.address}</p>
            <p className="text-gray-600 text-sm">{storeInfo.phone}</p>
          </div>

          {/* Bill Info */}
          <div className="flex justify-between text-sm mb-4">
            <div>
              <p className="text-gray-500">Bill No:</p>
              <p className="text-gray-900">#{latestBillData?.billNumber || Math.floor(Math.random() * 10000)}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Date:</p>
              <p className="text-gray-900">{billDate}</p>
            </div>
          </div>

          {/* Customer Mobile Display */}
          {latestBillData?.customerMobile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-green-700">Bill bhejne wala number:</p>
                <p className="text-sm text-green-900">+91 {latestBillData.customerMobile}</p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="border-t border-b border-gray-200 py-3 mb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-gray-700 pb-2">Item</th>
                  <th className="text-center text-gray-700 pb-2">Qty</th>
                  <th className="text-right text-gray-700 pb-2">Price</th>
                  <th className="text-right text-gray-700 pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{item.productName}</td>
                    <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-700">₹{item.price}</td>
                    <td className="py-2 text-right text-gray-900">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700 text-lg">Total Amount:</span>
            <span className="text-2xl text-[#1E88E5]">₹{calculateTotal()}</span>
          </div>

          {/* QR Code */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 text-center">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <div className="text-6xl">📱</div>
            </div>
            <p className="text-gray-600 text-xs mb-1">Scan for UPI Payment</p>
            <p className="text-gray-500 text-xs">UPI ID: {storeInfo.phone}@paytm</p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 mt-4 pt-4 text-center">
            <p className="text-gray-500 text-xs mb-1">Dhanyavaad! Phir se aayein 🙏</p>
            <p className="text-gray-400 text-xs">Powered by Retail Bandhu Lite</p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-gray-900 text-sm mb-1">Bandhu ka Suggestion</h4>
              <p className="text-gray-600 text-xs">
                Bill WhatsApp par bhejne se customer engagement badhta hai aur repeat orders milte hain!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <Button 
            variant="outline" 
            className="flex items-center justify-center space-x-2 h-12"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </Button>
          <Button 
            onClick={handleWhatsAppShare}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2 h-12"
          >
            <Share2 className="w-5 h-5" />
            <span>WhatsApp Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}