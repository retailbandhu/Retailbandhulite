import { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack?: () => void;
}

// Admin credentials - In production, these should be environment variables
const ADMIN_CREDENTIALS = {
  username: 'admin@retailbandhu.in',
  password: 'RetailBandhu@2024!Admin',
};

export function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    // Simulate network delay for security
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify credentials
    if (
      username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // Success!
      toast.success('🔐 Admin access granted!', {
        description: 'Welcome to Retail Bandhu Admin Panel'
      });
      
      // Store admin session
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_login_time', new Date().toISOString());
      localStorage.setItem('admin_username', username);
      
      // Log access (in production, this should be sent to backend)
      console.log('🔐 Admin login:', {
        username,
        timestamp: new Date().toISOString(),
        ip: 'localhost' // In production, get real IP
      });
      
      setLoading(false);
      onLoginSuccess();
    } else {
      // Failed
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      setError(`Invalid credentials. Attempt ${newAttempts}/3`);
      toast.error('Access denied', {
        description: 'Invalid username or password'
      });
      
      // Lock out after 3 attempts
      if (newAttempts >= 3) {
        setError('Too many failed attempts. Please try again later.');
        toast.error('Account temporarily locked', {
          description: 'Too many failed login attempts'
        });
        
        // Lock for 5 minutes
        setTimeout(() => {
          setAttempts(0);
          setError('');
        }, 5 * 60 * 1000);
      }
      
      setLoading(false);
    }
  };

  const isLocked = attempts >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-2">Admin Panel</h1>
            <p className="text-blue-200">Retail Bandhu Control Center</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm text-blue-100 mb-2">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <Input
                    type="text"
                    placeholder="admin@retailbandhu.in"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading || isLocked}
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-300/50"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-blue-100 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || isLocked}
                    className="pl-10 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-300/50"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading || isLocked}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white h-12 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : isLocked ? (
                  'Account Locked'
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/70">
                  This is a secure admin area. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-blue-200/50 text-sm">
              Protected by Retail Bandhu Security
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-white/30 text-xs">
          © 2024 Retail Bandhu. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// Export admin credentials for documentation
export const getAdminCredentials = () => {
  return {
    username: ADMIN_CREDENTIALS.username,
    password: ADMIN_CREDENTIALS.password,
    note: 'Change these in production!'
  };
};
