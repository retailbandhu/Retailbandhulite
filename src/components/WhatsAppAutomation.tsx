import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Screen } from '../types';
import {
  ArrowLeft,
  Plus,
  Send,
  BarChart3,
  MessageSquare,
  Zap,
  ChevronLeft,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Target,
  TrendingUp,
  Eye,
  X,
  Save,
  Image as ImageIcon,
  Smile,
  FileText,
  Settings,
} from 'lucide-react';

interface WhatsAppAutomationProps {
  onNavigate: (screen: Screen) => void;
}

interface Broadcast {
  id: string;
  title: string;
  message: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: number;
  sent?: number;
  opened?: number;
  scheduledDate?: string;
  sentDate?: string;
  templateId?: string;
}

interface Template {
  id: string;
  name: string;
  category: 'promotion' | 'notification' | 'reminder' | 'greeting';
  icon: string;
  message: string;
  variables: string[];
}

type Tab = 'broadcasts' | 'templates' | 'analytics' | 'contacts';

export function WhatsAppAutomation({ onNavigate }: WhatsAppAutomationProps) {
  const [activeTab, setActiveTab] = useState<Tab>('broadcasts');
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Mock broadcasts
    const mockBroadcasts: Broadcast[] = [
      {
        id: '1',
        title: 'Diwali Dhamaka Offer',
        message: '🎉 Diwali Special! Get 50% OFF on all products. Visit our store today!',
        status: 'sent',
        recipients: 156,
        sent: 156,
        opened: 106,
        sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Weekend Special Sale',
        message: '🛍️ Weekend Sale! Fresh stock arrived. 20% discount on groceries.',
        status: 'scheduled',
        recipients: 203,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'New Stock Alert',
        message: '📦 Fresh stock just arrived! Visit us for best prices.',
        status: 'draft',
        recipients: 0,
      },
    ];

    // Mock templates
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'Festival Offer',
        category: 'promotion',
        icon: '🎉',
        message: '🎉 {festival} Special Offer! Get {discount}% OFF on all products. Hurry, limited time only! Visit {shop_name}',
        variables: ['festival', 'discount', 'shop_name'],
      },
      {
        id: '2',
        name: 'New Stock Alert',
        category: 'notification',
        icon: '📦',
        message: '📦 Fresh stock of {product_name} just arrived at {shop_name}! Visit us today for best prices.',
        variables: ['product_name', 'shop_name'],
      },
      {
        id: '3',
        name: 'Payment Reminder',
        category: 'reminder',
        icon: '💰',
        message: 'नमस्ते {customer_name}, आपका ₹{amount} का बकाया है। कृपया जल्द भुगतान करें। धन्यवाद!',
        variables: ['customer_name', 'amount'],
      },
      {
        id: '4',
        name: 'Thank You Message',
        category: 'greeting',
        icon: '🙏',
        message: 'धन्यवाद {customer_name}! आपकी खरीदारी के लिए शुक्रिया। फिर से आएं! - {shop_name}',
        variables: ['customer_name', 'shop_name'],
      },
      {
        id: '5',
        name: 'Birthday Wishes',
        category: 'greeting',
        icon: '🎂',
        message: '🎂 Happy Birthday {customer_name}! 🎉 Special discount just for you - {discount}% OFF on your next purchase! - {shop_name}',
        variables: ['customer_name', 'discount', 'shop_name'],
      },
      {
        id: '6',
        name: 'Bill Share',
        category: 'notification',
        icon: '🧾',
        message: 'नमस्ते {customer_name}, आपका बिल: ₹{amount}\n{items}\nधन्यवाद! - {shop_name}',
        variables: ['customer_name', 'amount', 'items', 'shop_name'],
      },
    ];

    setBroadcasts(mockBroadcasts);
    setTemplates(mockTemplates);
  };

  const calculateStats = () => {
    const totalSent = broadcasts.filter(b => b.status === 'sent').reduce((sum, b) => sum + (b.sent || 0), 0);
    const totalOpened = broadcasts.filter(b => b.status === 'sent').reduce((sum, b) => sum + (b.opened || 0), 0);
    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
    const totalContacts = 348; // Mock

    return { totalSent, openRate, totalContacts };
  };

  const stats = calculateStats();

  const handleCreateBroadcast = (data: Partial<Broadcast>) => {
    const newBroadcast: Broadcast = {
      id: Date.now().toString(),
      title: data.title || 'Untitled Broadcast',
      message: data.message || '',
      status: data.scheduledDate ? 'scheduled' : 'draft',
      recipients: data.recipients || 0,
      scheduledDate: data.scheduledDate,
    };

    setBroadcasts([newBroadcast, ...broadcasts]);
    toast.success('Broadcast created successfully!');
    setShowCreateModal(false);
  };

  const handleSendBroadcast = (id: string) => {
    const updated = broadcasts.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status: 'sent' as const,
          sent: b.recipients,
          opened: Math.floor(b.recipients * 0.7), // Mock 70% open rate
          sentDate: new Date().toISOString(),
        };
      }
      return b;
    });
    setBroadcasts(updated);
    toast.success('Broadcast sent successfully!');
  };

  const handleDeleteBroadcast = (id: string) => {
    if (!confirm('Delete this broadcast?')) return;
    setBroadcasts(broadcasts.filter(b => b.id !== id));
    toast.success('Broadcast deleted');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">WhatsApp Automation</h1>
              <p className="text-sm text-white/90">Bulk Messages & Broadcasts</p>
            </div>
          </div>
          <Badge className="bg-orange-500">Pro</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white text-center">
            <div className="text-2xl font-bold">{stats.totalSent}</div>
            <div className="text-xs opacity-90">Total Sent</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white text-center">
            <div className="text-2xl font-bold">{stats.openRate}%</div>
            <div className="text-xs opacity-90">Open Rate</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20 p-3 text-white text-center">
            <div className="text-2xl font-bold">{stats.totalContacts}</div>
            <div className="text-xs opacity-90">Contacts</div>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Upgrade Banner */}
        <Card className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4">
          <div className="flex items-start gap-3 mb-3">
            <Zap className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold mb-1">Unlock WhatsApp Automation</h3>
              <p className="text-sm text-white/90">
                Bulk messages, templates, scheduling, analytics — sab automated!
              </p>
            </div>
          </div>
          <Button
            onClick={() => onNavigate('subscription')}
            className="w-full bg-white text-blue-600 hover:bg-blue-50"
          >
            Upgrade to Pro — ₹99/month
          </Button>
        </Card>

        {/* Tabs */}
        <Card className="p-1">
          <div className="grid grid-cols-4 gap-1">
            <Button
              onClick={() => setActiveTab('broadcasts')}
              variant={activeTab === 'broadcasts' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Broadcasts
            </Button>
            <Button
              onClick={() => setActiveTab('templates')}
              variant={activeTab === 'templates' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              Templates
            </Button>
            <Button
              onClick={() => setActiveTab('analytics')}
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Analytics
            </Button>
            <Button
              onClick={() => setActiveTab('contacts')}
              variant={activeTab === 'contacts' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
            >
              <Users className="w-3 h-3 mr-1" />
              Contacts
            </Button>
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'broadcasts' && (
          <BroadcastsTab
            broadcasts={broadcasts}
            onSend={handleSendBroadcast}
            onDelete={handleDeleteBroadcast}
            onEdit={setSelectedBroadcast}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesTab templates={templates} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab broadcasts={broadcasts} />
        )}

        {activeTab === 'contacts' && (
          <ContactsTab />
        )}
      </div>

      {/* Create Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateBroadcastModal
          templates={templates}
          onSave={handleCreateBroadcast}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

// ============================================
// BROADCASTS TAB
// ============================================

function BroadcastsTab({ broadcasts, onSend, onDelete, onEdit }: {
  broadcasts: Broadcast[];
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (broadcast: Broadcast) => void;
}) {
  if (broadcasts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="font-medium text-gray-900 mb-2">No broadcasts yet</h3>
        <p className="text-sm text-gray-600">Create your first broadcast to reach customers</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {broadcasts.map(broadcast => (
        <Card key={broadcast.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">{broadcast.title}</h4>
                <Badge
                  variant={
                    broadcast.status === 'sent' ? 'default' :
                    broadcast.status === 'scheduled' ? 'secondary' :
                    'outline'
                  }
                  className={
                    broadcast.status === 'sent' ? 'bg-green-500' :
                    broadcast.status === 'scheduled' ? 'bg-blue-500' :
                    ''
                  }
                >
                  {broadcast.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{broadcast.message}</p>
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {broadcast.recipients} recipients
                </div>
                {broadcast.sentDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(broadcast.sentDate).toLocaleDateString()}
                  </div>
                )}
                {broadcast.scheduledDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(broadcast.scheduledDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats for sent broadcasts */}
          {broadcast.status === 'sent' && (
            <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{broadcast.sent}</div>
                <div className="text-xs text-gray-600">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{broadcast.opened}</div>
                <div className="text-xs text-gray-600">Opened</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {broadcast.sent && broadcast.opened
                    ? Math.round((broadcast.opened / broadcast.sent) * 100)
                    : 0}%
                </div>
                <div className="text-xs text-gray-600">Rate</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {broadcast.status === 'draft' && (
              <Button onClick={() => onSend(broadcast.id)} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                <Send className="w-3 h-3 mr-1" />
                Send Now
              </Button>
            )}
            {broadcast.status === 'scheduled' && (
              <Button size="sm" variant="outline" className="flex-1">
                <Clock className="w-3 h-3 mr-1" />
                Scheduled
              </Button>
            )}
            {broadcast.status === 'sent' && (
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-3 h-3 mr-1" />
                View Report
              </Button>
            )}
            <Button onClick={() => onDelete(broadcast.id)} size="sm" variant="outline" className="text-red-600">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// TEMPLATES TAB
// ============================================

function TemplatesTab({ templates }: { templates: Template[] }) {
  const handleUseTemplate = (template: Template) => {
    toast.success(`Using template: ${template.name}`);
  };

  const categoryColors = {
    promotion: 'bg-orange-100 text-orange-700',
    notification: 'bg-blue-100 text-blue-700',
    reminder: 'bg-yellow-100 text-yellow-700',
    greeting: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-3">
      <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Quick Templates</h4>
            <p className="text-sm text-gray-600">
              Use pre-made templates for faster messaging. Customize variables before sending.
            </p>
          </div>
        </div>
      </Card>

      {templates.map(template => (
        <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {template.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">{template.name}</h4>
                <Badge variant="secondary" className={categoryColors[template.category]}>
                  {template.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.message}</p>
              
              {template.variables.length > 0 && (
                <div className="text-xs text-gray-500">
                  Variables: {template.variables.map(v => `{${v}}`).join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleUseTemplate(template)} size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              <Copy className="w-3 h-3 mr-1" />
              Use Template
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// ANALYTICS TAB
// ============================================

function AnalyticsTab({ broadcasts }: { broadcasts: Broadcast[] }) {
  const sentBroadcasts = broadcasts.filter(b => b.status === 'sent');
  const totalSent = sentBroadcasts.reduce((sum, b) => sum + (b.sent || 0), 0);
  const totalOpened = sentBroadcasts.reduce((sum, b) => sum + (b.opened || 0), 0);
  const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Overview */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-3">Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{sentBroadcasts.length}</div>
            <div className="text-sm text-gray-600">Campaigns</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{totalSent}</div>
            <div className="text-sm text-gray-600">Messages Sent</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{totalOpened}</div>
            <div className="text-sm text-gray-600">Opened</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{avgOpenRate}%</div>
            <div className="text-sm text-gray-600">Avg Open Rate</div>
          </div>
        </div>
      </Card>

      {/* Performance */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-3">Campaign Performance</h3>
        <div className="space-y-3">
          {sentBroadcasts.map(broadcast => {
            const openRate = broadcast.sent && broadcast.opened
              ? Math.round((broadcast.opened / broadcast.sent) * 100)
              : 0;

            return (
              <div key={broadcast.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{broadcast.title}</h4>
                  <Badge className={openRate >= 70 ? 'bg-green-500' : openRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}>
                    {openRate}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      openRate >= 70 ? 'bg-green-500' :
                      openRate >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${openRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                  <span>{broadcast.sent} sent</span>
                  <span>{broadcast.opened} opened</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <h4 className="font-medium text-gray-900 mb-2">📊 Analytics Tips</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Best time to send: 10 AM - 12 PM and 6 PM - 8 PM</li>
          <li>• Messages with emojis get 30% better engagement</li>
          <li>• Keep messages under 160 characters for better results</li>
          <li>• Personalization increases open rates by 50%</li>
        </ul>
      </Card>
    </div>
  );
}

// ============================================
// CONTACTS TAB
// ============================================

function ContactsTab() {
  const mockContacts = [
    { id: '1', name: 'Regular Customers', count: 156, type: 'group' },
    { id: '2', name: 'VIP Customers', count: 42, type: 'group' },
    { id: '3', name: 'New Customers (This Month)', count: 28, type: 'group' },
    { id: '4', name: 'Inactive (30+ days)', count: 67, type: 'group' },
    { id: '5', name: 'All Contacts', count: 348, type: 'all' },
  ];

  return (
    <div className="space-y-3">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Contact Groups</h4>
            <p className="text-sm text-gray-600">
              Organize contacts into groups for targeted messaging
            </p>
          </div>
        </div>
      </Card>

      {mockContacts.map(contact => (
        <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{contact.name}</h4>
                <p className="text-sm text-gray-600">{contact.count} contacts</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <MessageSquare className="w-3 h-3 mr-1" />
              Message
            </Button>
          </div>
        </Card>
      ))}

      <Button className="w-full" variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Create New Group
      </Button>
    </div>
  );
}

// ============================================
// CREATE BROADCAST MODAL
// ============================================

function CreateBroadcastModal({ templates, onSave, onClose }: {
  templates: Template[];
  onSave: (data: Partial<Broadcast>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipients: 0,
    scheduledDate: '',
    useTemplate: false,
    selectedTemplate: '',
  });

  const handleUseTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        message: template.message,
        selectedTemplate: templateId,
        useTemplate: true,
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter broadcast title');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter message');
      return;
    }

    onSave({
      title: formData.title,
      message: formData.message,
      recipients: formData.recipients || 100, // Default
      scheduledDate: formData.scheduledDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Create Broadcast</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Quick Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Start (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {templates.slice(0, 4).map(template => (
                <Button
                  key={template.id}
                  onClick={() => handleUseTemplate(template.id)}
                  variant={formData.selectedTemplate === template.id ? 'default' : 'outline'}
                  size="sm"
                  className="justify-start"
                >
                  <span className="mr-2">{template.icon}</span>
                  <span className="truncate text-xs">{template.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Broadcast Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Weekend Sale"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message here..."
              rows={6}
            />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
              <span>{formData.message.length} characters</span>
              <span className="flex items-center gap-1">
                <Smile className="w-3 h-3" />
                Use emojis for better engagement
              </span>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To
            </label>
            <select
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value={0}>Select recipient group</option>
              <option value={348}>All Contacts (348)</option>
              <option value={156}>Regular Customers (156)</option>
              <option value={42}>VIP Customers (42)</option>
              <option value={28}>New Customers (28)</option>
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule (Optional)
            </label>
            <Input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            {formData.scheduledDate ? 'Schedule' : 'Save Draft'}
          </Button>
        </div>
      </Card>
    </div>
  );
}