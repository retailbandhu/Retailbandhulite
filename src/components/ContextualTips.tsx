import { useState, useEffect } from 'react';
import { X, Lightbulb, TrendingUp, Zap, Gift, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Tip {
  id: string;
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ContextualTipsProps {
  screen?: string;
  onDismiss?: (tipId: string) => void;
}

const tipsByScreen: Record<string, Tip[]> = {
  dashboard: [
    {
      id: 'voice-billing-tip',
      title: 'Quick Voice Billing',
      message: 'Press the big mic button and say items to create bills instantly! Try: "2 Maggi, 3 Parle-G"',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'daily-tips',
      title: 'Track Daily Progress',
      message: 'Your sales stats update in real-time. Check the dashboard cards for today\'s performance!',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-teal-500'
    }
  ],
  inventory: [
    {
      id: 'low-stock-alert',
      title: 'Never Run Out of Stock',
      message: 'Set reorder alerts for your top-selling items. We\'ll notify you before they run out!',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'bulk-import',
      title: 'Add Items Quickly',
      message: 'Use the CSV import feature to add multiple products at once. Saves hours of manual entry!',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500'
    }
  ],
  customers: [
    {
      id: 'loyalty-program',
      title: 'Reward Your Customers',
      message: 'Turn on loyalty points to reward repeat customers. They\'ll love coming back!',
      icon: <Gift className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500'
    }
  ],
  billing: [
    {
      id: 'voice-billing-detail',
      title: 'Voice Billing Pro Tips',
      message: 'Speak clearly: "Item name, quantity". Example: "Atta 2 kg, Milk 1 liter". Works like magic!',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500'
    }
  ]
};

export function ContextualTips({ screen = 'dashboard', onDismiss }: ContextualTipsProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const tips = tipsByScreen[screen] || [];
  const activeTips = tips.filter(tip => !dismissed.includes(tip.id));

  useEffect(() => {
    // Show tip after 3 seconds on screen
    const timer = setTimeout(() => {
      if (activeTips.length > 0) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [screen, activeTips.length]);

  useEffect(() => {
    // Auto-rotate tips every 10 seconds
    if (isVisible && activeTips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % activeTips.length);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isVisible, activeTips.length]);

  const handleDismiss = (tipId: string) => {
    setDismissed([...dismissed, tipId]);
    if (onDismiss) {
      onDismiss(tipId);
    }
    
    // If no more tips, hide the component
    if (activeTips.length <= 1) {
      setIsVisible(false);
    } else {
      // Move to next tip
      setCurrentTipIndex((prev) => prev % (activeTips.length - 1));
    }
  };

  if (!isVisible || activeTips.length === 0) {
    return null;
  }

  const currentTip = activeTips[currentTipIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-4 right-4 z-40 md:left-auto md:right-6 md:w-80"
      >
        <div className={`bg-gradient-to-r ${currentTip.color} p-[2px] rounded-xl shadow-lg`}>
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`p-2 bg-gradient-to-r ${currentTip.color} rounded-lg text-white flex-shrink-0`}>
                {currentTip.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-gray-900 text-sm mb-1">
                  {currentTip.title}
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {currentTip.message}
                </p>

                {/* Action Button */}
                {currentTip.action && (
                  <button
                    onClick={currentTip.action.onClick}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {currentTip.action.label} →
                  </button>
                )}

                {/* Tip Counter */}
                {activeTips.length > 1 && (
                  <div className="flex gap-1 mt-2">
                    {activeTips.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-all ${
                          index === currentTipIndex
                            ? 'w-4 bg-blue-500'
                            : 'w-1 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => handleDismiss(currentTip.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
