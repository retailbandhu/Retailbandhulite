import { ArrowLeft, Calendar, User, Clock, TrendingUp, Lightbulb, Package, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MarketingNavBar } from './MarketingNavBar';

interface BlogPageProps {
  onBack?: () => void;
  onNavigate?: (page: 'about' | 'blog' | 'careers' | 'contact' | 'videos' | 'faq') => void;
}

export function BlogPage({ onBack, onNavigate }: BlogPageProps) {
  const blogPosts = [
    {
      id: 1,
      title: 'Voice Billing Revolution: How Indian Kiranas Are Saving 5 Minutes Per Bill',
      excerpt: 'Discover how voice technology is transforming traditional billing and why retailers are switching to voice-first solutions.',
      category: 'Technology',
      author: 'Priya Sharma',
      date: 'Dec 5, 2024',
      readTime: '5 min read',
      image: '🎤',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: '10 WhatsApp Automation Tricks Every Kirana Owner Should Know',
      excerpt: 'Learn how to automate your customer communication on WhatsApp and increase repeat purchases by 30%.',
      category: 'Marketing',
      author: 'Rahul Verma',
      date: 'Dec 3, 2024',
      readTime: '7 min read',
      image: '📱',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'GST Made Simple: A Complete Guide for Small Retailers',
      excerpt: 'Everything you need to know about GST compliance, from GSTIN registration to filing returns - explained in simple Hindi.',
      category: 'Finance',
      author: 'Anjali Patel',
      date: 'Dec 1, 2024',
      readTime: '10 min read',
      image: '💰',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 4,
      title: 'Inventory Management 101: Never Run Out of Stock Again',
      excerpt: 'Master inventory management with these proven strategies used by successful kirana stores across India.',
      category: 'Operations',
      author: 'Suresh Kumar',
      date: 'Nov 28, 2024',
      readTime: '6 min read',
      image: '📦',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 5,
      title: 'Success Story: How Ramesh Doubled His Sales Using Digital Khata',
      excerpt: 'Meet Ramesh from Delhi who transformed his credit management system and recovered 2 lakhs in pending payments.',
      category: 'Case Study',
      author: 'Team Retail Bandhu',
      date: 'Nov 25, 2024',
      readTime: '8 min read',
      image: '⭐',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 6,
      title: 'Customer Loyalty Programs That Actually Work for Kiranas',
      excerpt: 'Implement these simple yet effective loyalty strategies to turn one-time customers into regulars.',
      category: 'Growth',
      author: 'Priya Sharma',
      date: 'Nov 22, 2024',
      readTime: '5 min read',
      image: '🎁',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 7,
      title: 'Digital vs Traditional: Why Smart Kiranas Are Winning',
      excerpt: 'Data-backed comparison of digital and traditional kirana stores, and why digital adoption is no longer optional.',
      category: 'Trends',
      author: 'Rahul Verma',
      date: 'Nov 20, 2024',
      readTime: '9 min read',
      image: '📊',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 8,
      title: 'Top 5 Mistakes New Retailers Make (And How to Avoid Them)',
      excerpt: 'Learn from the mistakes of thousands of retailers and set your business up for success from day one.',
      category: 'Tips',
      author: 'Anjali Patel',
      date: 'Nov 18, 2024',
      readTime: '6 min read',
      image: '⚠️',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const categories = ['All', 'Technology', 'Marketing', 'Finance', 'Operations', 'Case Study', 'Growth', 'Tips'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation Bar */}
      <MarketingNavBar 
        currentPage="blog"
        onBackToHome={onBack || (() => {})}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Retail Bandhu Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl mb-6">
              Retail Tips, Tricks & Insights 📚
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Kirana business badhane ke liye expert advice, success stories, aur practical guides - bilkul free!
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? 'default' : 'outline'}
                size="sm"
                className={index === 0 ? 'bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]' : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-6">
            Featured Article
          </Badge>
          
          <Card className="overflow-hidden border-2 border-blue-200 hover:shadow-2xl transition-all cursor-pointer">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] flex items-center justify-center p-12">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">🎤</div>
                  <h3 className="text-2xl">Voice Billing Revolution</h3>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">Technology</Badge>
                  <span className="text-sm text-gray-500">Featured</span>
                </div>
                <h2 className="text-3xl mb-4 text-gray-900">
                  Voice Billing Revolution: How Indian Kiranas Are Saving 5 Minutes Per Bill
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Discover how voice technology is transforming traditional billing and why retailers are switching to voice-first solutions. Real data from 5000+ stores.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Priya Sharma
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Dec 5, 2024
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    5 min read
                  </span>
                </div>
                <Button className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]">
                  Read Full Article
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h3 className="text-2xl text-gray-900">Latest Articles</h3>
            <p className="text-gray-600">Stay updated with the latest retail trends and tips</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                <div className={`h-48 bg-gradient-to-br ${post.color} flex items-center justify-center text-7xl group-hover:scale-110 transition-transform`}>
                  {post.image}
                </div>
                <div className="p-6">
                  <Badge className="mb-3 bg-gray-100 text-gray-700 border-gray-200">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {post.date}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-3xl md:text-5xl mb-4">
            Get Retail Tips in Your Inbox
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Weekly newsletter with exclusive tips, tricks, and success stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-4 py-3 rounded-lg text-gray-900 flex-1"
            />
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-4">
            Join 5000+ retailers getting weekly insights
          </p>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
            Coming Soon
          </Badge>
          <h3 className="text-2xl mb-3 text-gray-900">
            Blog Launching Soon! 🚀
          </h3>
          <p className="text-gray-600 mb-6">
            We're working hard to bring you the best retail content. Subscribe to our newsletter to get notified when we launch!
          </p>
        </div>
      </section>
    </div>
  );
}