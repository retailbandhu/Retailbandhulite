/**
 * Floating Help Button Component
 * Quick access to voice tutorial from anywhere in the app
 */

import { useState } from 'react';
import { HelpCircle, X, Sparkles } from 'lucide-react';
import { VoiceTutorial } from './VoiceTutorial';

interface FloatingHelpButtonProps {
  onOpen?: () => void;
}

export function FloatingHelpButton({ onOpen }: FloatingHelpButtonProps) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showBadge, setShowBadge] = useState(() => {
    // Show badge if tutorial not completed
    return !localStorage.getItem('voice-tutorial-completed');
  });

  const handleClick = () => {
    setShowTutorial(true);
    setShowBadge(false);
    onOpen?.();
  };

  const handleClose = () => {
    setShowTutorial(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="fixed bottom-24 right-6 z-40 group"
        aria-label="Voice Tutorial Help"
      >
        {/* Pulsing Ring Animation for New Users */}
        {showBadge && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-75" />
        )}
        
        {/* Main Button */}
        <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
          <HelpCircle className="w-7 h-7 text-white" />
          
          {/* "NEW" Badge */}
          {showBadge && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            🎤 Voice Tutorial
            {showBadge && (
              <span className="block text-yellow-300 mt-0.5">
                ✨ Click to learn!
              </span>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      </button>

      {/* Tutorial Modal */}
      {showTutorial && (
        <VoiceTutorial onClose={handleClose} />
      )}
    </>
  );
}

/**
 * Mini Floating Help Button (for crowded screens)
 */
export function MiniFloatingHelpButton({ onOpen }: FloatingHelpButtonProps) {
  const [showTutorial, setShowTutorial] = useState(false);

  const handleClick = () => {
    setShowTutorial(true);
    onOpen?.();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Help"
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </button>

      {showTutorial && (
        <VoiceTutorial onClose={() => setShowTutorial(false)} />
      )}
    </>
  );
}
