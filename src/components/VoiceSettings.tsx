import { Mic, Volume2, Languages, Gauge, TestTube, BarChart3, Power, Check, X, GraduationCap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { detectBrowserSupport } from '../utils/browserSupport';
import { speak } from '../utils/speech';
import { VoiceTutorial, resetVoiceTutorial } from './VoiceTutorial';
import { getVoiceStats } from '../utils/voiceAnalytics';

interface VoiceSettingsProps {
  onClose?: () => void;
}

interface VoicePreferences {
  ttsEnabled: boolean;
  volume: number;
  language: 'hi-IN' | 'en-US' | 'hi-EN';
  speed: number;
  autoConfirm: boolean;
}

export function VoiceSettings({ onClose }: VoiceSettingsProps) {
  const [support, setSupport] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [preferences, setPreferences] = useState<VoicePreferences>({
    ttsEnabled: true,
    volume: 100,
    language: 'hi-IN',
    speed: 0.9,
    autoConfirm: true
  });
  const [stats, setStats] = useState({ commandsUsed: 0, timeSaved: '0.0', accuracy: 0 });

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('voice-preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }

    // Check browser support
    setSupport(detectBrowserSupport());
    
    // Load real analytics stats
    setStats(getVoiceStats());
  }, []);

  const savePreferences = (newPrefs: VoicePreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem('voice-preferences', JSON.stringify(newPrefs));
    toast.success('✅ Voice settings saved!');
  };

  const handleToggleTTS = () => {
    const newPrefs = { ...preferences, ttsEnabled: !preferences.ttsEnabled };
    savePreferences(newPrefs);
  };

  const handleVolumeChange = (value: number) => {
    const newPrefs = { ...preferences, volume: value };
    savePreferences(newPrefs);
  };

  const handleLanguageChange = (lang: 'hi-IN' | 'en-US' | 'hi-EN') => {
    const newPrefs = { ...preferences, language: lang };
    savePreferences(newPrefs);
    
    // Test with new language
    const messages = {
      'hi-IN': 'हिंदी भाषा चुनी गई',
      'en-US': 'English language selected',
      'hi-EN': 'Hinglish mode selected - Mix of Hindi and English'
    };
    speak(messages[lang]);
  };

  const handleSpeedChange = (speed: number) => {
    const newPrefs = { ...preferences, speed };
    savePreferences(newPrefs);
  };

  const handleTestMicrophone = async () => {
    if (!support?.speechRecognition) {
      toast.error('❌ Microphone test not available', {
        description: 'Speech recognition not supported in this browser'
      });
      return;
    }

    setTesting(true);
    toast.info('🎤 Microphone test starting...', {
      description: 'Say something!'
    });

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = preferences.language;

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = (event.results[0][0].confidence * 100).toFixed(0);
        
        toast.success('✅ Microphone working!', {
          description: `Heard: "${transcript}" (${confidence}% confidence)`,
          duration: 5000
        });

        if (preferences.ttsEnabled) {
          await speak(`I heard: ${transcript}`);
        }
        
        setTesting(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Test error:', event.error);
        toast.error('❌ Microphone test failed', {
          description: event.error === 'not-allowed' 
            ? 'Please allow microphone access' 
            : 'Please try again'
        });
        setTesting(false);
      };

      recognition.onend = () => {
        setTesting(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Test error:', error);
      toast.error('❌ Test failed');
      setTesting(false);
    }
  };

  const handleTestTTS = async () => {
    if (!support?.speechSynthesis) {
      toast.error('❌ Text-to-Speech not available');
      return;
    }

    const messages = {
      'hi-IN': 'नमस्ते! मैं आपकी आवाज़ सुन सकता हूं।',
      'en-US': 'Hello! I can hear your voice clearly.',
      'hi-EN': 'Hello! Main aapki awaaz sun sakta hoon.'
    };

    toast.info('🔊 Testing Text-to-Speech...');
    await speak(messages[preferences.language]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl flex items-center gap-2">
            <Mic className="w-6 h-6 text-blue-600" />
            Voice Settings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Customize your voice experience
          </p>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose} size="sm">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Browser Support Status */}
      {support && (
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-3">
            {support.isSupported ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm">
                <strong>Browser:</strong> {support.browser}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {support.isSupported 
                  ? '✅ All voice features are available!'
                  : `❌ ${support.reason}`
                }
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Speech Recognition: {support.speechRecognition ? '✅' : '❌'}
                </div>
                <div className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Text-to-Speech: {support.speechSynthesis ? '✅' : '❌'}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* TTS Enable/Disable */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power className={`w-5 h-5 ${preferences.ttsEnabled ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <p className="font-medium">Audio Confirmation (TTS)</p>
              <p className="text-xs text-gray-600">
                Hear voice feedback after speaking
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleTTS}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              preferences.ttsEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                preferences.ttsEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Volume Control */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Volume2 className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="font-medium">Voice Feedback Volume</p>
            <p className="text-xs text-gray-600">Adjust TTS volume</p>
          </div>
          <span className="text-sm font-medium text-gray-700">{preferences.volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={preferences.volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1E88E5 0%, #1E88E5 ${preferences.volume}%, #e5e7eb ${preferences.volume}%, #e5e7eb 100%)`
          }}
        />
      </Card>

      {/* Language Preference */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Languages className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium">Preferred Language</p>
            <p className="text-xs text-gray-600">Choose voice recognition language</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleLanguageChange('hi-IN')}
            className={`p-3 rounded-lg border-2 text-sm transition-all ${
              preferences.language === 'hi-IN'
                ? 'border-blue-600 bg-blue-50 font-medium'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            हिंदी
            <span className="block text-xs text-gray-600">Hindi</span>
          </button>
          <button
            onClick={() => handleLanguageChange('en-US')}
            className={`p-3 rounded-lg border-2 text-sm transition-all ${
              preferences.language === 'en-US'
                ? 'border-blue-600 bg-blue-50 font-medium'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            English
            <span className="block text-xs text-gray-600">EN-US</span>
          </button>
          <button
            onClick={() => handleLanguageChange('hi-EN')}
            className={`p-3 rounded-lg border-2 text-sm transition-all ${
              preferences.language === 'hi-EN'
                ? 'border-blue-600 bg-blue-50 font-medium'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            Hinglish
            <span className="block text-xs text-gray-600">Mix</span>
          </button>
        </div>
      </Card>

      {/* Voice Speed */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Gauge className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="font-medium">Speech Speed</p>
            <p className="text-xs text-gray-600">Adjust TTS speaking rate</p>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {preferences.speed === 0.7 ? 'Slow' : preferences.speed === 0.9 ? 'Normal' : 'Fast'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSpeedChange(0.7)}
            className={`p-3 rounded-lg border-2 text-sm transition-all ${
              preferences.speed === 0.7
                ? 'border-blue-600 bg-blue-50 font-medium'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            🐢 Slow
            <span className="block text-xs text-gray-600">धीमा</span>
          </button>
          <button
            onClick={() => handleSpeedChange(0.9)}
            className={`p-3 rounded-lg border-2 text-sm transition-all ${
              preferences.speed === 0.9
                ? 'border-blue-600 bg-blue-50 font-medium'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            🚶 Normal
            <span className="block text-xs text-gray-600">सामान्य</span>
          </button>
          <button
            onClick={() => handleSpeedChange(1.2)}
            className={`p-3 rounded-lg border-2 text-sm transition-all ${
              preferences.speed === 1.2
                ? 'border-blue-600 bg-blue-50 font-medium'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            🚀 Fast
            <span className="block text-xs text-gray-600">तेज़</span>
          </button>
        </div>
      </Card>

      {/* Testing Tools */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <TestTube className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium">Testing & Diagnostics</p>
            <p className="text-xs text-gray-600">Test your microphone and speakers</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleTestMicrophone}
            disabled={!support?.speechRecognition || testing}
            variant="outline"
            className="w-full"
          >
            {testing ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                Listening...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Test Mic
              </>
            )}
          </Button>
          <Button
            onClick={handleTestTTS}
            disabled={!support?.speechSynthesis}
            variant="outline"
            className="w-full"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Test TTS
          </Button>
        </div>
      </Card>

      {/* Voice Usage Stats */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Voice Usage Statistics</p>
            <p className="text-xs text-gray-600">Your voice activity this month</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.commandsUsed}</p>
            <p className="text-xs text-gray-600 mt-1">Commands Used</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.timeSaved}h</p>
            <p className="text-xs text-gray-600 mt-1">Time Saved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.accuracy}%</p>
            <p className="text-xs text-gray-600 mt-1">Accuracy</p>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <p className="text-sm font-medium mb-2">💡 Tips for Best Results:</p>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Use Chrome, Edge, or Safari for best experience</li>
          <li>• Ensure stable internet connection</li>
          <li>• Reduce background noise</li>
          <li>• Hold device 6-12 inches from mouth</li>
        </ul>
      </Card>

      {/* Tutorial */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium">Voice Tutorial</p>
            <p className="text-xs text-gray-600">Learn how to use voice features</p>
          </div>
        </div>
        <Button
          onClick={() => setShowTutorial(true)}
          variant="outline"
          className="w-full"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          Start Tutorial
        </Button>
      </Card>

      {/* Tutorial Modal */}
      {showTutorial && (
        <VoiceTutorial
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}

// Export function to get current voice preferences
export function getVoicePreferences(): VoicePreferences {
  const saved = localStorage.getItem('voice-preferences');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    ttsEnabled: true,
    volume: 100,
    language: 'hi-IN',
    speed: 0.9,
    autoConfirm: true
  };
}