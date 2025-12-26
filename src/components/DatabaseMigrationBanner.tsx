/**
 * Database Migration Banner
 * Shows a friendly banner prompting users to migrate their data to cloud
 */

import { useState, useEffect } from 'react';
import { Cloud, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { databaseManager, isDatabaseSyncEnabled } from '../utils/databaseIntegration';
import type { Screen } from '../types';

interface DatabaseMigrationBannerProps {
  onNavigate: (screen: Screen) => void;
}

export function DatabaseMigrationBanner({ onNavigate }: DatabaseMigrationBannerProps) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we should show the banner
    const bannerDismissed = localStorage.getItem('migrationBannerDismissed');
    const syncEnabled = isDatabaseSyncEnabled();
    const migrationNeeded = databaseManager.isMigrationNeeded();

    if (!bannerDismissed && syncEnabled && migrationNeeded) {
      // Show banner after a short delay so it doesn't overwhelm the user
      setTimeout(() => {
        setShow(true);
      }, 2000);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    localStorage.setItem('migrationBannerDismissed', 'true');
  };

  const handleMigrate = () => {
    setShow(false);
    onNavigate('database-settings');
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div className="mx-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 shadow-lg animate-in slide-in-from-top duration-500">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
          <Cloud className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">
            ☁️ Sync Your Data to the Cloud!
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            You have local data on this device. Migrate it to the cloud for automatic backup and access from anywhere!
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleMigrate}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Migrate Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="outline"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-blue-600 hover:text-blue-800 flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
