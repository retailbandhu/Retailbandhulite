/**
 * Browser Compatibility Banner
 * Shows warning for browsers with limited voice support
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Chrome } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function BrowserCompatibilityBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({ name: '', isSupported: true });

  useEffect(() => {
    detectBrowser();
  }, []);

  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    let browser = { name: '', isSupported: true };

    if (userAgent.indexOf('Firefox') > -1) {
      browser = { name: 'Firefox', isSupported: false };
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
      browser = { name: 'Opera', isSupported: false };
    } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1) {
      browser = { name: 'Edge', isSupported: true };
    } else if (userAgent.indexOf('Chrome') > -1) {
      browser = { name: 'Chrome', isSupported: true };
    } else if (userAgent.indexOf('Safari') > -1) {
      browser = { name: 'Safari', isSupported: true };
    }

    setBrowserInfo(browser);
    
    // Show banner only for unsupported browsers
    const dismissed = localStorage.getItem('browser-banner-dismissed');
    if (!browser.isSupported && !dismissed) {
      setIsVisible(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('browser-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-orange-50 to-blue-50 shadow-md border-b-2 border-orange-200">
      <div className="max-w-4xl mx-auto">
        <Alert variant="warning" className="relative bg-white/90 backdrop-blur-sm border-orange-300">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-900 pr-8">
            Voice Features Limited in {browserInfo.name}
          </AlertTitle>
          <AlertDescription className="text-gray-700 mt-2">
            <p className="mb-2">
              For the best <strong>voice-first experience</strong> with hands-free billing, 
              we recommend using:
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-lg">
                <Chrome className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Google Chrome</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-lg">
                <Chrome className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Microsoft Edge</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                <Chrome className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Safari</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              ℹ️ Manual input is always available as a fallback in all browsers.
            </p>
          </AlertDescription>
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </Alert>
      </div>
    </div>
  );
}
