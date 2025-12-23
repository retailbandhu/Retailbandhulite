/**
 * Data Migration Modal
 * Shows migration progress and handles user interaction
 */

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Alert } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Cloud,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  Download,
  Shield,
} from 'lucide-react';
import {
  migrateToSupabase,
  needsMigration,
  getMigrationStatus,
  verifyMigration,
  createPreMigrationBackup,
  resetMigration,
  type MigrationStatus,
} from '../utils/dataMigration';
import { toast } from 'sonner@2.0.3';

interface DataMigrationModalProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function DataMigrationModal({
  open,
  onClose,
  onComplete,
}: DataMigrationModalProps) {
  const [status, setStatus] = useState<MigrationStatus>(getMigrationStatus());
  const [migrating, setMigrating] = useState(false);
  const [backupKey, setBackupKey] = useState<string>('');

  useEffect(() => {
    // Update status when modal opens
    if (open) {
      setStatus(getMigrationStatus());
    }
  }, [open]);

  const handleMigrate = async () => {
    try {
      setMigrating(true);

      // Create backup first
      toast.info('Creating backup...');
      const key = await createPreMigrationBackup();
      setBackupKey(key);

      // Run migration
      const result = await migrateToSupabase((newStatus) => {
        setStatus(newStatus);
      });

      if (result.success) {
        toast.success('Migration completed successfully!');
        
        // Verify migration
        const verification = await verifyMigration();
        if (!verification.valid) {
          toast.warning('Migration completed but verification found issues');
        }

        if (onComplete) {
          onComplete();
        }
      } else {
        toast.error(`Migration completed with ${result.errors.length} errors`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error(`Migration failed: ${error}`);
    } finally {
      setMigrating(false);
    }
  };

  const handleSkip = () => {
    // Mark as completed to not show again
    localStorage.setItem(
      'retail_bandhu_migration_status',
      JSON.stringify({
        inProgress: false,
        completed: true,
        failed: false,
        currentStep: 'Skipped by user',
        progress: 100,
        errors: [],
        migratedAt: new Date().toISOString(),
      })
    );
    onClose();
  };

  const handleRetry = () => {
    resetMigration();
    setStatus(getMigrationStatus());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-500" />
            Migrate to Cloud
          </DialogTitle>
          <DialogDescription>
            Upload your local data to the cloud for multi-device sync and backup
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Migration Status */}
          {status.inProgress && (
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-600 animate-pulse" />
                  <div className="flex-1">
                    <p className="font-medium">{status.currentStep}</p>
                    <p className="text-sm text-gray-600">
                      Please wait, do not close this window...
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(status.progress)}%
                  </span>
                </div>

                <Progress value={status.progress} className="h-3" />
              </div>
            </Card>
          )}

          {/* Completed Successfully */}
          {status.completed && !status.failed && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="ml-3">
                <h3 className="font-medium text-green-900">
                  Migration Completed Successfully!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your data has been safely uploaded to the cloud. You can now access
                  it from any device!
                </p>
              </div>
            </Alert>
          )}

          {/* Completed with Errors */}
          {status.completed && status.failed && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="ml-3">
                <h3 className="font-medium text-yellow-900">
                  Migration Completed with Errors
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Some items could not be migrated. Your data is safe in local storage.
                </p>
                {status.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {status.errors.slice(0, 3).map((error, i) => (
                      <p key={i} className="text-xs text-yellow-600">
                        • {error}
                      </p>
                    ))}
                    {status.errors.length > 3 && (
                      <p className="text-xs text-yellow-600">
                        ... and {status.errors.length - 3} more errors
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Alert>
          )}

          {/* Not Started */}
          {!status.inProgress && !status.completed && (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <Database className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Local Data</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Currently on this device only
                    </p>
                  </Card>

                  <Card className="p-4 text-center">
                    <Upload className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Migrate</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Upload to cloud safely
                    </p>
                  </Card>

                  <Card className="p-4 text-center">
                    <Cloud className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Cloud Sync</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Access from anywhere
                    </p>
                  </Card>
                </div>

                <Alert>
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <h3 className="font-medium">Safe & Secure</h3>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      <li>✅ Automatic backup before migration</li>
                      <li>✅ Your local data stays safe</li>
                      <li>✅ Can rollback if needed</li>
                      <li>✅ Encrypted cloud storage</li>
                    </ul>
                  </div>
                </Alert>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">What will be migrated:</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>📦 All products & inventory</li>
                    <li>👥 All customers & purchase history</li>
                    <li>📄 All bills & transactions</li>
                    <li>🏪 Store information & settings</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {!status.inProgress && !status.completed && (
              <>
                <Button
                  onClick={handleMigrate}
                  disabled={migrating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {migrating ? 'Migrating...' : 'Start Migration'}
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  disabled={migrating}
                >
                  Skip for Now
                </Button>
              </>
            )}

            {status.completed && status.failed && (
              <>
                <Button onClick={handleRetry} variant="outline">
                  Retry Migration
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </>
            )}

            {status.completed && !status.failed && (
              <Button onClick={onClose} className="w-full">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Done
              </Button>
            )}
          </div>

          {/* Backup Info */}
          {backupKey && (
            <p className="text-xs text-gray-500 text-center">
              Backup created: {backupKey}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
