import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  FileText,
  Globe,
  MessageSquare,
  Bell,
  Video,
  Image,
  BookOpen,
  Layout,
  LayoutDashboard,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Upload,
  Download,
  Copy,
  ExternalLink,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Film,
  HelpCircle,
  FileCode,
  Zap,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  status: 'published' | 'draft' | 'scheduled';
  publishDate: string;
  views: number;
  category: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  thumbnail: string;
  category: string;
  views: number;
  status: 'published' | 'draft';
  uploadDate: string;
}

interface Template {
  id: string;
  name: string;
  type: 'whatsapp' | 'notification' | 'email';
  content: string;
  variables: string[];
  active: boolean;
  usageCount: number;
}

type CMSView = 'overview' | 'blog' | 'videos' | 'whatsapp' | 'notifications' | 'landing' | 'help' | 'media';

export function AdminContentCMS() {
  const [activeView, setActiveView] = useState<CMSView>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Getting Started with Voice Billing',
      slug: 'getting-started-voice-billing',
      excerpt: 'Learn how to use voice commands to create bills faster...',
      author: 'Retail Bandhu Team',
      status: 'published',
      publishDate: '2024-12-01',
      views: 1245,
      category: 'Tutorials',
    },
    {
      id: '2',
      title: 'WhatsApp Automation: Complete Guide',
      slug: 'whatsapp-automation-guide',
      excerpt: 'Automate your customer communication with WhatsApp...',
      author: 'Marketing Team',
      status: 'published',
      publishDate: '2024-12-05',
      views: 892,
      category: 'Marketing',
    },
    {
      id: '3',
      title: 'Inventory Management Best Practices',
      slug: 'inventory-management-best-practices',
      excerpt: 'Tips and tricks for managing inventory efficiently...',
      author: 'Product Team',
      status: 'draft',
      publishDate: '2024-12-15',
      views: 0,
      category: 'Business',
    },
  ]);

  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([
    {
      id: 'v1',
      title: 'Quick Start: Creating Your First Bill',
      description: 'Step-by-step guide to creating your first bill in Retail Bandhu',
      duration: '5:23',
      url: 'https://youtube.com/watch?v=example1',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      category: 'Getting Started',
      views: 3245,
      status: 'published',
      uploadDate: '2024-11-20',
    },
    {
      id: 'v2',
      title: 'Voice Billing Tutorial',
      description: 'Learn how to use voice commands for faster billing',
      duration: '8:15',
      url: 'https://youtube.com/watch?v=example2',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      category: 'Features',
      views: 2187,
      status: 'published',
      uploadDate: '2024-11-25',
    },
    {
      id: 'v3',
      title: 'WhatsApp Integration Setup',
      description: 'Connect WhatsApp Business API to your store',
      duration: '12:40',
      url: 'https://youtube.com/watch?v=example3',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
      category: 'Integrations',
      views: 1654,
      status: 'published',
      uploadDate: '2024-12-01',
    },
    {
      id: 'v4',
      title: 'Advanced Inventory Management',
      description: 'Master inventory tracking and low stock alerts',
      duration: '15:30',
      url: 'https://youtube.com/watch?v=example4',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
      category: 'Advanced',
      views: 987,
      status: 'published',
      uploadDate: '2024-12-05',
    },
    {
      id: 'v5',
      title: 'Reports & Analytics Deep Dive',
      description: 'Understand your business metrics and grow faster',
      duration: '10:25',
      url: 'https://youtube.com/watch?v=example5',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      category: 'Analytics',
      views: 1432,
      status: 'draft',
      uploadDate: '2024-12-08',
    },
  ]);

  const [whatsappTemplates, setWhatsappTemplates] = useState<Template[]>([
    {
      id: 'wt1',
      name: 'Order Confirmation',
      type: 'whatsapp',
      content: 'Hi {{customer_name}}, your order #{{order_id}} has been confirmed. Total: ₹{{amount}}. Thank you!',
      variables: ['customer_name', 'order_id', 'amount'],
      active: true,
      usageCount: 1245,
    },
    {
      id: 'wt2',
      name: 'Payment Reminder',
      type: 'whatsapp',
      content: 'Dear {{customer_name}}, you have a pending payment of ₹{{amount}}. Please clear dues by {{due_date}}.',
      variables: ['customer_name', 'amount', 'due_date'],
      active: true,
      usageCount: 687,
    },
    {
      id: 'wt3',
      name: 'New Product Launch',
      type: 'whatsapp',
      content: '🎉 New arrival! {{product_name}} now available at {{store_name}}. Special price: ₹{{price}}. Visit today!',
      variables: ['product_name', 'store_name', 'price'],
      active: false,
      usageCount: 234,
    },
  ]);

  const [notificationTemplates, setNotificationTemplates] = useState<Template[]>([
    {
      id: 'nt1',
      name: 'Low Stock Alert',
      type: 'notification',
      content: '⚠️ Low stock alert: {{product_name}} has only {{quantity}} units left.',
      variables: ['product_name', 'quantity'],
      active: true,
      usageCount: 432,
    },
    {
      id: 'nt2',
      name: 'Daily Sales Summary',
      type: 'notification',
      content: '📊 Today\'s sales: ₹{{total_sales}} | Bills: {{bill_count}} | Top product: {{top_product}}',
      variables: ['total_sales', 'bill_count', 'top_product'],
      active: true,
      usageCount: 890,
    },
  ]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{blogPosts.length}</div>
              <div className="text-sm text-blue-700">Blog Posts</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{videoTutorials.length}</div>
              <div className="text-sm text-purple-700">Video Tutorials</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{whatsappTemplates.length}</div>
              <div className="text-sm text-green-700">WhatsApp Templates</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">{notificationTemplates.length}</div>
              <div className="text-sm text-orange-700">Notification Templates</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Content Management Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => setActiveView('blog')}
          >
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-sm">Manage Blog</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => setActiveView('videos')}
          >
            <Video className="w-6 h-6 text-purple-600" />
            <span className="text-sm">Video Tutorials</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => setActiveView('whatsapp')}
          >
            <MessageSquare className="w-6 h-6 text-green-600" />
            <span className="text-sm">WhatsApp Templates</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => setActiveView('notifications')}
          >
            <Bell className="w-6 h-6 text-orange-600" />
            <span className="text-sm">Notifications</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => setActiveView('landing')}
          >
            <Globe className="w-6 h-6 text-blue-600" />
            <span className="text-sm">Landing Page</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => setActiveView('help')}
          >
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <span className="text-sm">Help Docs</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => setActiveView('media')}
          >
            <Image className="w-6 h-6 text-pink-600" />
            <span className="text-sm">Media Library</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2"
            onClick={() => toast.info('Coming soon!')}
          >
            <Layout className="w-6 h-6 text-gray-600" />
            <span className="text-sm">Page Builder</span>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Recent Content Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">New blog post published</div>
              <div className="text-xs text-gray-600">"WhatsApp Automation Guide" - 2 hours ago</div>
            </div>
            <Badge className="bg-green-500">Published</Badge>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Video className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Video tutorial uploaded</div>
              <div className="text-xs text-gray-600">"Advanced Inventory Management" - 5 hours ago</div>
            </div>
            <Badge className="bg-purple-500">New</Badge>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">WhatsApp template activated</div>
              <div className="text-xs text-gray-600">"New Product Launch" - 1 day ago</div>
            </div>
            <Badge className="bg-green-500">Active</Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderBlogPosts = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {blogPosts.map((post) => (
          <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
                  <Badge
                    className={
                      post.status === 'published'
                        ? 'bg-green-500'
                        : post.status === 'scheduled'
                        ? 'bg-orange-500'
                        : 'bg-gray-400'
                    }
                  >
                    {post.status}
                  </Badge>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.publishDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderVideoTutorials = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search video tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button className="bg-purple-600 ml-3">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoTutorials.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gray-200">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/60 transition-colors">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 rounded-full w-16 h-16 p-0 opacity-80 group-hover:opacity-100"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <Play className="w-8 h-8" />
                </Button>
              </div>
              <Badge className="absolute top-3 right-3 bg-black/70">
                {video.duration}
              </Badge>
              <Badge
                className={`absolute top-3 left-3 ${
                  video.status === 'published' ? 'bg-green-500' : 'bg-gray-500'
                }`}
              >
                {video.status}
              </Badge>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 flex-1">{video.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{video.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {video.category}
                </Badge>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{video.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.uploadDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTemplates = (templates: Template[], type: 'whatsapp' | 'notification') => (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">
            {type === 'whatsapp' ? 'WhatsApp' : 'Notification'} Templates
          </h3>
          <Button className={type === 'whatsapp' ? 'bg-green-600' : 'bg-orange-600'}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                  <Badge className={template.active ? 'bg-green-500' : 'bg-gray-400'}>
                    {template.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg mb-3 font-mono text-sm">
                  {template.content}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">Variables:</span>
                  {template.variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs font-mono">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Used {template.usageCount.toLocaleString()} times
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (type === 'whatsapp') {
                      setWhatsappTemplates((prev) =>
                        prev.map((t) =>
                          t.id === template.id ? { ...t, active: !t.active } : t
                        )
                      );
                    } else {
                      setNotificationTemplates((prev) =>
                        prev.map((t) =>
                          t.id === template.id ? { ...t, active: !t.active } : t
                        )
                      );
                    }
                    toast.success('Template status updated');
                  }}
                >
                  {template.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLandingPage = () => (
    <div className="space-y-6">
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Landing Page Editor</h3>
            <p className="text-sm text-blue-700 mb-3">
              Edit your landing page content, hero sections, features, testimonials, and more.
            </p>
            <Button className="bg-blue-600">
              <Edit className="w-4 h-4 mr-2" />
              Open Landing Page Editor
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Hero Section</h4>
            <p className="text-xs text-gray-600 mb-3">Main banner & CTA</p>
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Layout className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Features</h4>
            <p className="text-xs text-gray-600 mb-3">App features showcase</p>
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Testimonials</h4>
            <p className="text-xs text-gray-600 mb-3">Customer reviews</p>
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Pricing</h4>
            <p className="text-xs text-gray-600 mb-3">Pricing plans</p>
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6 text-pink-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">FAQ</h4>
            <p className="text-xs text-gray-600 mb-3">Help & questions</p>
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <FileCode className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Footer</h4>
            <p className="text-xs text-gray-600 mb-3">Links & legal</p>
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderHelpDocs = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Help Documentation</h3>
          <Button className="bg-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Create and manage help articles, FAQs, and user guides.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Getting Started Guide', category: 'Basics', articles: 12 },
          { title: 'Voice Billing Help', category: 'Features', articles: 8 },
          { title: 'Inventory Management', category: 'Features', articles: 15 },
          { title: 'WhatsApp Integration', category: 'Integrations', articles: 6 },
          { title: 'Reports & Analytics', category: 'Advanced', articles: 10 },
          { title: 'Troubleshooting', category: 'Support', articles: 20 },
        ].map((section, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{section.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {section.category}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">{section.articles} articles</p>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMediaLibrary = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Media Library</h3>
          <Button className="bg-pink-600">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Image className="w-12 h-12 text-gray-400" />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-gray-900 truncate">image-{item}.jpg</p>
              <p className="text-xs text-gray-500">1.2 MB</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <Card className="p-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'blog', label: 'Blog Posts', icon: FileText },
            { id: 'videos', label: 'Video Tutorials', icon: Video },
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'landing', label: 'Landing Page', icon: Globe },
            { id: 'help', label: 'Help Docs', icon: HelpCircle },
            { id: 'media', label: 'Media Library', icon: Image },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as CMSView)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Content Area */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'blog' && renderBlogPosts()}
      {activeView === 'videos' && renderVideoTutorials()}
      {activeView === 'whatsapp' && renderTemplates(whatsappTemplates, 'whatsapp')}
      {activeView === 'notifications' && renderTemplates(notificationTemplates, 'notification')}
      {activeView === 'landing' && renderLandingPage()}
      {activeView === 'help' && renderHelpDocs()}
      {activeView === 'media' && renderMediaLibrary()}
    </div>
  );
}