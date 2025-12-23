import { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target, TrendingUp, Gift, Award, Crown, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

// Confetti function using canvas API directly
const triggerConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles: Array<{x: number, y: number, vx: number, vy: number, color: string, size: number}> = [];
  const colors = ['#1E88E5', '#FF6F00', '#4CAF50', '#FFC107', '#E91E63', '#9C27B0'];
  
  // Create particles
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.6,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 15 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 2
    });
  }
  
  // Animate particles
  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // gravity
      
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    
    frame++;
    if (frame < 120) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  };
  
  animate();
};

// Achievement definition
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed from React.ReactNode to string
  points: number;
  badge: string;
  category: 'getting-started' | 'sales' | 'inventory' | 'customers' | 'power-user' | 'master';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Achievement categories with colors
const categoryConfig = {
  'getting-started': { color: 'from-blue-500 to-cyan-500', label: 'Getting Started' },
  'sales': { color: 'from-green-500 to-emerald-500', label: 'Sales Master' },
  'inventory': { color: 'from-purple-500 to-pink-500', label: 'Inventory Pro' },
  'customers': { color: 'from-orange-500 to-red-500', label: 'Customer Champion' },
  'power-user': { color: 'from-indigo-500 to-purple-500', label: 'Power User' },
  'master': { color: 'from-yellow-500 to-orange-500', label: 'Retail Master' }
};

// Helper to render icon by name
const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Star,
    Trophy,
    Zap,
    Target,
    TrendingUp,
    Gift,
    Award,
    Crown,
    Sparkles
  };
  
  const IconComponent = icons[iconName] || Star;
  return <IconComponent className={className} />;
};

