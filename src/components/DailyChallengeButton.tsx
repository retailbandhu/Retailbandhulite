import { useState, useEffect } from 'react';
import { Target, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyChallengeButtonProps {
  onClick: () => void;
}

export function DailyChallengeButton({ onClick }: DailyChallengeButtonProps) {
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const loadData = () => {
      // Load challenges
      const saved = localStorage.getItem('daily-challenges');
      if (saved) {
        const challenges = JSON.parse(saved);
        const completed = challenges.filter((c: any) => c.completed).length;
        const total = challenges.length;
        
        setCompletedCount(completed);
        setTotalCount(total);

        // Show pulse if there are new completions
        if (completed > 0) {
          setShowPulse(true);
          setTimeout(() => setShowPulse(false), 2000);
        }
      }

      // Load streak
      const savedStreak = localStorage.getItem('login-streak');
      if (savedStreak) {
        const streakData = JSON.parse(savedStreak);
        setStreak(streakData.current);
      }
    };

    loadData();

    // Check periodically for updates
    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);
  }, []);

  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-36 right-6 z-40 text-white rounded-full shadow-lg hover:shadow-xl transition-all ${
        allCompleted
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
          : 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]'
      }`}
    >
      <div className="relative p-4">
        {/* Pulse effect */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute inset-0 rounded-full ${
                allCompleted
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]'
              }`}
            />
          )}
        </AnimatePresence>

        <Target className="w-6 h-6 relative z-10" />

        {/* Completion badge */}
        {totalCount > 0 && (
          <div className={`absolute -top-1 -right-1 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg ${
            allCompleted ? 'bg-green-600' : 'bg-purple-600'
          }`}>
            {completedCount}/{totalCount}
          </div>
        )}

        {/* Streak indicator */}
        {streak > 0 && (
          <div className="absolute -bottom-1 -left-1 bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
            <Flame className="w-3 h-3" />
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {allCompleted ? '🎉 All Complete!' : `${completedCount}/${totalCount} challenges`}
          {streak > 0 && ` • ${streak} day streak 🔥`}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </motion.button>
  );
}