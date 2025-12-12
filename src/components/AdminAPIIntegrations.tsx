import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  Webhook,
  Code,
  Key,
  Globe,
  MessageSquare,
  Mail,
  Smartphone,
  Database,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Play,
  Pause,
  BarChart3,
  Terminal,
  FileText,
  Settings,
} from 'lucide-react';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered: string;
  successRate: number;
  totalCalls: number;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'whatsapp' | 'sms' | 'email' | 'payment' | 'analytics';
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  config: Record<string, any>;
}

export function AdminAPIIntegrations() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 'wh-1',
      name: 'New Order Notification',
      url: 'https://api.example.com/webhooks/orders',
      events: ['order.created', 'order.completed'],
      active: true,
      lastTriggered: '2 hours ago',
      successRate: 98.5,
      totalCalls: 1245,
    },
    {
      id: 'wh-2',
      name: 'Inventory Sync',
      url: 'https://inventory.example.com/sync',
      events: ['inventory.updated', 'product.created'],
      active: true,
      lastTriggered: '15 minutes ago',
      successRate: 99.2,
      totalCalls: 3542,
    },
    {
      id: 'wh-3',
      name: 'Analytics Tracker',
      url: 'https://analytics.example.com/track',
      events: ['user.login', 'bill.created', 'payment.received'],
      active: false,
      lastTriggered: '3 days ago',
      successRate: 95.8,
      totalCalls: 892,
    },
  ]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'int-1',
      name: 'WhatsApp Business API',
      description: 'Send bills and catalogs via WhatsApp',
      type: 'whatsapp',
      icon: MessageSquare,
      status: 'connected',
      apiKey: 'whatsapp_live_***************',
      config: {
        phoneNumberId: '+91 98765 43210',
        businessAccountId: 'BA-123456',
      },
    },
    {
      id: 'int-2',
      name: 'SMS Gateway',
      description: 'Send SMS notifications to customers',
      type: 'sms',
      icon: Smartphone,
      status: 'connected',
      apiKey: 'sms_api_***************',
      config: {
        provider: 'Twilio',
        senderId: 'RETAILB',
      },
    },
    {
      id: 'int-3',
      name: 'Email Service',
      description: 'Send email receipts and newsletters',
      type: 'email',
      icon: Mail,
      status: 'disconnected',
      config: {
        provider: 'SendGrid',
        fromEmail: 'noreply@retailbandhu.com',
      },
    },
    {
      id: 'int-4',
      name: 'Payment Gateway',
      description: 'Accept online payments',
      type: 'payment',
      icon: Database,
      status: 'connected',
      apiKey: 'razorpay_***************',
      config: {
        provider: 'Razorpay',
        webhookSecret: '***************',
      },
    },
    {
      id: 'int-5',
      name: 'Google Analytics',
      description: 'Track user behavior and conversions',
      type: 'analytics',
      icon: BarChart3,
      status: 'connected',
      config: {
        measurementId: 'G-XXXXXXXXXX',
        propertyId: '123456789',
      },
    },
  ]);

  const [showAddWebhook, setShowAddWebhook] = useState(false);

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(prev =>
      prev.map(wh =>
        wh.id === webhookId ? { ...wh, active: !wh.active } : wh
      )
    );
    toast.success('Webhook status updated');
  };

  const deleteWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.filter(wh => wh.id !== webhookId));
    toast.success('Webhook deleted');
  };

  const testWebhook = (webhook: Webhook) => {
    toast.loading('Testing webhook...', { id: 'webhook-test' });
    setTimeout(() => {
      toast.success('Webhook test successful!', { id: 'webhook-test' });
    }, 2000);
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? {
              ...int,
              status:
                int.status === 'connected' ? 'disconnected' : 'connected',
            }
          : int
      )
    );
    toast.success('Integration status updated');
  };

  const availableEvents = [
    'order.created',
    'order.completed',
    'order.cancelled',
    'inventory.updated',
    'product.created',
    'product.updated',
    'user.login',
    'user.signup',
    'bill.created',
    'payment.received',
    'payment.failed',
  ];

  return (
    <div className="space-y-6">
      {/* API Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Webhook className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {webhooks.length}
              </div>
              <div className="text-sm text-blue-700">Active Webhooks</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <div className="text-sm text-green-700">Connected</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {webhooks.reduce((sum, wh) => sum + wh.totalCalls, 0).toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Total API Calls</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">
                {(
                  webhooks.reduce((sum, wh) => sum + wh.successRate, 0) /
                  webhooks.length
                ).toFixed(1)}%
              </div>
              <div className="text-sm text-orange-700">Success Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Integrations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Third-Party Integrations
          </h3>
          <Button size="sm" className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card
                key={integration.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {integration.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      integration.status === 'connected'
                        ? 'bg-green-500'
                        : integration.status === 'error'
                        ? 'bg-red-500'
                        : 'bg-gray-400'
                    }
                  >
                    {integration.status}
                  </Badge>
                </div>

                {integration.apiKey && (
                  <div className="mb-3 p-2 bg-gray-50 rounded text-xs font-mono">
                    {integration.apiKey}
                  </div>
                )}

                <div className="space-y-1 mb-3">
                  {Object.entries(integration.config).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleIntegration(integration.id)}
                  >
                    {integration.status === 'connected' ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Webhooks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Webhook className="w-5 h-5 text-blue-600" />
            Webhook Management
          </h3>
          <Button
            size="sm"
            className="bg-blue-600"
            onClick={() => setShowAddWebhook(!showAddWebhook)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        {showAddWebhook && (
          <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-3">Create New Webhook</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Webhook Name
                </label>
                <Input placeholder="e.g., Order Notifications" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Webhook URL
                </label>
                <Input
                  placeholder="https://your-domain.com/webhooks/endpoint"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Events (select multiple)
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableEvents.slice(0, 6).map((event) => (
                    <label key={event} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>{event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Webhook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddWebhook(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {webhooks.map((webhook) => (
            <Card
              key={webhook.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{webhook.name}</h4>
                    <Badge
                      className={webhook.active ? 'bg-green-500' : 'bg-gray-400'}
                    >
                      {webhook.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2 font-mono">
                    {webhook.url}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <Badge
                        key={event}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700"
                      >
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWebhook(webhook.id)}
                  >
                    {webhook.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteWebhook(webhook.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-600">Total Calls</div>
                  <div className="font-bold text-gray-900">
                    {webhook.totalCalls.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                  <div className="font-bold text-green-600">
                    {webhook.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Last Triggered</div>
                  <div className="font-medium text-gray-700">
                    {webhook.lastTriggered}
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => testWebhook(webhook)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Test
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* API Documentation */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          API Documentation
        </h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Code className="w-4 h-4 mr-2" />
            View API Reference
            <ExternalLink className="w-4 h-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Terminal className="w-4 h-4 mr-2" />
            Interactive API Console
            <ExternalLink className="w-4 h-4 ml-auto" />
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="w-4 h-4 mr-2" />
            Download Postman Collection
            <ExternalLink className="w-4 h-4 ml-auto" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
