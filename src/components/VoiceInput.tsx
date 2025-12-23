import { Mic, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { confirmVoice } from '../utils/speech';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'number' | 'search';
  className?: string;
  maxLength?: number;
  voiceType?: 'item' | 'number' | 'text' | 'search';
  voiceLabel?: string;
  disabled?: boolean;
  onVoiceComplete?: (text: string) => void;
}

export function VoiceInput({
  value,
  onChange,
  placeholder = 'Type or speak...',
  type = 'text',
  className = '',
  maxLength,
  voiceType = 'text',
  voiceLabel = 'Voice Input',
  disabled = false,
  onVoiceComplete
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        // Silently handle browsers without speech recognition support
        // Only log in development mode to avoid console warnings in production
        if (process.env.NODE_ENV === 'development') {
          console.log('ℹ️ Speech Recognition not available - using Chrome/Edge/Safari for voice features');
        }
        setIsSupported(false);
        return; // Exit early if not supported
      }
      
      try {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'hi-IN'; // Hindi + English
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
          toast.info('🎤 Bolo...', {
            description: voiceLabel,
            duration: 2000
          });
        };
        
        recognitionInstance.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice Input:', transcript);
          
          // Update input value
          onChange(transcript);
          
          // Audio confirmation with TTS
          try {
            await confirmVoice(transcript, voiceType);
          } catch (error) {
            console.error('TTS error:', error);
          }
          
          // Show visual confirmation
          toast.success('✅ Samajh aa gaya!', {
            description: transcript,
            duration: 3000
          });

          // Callback
          if (onVoiceComplete) {
            onVoiceComplete(transcript);
          }
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'no-speech') {
            toast.error('Kuch sunai nahi diya', { duration: 2000 });
          } else if (event.error === 'not-allowed') {
            toast.error('Microphone permission chahiye', {
              description: 'Browser settings mein allow karein'
            });
          } else if (event.error === 'network') {
            toast.error('Network error - Check internet connection');
          } else {
            toast.error('Voice error - dobara try karein');
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
        console.log('✅ VoiceInput: Speech recognition initialized');
      } catch (error) {
        console.error('❌ Failed to initialize VoiceInput speech recognition:', error);
      }
    }
  }, [onChange, voiceType, voiceLabel, onVoiceComplete]);

  const handleVoiceClick = () => {
    if (!recognition) {
      toast.error('Voice not supported', {
        description: 'Please use Chrome, Edge, or Safari'
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (error: any) {
        console.error('Error starting recognition:', error);
        
        if (error.message && error.message.includes('already started')) {
          recognition.stop();
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Retry failed:', e);
              toast.error('Please try again');
            }
          }, 100);
        } else {
          toast.error('Voice recognition error');
        }
      }
    }
  };

  return (
    <div className="relative flex gap-2">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        maxLength={maxLength}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={handleVoiceClick}
        disabled={disabled || isListening}
        className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all shadow-sm flex-shrink-0 ${
          isListening 
            ? 'bg-blue-600 animate-pulse shadow-lg' 
            : 'bg-gradient-to-br from-blue-600 to-blue-500 hover:shadow-md hover:scale-105 active:scale-95'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isListening ? 'Listening...' : voiceLabel}
      >
        {isListening ? (
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}