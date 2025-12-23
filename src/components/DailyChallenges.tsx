import { useState, useEffect } from 'react';
import { Target, Zap, Trophy, Clock, ChevronRight, X, CheckCircle2, Flame, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

// Helper to render icon by name
const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Target,
    Zap,
    Trophy,
    Clock,
    CheckCircle2,
    Flame,
    Calendar
  };
  
  const IconComponent = icons[iconName] || Target;
  return <IconComponent className={className} />;
};

// Daily challenge definition
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed from React.ReactNode to string
  points: number;
  target: number;
  progress: number;
  completed: boolean;
  type: 'sales' | 'inventory' | 'customers' | 'features' | 'streak';
  expiresAt: string; // ISO date string
}

// Streak data
export interface StreakData {
  current: number;
  longest: number;
  lastCheckIn: string; // ISO date string
  milestones: number[]; // Days at which bonuses were earned
}

interface DailyChallengesProps {
  isOpen: boolean;
  onClose: () => void;
  billCount?: number;
  productCount?: number;
  customerCount?: number;
}

export function DailyChallenges({ isOpen, onClose, billCount = 0, productCount = 0, customerCount = 0 }: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    lastCheckIn: '',
    milestones: []
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  // Initialize or load challenges
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('daily-challenges');
    const savedDate = localStorage.getItem('daily-challenges-date');
    
    // Check if we need to generate new challenges (new day)
    if (savedDate !== today || !saved) {
      const newChallenges = generateDailyChallenges();
      setChallenges(newChallenges);
      localStorage.setItem('daily-challenges', JSON.stringify(newChallenges));
      localStorage.setItem('daily-challenges-date', today);
    } else {
      setChallenges(JSON.parse(saved));
    }

    // Load streak data
    const savedStreak = localStorage.getItem('login-streak');
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak));
    }

    // Update streak on open
    updateStreak();
  }, [isOpen]);

  // Update challenge progress
  useEffect(() => {
    if (challenges.length === 0) return;

    const updated = challenges.map(challenge => {
      let newProgress = challenge.progress;

      switch (challenge.type) {
        case 'sales':
          newProgress = billCount;
          break;
        case 'inventory':
          newProgress = productCount;
          break;
        case 'customers':
          newProgress = customerCount;
          break;
      }

      // Check if just completed
      if (!challenge.completed && newProgress >= challenge.target) {
        challenge.completed = true;
        toast.success(`🎉 Challenge Completed: ${challenge.title}`, {
          description: `+${challenge.points} points earned!`
        });
      }

      return { ...challenge, progress: newProgress };
    });

    setChallenges(updated);
    localStorage.setItem('daily-challenges', JSON.stringify(updated));
  }, [billCount, productCount, customerCount]);

  // Calculate total points earned
  useEffect(() => {
    const points = challenges
      .filter(c => c.completed)
      .reduce((sum, c) => sum + c.points, 0);
    setTotalPoints(points);
  }, [challenges]);

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Update streak
  const updateStreak = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('login-streak');
    let streakData: StreakData = saved 
      ? JSON.parse(saved) 
      : { current: 0, longest: 0, lastCheckIn: '', milestones: [] };

    const lastCheckIn = streakData.lastCheckIn ? new Date(streakData.lastCheckIn).toDateString() : '';
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastCheckIn === today) {
      // Already checked in today
      setStreak(streakData);
      return;
    }

    if (lastCheckIn === yesterday) {
      // Consecutive day
      streakData.current += 1;
    } else if (lastCheckIn === '') {
      // First check-in
      streakData.current = 1;
    } else {
      // Streak broken
      streakData.current = 1;
    }

    streakData.lastCheckIn = new Date().toISOString();
    
    // Update longest streak
    if (streakData.current > streakData.longest) {
      streakData.longest = streakData.current;
    }

    // Check for milestone bonuses (7, 14, 30, 60, 100 days)
    const milestones = [7, 14, 30, 60, 100];
    milestones.forEach(milestone => {
      if (streakData.current === milestone && !streakData.milestones.includes(milestone)) {
        streakData.milestones.push(milestone);
        const bonusPoints = milestone * 10;
        toast.success(`🔥 ${milestone}-Day Streak Milestone!`, {
          description: `Bonus +${bonusPoints} points earned!`
        });
      }
    });

    setStreak(streakData);
    localStorage.setItem('login-streak', JSON.stringify(streakData));
  };

  // Generate daily challenges
  const generateDailyChallenges = (): DailyChallenge[] => {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const expiresAt = tomorrow.toISOString();

    const allChallenges = [
      // Sales challenges
      {
        id: 'sales-5',
        title: 'First 5 Sales',
        description: 'Complete 5 sales today',
        icon: 'Zap',
        points: 50,
        target: 5,
        progress: 0,
        completed: false,
        type: 'sales' as const,
        expiresAt
      },
      {
        id: 'sales-10',
        title: 'Power Seller',
        description: 'Complete 10 sales today',
        icon: 'Trophy',
        points: 100,
        target: 10,
        progress: 0,
        completed: false,
        type: 'sales' as const,
        expiresAt
      },
      {
        id: 'sales-20',
        title: 'Sales Champion',
        description: 'Complete 20 sales today',
        icon: 'Target',
        points: 200,
        target: 20,
        progress: 0,
        completed: false,
        type: 'sales' as const,
        expiresAt
      },
      // Inventory challenges
      {
        id: 'inventory-3',
        title: 'Stock Update',
        description: 'Add 3 new products today',
        icon: 'Target',
        points: 40,
        target: 3,
        progress: 0,
        completed: false,
        type: 'inventory' as const,
        expiresAt
      },
      {
        id: 'inventory-10',
        title: 'Inventory Master',
        description: 'Manage 10+ products',
        icon: 'Trophy',
        points: 60,
        target: 10,
        progress: 0,
        completed: false,
        type: 'inventory' as const,
        expiresAt
      },
      // Customer challenges
      {
        id: 'customers-2',
        title: 'New Customer',
        description: 'Add 2 new customers today',
        icon: 'Target',
        points: 45,
        target: 2,
        progress: 0,
        completed: false,
        type: 'customers' as const,
        expiresAt
      }
    ];

    // Randomly select 3-4 challenges for the day
    const shuffled = allChallenges.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const completionPercentage = totalChallenges > 0 
    ? Math.round((completedCount / totalChallenges) * 100) 
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl">Daily Challenges</h2>
                <p className="text-white/90 text-sm">
                  {completedCount}/{totalChallenges} completed • {totalPoints} points earned
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
              <span className="text-white text-sm">Today's Progress</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/90" />
                <span className="text-white text-sm">{timeLeft} left</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Streak Display */}
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8" />
                <div>
                  <div className="text-sm opacity-90">Current Streak</div>
                  <div className="text-2xl font-bold">{streak.current} Days</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Longest Streak</div>
                <div className="text-xl font-bold">{streak.longest} Days</div>
              </div>
            </div>
            
            {/* Streak milestones */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-xs opacity-90 mb-2">Milestone Progress</div>
              <div className="flex gap-2">
                {[7, 14, 30, 60, 100].map(milestone => {
                  const achieved = streak.current >= milestone;
                  const inProgress = streak.current < milestone;
                  return (
                    <div
                      key={milestone}
                      className={`flex-1 h-2 rounded-full ${
                        achieved 
                          ? 'bg-white' 
                          : inProgress 
                            ? 'bg-white/30' 
                            : 'bg-white/10'
                      }`}
                      title={`${milestone} days`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs opacity-75 mt-1">
                <span>7d</span>
                <span>14d</span>
                <span>30d</span>
                <span>60d</span>
                <span>100d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {challenges.map((challenge, index) => {
              const progressPercentage = Math.min(100, (challenge.progress / challenge.target) * 100);
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-4 transition-all ${
                    challenge.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-50 border-2 border-gray-200 hover:border-[#1E88E5]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${
                      challenge.completed
                        ? 'bg-white/20 backdrop-blur-sm text-white'
                        : 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white'
                    }`}>
                      {challenge.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        renderIcon(challenge.icon)
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-medium mb-1 ${
                            challenge.completed ? 'text-white' : 'text-gray-900'
                          }`}>
                            {challenge.title}
                          </h3>
                          <p className={`text-sm ${
                            challenge.completed ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            {challenge.description}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2 ${
                          challenge.completed
                            ? 'bg-white/20 backdrop-blur-sm text-white'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        }`}>
                          +{challenge.points} pts
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={challenge.completed ? 'text-white/90' : 'text-gray-600'}>
                            Progress
                          </span>
                          <span className={challenge.completed ? 'text-white' : 'text-gray-900'}>
                            {challenge.progress} / {challenge.target}
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${
                          challenge.completed ? 'bg-white/20' : 'bg-gray-200'
                        }`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              challenge.completed
                                ? 'bg-white'
                                : 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Status */}
                      {challenge.completed && (
                        <div className="flex items-center gap-1 text-white text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Completion Bonus */}
          {completedCount === totalChallenges && totalChallenges > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white text-center"
            >
              <Trophy className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">🎉 All Challenges Complete!</h3>
              <p className="text-white/90 mb-3">
                You've completed all daily challenges!
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                <span className="text-2xl font-bold">Bonus +50 points</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>New challenges tomorrow</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Hook to manage daily challenges
export function useDailyChallenges() {
  const [hasUnclaimedRewards, setHasUnclaimedRewards] = useState(false);

  useEffect(() => {
    // Check if there are completed but unclaimed challenges
    const saved = localStorage.getItem('daily-challenges');
    if (saved) {
      const challenges: DailyChallenge[] = JSON.parse(saved);
      const hasCompleted = challenges.some(c => c.completed);
      setHasUnclaimedRewards(hasCompleted);
    }
  }, []);

  return {
    hasUnclaimedRewards
  };
}