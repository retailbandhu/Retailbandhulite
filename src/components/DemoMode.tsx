import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Mic, 
  MessageSquare, 
  Package, 
  CheckCircle2,
  ArrowRight,
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DemoModeProps {
  onClose: () => void;
}

type DemoStep = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  action: string;
  icon: any;
  highlight: string;
  autoNext?: boolean;
  duration?: number;
};

export function DemoMode({ onClose }: DemoModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const demoSteps: DemoStep[] = [
    {
      id: 0,
      title: 'Welcome to Retail Bandhu Lite! 🎉',
      subtitle: 'Guided Interactive Demo',
      description: 'We\'ll show you how to create a complete bill in just 10 seconds using voice. Bilkul asaan hai!',
      action: 'Let\'s Start',
      icon: Sparkles,
      highlight: 'This demo will take 90 seconds',
      autoNext: false
    },
    {
      id: 1,
      title: 'Step 1: Press Mic Button 🎤',
      subtitle: 'Voice Billing Shuru Karein',
      description: 'Dashboard par mic button press karein. Ab aap ready hain billing ke liye!',
      action: 'Next: Speak Items',
      icon: Mic,
      highlight: 'Tip: Works in Hindi, English, or Hinglish',
      autoNext: true,
      duration: 3000
    },
    {
      id: 2,
      title: 'Step 2: Speak Product Names 🗣️',
      subtitle: 'Bolo Items',
      description: 'Simply speak: "2 kg chawal, 500 gram dal, 1 Maggi packet, 2 Parle-G"',
      action: 'Next: See Magic',
      icon: MessageSquare,
      highlight: 'AI recognizes products automatically!',
      autoNext: true,
      duration: 4000
    },
    {
      id: 3,
      title: 'Step 3: AI Creates Bill ✨',
      subtitle: 'Automatic Bill Generation',
      description: 'AI ne automatically:\n• Products identify kiye\n• Prices add kiye\n• Tax calculate kiya\n• Total nikala',
      action: 'Next: Customer Details',
      icon: CheckCircle2,
      highlight: 'All in 3 seconds!',
      autoNext: true,
      duration: 4000
    },
    {
      id: 4,
      title: 'Step 4: Add Customer (Optional) 👤',
      subtitle: 'Customer Select Karein',
      description: 'Existing customer select karein ya naya add karein. Skip bhi kar sakte hain!',
      action: 'Next: Payment',
      icon: Package,
      highlight: 'Auto-saves for future bills',
      autoNext: true,
      duration: 3000
    },
    {
      id: 5,
      title: 'Step 5: Payment Method 💰',
      subtitle: 'Payment Kaise Mila?',
      description: 'Cash, UPI, Card, or Credit (Khata) - select payment method.',
      action: 'Next: Share Bill',
      icon: CheckCircle2,
      highlight: 'Khata = Digital udhar management',
      autoNext: true,
      duration: 3000
    },
    {
      id: 6,
      title: 'Step 6: Share on WhatsApp 📱',
      subtitle: 'Bill Customer Ko Bhejein',
      description: 'One tap - bill automatically WhatsApp par chala gaya! Customer ko PDF mil gaya.',
      action: 'Next: Inventory',
      icon: MessageSquare,
      highlight: 'Works without WhatsApp Business API',
      autoNext: true,
      duration: 4000
    },
    {
      id: 7,
      title: 'Bonus: Auto Inventory Update 📦',
      subtitle: 'Stock Automatically Kam Hui',
      description: 'Bill create karte hi:\n• Inventory automatically updated\n• Low stock alert agar kam hai\n• Reorder suggestion ready',
      action: 'See Full Features',
      icon: Package,
      highlight: 'No manual stock entry needed!',
      autoNext: false
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && demoSteps[currentStep].autoNext) {
      const duration = demoSteps[currentStep].duration || 3000;
      const step = 100 / (duration / 50);
      
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + step;
        });
      }, 50);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const step = demoSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900">Interactive Demo</h3>
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} of {demoSteps.length}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex gap-1 mb-4">
            {demoSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 min-h-[400px] flex flex-col">
          <div className="flex-1">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
                <Icon className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl mb-2 text-gray-900">{step.title}</h2>
              <p className="text-orange-600 mb-4">{step.subtitle}</p>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {step.highlight}
              </Badge>
            </div>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-2 border-blue-200">
              <p className="text-gray-700 whitespace-pre-line text-center">
                {step.description}
              </p>
            </Card>

            {/* Auto-play Progress */}
            {step.autoNext && isPlaying && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Auto-advancing in {Math.ceil((100 - progress) / 33)} seconds...
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
              {currentStep === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Auto Play
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                onClick={handleNext}
              >
                {step.action}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
