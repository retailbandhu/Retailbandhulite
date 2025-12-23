import { useState } from 'react';
import { Mail, Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import bandhuMascot from 'figma:asset/4d93b3d1b087e58174e0c66cc9a52e892bfab633.png';
import { signup, login } from '../utils/auth';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

export function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please enter email and password');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const result = await login({
        email,
        password,
      });
      
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Success!
      onAuthComplete();
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password || !name) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    try {
      const result = await signup({
        email,
        password,
        name,
        phone: phone || '',
        storeName: storeName || 'My Store',
      });

      if (!result.success) {
        setError(result.error || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      // Auto-login after signup
      onAuthComplete();
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      handleLogin();
    } else {
      handleSignup();
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

      {/* Auth Form */}
      <div className="flex-1 -mt-16 px-6 pb-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 max-w-md mx-auto">
          <div className="text-center">
            <h2 className="text-xl text-gray-900 mb-1">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' 
                ? 'Login karein apne account mein' 
                : 'Naya account banayein'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Signup Only: Name */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Signup Only: Phone */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Mobile Number (Optional)
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
              </div>
            )}

            {/* Signup Only: Store Name */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Store Name (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🏪</span>
                  <Input
                    type="text"
                    placeholder="Rajesh General Store"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                  minLength={6}
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1">
                  At least 6 characters
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Login' : 'Create Account'
              )}
            </Button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                className="text-[#1E88E5] text-sm hover:underline"
                disabled={loading}
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Login'}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By continuing, you agree to Retail Bandhu's Terms & Conditions
            </p>
          </div>
        </div>

        {/* Mascot */}
        <div className="text-center mt-8 max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-2 flex items-center justify-center">
            <img src={bandhuMascot} alt="Bandhu Mascot" className="w-full h-full object-contain" />
          </div>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Namaste! Wapas aane ke liye dhanyavaad' 
              : 'Namaste! Aayiye shuru karein'}
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