/**
 * Database Migration Status Component
 * Shows the current state of database integration
 * Useful for tracking migration progress
 */

import { useState, useEffect } from 'react';
import { Database, HardDrive, Cloud, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface MigrationStatus {
  phase: 'localStorage' | 'localStorageProvider' | 'hybrid' | 'supabase';
  features: {
    errorHandling: boolean;
    caching: boolean;
    asyncOperations: boolean;
    offlineFirst: boolean;
    cloudSync: boolean;
    multiDevice: boolean;
  };
  nextSteps: string[];
}

export function DatabaseMigrationStatus() {
  const [status, setStatus] = useState<MigrationStatus>({
    phase: 'localStorageProvider',
    features: {
      errorHandling: true,
      caching: true,
      asyncOperations: true,
      offlineFirst: true,
      cloudSync: false,
      multiDevice: false,
    },
    nextSteps: [
      'Update components to use async data loading',
      'Test error handling and recovery',
      'Create Supabase project',
      'Run database migrations',
      'Enable hybrid provider for cloud sync',
    ],
  });

  const phaseConfig = {
    localStorage: {
      icon: HardDrive,
      color: 'text-gray-500',
      bg: 'bg-gray-100',
      name: 'localStorage (Basic)',
      description: 'Synchronous local storage only',
    },
    localStorageProvider: {
      icon: Database,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      name: 'localStorage Provider (Enhanced)',
      description: 'Async operations with caching & error handling',
    },
    hybrid: {
      icon: Cloud,
      color: 'text-purple-500',
      bg: 'bg-purple-100',
      name: 'Hybrid Provider',
      description: 'Offline-first with cloud sync',
    },
    supabase: {
      icon: Database,
      color: 'text-green-500',
      bg: 'bg-green-100',
      name: 'Supabase (Full Cloud)',
      description: 'Real-time multi-device sync',
    },
  };

  const currentPhase = phaseConfig[status.phase];
  const Icon = currentPhase.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${currentPhase.bg}`}>
            <Icon className={`w-5 h-5 ${currentPhase.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{currentPhase.name}</h3>
            <p className="text-xs text-gray-500">{currentPhase.description}</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Active Features:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(status.features).map(([key, enabled]) => (
              <div key={key} className="flex items-center gap-1">
                {enabled ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-gray-300" />
                )}
                <span className={`text-xs ${enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        {status.nextSteps.length > 0 && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Next Steps:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              {status.nextSteps.slice(0, 3).map((step, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Migration Progress</span>
            <span>
              {status.phase === 'localStorage' && '25%'}
              {status.phase === 'localStorageProvider' && '50%'}
              {status.phase === 'hybrid' && '75%'}
              {status.phase === 'supabase' && '100%'}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${currentPhase.bg} ${currentPhase.color} transition-all duration-500`}
              style={{
                width:
                  status.phase === 'localStorage'
                    ? '25%'
                    : status.phase === 'localStorageProvider'
                    ? '50%'
                    : status.phase === 'hybrid'
                    ? '75%'
                    : '100%',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Development-only indicator (remove in production)
 */
export function DevDatabaseStatus() {
  if (import.meta.env.PROD) return null;

  return <DatabaseMigrationStatus />;
}
