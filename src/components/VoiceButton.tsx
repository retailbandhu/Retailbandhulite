import { Mic, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';
import { confirmVoice } from '../utils/speech';
import { detectBrowserSupport, logBrowserSupport } from '../utils/browserSupport';

interface VoiceButtonProps {
  onVoiceInput?: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showBetaBadge?: boolean;
}

export function VoiceButton({ onVoiceInput, onListeningChange, size = 'lg', showBetaBadge = true }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Use refs to avoid stale closure issues
  const onVoiceInputRef = useRef(onVoiceInput);
  const onListeningChangeRef = useRef(onListeningChange);
  
  // Update refs when props change
  useEffect(() => {
    onVoiceInputRef.current = onVoiceInput;
    onListeningChangeRef.current = onListeningChange;
  }, [onVoiceInput, onListeningChange]);

  useEffect(() => {
    // Check browser support silently (no logs for unsupported browsers)
    const support = detectBrowserSupport();
    
    // Check if browser supports Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        // Silently exit - don't show error toast
        // VoiceSupportBanner will handle user notification
        console.log('Speech Recognition not available in this browser');
        return;
      }
      
      try {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'hi-IN'; // Hindi language
        
        recognitionInstance.onstart = () => {
          console.log('✅ Speech recognition started');
          setIsListening(true);
          if (onListeningChangeRef.current) {
            onListeningChangeRef.current(true);
          }
          toast.info('🎤 Bolo... Sun raha hoon!', {
            description: 'Hindi ya English mein bolo',
          });
        };
        
        recognitionInstance.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('✅ Speech recognized:', transcript);
          
          // CRITICAL: Call the callback FIRST before any other processing
          if (onVoiceInputRef.current) {
            console.log('✅ Calling onVoiceInput callback with:', transcript);
            try {
              onVoiceInputRef.current(transcript);
              console.log('✅ onVoiceInput callback completed successfully');
            } catch (error) {
              console.error('❌ Error in onVoiceInput callback:', error);
            }
          } else {
            console.error('❌ onVoiceInput callback is undefined!');
          }
          
          // Simple toast confirmation (don't use TTS here to avoid conflicts)
          toast.success('✅ Samajh aa gaya!', {
            description: transcript,
            duration: 2000
          });
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('❌ Speech recognition error:', event.error);
          setIsListening(false);
          if (onListeningChangeRef.current) {
            onListeningChangeRef.current(false);
          }
          
          if (event.error === 'no-speech') {
            toast.error('Kuch sunai nahi diya');
          } else if (event.error === 'not-allowed') {
            toast.error('Microphone permission denied', {
              description: 'Please allow microphone access in browser settings'
            });
          } else if (event.error === 'network') {
            toast.error('Network error - Check internet connection');
          } else {
            toast.error('Voice recognition error: ' + event.error);
          }
        };
        
        recognitionInstance.onend = () => {
          console.log('✅ Speech recognition ended');
          setIsListening(false);
          if (onListeningChangeRef.current) {
            onListeningChangeRef.current(false);
          }
        };
        
        setRecognition(recognitionInstance);
        console.log('✅ Speech recognition initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize speech recognition:', error);
      }
    }
  }, []); // Empty dependency array - only run once

  const handleClick = () => {
    console.log('Voice button clicked');
    console.log('Recognition available:', !!recognition);
    console.log('Currently listening:', isListening);
    
    if (!recognition) {
      toast.error('Voice recognition not supported', {
        description: 'Please use Chrome, Edge, or Safari browser'
      });
      return;
    }

    if (isListening) {
      console.log('Stopping recognition...');
      recognition.stop();
    } else {
      try {
        console.log('Starting recognition...');
        recognition.start();
      } catch (error: any) {
        console.error('Error starting recognition:', error);
        
        // Handle case where recognition is already started
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
          toast.error('Could not start voice recognition');
        }
      }
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const iconClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative ${
        isListening ? 'animate-pulse scale-110' : 'hover:scale-105 active:scale-95'
      }`}
      title={isListening ? 'Listening... Click to stop' : 'Voice Input (Beta)'}
    >
      <Mic className={iconClasses[size]} />
      
      {/* Listening pulse effect */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-pulse"></div>
        </>
      )}
    </button>
  );
}