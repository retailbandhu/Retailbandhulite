import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Screen } from '../App';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  MessageSquare,
  BarChart3,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Globe,
  Zap,
  Award,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  ChevronRight,
} from 'lucide-react';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4099df5/admin`;

interface AdminPanelProps {
  onNavigate: (screen: Screen) => void;
}

type TabType = 'dashboard' | 'landing-page' | 'features' | 'testimonials' | 'pricing' | 'blog' | 'config' | 'whatsapp' | 'analytics';

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadMetrics();
    }
  }, [activeTab]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/metrics`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'landing-page', label: 'Landing Page', icon: Globe },
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'testimonials', label: 'Testimonials', icon: Award },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'config', label: 'App Config', icon: Settings },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onNavigate('marketing')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              ← Back to App
            </Button>
            <div className="h-8 w-px bg-white/30" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Badge className="bg-white text-blue-600">Super Admin</Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid md:grid-cols-[250px,1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-2">
            <Card className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </Card>
          </div>

          {/* Main Content */}
          <div>
            {activeTab === 'dashboard' && <DashboardTab metrics={metrics} loading={loading} />}
            {activeTab === 'landing-page' && <LandingPageTab />}
            {activeTab === 'features' && <FeaturesTab />}
            {activeTab === 'testimonials' && <TestimonialsTab />}
            {activeTab === 'pricing' && <PricingTab />}
            {activeTab === 'blog' && <BlogTab />}
            {activeTab === 'config' && <ConfigTab />}
            {activeTab === 'whatsapp' && <WhatsAppTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD TAB
// ============================================

function DashboardTab({ metrics, loading }: any) {
  if (loading) {
    return <div className="text-center py-12">Loading metrics...</div>;
  }

  const stats = [
    { label: 'Total Users', value: metrics?.totalUsers || 0, icon: Users, color: 'blue' },
    { label: 'Active Users', value: metrics?.activeUsers || 0, icon: TrendingUp, color: 'green' },
    { label: 'Monthly Revenue', value: `₹${metrics?.monthlyRevenue || 0}`, icon: DollarSign, color: 'orange' },
    { label: 'Blog Posts', value: metrics?.blogPosts || 0, icon: FileText, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New user signup', time: '2 minutes ago', icon: Users },
            { action: 'Blog post published', time: '1 hour ago', icon: FileText },
            { action: 'Pricing plan updated', time: '3 hours ago', icon: DollarSign },
          ].map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// LANDING PAGE TAB
// ============================================

function LandingPageTab() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/landing-page`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load landing page content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/landing-page`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Landing page updated successfully! ✅ Refresh landing page to see changes.');
      } else {
        toast.error('Failed to update landing page');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Landing Page Content</h2>
          <p className="text-gray-600">Edit your landing page hero, stats, and content</p>
        </div>
        <Button onClick={saveContent} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        {/* Hero Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
              <Input
                value={content?.hero?.title || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value }
                })}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <Input
                value={content?.hero?.subtitle || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value }
                })}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <Input
                value={content?.hero?.cta || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, cta: e.target.value }
                })}
                placeholder="Enter CTA text"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold mb-4">Statistics</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Users</label>
              <Input
                value={content?.stats?.users || ''}
                onChange={(e) => setContent({
                  ...content,
                  stats: { ...content.stats, users: e.target.value }
                })}
                placeholder="e.g., 50,000+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bills Generated</label>
              <Input
                value={content?.stats?.bills || ''}
                onChange={(e) => setContent({
                  ...content,
                  stats: { ...content.stats, bills: e.target.value }
                })}
                placeholder="e.g., 10L+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Savings</label>
              <Input
                value={content?.stats?.savings || ''}
                onChange={(e) => setContent({
                  ...content,
                  stats: { ...content.stats, savings: e.target.value }
                })}
                placeholder="e.g., ₹50Cr+"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// FEATURES TAB
// ============================================

function FeaturesTab() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/features`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setFeatures(data.data);
      }
    } catch (error) {
      console.error('Error loading features:', error);
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const saveFeatures = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/features`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Features updated successfully!');
      }
    } catch (error) {
      console.error('Error saving features:', error);
      toast.error('Failed to save features');
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    setFeatures([...features, {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: 'Zap',
    }]);
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">App Features</h2>
          <p className="text-gray-600">Manage features shown on landing page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addFeature} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
          <Button onClick={saveFeatures} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <Card key={feature.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Feature #{index + 1}</h3>
              </div>
              <Button
                onClick={() => removeFeature(feature.id)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  value={feature.title}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[index].title = e.target.value;
                    setFeatures(updated);
                  }}
                  placeholder="Feature title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  value={feature.description}
                  onChange={(e) => {
                    const updated = [...features];
                    updated[index].description = e.target.value;
                    setFeatures(updated);
                  }}
                  placeholder="Feature description"
                  rows={3}
                />
              </div>
            </div>
          </Card>
        ))}

        {features.length === 0 && (
          <Card className="p-12 text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No features yet</h3>
            <p className="text-gray-600 mb-4">Add your first feature to get started</p>
            <Button onClick={addFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================
// TESTIMONIALS TAB
// ============================================

function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Testimonial deleted');
        loadTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Testimonials</h2>
          <p className="text-gray-600">Manage customer reviews and testimonials</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.business}</p>
              </div>
              <Button
                onClick={() => deleteTestimonial(testimonial.id)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-700 italic">"{testimonial.message}"</p>
            <div className="flex items-center gap-1 mt-4">
              {[...Array(testimonial.rating || 5)].map((_, i) => (
                <Award key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card className="p-12 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
          <p className="text-gray-600 mb-4">Add customer testimonials to build trust</p>
        </Card>
      )}

      {showAddModal && (
        <AddTestimonialModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            loadTestimonials();
          }}
        />
      )}
    </div>
  );
}

function AddTestimonialModal({ onClose, onAdded }: any) {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    message: '',
    rating: 5,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Testimonial added successfully!');
        onAdded();
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Add Testimonial</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business</label>
            <Input
              value={formData.business}
              onChange={(e) => setFormData({ ...formData, business: e.target.value })}
              placeholder="Business name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Testimonial message"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {saving ? 'Adding...' : 'Add Testimonial'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// PRICING TAB
// ============================================

function PricingTab() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/pricing-plans`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error('Error loading pricing plans:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const savePlans = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/pricing-plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plans),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Pricing plans updated successfully!');
      }
    } catch (error) {
      console.error('Error saving pricing plans:', error);
      toast.error('Failed to save pricing plans');
    } finally {
      setSaving(false);
    }
  };

  const updatePlan = (index: number, field: string, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    const updated = [...plans];
    const features = [...updated[planIndex].features];
    features[featureIndex] = value;
    updated[planIndex] = { ...updated[planIndex], features };
    setPlans(updated);
  };

  const addPlanFeature = (planIndex: number) => {
    const updated = [...plans];
    updated[planIndex].features.push('New Feature');
    setPlans(updated);
  };

  const removePlanFeature = (planIndex: number, featureIndex: number) => {
    const updated = [...plans];
    updated[planIndex].features.splice(featureIndex, 1);
    setPlans(updated);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Pricing Plans</h2>
          <p className="text-gray-600">Manage subscription tiers and features</p>
        </div>
        <Button onClick={savePlans} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, planIndex) => (
          <Card key={plan.id} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <Input
                  value={plan.name}
                  onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                  placeholder="Plan name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <Input
                  type="number"
                  value={plan.price}
                  onChange={(e) => updatePlan(planIndex, 'price', Number(e.target.value))}
                  placeholder="0"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button
                    onClick={() => addPlanFeature(planIndex)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updatePlanFeature(planIndex, featureIndex, e.target.value)}
                        placeholder="Feature"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removePlanFeature(planIndex, featureIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// BLOG TAB
// ============================================

function BlogTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blog-posts`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/blog-posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Post deleted successfully!');
        loadPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      tags: [],
      published: false,
    });
    setShowEditor(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={() => {
          setShowEditor(false);
          loadPosts();
        }}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Blog Posts</h2>
          <p className="text-gray-600">Create and manage blog content</p>
        </div>
        <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{post.title}</h3>
                  <Badge variant={post.published ? 'default' : 'secondary'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(post)} variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => deletePost(post.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {posts.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 mb-4">Start creating content for your blog</p>
            <Button onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

function BlogEditor({ post, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(post);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const url = post.id 
        ? `${API_BASE_URL}/blog-posts/${post.id}`
        : `${API_BASE_URL}/blog-posts`;
      
      const response = await fetch(url, {
        method: post.id ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success(`Post ${post.id ? 'updated' : 'created'} successfully!`);
        onSave();
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {post.id ? 'Edit Post' : 'New Post'}
        </h2>
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="post-url-slug"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Short description"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Full blog post content (Markdown supported)"
            rows={12}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
            <Input
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Updates, Tips, News"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">Publish immediately</label>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// CONFIG TAB
// ============================================

function ConfigTab() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/app-config`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/app-config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Configuration updated successfully!');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">App Configuration</h2>
          <p className="text-gray-600">Global settings and feature flags</p>
        </div>
        <Button onClick={saveConfig} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
              <Input
                value={config?.appName || ''}
                onChange={(e) => setConfig({ ...config, appName: e.target.value })}
                placeholder="App name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
              <Input
                value={config?.supportEmail || ''}
                onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                placeholder="support@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
              <Input
                value={config?.supportPhone || ''}
                onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Feature Flags</h3>
          <div className="space-y-3">
            {Object.entries(config?.featureFlags || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {value ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => setConfig({
                      ...config,
                      featureFlags: {
                        ...config.featureFlags,
                        [key]: e.target.checked,
                      },
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-bold mb-4 text-red-900">Maintenance Mode</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800">
                Enable maintenance mode to temporarily disable the app
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config?.maintenanceMode || false}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// WHATSAPP TAB
// ============================================

function WhatsAppTab() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/whatsapp-templates`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data.length > 0 ? data.data : getDefaultTemplates());
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplates = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/whatsapp-templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templates),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Templates updated successfully!');
      }
    } catch (error) {
      console.error('Error saving templates:', error);
      toast.error('Failed to save templates');
    } finally {
      setSaving(false);
    }
  };

  const updateTemplate = (index: number, field: string, value: string) => {
    const updated = [...templates];
    updated[index] = { ...updated[index], [field]: value };
    setTemplates(updated);
  };

  const getDefaultTemplates = () => [
    {
      id: 'bill',
      name: 'Bill Share',
      message: 'Hi {customerName},\n\nThank you for shopping at {storeName}!\n\nBill Amount: ₹{amount}\nDate: {date}\n\nView your bill: {billLink}\n\n- {storeName}',
    },
    {
      id: 'payment',
      name: 'Payment Reminder',
      message: 'Namaste {customerName},\n\nGentle reminder: Your pending payment of ₹{amount} is due.\n\nPlease pay at your earliest convenience.\n\nThank you!\n{storeName}',
    },
    {
      id: 'catalog',
      name: 'Catalog Share',
      message: 'Hello {customerName}!\n\nCheck out our latest catalog:\n{catalogLink}\n\nNew arrivals and best deals!\n\n{storeName}',
    },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">WhatsApp Templates</h2>
          <p className="text-gray-600">Customize message templates for WhatsApp integration</p>
        </div>
        <Button onClick={saveTemplates} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Templates'}
        </Button>
      </div>

      <div className="space-y-4">
        {templates.map((template, index) => (
          <Card key={template.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Message</label>
                <Textarea
                  value={template.message}
                  onChange={(e) => updateTemplate(index, 'message', e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">Available Variables:</div>
                <div className="flex flex-wrap gap-2">
                  {['{customerName}', '{storeName}', '{amount}', '{date}', '{billLink}', '{catalogLink}'].map(variable => (
                    <Badge key={variable} variant="secondary" className="font-mono text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ANALYTICS TAB
// ============================================

function AnalyticsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      // For now, show mock data since we need a GET endpoint
      setEvents([
        { id: '1', event: 'page_view', page: '/landing', timestamp: new Date().toISOString() },
        { id: '2', event: 'button_click', action: 'get_started', timestamp: new Date().toISOString() },
        { id: '3', event: 'feature_view', feature: 'voice_billing', timestamp: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Events', value: '1.2K', change: '+12%', icon: TrendingUp },
    { label: 'Active Users', value: '245', change: '+8%', icon: Users },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: BarChart3 },
    { label: 'Avg. Session', value: '4m 32s', change: '-5%', icon: TrendingUp },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Analytics & Insights</h2>
        <p className="text-gray-600">Track user behavior and app performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-6 h-6 text-blue-600" />
                <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Recent Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recent Events</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Events</option>
            <option value="page_view">Page Views</option>
            <option value="button_click">Clicks</option>
            <option value="feature_view">Features</option>
          </select>
        </div>

        <div className="space-y-2">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-900">{event.event}</div>
                  <div className="text-sm text-gray-600">
                    {event.page || event.action || event.feature}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Export Data</h3>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}