/**
 * Browser Support Detection for Voice Features
 * Checks if browser supports Speech Recognition API
 */

export interface BrowserSupport {
  speechRecognition: boolean;
  speechSynthesis: boolean;
  browser: string;
  isSupported: boolean;
  reason?: string;
  isMobile: boolean;
  isSecureContext: boolean;
  canUseMicrophone: boolean;
}

/**
 * Detect browser and check voice API support
 */
export function detectBrowserSupport(): BrowserSupport {
  if (typeof window === 'undefined') {
    return {
      speechRecognition: false,
      speechSynthesis: false,
      browser: 'server',
      isSupported: false,
      reason: 'Running on server'
    };
  }

  const userAgent = navigator.userAgent;
  let browser = 'Unknown';

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Check Speech Recognition API
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const speechRecognition = !!SpeechRecognition;

  // Check Speech Synthesis API
  const speechSynthesis = !!window.speechSynthesis;

  // Determine if supported
  let isSupported = speechRecognition && speechSynthesis;
  let reason: string | undefined;

  if (!speechRecognition) {
    reason = `${browser} doesn't support Speech Recognition API`;
  } else if (!speechSynthesis) {
    reason = `${browser} doesn't support Speech Synthesis API`;
  }

  return {
    speechRecognition,
    speechSynthesis,
    browser,
    isSupported,
    reason,
    isMobile: isMobile(),
    isSecureContext: isSecureContext(),
    canUseMicrophone: isSecureContext() && speechRecognition
  };
}

/**
 * Check if running on mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if HTTPS (required for microphone access)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return false;
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

/**
 * Log browser support information to console
 * Only logs detailed info in development, minimal in production
 */
export function logBrowserSupport(): void {
  const support = detectBrowserSupport();
  
  // Only log warnings in development, not production
  if (process.env.NODE_ENV === 'development') {
    console.log('🎤 Voice Features - Browser Support');
    console.log(`  Browser: ${support.browser}`);
    console.log(`  Speech Recognition: ${support.speechRecognition ? '✅' : '❌'}`);
    console.log(`  Speech Synthesis: ${support.speechSynthesis ? '✅' : '❌'}`);
    console.log(`  Mobile Device: ${support.isMobile ? 'Yes' : 'No'}`);
    console.log(`  Secure Context (HTTPS): ${support.isSecureContext ? '✅' : '❌'}`);
    console.log(`  Can Use Microphone: ${support.canUseMicrophone ? '✅' : '❌'}`);

    if (!support.isSupported) {
      console.log(`\n⚠️ ${support.reason}`);
      console.log('\n🌐 Recommended browsers for voice features:');
      console.log('• Google Chrome (Desktop & Mobile)');
      console.log('• Microsoft Edge (Desktop & Mobile)');
      console.log('• Safari (iOS/macOS)');
    }
  } else {
    // In production, only log if there's an issue
    if (!support.isSupported) {
      console.debug('Voice features limited:', support.reason);
    }
  }
}