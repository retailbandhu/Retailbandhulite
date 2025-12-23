import { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Feature {
  id: string;
  title: string;
  description: string;
  badge?: string;
  action: () => void;
  actionLabel: string;
}

interface FeatureSpotlightProps {
  feature: Feature;
  onDismiss: () => void;
  position?: 'top' | 'bottom' | 'center';
}

export function FeatureSpotlight({ feature, onDismiss, position = 'bottom' }: FeatureSpotlightProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleAction = () => {
    feature.action();
    handleDismiss();
  };

  const positionClasses = {
    top: 'top-24',
    bottom: 'bottom-24',
    center: 'top-1/2 -translate-y-1/2'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Spotlight Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed left-4 right-4 ${positionClasses[position]} z-50 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md`}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 relative">
                {/* Floating sparkles */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-4 right-4"
                >
                  <Sparkles className="w-6 h-6 text-white/80" />
                </motion.div>

                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white text-lg">
                        {feature.title}
                      </h3>
                      {feature.badge && (
                        <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded text-xs font-medium">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-white/90 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action area */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-orange-50">
                <button
                  onClick={handleAction}
                  className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white rounded-xl py-3 px-4 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{feature.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleDismiss}
                  className="w-full mt-2 text-gray-600 text-sm py-2 hover:text-gray-900 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Pre-built feature spotlights for common features
export const featureSpotlights = {
  hiddenAdmin: {
    id: 'hidden-admin',
    title: '🔓 Hidden Admin Unlocked!',
    description: 'You discovered the secret admin panel! Tap the version number 7 times to unlock advanced features.',
    badge: 'SECRET',
    actionLabel: 'Got it!',
    action: () => {}
  },
  voiceBilling: {
    id: 'voice-billing',
    title: '🎤 Try Voice Billing',
    description: 'Create bills just by speaking! Press the mic and say "2 Maggi, 3 Parle-G" to see magic happen.',
    badge: 'NEW',
    actionLabel: 'Try Now',
    action: () => {}
  },
  loyaltyProgram: {
    id: 'loyalty-program',
    title: '🎁 Loyalty Rewards',
    description: 'Keep customers coming back! Set up automatic loyalty points to reward your regulars.',
    badge: 'POPULAR',
    actionLabel: 'Setup Now',
    action: () => {}
  },
  whatsappAutomation: {
    id: 'whatsapp-automation',
    title: '📱 WhatsApp Automation',
    description: 'Send bills, payment reminders, and offers directly on WhatsApp. Automated aur easy!',
    badge: 'PRO',
    actionLabel: 'Learn More',
    action: () => {}
  },
  bulkImport: {
    id: 'bulk-import',
    title: '⚡ Bulk Product Import',
    description: 'Add 100s of products in seconds using CSV import. No more manual entry!',
    badge: 'TIME SAVER',
    actionLabel: 'Import Products',
    action: () => {}
  },
  analytics: {
    id: 'analytics',
    title: '📊 Business Insights',
    description: 'See which products sell best, peak hours, and profit trends. Make data-driven decisions!',
    actionLabel: 'View Analytics',
    action: () => {}
  }
};
