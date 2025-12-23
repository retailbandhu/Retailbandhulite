import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { detectBrowserSupport } from '../utils/browserSupport';

/**
 * Banner to show if voice features are not supported
 * Only shows when browser doesn't support voice
 */
export function VoiceSupportBanner() {
  const [support, setSupport] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const browserSupport = detectBrowserSupport();
    setSupport(browserSupport);
    
    // Only show banner if voice is not supported
    if (!browserSupport.isSupported) {
      // Check if user previously dismissed the banner
      const dismissed = localStorage.getItem('voice-banner-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    // Remember dismissal for 7 days
    localStorage.setItem('voice-banner-dismissed', Date.now().toString());
  };

  if (!isVisible || !support || support.isSupported || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 shadow-lg animate-slide-down">
      <div className="max-w-4xl mx-auto flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm mb-1">
            <strong>Voice Features Limited</strong>
          </p>
          <p className="text-xs text-white/90">
            {support.reason}. For best experience, please use <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Safari</strong> browser.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Small indicator to show voice support status
 * Shows in corner of voice buttons
 */
export function VoiceSupportIndicator() {
  const [support, setSupport] = useState<any>(null);

  useEffect(() => {
    setSupport(detectBrowserSupport());
  }, []);

  if (!support) return null;

  if (support.isSupported) {
    return (
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
        <CheckCircle className="w-3 h-3 text-white" />
      </div>
    );
  }

  return (
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
      <AlertCircle className="w-3 h-3 text-white" />
    </div>
  );
}
