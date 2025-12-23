import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { AdminAnnouncementCenter } from './AdminAnnouncementCenter';
import { AdminSupportTickets } from './AdminSupportTickets';
import {
  Users,
  Mail,
  MessageSquare,
  Bell,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Calendar,
  Clock,
  Filter,
  Target,
  Zap,
  Gift,
  Tag,
  DollarSign,
  Megaphone,
  Headphones,
} from 'lucide-react';

type NotificationTab = 'bulk' | 'announcements' | 'support';

export function AdminBulkOperations() {
  const [activeNotifTab, setActiveNotifTab] = useState<NotificationTab>('bulk');

  const [selectedOperation, setSelectedOperation] = useState<
    'notification' | 'email' | 'sms' | 'whatsapp' | 'plan-upgrade' | 'bulk-delete' | 'export' | 'import'
  >('notification');

  const [targetAudience, setTargetAudience] = useState<'all' | 'free' | 'pro' | 'automation' | 'active' | 'trial' | 'churned'>('all');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const operations = [
    {
      id: 'notification',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Send instant notifications to app',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email Campaign',
      description: 'Send bulk emails',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'sms',
      icon: MessageSquare,
      title: 'SMS Blast',
      description: 'Send SMS messages',
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'whatsapp',
      icon: MessageSquare,
      title: 'WhatsApp Broadcast',
      description: 'Send WhatsApp messages',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'plan-upgrade',
      icon: Zap,
      title: 'Bulk Plan Change',
      description: 'Upgrade/downgrade users',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'bulk-delete',
      icon: Trash2,
      title: 'Bulk Delete',
      description: 'Remove inactive users',
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 'export',
      icon: Download,
      title: 'Export Data',
      description: 'Download user data',
      color: 'bg-teal-100 text-teal-600',
    },
    {
      id: 'import',
      icon: Upload,
      title: 'Import Users',
      description: 'Bulk user upload',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  const audiences = [
    { id: 'all', label: 'All Users', count: 15847 },
    { id: 'free', label: 'Free Plan', count: 8245 },
    { id: 'pro', label: 'Pro Plan', count: 5892 },
    { id: 'automation', label: 'Automation Plan', count: 1710 },
    { id: 'active', label: 'Active Users', count: 12653 },
    { id: 'trial', label: 'Trial Users', count: 2450 },
    { id: 'churned', label: 'Churned Users', count: 744 },
  ];

  const templates = {
    notification: [
      {
        id: 1,
        title: 'New Feature Announcement',
        message: '🎉 Exciting news! We just launched [Feature Name]. Try it now!',
      },
      {
        id: 2,
        title: 'Upgrade Reminder',
        message: '💎 Upgrade to Pro and unlock unlimited bills! Special offer: 20% off.',
      },
      {
        id: 3,
        title: 'Inactive User Re-engagement',
        message: '👋 We miss you! Come back and get 7 days of Pro features FREE.',
      },
    ],
    email: [
      {
        id: 1,
        subject: 'Welcome to Retail Bandhu Lite!',
        message: 'Dear (name),\n\nThank you for joining Retail Bandhu Lite...',
      },
      {
        id: 2,
        subject: 'Your monthly report is ready',
        message: 'Hi (name),\n\nHere is your business summary for this month...',
      },
    ],
    whatsapp: [
      {
        id: 1,
        message: 'Namaste (name)! 🙏\n\n(storeName) ke liye special offer...',
      },
      {
        id: 2,
        message: 'Hi (name), aapka bill ready hai! Download link: (link)',
      },
    ],
  };

  const handleSend = () => {
    const audience = audiences.find((a) => a.id === targetAudience);
    toast.success(`Sending ${selectedOperation} to ${audience?.count} users...`);
  };

  const handleSchedule = () => {
    toast.success(`Scheduled for ${scheduleDate} at ${scheduleTime}`);
  };

  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    toast.info(`Exporting data as ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`Download started! Check your downloads folder.`);
    }, 1500);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete inactive users? This cannot be undone.`)) {
      toast.success('Bulk delete started. This may take a few minutes.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="p-2">
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveNotifTab('bulk')}
            variant={activeNotifTab === 'bulk' ? 'default' : 'ghost'}
            className={activeNotifTab === 'bulk' ? 'bg-blue-600' : ''}
          >
            <Zap className="w-4 h-4 mr-2" />
            Bulk Operations
          </Button>
          <Button
            onClick={() => setActiveNotifTab('announcements')}
            variant={activeNotifTab === 'announcements' ? 'default' : 'ghost'}
            className={activeNotifTab === 'announcements' ? 'bg-blue-600' : ''}
          >
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </Button>
          <Button
            onClick={() => setActiveNotifTab('support')}
            variant={activeNotifTab === 'support' ? 'default' : 'ghost'}
            className={activeNotifTab === 'support' ? 'bg-blue-600' : ''}
          >
            <Headphones className="w-4 h-4 mr-2" />
            Support Tickets
          </Button>
        </div>
      </Card>

      {/* Render active tab content */}
      {activeNotifTab === 'announcements' && <AdminAnnouncementCenter />}
      {activeNotifTab === 'support' && <AdminSupportTickets />}
      {activeNotifTab === 'bulk' && (
        <>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bulk Operations</h2>
        <p className="text-sm text-gray-600">Manage multiple users at once</p>
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {operations.map((op) => {
          const Icon = op.icon;
          return (
            <Card
              key={op.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedOperation === op.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedOperation(op.id as any)}
            >
              <div className={`w-12 h-12 ${op.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{op.title}</h3>
              <p className="text-xs text-gray-600">{op.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      {(selectedOperation === 'notification' || selectedOperation === 'email' || selectedOperation === 'sms' || selectedOperation === 'whatsapp') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Target Audience
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {audiences.map((audience) => (
                  <button
                    key={audience.id}
                    onClick={() => setTargetAudience(audience.id as any)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      targetAudience === audience.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{audience.count.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{audience.label}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Compose Message
              </h3>

              <div className="space-y-4">
                {selectedOperation === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      placeholder="Enter email subject..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Use placeholders: (name), (storeName), (phone), (link)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Schedule Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Schedule Time
                    </label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      disabled={!scheduleDate}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-blue-600" onClick={handleSend}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                  {scheduleDate && (
                    <Button variant="outline" className="flex-1" onClick={handleSchedule}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Templates */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-600" />
                Templates
              </h3>
              <div className="space-y-2">
                {(templates[selectedOperation as keyof typeof templates] || []).map((template: any) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      if (template.subject) setSubject(template.subject);
                      setMessage(template.message);
                      toast.success('Template loaded');
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {template.title || template.subject}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">{template.message}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-bold mb-2 text-blue-900">💡 Pro Tips</h3>
              <ul className="text-xs text-blue-800 space-y-2">
                <li>• Use personalization placeholders</li>
                <li>• Send during peak hours (6-8 PM)</li>
                <li>• A/B test different messages</li>
                <li>• Keep it short and actionable</li>
                <li>• Include a clear CTA</li>
              </ul>
            </Card>

            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="font-bold mb-2 text-green-900">✅ Best Practices</h3>
              <ul className="text-xs text-green-800 space-y-2">
                <li>• Don't spam users (max 1/day)</li>
                <li>• Segment your audience</li>
                <li>• Test with small group first</li>
                <li>• Track engagement metrics</li>
                <li>• Respect opt-out preferences</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Export Data */}
      {selectedOperation === 'export' && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Export User Data</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Export Format</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleExport('csv')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSV File
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleExport('excel')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel File
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleExport('json')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  JSON File
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Data to Include</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Basic Info (Name, Email, Phone)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Store Details
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Subscription Data
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Usage Statistics
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Revenue Data
                </label>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Filter Options</h4>
              <div className="space-y-2">
                <select className="w-full p-2 border rounded">
                  <option>All Users</option>
                  <option>Free Plan Only</option>
                  <option>Pro Plan Only</option>
                  <option>Automation Plan Only</option>
                  <option>Active Users</option>
                  <option>Churned Users</option>
                </select>
                <Input type="date" placeholder="From Date" />
                <Input type="date" placeholder="To Date" />
              </div>
            </Card>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Privacy Notice:</strong> Exported data contains sensitive user information. Handle with care and comply with GDPR/data protection laws.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Import Users */}
      {selectedOperation === 'import' && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Import Users (Bulk Upload)</h3>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Drop CSV file here or click to browse</h4>
              <p className="text-sm text-gray-600 mb-4">
                Maximum file size: 10MB • Supports CSV, Excel formats
              </p>
              <input type="file" accept=".csv,.xlsx" className="hidden" id="file-upload" />
              <label htmlFor="file-upload">
                <Button variant="outline">Select File</Button>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-blue-50">
                <h4 className="font-medium mb-2 text-blue-900">📋 CSV Format Required</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`name,email,phone,storeName,plan
Ramesh,ram@ex.com,9876543210,Store1,pro
Priya,priya@ex.com,9876543211,Store2,free`}
                </pre>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Download className="w-3 h-3 mr-2" />
                  Download Template
                </Button>
              </Card>

              <Card className="p-4 bg-green-50">
                <h4 className="font-medium mb-2 text-green-900">✅ Import Rules</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Email must be unique</li>
                  <li>• Phone format: +91XXXXXXXXXX</li>
                  <li>• Valid plans: free, pro, automation</li>
                  <li>• Max 1000 users per upload</li>
                  <li>• Duplicates will be skipped</li>
                </ul>
              </Card>
            </div>
          </div>
        </Card>
      )}

      {/* Bulk Plan Upgrade */}
      {selectedOperation === 'plan-upgrade' && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Bulk Plan Change</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Users
                </label>
                <select className="w-full p-3 border rounded-lg">
                  <option>All Free Plan Users (8,245)</option>
                  <option>All Pro Plan Users (5,892)</option>
                  <option>All Trial Users (2,450)</option>
                  <option>Churned Users (744)</option>
                  <option>Top 10% by Revenue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Plan
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition">
                    <div className="font-bold text-gray-900">FREE</div>
                    <div className="text-xs text-gray-600">₹0/mo</div>
                  </button>
                  <button className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-900">PRO</div>
                    <div className="text-xs text-blue-600">₹99/mo</div>
                  </button>
                  <button className="p-4 border-2 border-orange-500 bg-orange-50 rounded-lg">
                    <div className="font-bold text-orange-900">AUTO</div>
                    <div className="text-xs text-orange-600">₹199/mo</div>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Preview Changes</h4>
                <div className="text-sm text-blue-800">
                  <div className="flex justify-between mb-1">
                    <span>Users affected:</span>
                    <strong>8,245</strong>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>New plan:</span>
                    <strong>Pro (₹99/mo)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. monthly revenue:</span>
                    <strong>₹8,16,255</strong>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-blue-600">
                <Zap className="w-4 h-4 mr-2" />
                Apply Changes
              </Button>
            </div>

            <div className="space-y-4">
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Important Notes</h4>
                    <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                      <li>• Users will be notified of plan change</li>
                      <li>• Billing will be updated immediately</li>
                      <li>• This action cannot be undone</li>
                      <li>• Consider offering discount codes</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-purple-50 border-purple-200">
                <h4 className="font-medium text-purple-900 mb-3">
                  <Gift className="w-4 h-4 inline mr-1" />
                  Offer Incentives
                </h4>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-purple-800">Give 7 days free trial</span>
                </label>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-purple-800">Apply 20% discount for 3 months</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-purple-800">Bonus features for early adopters</span>
                </label>
              </Card>
            </div>
          </div>
        </Card>
      )}

      {/* Bulk Delete */}
      {selectedOperation === 'bulk-delete' && (
        <Card className="p-6 border-red-200">
          <h3 className="font-bold text-lg mb-4 text-red-900">⚠️ Danger Zone: Bulk Delete</h3>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-900 mb-2">Warning: This is a destructive action!</h4>
                <p className="text-sm text-red-800">
                  Deleting users will permanently remove all their data including bills, products, and analytics. 
                  This action CANNOT be undone. Please proceed with extreme caution.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delete Criteria
              </label>
              <select className="w-full p-3 border rounded-lg">
                <option>Users inactive for 90+ days (744 users)</option>
                <option>Users inactive for 180+ days (320 users)</option>
                <option>Free users inactive for 30+ days (1,245 users)</option>
                <option>Trial expired, no conversion (580 users)</option>
                <option>Suspended accounts (45 users)</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Before Deletion:</h4>
              <label className="flex items-center gap-2 mb-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Send final notification to users</span>
              </label>
              <label className="flex items-center gap-2 mb-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Export user data for records</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Create backup before deletion</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export First
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Users
              </Button>
            </div>
          </div>
        </Card>
      )}
        </>
      )}
    </div>
  );
}