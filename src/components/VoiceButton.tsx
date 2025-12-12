import { Mic, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface VoiceButtonProps {
  onVoiceInput?: (text: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showBetaBadge?: boolean;
}

export function VoiceButton({ onVoiceInput, size = 'lg', showBetaBadge = true }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    setIsListening(true);
    
    // Show beta message
    toast.info('🎤 Voice Demo Mode', {
      description: 'Advanced Hinglish voice recognition coming soon! Currently showing demo.',
    });
    
    // Simulate voice recognition (demo mode)
    setTimeout(() => {
      const mockInput = "2 Pepsi 20 rupees each";
      if (onVoiceInput) {
        onVoiceInput(mockInput);
      }
      setIsListening(false);
    }, 2000);
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={isListening}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
          isListening ? 'animate-pulse scale-110' : ''
        }`}
        title={isListening ? 'Listening...' : 'Voice Input (Beta)'}
      >
        <Mic className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`} />
      </button>
      
      {/* Beta Badge */}
      {showBetaBadge && size === 'lg' && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 animate-pulse">
          <Sparkles className="w-3 h-3" />
          <span>BETA</span>
        </div>
      )}
      
      {/* Listening indicator */}
      {isListening && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs whitespace-nowrap">
          Listening... 🎤
        </div>
      )}
    </div>
  );
}