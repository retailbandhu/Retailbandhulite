import { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, TrendingUp, Users, Share2, X, ChevronRight, Flame, Star, Zap, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

// Leaderboard entry
export interface LeaderboardEntry {
  id: string;
  name: string;
  storeName: string;
  city: string;
  points: number;
  level: number;
  achievements: number;
  streak: number;
  rank: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

// Leaderboard type
type LeaderboardType = 'global' | 'city' | 'friends';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Load leaderboard data
  useEffect(() => {
    if (!isOpen) return;

    // Get current user data
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const streak = JSON.parse(localStorage.getItem('login-streak') || '{"current": 0}');
    const storeInfo = JSON.parse(localStorage.getItem('storeInfo') || '{}');
    
    const unlockedAchievements = achievements.filter((a: any) => a.unlocked);
    const totalPoints = unlockedAchievements.reduce((sum: number, a: any) => sum + a.points, 0);
    const level = Math.floor(totalPoints / 100) + 1;

    const user: LeaderboardEntry = {
      id: 'current-user',
      name: storeInfo.owner || 'You',
      storeName: storeInfo.name || 'Your Store',
      city: extractCity(storeInfo.address) || 'Your City',
      points: totalPoints,
      level: level,
      achievements: unlockedAchievements.length,
      streak: streak.current || 0,
      rank: 0, // Will be calculated
      isCurrentUser: true
    };

    setCurrentUser(user);

    // Generate mock leaderboard (in production, this would come from backend)
    const mockEntries = generateMockLeaderboard(user);
    setEntries(mockEntries);
  }, [isOpen, leaderboardType]);

  // Extract city from address
  const extractCity = (address: string): string => {
    if (!address) return '';
    const parts = address.split(',');
    return parts[parts.length - 1]?.trim() || '';
  };

  // Generate mock leaderboard
  const generateMockLeaderboard = (currentUser: LeaderboardEntry): LeaderboardEntry[] => {
    const indianNames = [
      { name: 'Ramesh Kumar', store: 'Kumar Kirana' },
      { name: 'Priya Sharma', store: 'Sharma General Store' },
      { name: 'Amit Patel', store: 'Patel Trading Co' },
      { name: 'Sunita Devi', store: 'Devi Provisions' },
      { name: 'Rajesh Singh', store: 'Singh Mart' },
      { name: 'Anita Gupta', store: 'Gupta Store' },
      { name: 'Vijay Reddy', store: 'Reddy Super Market' },
      { name: 'Meera Joshi', store: 'Joshi Kirana' },
      { name: 'Suresh Yadav', store: 'Yadav Traders' },
      { name: 'Kavita Mishra', store: 'Mishra General Store' }
    ];

    const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

    const mockData: LeaderboardEntry[] = [];

    // Generate 50 entries
    for (let i = 0; i < 50; i++) {
      const nameData = indianNames[Math.floor(Math.random() * indianNames.length)];
      const city = leaderboardType === 'city' 
        ? currentUser.city 
        : indianCities[Math.floor(Math.random() * indianCities.length)];

      mockData.push({
        id: `user-${i}`,
        name: nameData.name,
        storeName: nameData.store,
        city: city,
        points: Math.floor(Math.random() * 3000) + 100,
        level: Math.floor(Math.random() * 20) + 1,
        achievements: Math.floor(Math.random() * 25),
        streak: Math.floor(Math.random() * 100),
        rank: 0 // Will be set later
      });
    }

    // Add current user
    mockData.push(currentUser);

    // Sort by points
    mockData.sort((a, b) => b.points - a.points);

    // Assign ranks
    mockData.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return mockData;
  };

  // Filter entries based on type
  const filteredEntries = leaderboardType === 'city'
    ? entries.filter(e => e.city === currentUser?.city)
    : leaderboardType === 'friends'
    ? entries.filter(e => e.isCurrentUser || Math.random() > 0.8) // Mock friends
    : entries;

  // Get top 10
  const topEntries = filteredEntries.slice(0, 10);

  // Find current user in list
  const userEntry = filteredEntries.find(e => e.isCurrentUser);
  const userRank = userEntry?.rank || 0;

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    if (!currentUser) return;

    const message = `🏆 *Retail Bandhu Lite Leaderboard*\n\n` +
      `I'm ranked #${userRank} with ${currentUser.points} points! 🎉\n\n` +
      `📊 My Stats:\n` +
      `• Level ${currentUser.level}\n` +
      `• ${currentUser.achievements} Achievements\n` +
      `• ${currentUser.streak} Day Streak 🔥\n\n` +
      `Join me on Retail Bandhu Lite!\n` +
      `Download: https://www.retailbandhu.in`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  // Share as image
  const shareAsImage = () => {
    toast.success('Generating shareable image...');
    // In production, generate an image card
    setTimeout(() => {
      toast.success('Image ready! Share on social media.');
    }, 1000);
  };

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
        <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl">Leaderboard</h2>
                <p className="text-white/90 text-sm">
                  {leaderboardType === 'global' && 'India-wide Rankings'}
                  {leaderboardType === 'city' && `${currentUser?.city || 'City'} Rankings`}
                  {leaderboardType === 'friends' && 'Friends Rankings'}
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

          {/* Your Rank Card */}
          {userEntry && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {userEntry.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{userEntry.name}</div>
                    <div className="text-white/80 text-sm">{userEntry.storeName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-2xl font-bold">#{userRank}</div>
                  <div className="text-white/80 text-sm">{userEntry.points} pts</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setLeaderboardType('global')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                leaderboardType === 'global'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌍 Global
            </button>
            <button
              onClick={() => setLeaderboardType('city')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                leaderboardType === 'city'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏙️ City
            </button>
            <button
              onClick={() => setLeaderboardType('friends')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                leaderboardType === 'friends'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👥 Friends
            </button>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {topEntries.map((entry, index) => {
              const isTop3 = entry.rank <= 3;
              const isCurrentUser = entry.isCurrentUser;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl p-4 transition-all ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : isTop3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400'
                        : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      isCurrentUser
                        ? 'bg-white/20 text-white'
                        : entry.rank === 1
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                          : entry.rank === 2
                            ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
                            : entry.rank === 3
                              ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                    }`}>
                      {entry.rank === 1 && <Crown className="w-6 h-6" />}
                      {entry.rank === 2 && <Medal className="w-6 h-6" />}
                      {entry.rank === 3 && <Award className="w-6 h-6" />}
                      {entry.rank > 3 && `#${entry.rank}`}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${
                          isCurrentUser ? 'text-white' : 'text-gray-900'
                        }`}>
                          {entry.name}
                          {isCurrentUser && ' (You)'}
                        </h3>
                        {entry.streak > 7 && (
                          <div className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                            isCurrentUser
                              ? 'bg-white/20 text-white'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            <Flame className="w-3 h-3" />
                            {entry.streak}d
                          </div>
                        )}
                      </div>
                      <div className={`text-sm ${
                        isCurrentUser ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {entry.storeName} • {entry.city}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs ${
                          isCurrentUser ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          Level {entry.level}
                        </span>
                        <span className={`text-xs ${
                          isCurrentUser ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {entry.achievements} achievements
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        isCurrentUser ? 'text-white' : 'text-gray-900'
                      }`}>
                        {entry.points.toLocaleString()}
                      </div>
                      <div className={`text-sm ${
                        isCurrentUser ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        points
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Your position if not in top 10 */}
          {userEntry && userRank > 10 && (
            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500 text-sm mb-3">
                ... {userRank - 11} more users ...
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
                    #{userRank}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{userEntry.name} (You)</div>
                    <div className="text-white/90 text-sm">{userEntry.storeName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{userEntry.points}</div>
                    <div className="text-white/80 text-sm">points</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Share CTA */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={shareToWhatsApp}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </button>
            <button
              onClick={shareAsImage}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4" />
              Share as Image
            </button>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={onClose}
              className="text-gray-600 text-sm hover:text-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Floating leaderboard button
interface LeaderboardButtonProps {
  onClick: () => void;
}

export function LeaderboardButton({ onClick }: LeaderboardButtonProps) {
  const [userRank, setUserRank] = useState<number | null>(null);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Calculate user rank (simplified - in production, fetch from backend)
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const unlocked = achievements.filter((a: any) => a.unlocked);
    const points = unlocked.reduce((sum: number, a: any) => sum + a.points, 0);
    
    // Simulate rank based on points (higher rank for more points)
    const estimatedRank = points > 1000 ? Math.floor(Math.random() * 10) + 1 
                        : points > 500 ? Math.floor(Math.random() * 50) + 10
                        : Math.floor(Math.random() * 100) + 50;
    
    setUserRank(estimatedRank);

    // Show pulse on rank change
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 2000);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-52 right-6 z-40 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
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
              className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full"
            />
          )}
        </AnimatePresence>

        <Trophy className="w-6 h-6 relative z-10" />

        {/* Rank badge */}
        {userRank && (
          <div className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
            #{userRank}
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {userRank ? `You're ranked #${userRank}!` : 'Leaderboard'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </motion.button>
  );
}