// All available achievements
const allAchievements: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Getting Started (Easy wins to encourage users)
  {
    id: 'first-login',
    title: '👋 Welcome Aboard!',
    description: 'Logged in for the first time',
    icon: 'Star',
    points: 10,
    badge: '🎉',
    category: 'getting-started'
  },
  {
    id: 'store-setup',
    title: '🏪 Store is Ready!',
    description: 'Completed store setup',
    icon: 'Target',
    points: 20,
    badge: '🏪',
    category: 'getting-started'
  },
  {
    id: 'first-product',
    title: '📦 First Product Added',
    description: 'Added your first product to inventory',
    icon: 'Gift',
    points: 15,
    badge: '📦',
    category: 'getting-started'
  },
  {
    id: 'first-bill',
    title: '💰 First Sale!',
    description: 'Created your first bill',
    icon: 'Zap',
    points: 25,
    badge: '💰',
    category: 'getting-started'
  },
  {
    id: 'voice-billing-first',
    title: '🎤 Voice Activated!',
    description: 'Created a bill using voice',
    icon: 'Sparkles',
    points: 30,
    badge: '🎤',
    category: 'getting-started'
  },

  // Sales Achievements
  {
    id: 'sales-10',
    title: '📈 10 Sales Milestone',
    description: 'Completed 10 successful sales',
    icon: 'TrendingUp',
    points: 50,
    badge: '🔥',
    category: 'sales',
    progress: 0,
    target: 10
  },
  {
    id: 'sales-50',
    title: '💪 50 Sales Champion',
    description: 'Completed 50 successful sales',
    icon: 'Award',
    points: 100,
    badge: '⭐',
    category: 'sales',
    progress: 0,
    target: 50
  },
  {
    id: 'sales-100',
    title: '👑 Century Club',
    description: 'Completed 100 successful sales!',
    icon: 'Crown',
    points: 200,
    badge: '👑',
    category: 'sales',
    progress: 0,
    target: 100
  },
  {
    id: 'daily-target',
    title: '🎯 Daily Target Met',
    description: 'Achieved daily sales target',
    icon: 'Target',
    points: 40,
    badge: '🎯',
    category: 'sales'
  },

  // Inventory Achievements
  {
    id: 'inventory-10',
    title: '📦 Inventory Builder',
    description: 'Added 10 products to inventory',
    icon: 'Gift',
    points: 30,
    badge: '📦',
    category: 'inventory',
    progress: 0,
    target: 10
  },
  {
    id: 'inventory-50',
    title: '🏪 Well Stocked',
    description: 'Manage 50+ products',
    icon: 'Trophy',
    points: 75,
    badge: '🏆',
    category: 'inventory',
    progress: 0,
    target: 50
  },
  {
    id: 'bulk-import',
    title: '⚡ Bulk Import Master',
    description: 'Used CSV import to add products',
    icon: 'Zap',
    points: 50,
    badge: '⚡',
    category: 'inventory'
  },
  {
    id: 'low-stock-alert',
    title: '🔔 Stock Alert Setup',
    description: 'Configured low stock alerts',
    icon: 'Target',
    points: 35,
    badge: '🔔',
    category: 'inventory'
  },

  // Customer Achievements
  {
    id: 'first-customer',
    title: '👥 First Customer Added',
    description: 'Added your first customer',
    icon: 'Gift',
    points: 20,
    badge: '👤',
    category: 'customers'
  },
  {
    id: 'customers-10',
    title: '🤝 Customer Base Growing',
    description: 'Have 10+ customers in database',
    icon: 'Award',
    points: 50,
    badge: '🤝',
    category: 'customers',
    progress: 0,
    target: 10
  },
  {
    id: 'loyalty-activated',
    title: '🎁 Loyalty Program Active',
    description: 'Activated loyalty rewards',
    icon: 'Sparkles',
    points: 40,
    badge: '🎁',
    category: 'customers'
  },
  {
    id: 'repeat-customer',
    title: '💝 Repeat Customer',
    description: 'Served a customer 5+ times',
    icon: 'Trophy',
    points: 60,
    badge: '💝',
    category: 'customers'
  },

  // Power User Achievements
  {
    id: 'keyboard-shortcuts',
    title: '⌨️ Keyboard Ninja',
    description: 'Used 5+ keyboard shortcuts',
    icon: 'Zap',
    points: 45,
    badge: '⌨️',
    category: 'power-user'
  },
  {
    id: 'voice-search',
    title: '🔍 Voice Search Pro',
    description: 'Used voice search feature',
    icon: 'Sparkles',
    points: 35,
    badge: '🔍',
    category: 'power-user'
  },
  {
    id: 'dark-mode',
    title: '🌙 Night Owl',
    description: 'Enabled dark mode',
    icon: 'Star',
    points: 25,
    badge: '🌙',
    category: 'power-user'
  },
  {
    id: 'export-report',
    title: '📊 Data Analyst',
    description: 'Exported business reports',
    icon: 'TrendingUp',
    points: 40,
    badge: '📊',
    category: 'power-user'
  },
  {
    id: 'admin-unlocked',
    title: '🔓 Secret Discovered!',
    description: 'Unlocked hidden admin panel',
    icon: 'Crown',
    points: 100,
    badge: '🔓',
    category: 'power-user'
  },

  // Master Achievements (Hard to get)
  {
    id: 'week-streak',
    title: '🔥 Weekly Warrior',
    description: 'Used app for 7 consecutive days',
    icon: 'Crown',
    points: 150,
    badge: '🔥',
    category: 'master',
    progress: 0,
    target: 7
  },
  {
    id: 'all-features',
    title: '🌟 Feature Explorer',
    description: 'Used 20+ different features',
    icon: 'Sparkles',
    points: 200,
    badge: '🌟',
    category: 'master',
    progress: 0,
    target: 20
  },
  {
    id: 'revenue-milestone',
    title: '💎 Revenue Master',
    description: 'Generated ₹1,00,000+ in sales',
    icon: 'Trophy',
    points: 300,
    badge: '💎',
    category: 'master',
    progress: 0,
    target: 100000
  },
  {
    id: 'retail-bandhu-master',
    title: '👑 Retail Bandhu Master',
    description: 'Unlocked all achievements!',
    icon: 'Crown',
    points: 500,
    badge: '👑',
    category: 'master'
  }
];

