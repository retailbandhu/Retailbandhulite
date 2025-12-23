import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Moon, 
  Calculator, 
  Upload, 
  Calendar, 
  Accessibility, 
  Download,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface WhatsNewShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  gradient: string;
}

export function WhatsNewShowcase({ isOpen, onClose }: WhatsNewShowcaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const features: Feature[] = [
    {
      icon: Sparkles,
      title: 'Welcome to Elite Tier!',
      description: 'Your Retail Bandhu has been upgraded with 10 powerful new features!',
      benefits: [
        '250+ total features',
        'Professional design',
        'Enterprise-grade quality',
        'WCAG 2.1 accessible'
      ],
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      description: 'Switch between light and dark themes for comfortable viewing anytime.',
      benefits: [
        'Reduces eye strain',
        'Saves battery on OLED screens',
        'Professional appearance',
        'Automatic preference saving'
      ],
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Calculator,
      title: 'Quick Calculator',
      description: 'Built-in calculator with special GST calculation tools.',
      benefits: [
        'Full calculator functionality',
        'Add 18% GST instantly',
        'Remove GST from total',
        'Keyboard shortcuts supported'
      ],
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Upload,
      title: 'Bulk CSV Import',
      description: 'Import hundreds of products at once using CSV files.',
      benefits: [
        'Download ready-to-use template',
        'Drag & drop file upload',
        'Line-by-line validation',
        'Save hours of manual entry'
      ],
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      title: 'Advanced Date Picker',
      description: 'Select date ranges with quick presets or custom selection.',
      benefits: [
        '8 quick preset ranges',
        'Custom date selection',
        'Interactive calendar',
        'Perfect for reports'
      ],
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Accessibility,
      title: 'Full Accessibility',
      description: 'WCAG 2.1 compliant with customizable accessibility settings.',
      benefits: [
        'Adjustable font size (80-150%)',
        'High contrast mode',
        'Reduce motion option',
        'Screen reader support'
      ],
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Download,
      title: 'Multi-Format Export',
      description: 'Export your data in JSON, CSV, or PDF formats.',
      benefits: [
        'Complete data backup',
        'Excel-compatible CSV',
        'Professional PDF reports',
        'Selective export options'
      ],
      color: 'text-teal-600',
      gradient: 'from-teal-500 to-cyan-500'
    }
  ];

  const currentFeature = features[currentSlide];
  const Icon = currentFeature.icon;

  const handleNext = () => {
    if (currentSlide < features.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('whats-new-shown', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${currentFeature.gradient} p-8 text-white relative`}>
          <button
            onClick={handleFinish}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  What's New
                </span>
              </div>
              <h2 className="text-3xl font-bold">{currentFeature.title}</h2>
            </div>
          </div>

          <p className="text-lg text-white/90">
            {currentFeature.description}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Key Benefits:
          </h3>

          <div className="space-y-3 mb-8">
            {currentFeature.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 transform transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentFeature.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-8 h-2 bg-gradient-to-r ' + currentFeature.gradient
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentSlide === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentSlide === features.length - 1 ? (
              <Button
                onClick={handleFinish}
                className={`flex-1 bg-gradient-to-r ${currentFeature.gradient} hover:opacity-90 text-white border-0`}
              >
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className={`flex-1 bg-gradient-to-r ${currentFeature.gradient} hover:opacity-90 text-white border-0`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Skip option */}
          <div className="text-center mt-4">
            <button
              onClick={handleFinish}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip tour
            </button>
          </div>
        </div>

        {/* Feature counter */}
        <div className="px-8 pb-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Feature {currentSlide + 1} of {features.length}
          </p>
        </div>
      </Card>
    </div>
  );
}

// Hook to manage What's New visibility
export function useWhatsNew() {
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  React.useEffect(() => {
    const shown = localStorage.getItem('whats-new-shown');
    if (!shown) {
      // Show after a short delay when app loads
      setTimeout(() => {
        setShowWhatsNew(true);
      }, 2000);
    }
  }, []);

  return {
    showWhatsNew,
    setShowWhatsNew,
    resetWhatsNew: () => {
      localStorage.removeItem('whats-new-shown');
      setShowWhatsNew(true);
    }
  };
}
