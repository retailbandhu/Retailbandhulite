import { Mic, MicOff, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useVoiceRecognition, parseVoiceInput, ParsedVoiceItem } from '../hooks/useVoiceRecognition';

interface VoiceButtonProps {
  onVoiceInput?: (text: string) => void;
  onParsedItems?: (items: ParsedVoiceItem[]) => void;
  products?: { id: string; name: string; price: number }[];
  size?: 'sm' | 'md' | 'lg';
  showBetaBadge?: boolean;
  language?: 'hi-IN' | 'en-IN' | 'hi';
}

export function VoiceButton({ 
  onVoiceInput, 
  onParsedItems,
  products = [],
  size = 'lg', 
  showBetaBadge = true,
  language = 'hi-IN'
}: VoiceButtonProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  
  const handleResult = useCallback((result: { transcript: string; isFinal: boolean }) => {
    if (result.isFinal && result.transcript.trim()) {
      onVoiceInput?.(result.transcript);
      
      if (products.length > 0 && onParsedItems) {
        const parsedItems = parseVoiceInput(result.transcript, products);
        if (parsedItems.length > 0) {
          onParsedItems(parsedItems);
        }
      }
    }
  }, [onVoiceInput, onParsedItems, products]);

  const handleError = useCallback((error: string) => {
    if (error === 'not-allowed') {
      toast.error('Microphone access denied. Please enable microphone in browser settings.');
    } else if (error === 'no-speech') {
      toast.info('No speech detected. Try speaking louder.');
    } else if (error === 'network') {
      toast.error('Network error. Check your internet connection.');
    } else {
      toast.error(`Voice error: ${error}`);
    }
  }, []);

  const handleEnd = useCallback(() => {
    setShowTranscript(false);
  }, []);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
  } = useVoiceRecognition({
    language,
    continuous: false,
    interimResults: true,
    onResult: handleResult,
    onError: handleError,
    onEnd: handleEnd,
  });

  const handleClick = () => {
    if (!isSupported) {
      toast.error('Voice recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setShowTranscript(true);
      startListening();
      toast.info('🎤 Boliye... (Speak now)', {
        description: 'Hindi/Hinglish mein bolo - "2 Maggi aur 1 Pepsi"',
      });
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const currentTranscript = transcript || interimTranscript;

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} rounded-full ${
          isListening 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]'
        } text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center`}
        title={isListening ? 'Listening... (Click to stop)' : 'Voice Input (Click to speak)'}
      >
        {isListening ? (
          <MicOff className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`} />
        ) : (
          <Mic className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`} />
        )}
      </button>
      
      {showBetaBadge && size === 'lg' && !isListening && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>LIVE</span>
        </div>
      )}
      
      {isListening && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap min-w-[150px] text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="animate-pulse text-red-500">●</span>
            <span>Sun raha hoon...</span>
          </div>
          {currentTranscript && (
            <div className="text-gray-600 text-xs mt-1 max-w-[200px] truncate">
              "{currentTranscript}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
