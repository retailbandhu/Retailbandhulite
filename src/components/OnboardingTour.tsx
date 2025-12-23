import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Mic, Store, BarChart3, Package, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
  tip?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'नमस्ते! Welcome to Retail Bandhu Lite 🎉',
    description: 'Aapke dukaan ke liye complete digital solution. Voice billing se WhatsApp automation tak, sab kuch ek jagah!',
    icon: <Sparkles className="w-12 h-12 text-[#FF6F00]" />,
    highlight: 'Your smart retail companion',
    tip: 'Swipe or tap arrows to continue'
  },
  {
    id: 'voice-billing',
    title: '🎤 Voice Billing - Bolo, Ban Gaya!',
    description: 'Mic button dabao aur bol do "2 Maggi, 3 Parle-G". Bill automatically ban jayega!',
    icon: <Mic className="w-12 h-12 text-blue-600" />,
    highlight: 'Hands-free billing in seconds',
    tip: 'Perfect for busy hours - no typing needed!'
  },
  {
    id: 'inventory',
    title: '📦 Smart Inventory Management',
    description: 'Stock tracking automatic hai. Low stock alert bhi milega. Kabhi shortage nahi hogi!',
    icon: <Package className="w-12 h-12 text-green-600" />,
    highlight: 'Never run out of stock',
    tip: 'Set reorder alerts for your top products'
  },
  {
    id: 'customers',
    title: '👥 Customer Management + Loyalty',
    description: 'Har customer ka record rakho. Udhar tracking aur loyalty points automatically!',
    icon: <Users className="w-12 h-12 text-purple-600" />,
    highlight: 'Build lasting relationships',
    tip: 'Reward loyal customers with points'
  },
  {
    id: 'analytics',
    title: '📊 Business Insights',
    description: 'Daily sales, profit, trending items - sab kuch ek dashboard par. Data-driven decisions lo!',
    icon: <BarChart3 className="w-12 h-12 text-[#1E88E5]" />,
    highlight: 'Know your business inside-out',
    tip: 'Check analytics daily to spot trends'
  },
  {
    id: 'setup',
    title: "🏪 Let's Setup Your Store",
    description: 'Bas 2 minute mein apni dukaan ka naam, address aur GST details dal do. Ho gaya shuru!',
    icon: <Store className="w-12 h-12 text-[#FF6F00]" />,
    highlight: 'Quick 2-minute setup',
    tip: "You can always change these later in Settings"
  }
];

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Reset to first step when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      // Tour complete
      localStorage.setItem('onboarding-tour-completed', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding-tour-skipped', 'true');
    onClose();
  };

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#1E88E5]/95 to-[#FF6F00]/95 backdrop-blur-sm">
      <div className="h-full flex flex-col items-center justify-center p-6">
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors flex items-center gap-2"
        >
          <span className="text-sm">Skip Tour</span>
          <X className="w-5 h-5" />
        </button>

        {/* Progress Indicator */}
        <div className="absolute top-6 left-6 flex gap-2">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-white'
                  : index < currentStep
                  ? 'w-4 bg-white/60'
                  : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Main Content Card */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl">
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-gray-900 text-center mb-3">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Highlight */}
              <div className="bg-gradient-to-r from-[#1E88E5]/10 to-[#FF6F00]/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 justify-center">
                  <Zap className="w-4 h-4 text-[#FF6F00]" />
                  <span className="text-gray-900 text-sm">{step.highlight}</span>
                </div>
              </div>

              {/* Tip */}
              {step.tip && (
                <div className="bg-blue-50 rounded-lg p-3 mb-6">
                  <p className="text-blue-900 text-sm text-center">
                    💡 <span className="font-medium">Tip:</span> {step.tip}
                  </p>
                </div>
              )}

              {/* Step Counter */}
              <div className="text-center mb-6">
                <span className="text-gray-500 text-sm">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 px-4 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                )}
                
                <button
                  onClick={handleNext}
                  className={`flex-1 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white rounded-xl py-3 px-4 hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                    currentStep === 0 ? 'w-full' : ''
                  }`}
                >
                  <span>{isLastStep ? "Let's Start!" : 'Next'}</span>
                  {isLastStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-6 text-center">
          <p className="text-white/80 text-sm">
            🎉 Welcome to the future of retail management
          </p>
          <p className="text-white/60 text-xs mt-1">
            Made with ❤️ for Bharat's Retailers
          </p>
        </div>
      </div>
    </div>
  );
}