import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AchievementButtonProps {
  onClick: () => void;
}

export function AchievementButton({ onClick }: AchievementButtonProps) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Load achievement data
    const loadAchievements = () => {
      const saved = localStorage.getItem('achievements');
      if (saved) {
        const achievements = JSON.parse(saved);
        const unlocked = achievements.filter((a: any) => a.unlocked);
        const points = unlocked.reduce((sum: number, a: any) => sum + a.points, 0);
        
        setUnlockedCount(unlocked.length);
        setTotalPoints(points);
        setLevel(Math.floor(points / 100) + 1);
      }
    };

    loadAchievements();

    // Listen for storage changes (when achievements are unlocked)
    const handleStorageChange = () => {
      loadAchievements();
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (in case unlocked in same tab)
    const interval = setInterval(loadAchievements, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 right-6 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      <div className="relative p-4">
        {/* Pulse effect when new achievement */}
        <AnimatePresence>
          {showPulse && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
            />
          )}
        </AnimatePresence>

        <Trophy className="w-6 h-6 relative z-10" />

        {/* Level badge */}
        {level > 1 && (
          <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
            {level}
          </div>
        )}

        {/* Points tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {unlockedCount} achievements • {totalPoints} pts
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </motion.button>
  );
}