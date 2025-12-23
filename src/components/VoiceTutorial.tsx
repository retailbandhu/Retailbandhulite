/**
 * Voice Tutorial Component
 * Interactive guide for first-time voice users
 */

import React, { useState } from 'react';
import { 
  Mic, 
  Volume2, 
  MessageSquare, 
  ShoppingCart, 
  Package, 
  Users,
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Play
} from 'lucide-react';

interface VoiceTutorialProps {
  onClose: () => void;
}

export function VoiceTutorial({ onClose }: VoiceTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Voice-First Billing! 🎤',
      description: 'Retail Bandhu is India\'s ONLY hands-free billing app. Complete entire transactions using just your voice!',
      icon: Sparkles,
      color: 'from-blue-500 to-purple-600',
      commands: [
        { text: 'Speak naturally in Hindi or English', example: '"Do maggie aur ek pepsi"' },
        { text: 'Get instant voice confirmation', example: 'App responds: "2 Maggie aur 1 Pepsi add kar diya!"' },
        { text: 'Complete billing without touching screen', example: '"Generate bill"' }
      ]
    },
    {
      title: 'Voice Billing Commands 🛒',
      description: 'Add products, remove items, and manage your bill - all with voice!',
      icon: ShoppingCart,
      color: 'from-green-500 to-teal-600',
      commands: [
        { text: 'Add items', example: '"2 maggie and 1 pepsi add karo"' },
        { text: 'Remove items', example: '"maggie remove karo"' },
        { text: 'Clear all', example: '"sara bill clear karo"' },
        { text: 'Apply discount', example: '"10 percent discount lagao"' },
        { text: 'Generate bill', example: '"bill generate karo"' }
      ]
    },
    {
      title: 'Voice Inventory Management 📦',
      description: 'Manage your stock with voice commands!',
      icon: Package,
      color: 'from-orange-500 to-red-600',
      commands: [
        { text: 'Add product', example: '"Product add karo"' },
        { text: 'Search product', example: '"maggie search karo"' },
        { text: 'Update stock', example: 'Use voice in stock field' },
        { text: 'Set price', example: 'Use voice in price field' }
      ]
    },
    {
      title: 'Voice Customer & Khata 👥',
      description: 'Manage customers and transactions with voice!',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      commands: [
        { text: 'Add customer', example: 'Voice input in all fields' },
        { text: 'Record payment', example: '"Payment add karo"' },
        { text: 'Add expense', example: '"Expense add karo"' },
        { text: 'Search anything', example: 'Press Ctrl+Shift+V' }
      ]
    },
    {
      title: 'Global Voice Search 🔍',
      description: 'Search across products, customers, and bills instantly!',
      icon: MessageSquare,
      color: 'from-indigo-500 to-blue-600',
      commands: [
        { text: 'Universal shortcut', example: 'Press Ctrl+Shift+V anywhere' },
        { text: 'Search products', example: '"maggie search karo"' },
        { text: 'Find customers', example: '"sharma ji ka number batao"' },
        { text: 'Check bills', example: '"aaj ke bills dikhao"' }
      ]
    },
    {
      title: 'Voice Tips & Best Practices 💡',
      description: 'Get the most out of voice features!',
      icon: Volume2,
      color: 'from-yellow-500 to-orange-600',
      commands: [
        { text: 'Speak clearly', example: 'Natural pace, clear pronunciation' },
        { text: 'Use Hinglish freely', example: 'Mix Hindi and English naturally' },
        { text: 'Wait for confirmation', example: 'App will speak back what it heard' },
        { text: 'Grant mic permission', example: 'Click "Allow" when browser asks' },
        { text: 'Use Chrome/Edge', example: 'Best voice support on these browsers' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('voice-tutorial-completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentStepData.color} text-white p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{currentStepData.title}</h2>
              <p className="text-white/90 text-sm">{currentStepData.description}</p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          <div className="space-y-4">
            {currentStepData.commands.map((cmd, index) => (
              <div 
                key={index}
                className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{cmd.text}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 font-mono bg-white px-3 py-1 rounded border border-gray-200">
                      {cmd.example}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video Demo Placeholder */}
          {currentStep === 0 && (
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Play className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900">Video Tutorial</h3>
              </div>
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p className="text-sm opacity-75">Video demonstration coming soon!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-5 h-5" />
                Get Started!
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Utility function to reset tutorial completion status
export function resetVoiceTutorial() {
  localStorage.removeItem('voice-tutorial-completed');
}