// Text-to-Speech Service for Voice Confirmations
// Provides audio feedback for voice inputs

interface SpeechConfig {
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private config: SpeechConfig = {
    lang: 'hi-IN', // Hindi for Indian users
    pitch: 1,
    rate: 0.9, // Slightly slower for clarity
    volume: 1
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Speak text with audio feedback
   */
  speak(text: string, config?: Partial<SpeechConfig>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const finalConfig = { ...this.config, ...config };

      utterance.lang = finalConfig.lang;
      utterance.pitch = finalConfig.pitch;
      utterance.rate = finalConfig.rate;
      utterance.volume = finalConfig.volume;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        reject(error);
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Confirm voice input with audio feedback
   */
  async confirmVoiceInput(text: string, type: 'item' | 'number' | 'text' | 'search' = 'text') {
    let message = '';
    
    switch (type) {
      case 'item':
        message = `${text}. Samajh aa gaya.`;
        break;
      case 'number':
        message = `Number: ${text}`;
        break;
      case 'search':
        message = `${text}. Dhoond raha hoon.`;
        break;
      default:
        message = text;
    }

    try {
      await this.speak(message);
    } catch (error) {
      console.error('TTS confirmation failed:', error);
    }
  }

  /**
   * Welcome message
   */
  async welcome() {
    await this.speak('Namaste! Retail Bandhu tayyar hai.');
  }

  /**
   * Success message
   */
  async success(message: string) {
    await this.speak(message);
  }

  /**
   * Error message
   */
  async error(message: string) {
    await this.speak(message, { pitch: 0.8, rate: 0.8 });
  }

  /**
   * Stop any ongoing speech
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if speech synthesis is available
   */
  isSupported(): boolean {
    return !!this.synth;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  /**
   * Set language
   */
  setLanguage(lang: string) {
    this.config.lang = lang;
  }
}

// Singleton instance
export const speechService = new SpeechService();

// Utility functions for common use cases
export const confirmVoice = (text: string, type?: 'item' | 'number' | 'text' | 'search') => {
  return speechService.confirmVoiceInput(text, type);
};

export const speak = (text: string) => {
  return speechService.speak(text);
};

export const stopSpeaking = () => {
  speechService.stop();
};
