import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, Download, X, Sparkles } from 'lucide-react';

export function AppUpdateNotifier() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check for app updates
    const checkForUpdates = () => {
      // In production, this would check for service worker updates
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          // Check for updates every 30 minutes
          setInterval(() => {
            registration.update();
          }, 30 * 60 * 1000);

          // Listen for new service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  setUpdateAvailable(true);
                  setShowUpdate(true);
                }
              });
            }
          });
        });
      }

      // Mock update check for demo (remove in production)
      const lastCheck = localStorage.getItem('last_update_check');
      const now = Date.now();
      
      if (!lastCheck || now - parseInt(lastCheck) > 24 * 60 * 60 * 1000) {
        // Simulate update available after 24 hours
        setTimeout(() => {
          setUpdateAvailable(true);
          setShowUpdate(true);
        }, 5000);
        localStorage.setItem('last_update_check', now.toString());
      }
    };

    checkForUpdates();
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator && updateAvailable) {
      // Skip waiting and reload
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
      // Fallback: just reload
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Remind later (after 1 hour)
    setTimeout(() => {
      setShowUpdate(true);
    }, 60 * 60 * 1000);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto animate-slide-down">
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold mb-1">Update Available!</h3>
            <p className="text-sm text-white/90 mb-3">
              A new version of Retail Bandhu is ready. Update now for the best experience.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                className="bg-white text-green-600 hover:bg-green-50"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Now
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="sm"
              >
                Later
              </Button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Features */}
        <div className="mt-3 pt-3 border-t border-white/20 space-y-1">
          <div className="text-xs text-white/90">
            ✨ What&apos;s new:
          </div>
          <div className="text-xs text-white/80 space-y-0.5">
            <div>• Improved performance & speed</div>
            <div>• Bug fixes & stability</div>
            <div>• New features & enhancements</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Add slide-down animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-down {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
`;
document.head.appendChild(style);