interface AchievementSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementSystem({ isOpen, onClose }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [level, setLevel] = useState(1);

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      // Initialize with all achievements locked
      const initial = allAchievements.map(a => ({ ...a, unlocked: false }));
      setAchievements(initial);
      localStorage.setItem('achievements', JSON.stringify(initial));
    }
  }, []);

  // Calculate total points and level
  useEffect(() => {
    const points = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    setTotalPoints(points);
    
    // Calculate level (every 100 points = 1 level)
    const calculatedLevel = Math.floor(points / 100) + 1;
    setLevel(calculatedLevel);
  }, [achievements]);

  // Filter achievements
  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl">Achievements</h2>
                <p className="text-white/90 text-sm">
                  Level {level} • {totalPoints} Points
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">
                {unlockedCount} of {totalCount} unlocked
              </span>
              <span className="text-white text-sm font-medium">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({achievements.length})
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = achievements.filter(a => a.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${config.color} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement) => {
              const categoryColor = categoryConfig[achievement.category].color;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 transition-all ${
                    achievement.unlocked
                      ? `bg-gradient-to-r ${categoryColor} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${
                      achievement.unlocked
                        ? 'bg-white/20 backdrop-blur-sm'
                        : 'bg-gray-200'
                    }`}>
                      <div className={achievement.unlocked ? 'text-white' : 'text-gray-400'}>
                        {renderIcon(achievement.icon)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg ${
                          achievement.unlocked ? 'text-white' : 'text-gray-700'
                        }`}>
                          {achievement.title}
                        </h3>
                        {achievement.unlocked && (
                          <span className="text-2xl">{achievement.badge}</span>
                        )}
                      </div>
                      <p className={`text-sm mb-2 ${
                        achievement.unlocked ? 'text-white/90' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>

                      {/* Progress Bar (if applicable) */}
                      {achievement.target && achievement.target > 1 && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>
                              {achievement.progress || 0} / {achievement.target}
                            </span>
                          </div>
                          <div className={`h-1.5 rounded-full overflow-hidden ${
                            achievement.unlocked ? 'bg-white/20' : 'bg-gray-300'
                          }`}>
                            <div
                              className={`h-full rounded-full ${
                                achievement.unlocked ? 'bg-white' : 'bg-gray-400'
                              }`}
                              style={{
                                width: `${Math.min(100, ((achievement.progress || 0) / achievement.target) * 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Points & Date */}
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-medium ${
                          achievement.unlocked ? 'text-white' : 'text-gray-600'
                        }`}>
                          +{achievement.points} points
                        </span>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <span className="text-white/80">
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Achievement unlock notification
interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  useEffect(() => {
    // Trigger confetti
    triggerConfetti();

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const categoryColor = categoryConfig[achievement.category].color;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.9 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <div className={`bg-gradient-to-r ${categoryColor} rounded-2xl shadow-2xl p-6 text-white`}>
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <div className="flex-1">
            <div className="text-white/90 text-sm mb-1">Achievement Unlocked!</div>
            <h3 className="text-white text-xl mb-1">{achievement.title}</h3>
            <p className="text-white/90 text-sm mb-2">{achievement.description}</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                +{achievement.points} points
              </span>
              <span className="text-2xl">{achievement.badge}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Hook to manage achievements
export function useAchievements() {
  const [showNotification, setShowNotification] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const unlockAchievement = (achievementId: string, progress?: number) => {
    const saved = localStorage.getItem('achievements');
    if (!saved) return;

    const achievements: Achievement[] = JSON.parse(saved);
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement) return;

    // Update progress if provided
    if (progress !== undefined && achievement.target) {
      achievement.progress = progress;
      
      // Check if target reached
      if (progress >= achievement.target && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        
        // Show notification
        setCurrentAchievement(achievement);
        setShowNotification(true);
        
        // Show toast
        toast.success(`🎉 Achievement Unlocked: ${achievement.title}`, {
          description: `+${achievement.points} points earned!`
        });
      }
    } else if (!achievement.unlocked) {
      // Unlock immediately
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      
      // Show notification
      setCurrentAchievement(achievement);
      setShowNotification(true);
      
      // Show toast
      toast.success(`🎉 Achievement Unlocked: ${achievement.title}`, {
        description: `+${achievement.points} points earned!`
      });
    }

    // Save updated achievements
    localStorage.setItem('achievements', JSON.stringify(achievements));
  };

  const closeNotification = () => {
    setShowNotification(false);
    setCurrentAchievement(null);
  };

  return {
    unlockAchievement,
    showNotification,
    currentAchievement,
    closeNotification
  };
}