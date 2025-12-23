/**
 * Voice Analytics Utility
 * Tracks voice usage, accuracy, and time saved
 */

export interface VoiceAnalytics {
  commandsUsed: number;
  timeSaved: number; // in minutes
  accuracy: number; // percentage
  lastUpdated: string;
  commandHistory: VoiceCommand[];
}

export interface VoiceCommand {
  timestamp: string;
  type: 'billing' | 'inventory' | 'customer' | 'search' | 'reports' | 'other';
  success: boolean;
  timeSavedMs: number;
}

const ANALYTICS_KEY = 'voice-analytics-v1';

// Average time saved per successful voice command (in milliseconds)
const TIME_SAVED_PER_COMMAND = {
  billing: 8000,     // 8 seconds saved vs manual typing
  inventory: 6000,   // 6 seconds saved
  customer: 10000,   // 10 seconds saved
  search: 4000,      // 4 seconds saved
  reports: 5000,     // 5 seconds saved
  other: 5000        // 5 seconds saved
};

/**
 * Get current voice analytics
 */
export function getVoiceAnalytics(): VoiceAnalytics {
  const stored = localStorage.getItem(ANALYTICS_KEY);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing voice analytics:', error);
    }
  }
  
  // Return default analytics
  return {
    commandsUsed: 0,
    timeSaved: 0,
    accuracy: 0,
    lastUpdated: new Date().toISOString(),
    commandHistory: []
  };
}

/**
 * Track a voice command
 */
export function trackVoiceCommand(
  type: VoiceCommand['type'],
  success: boolean
): void {
  const analytics = getVoiceAnalytics();
  
  const timeSavedMs = success ? TIME_SAVED_PER_COMMAND[type] : 0;
  
  const command: VoiceCommand = {
    timestamp: new Date().toISOString(),
    type,
    success,
    timeSavedMs
  };
  
  // Add to history (keep last 100 commands)
  analytics.commandHistory.push(command);
  if (analytics.commandHistory.length > 100) {
    analytics.commandHistory = analytics.commandHistory.slice(-100);
  }
  
  // Update counts
  analytics.commandsUsed += 1;
  analytics.timeSaved += timeSavedMs / 1000 / 60; // Convert to minutes
  
  // Calculate accuracy
  const successfulCommands = analytics.commandHistory.filter(c => c.success).length;
  analytics.accuracy = analytics.commandHistory.length > 0
    ? Math.round((successfulCommands / analytics.commandHistory.length) * 100)
    : 0;
  
  analytics.lastUpdated = new Date().toISOString();
  
  // Save to localStorage
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  
  // Log for debugging
  console.log('📊 Voice Analytics Updated:', {
    commandsUsed: analytics.commandsUsed,
    timeSaved: `${analytics.timeSaved.toFixed(1)} min`,
    accuracy: `${analytics.accuracy}%`,
    type,
    success
  });
}

/**
 * Get analytics for display
 */
export function getVoiceStats() {
  const analytics = getVoiceAnalytics();
  
  return {
    commandsUsed: analytics.commandsUsed,
    timeSaved: analytics.timeSaved.toFixed(1), // Format to 1 decimal
    accuracy: analytics.accuracy,
    totalCommands: analytics.commandHistory.length
  };
}

/**
 * Reset analytics (for testing or user request)
 */
export function resetVoiceAnalytics(): void {
  localStorage.removeItem(ANALYTICS_KEY);
  console.log('✅ Voice analytics reset');
}

/**
 * Get analytics by time period
 */
export function getAnalyticsByPeriod(days: number = 7) {
  const analytics = getVoiceAnalytics();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  const recentCommands = analytics.commandHistory.filter(cmd => {
    const cmdDate = new Date(cmd.timestamp);
    return cmdDate >= cutoff;
  });
  
  const successfulCommands = recentCommands.filter(c => c.success).length;
  const totalTimeSaved = recentCommands.reduce((sum, c) => sum + c.timeSavedMs, 0) / 1000 / 60;
  
  return {
    commandsUsed: recentCommands.length,
    timeSaved: totalTimeSaved.toFixed(1),
    accuracy: recentCommands.length > 0
      ? Math.round((successfulCommands / recentCommands.length) * 100)
      : 0
  };
}

/**
 * Export analytics for reporting
 */
export function exportVoiceAnalytics(): string {
  const analytics = getVoiceAnalytics();
  return JSON.stringify(analytics, null, 2);
}
