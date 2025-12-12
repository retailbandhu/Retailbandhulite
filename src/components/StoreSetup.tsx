import { useState } from 'react';
import { Store, User, MapPin, Phone, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { StoreInfo } from '../App';

interface StoreSetupProps {
  onComplete: (info: StoreInfo) => void;
  initialData: StoreInfo;
}

export function StoreSetup({ onComplete, initialData }: StoreSetupProps) {
  const [storeName, setStoreName] = useState(initialData.name);
  const [owner, setOwner] = useState(initialData.owner);
  const [address, setAddress] = useState(initialData.address);
  const [phone, setPhone] = useState(initialData.phone);

  const handleSubmit = () => {
    if (storeName && owner && address && phone) {
      onComplete({
        name: storeName,
        owner,
        address,
        phone,
        billColor: '#1E88E5'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-16 rounded-b-3xl">
        <div className="text-center">
          <div className="text-6xl mb-3">🏪</div>
          <h1 className="text-white text-2xl mb-1">Apni Dukaan Setup Karein</h1>
          <p className="text-white/90">Yeh details bill par dikhegi</p>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Store Logo (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1E88E5] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Logo upload karein</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 2MB)</p>
            </div>
          </div>

          {/* Store Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Store Name *
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Sharma Kirana Store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Owner Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Ramesh Sharma"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Store Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                placeholder="Shop No., Area, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] min-h-[80px]"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Contact Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!storeName || !owner || !address || !phone}
            className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
          >
            Save & Continue
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Yeh details baad mein bhi change kar sakte hain
          </p>
        </div>
      </div>

      <div className="p-4 mt-6 text-center">
        <p className="text-gray-500 text-sm">
          Powered by Retail Bandhu — Har Dukaan, Digital Dukaan.
        </p>
      </div>
    </div>
  );
}
