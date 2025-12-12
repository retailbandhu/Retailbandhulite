import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  audience: 'all' | 'free' | 'pro' | 'automation' | 'active';
  channels: ('app' | 'email' | 'sms' | 'whatsapp')[];
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: string;
  sentAt?: string;
  recipients: number;
  views: number;
  createdBy: string;
}

export function AdminAnnouncementCenter() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann-1',
      title: 'New Feature: Voice Billing Now Live!',
      message:
        'We are excited to announce that Voice Billing is now available to all Pro users. Create bills faster using voice commands in Hindi and English!',
      type: 'success',
      audience: 'pro',
      channels: ['app', 'email', 'whatsapp'],
      status: 'sent',
      sentAt: '2024-12-09 10:00 AM',
      recipients: 5892,
      views: 4234,
      createdBy: 'Admin',
    },
    {
      id: 'ann-2',
      title: 'Scheduled Maintenance - Dec 15, 2024',
      message:
        'We will be performing scheduled maintenance on December 15th from 2:00 AM to 4:00 AM IST. The app will be temporarily unavailable during this time.',
      type: 'warning',
      audience: 'all',
      channels: ['app', 'email', 'sms'],
      status: 'scheduled',
      scheduledFor: '2024-12-14 06:00 PM',
      recipients: 15847,
      views: 0,
      createdBy: 'Admin',
    },
    {
      id: 'ann-3',
      title: 'Special Offer: Upgrade to Pro for 50% Off',
      message:
        'Limited time offer! Upgrade to Retail Bandhu Pro and get 50% off for the first 3 months. Offer valid until December 31st.',
      type: 'info',
      audience: 'free',
      channels: ['app', 'email', 'whatsapp'],
      status: 'draft',
      recipients: 0,
      views: 0,
      createdBy: 'Marketing Team',
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    audience: 'all' as const,
    channels: ['app'] as ('app' | 'email' | 'sms' | 'whatsapp')[],
  });

  const createAnnouncement = () => {
    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      ...newAnnouncement,
      status: 'draft',
      recipients: 0,
      views: 0,
      createdBy: 'Super Admin',
    };

    setAnnouncements([announcement, ...announcements]);
    setShowCreateForm(false);
    setNewAnnouncement({
      title: '',
      message: '',
      type: 'info',
      audience: 'all',
      channels: ['app'],
    });
    toast.success('Announcement created successfully!');
  };

  const sendAnnouncement = (announcementId: string) => {
    toast.loading('Sending announcement...', { id: 'send' });

    setTimeout(() => {
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === announcementId
            ? {
                ...ann,
                status: 'sent',
                sentAt: new Date().toLocaleString(),
                recipients: getAudienceCount(ann.audience),
              }
            : ann
        )
      );
      toast.success('Announcement sent successfully!', { id: 'send' });
    }, 2000);
  };

  const deleteAnnouncement = (announcementId: string) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== announcementId));
    toast.success('Announcement deleted');
  };

  const getAudienceCount = (audience: string) => {
    const counts = {
      all: 15847,
      free: 8245,
      pro: 5892,
      automation: 1710,
      active: 12653,
    };
    return counts[audience as keyof typeof counts] || 0;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'urgent':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {announcements.length}
              </div>
              <div className="text-sm text-blue-700">Total Announcements</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                {announcements.filter((a) => a.status === 'sent').length}
              </div>
              <div className="text-sm text-green-700">Sent</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">
                {announcements.filter((a) => a.status === 'scheduled').length}
              </div>
              <div className="text-sm text-orange-700">Scheduled</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {announcements.reduce((sum, a) => sum + a.recipients, 0).toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Total Reach</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Announcement */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            Broadcast Announcements
          </h3>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>

        {showCreateForm && (
          <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-3">Create New Announcement</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  placeholder="e.g., New Feature Launch"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Textarea
                  placeholder="Enter your announcement message..."
                  value={newAnnouncement.message}
                  onChange={(e) =>
                    setNewAnnouncement({ ...newAnnouncement, message: e.target.value })
                  }
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full p-2 border rounded-lg mt-1"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Audience</label>
                  <select
                    value={newAnnouncement.audience}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        audience: e.target.value as any,
                      })
                    }
                    className="w-full p-2 border rounded-lg mt-1"
                  >
                    <option value="all">All Users (15,847)</option>
                    <option value="free">Free Plan (8,245)</option>
                    <option value="pro">Pro Plan (5,892)</option>
                    <option value="automation">Automation Plan (1,710)</option>
                    <option value="active">Active Users (12,653)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Delivery Channels
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['app', 'email', 'sms', 'whatsapp'].map((channel) => (
                    <label key={channel} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newAnnouncement.channels.includes(channel as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewAnnouncement({
                              ...newAnnouncement,
                              channels: [...newAnnouncement.channels, channel as any],
                            });
                          } else {
                            setNewAnnouncement({
                              ...newAnnouncement,
                              channels: newAnnouncement.channels.filter(
                                (c) => c !== channel
                              ),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={createAnnouncement}
                  className="bg-blue-600"
                  disabled={!newAnnouncement.title || !newAnnouncement.message}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Card>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    {announcement.title}
                  </h3>
                  <Badge className={getTypeColor(announcement.type)}>
                    {announcement.type}
                  </Badge>
                  <Badge className={getStatusColor(announcement.status)}>
                    {announcement.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{announcement.message}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-600">Audience</div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {announcement.audience} ({getAudienceCount(announcement.audience)})
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Channels</div>
                    <div className="flex gap-1 mt-1">
                      {announcement.channels.map((channel) => (
                        <Badge
                          key={channel}
                          variant="outline"
                          className="text-xs bg-gray-50"
                        >
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {announcement.status === 'sent' && (
                    <>
                      <div>
                        <div className="text-xs text-gray-600">Sent At</div>
                        <div className="text-sm font-medium text-gray-900">
                          {announcement.sentAt}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Views</div>
                        <div className="text-sm font-medium text-green-600">
                          {announcement.views.toLocaleString()} /{' '}
                          {announcement.recipients.toLocaleString()}
                        </div>
                      </div>
                    </>
                  )}
                  {announcement.status === 'scheduled' && (
                    <div>
                      <div className="text-xs text-gray-600">Scheduled For</div>
                      <div className="text-sm font-medium text-orange-600">
                        {announcement.scheduledFor}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Created by {announcement.createdBy}
                </div>
              </div>

              <div className="flex gap-2">
                {announcement.status === 'draft' && (
                  <Button
                    size="sm"
                    className="bg-green-600"
                    onClick={() => sendAnnouncement(announcement.id)}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send Now
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAnnouncement(announcement.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
