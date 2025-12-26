/**
 * Database Initialization Hook
 * Handles auto-enabling database sync and migration prompts
 */

import { useEffect, useState } from 'react';
import { databaseManager, isDatabaseSyncEnabled } from '../utils/databaseIntegration';
import { toast } from 'sonner';

export function useDatabaseInit() {
  const [initialized, setInitialized] = useState(false);
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Check if first time setup
        const firstTime = !localStorage.getItem('databaseInitialized');
        
        if (firstTime) {
          // Auto-enable database sync for new users
          databaseManager.enableDatabaseSync();
          localStorage.setItem('databaseInitialized', 'true');
          console.log('✅ Database sync auto-enabled for new user');
        }

        // Check if migration is needed
        const needsMigration = databaseManager.isMigrationNeeded();
        setMigrationNeeded(needsMigration);

        // Show prompt if migration is needed (but don't annoy user every time)
        const migrationPromptShown = localStorage.getItem('migrationPromptShown');
        if (needsMigration && !migrationPromptShown && isDatabaseSyncEnabled()) {
          // Wait a bit before showing the prompt
          setTimeout(() => {
            toast.info(
              'You have local data that can be synced to the cloud. Visit Settings → Database & Sync to migrate.',
              {
                duration: 10000,
                action: {
                  label: 'Don\'t show again',
                  onClick: () => {
                    localStorage.setItem('migrationPromptShown', 'true');
                  }
                }
              }
            );
          }, 3000);
        }

        setInitialized(true);
      } catch (error) {
        console.error('Database initialization error:', error);
        setInitialized(true);
      }
    };

    initDatabase();
  }, []);

  return {
    initialized,
    migrationNeeded,
    isSyncEnabled: isDatabaseSyncEnabled()
  };
}
