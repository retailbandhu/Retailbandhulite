import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Download,
  Smartphone,
  X,
  Chrome,
  CheckCircle2,
  Zap,
  Wifi,
  Bell
} from 'lucide-react';

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

export function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show prompt after a delay
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
      onInstall?.();
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    onDismiss?.();
  };

  if (isInstalled) {
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <>
      {/* Mobile Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <Card className="rounded-t-3xl rounded-b-none border-t-4 border-blue-500 shadow-2xl">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">Install App</h3>
                  <p className="text-sm text-gray-600">Get full app experience</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-700">Faster</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Wifi className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-700">Offline</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-xs text-gray-700">Alerts</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-700 text-center mb-3">
                  Install karne ke liye:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">
                      1
                    </div>
                    <span>Tap Share button at the bottom</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">
                      2
                    </div>
                    <span>Scroll and tap "Add to Home Screen"</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs flex-shrink-0">
                      3
                    </div>
                    <span>Tap "Add" to confirm</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={handleDismiss}
                >
                  Got it!
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                  onClick={handleInstallClick}
                  disabled={!deferredPrompt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
                <Button variant="outline" onClick={handleDismiss}>
                  Later
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Desktop Card */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50 max-w-sm">
        <Card className="shadow-2xl border-2 border-blue-200">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900">Install Retail Bandhu</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-200 mt-1">
                    Recommended
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Install our app for the best experience with offline access and faster performance.
            </p>

            <div className="space-y-2 mb-4">
              {[
                { icon: Zap, text: '10x faster loading', color: 'text-blue-600' },
                { icon: Wifi, text: 'Works offline', color: 'text-green-600' },
                { icon: Bell, text: 'Push notifications', color: 'text-orange-600' },
                { icon: Smartphone, text: 'App-like experience', color: 'text-purple-600' }
              ].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Icon className={`w-4 h-4 ${benefit.color}`} />
                    <span className="text-gray-700">{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            {isIOS ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>iPhone/iPad Users:</strong>
                  </p>
                  <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Tap the Share button</li>
                    <li>Select "Add to Home Screen"</li>
                    <li>Tap "Add" to confirm</li>
                  </ol>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={handleDismiss}
                >
                  Got it, thanks!
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                  onClick={handleInstallClick}
                  disabled={!deferredPrompt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install
                </Button>
                <Button variant="outline" onClick={handleDismiss}>
                  Maybe Later
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
