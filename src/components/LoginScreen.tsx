import React, { useState } from 'react';
import { Phone, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import bandhuMascot from '@assets/retail_bandhu_logo.png';

interface LoginScreenProps {
  onLoginComplete: () => void;
}

export function LoginScreen({ onLoginComplete }: LoginScreenProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      onLoginComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 pb-20 rounded-b-3xl">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-white text-2xl mb-1">Retail Bandhu Lite</h1>
          <p className="text-white/90">Apni dukaan ko banayein digital</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 -mt-16 px-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl text-gray-900 mb-1">
              {step === 'phone' ? 'Login / Sign Up' : 'OTP Verify Karein'}
            </h2>
            <p className="text-gray-600">
              {step === 'phone' 
                ? 'Mobile number enter karein' 
                : `OTP bheja gaya hai ${phone} par`}
            </p>
          </div>

          {step === 'phone' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-10 h-12"
                    maxLength={10}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  +91 se shuru hoga
                </p>
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={phone.length !== 10}
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
              >
                OTP Bhejein
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  4-Digit OTP
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="1234"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="pl-10 h-12 text-center tracking-widest text-xl"
                    maxLength={4}
                  />
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 4}
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
              >
                Verify & Login
              </Button>

              <button
                onClick={() => setStep('phone')}
                className="w-full text-[#1E88E5] text-sm"
              >
                Number change karein
              </button>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Login karke aap agree hote hain Retail Bandhu ke Terms & Conditions se
            </p>
          </div>
        </div>

        {/* Mascot */}
        <div className="text-center mt-8">
          <div className="w-24 h-24 mx-auto mb-2 flex items-center justify-center">
            <img src={bandhuMascot} alt="Bandhu Mascot" className="w-full h-full object-contain" />
          </div>
          <p className="text-gray-600">
            Namaste! Aayiye shuru karein
          </p>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-gray-500 text-sm">
          Powered by Retail Bandhu — Har Dukaan, Digital Dukaan.
        </p>
      </div>
    </div>
  );
}