import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  Headphones,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  Tag,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: 'technical' | 'billing' | 'feature' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  responses: {
    from: string;
    message: string;
    timestamp: string;
  }[];
}

export function AdminSupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'tkt-1',
      ticketNumber: 'TKT-001',
      userId: 'user-1',
      userName: 'Ramesh Sharma',
      userEmail: 'ramesh@example.com',
      subject: 'Voice billing not working properly',
      message:
        'When I try to use voice billing in Hindi, the app is not recognizing product names correctly. Please help.',
      category: 'technical',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Support Team',
      createdAt: '2024-12-10 09:30 AM',
      updatedAt: '2024-12-10 11:00 AM',
      responses: [
        {
          from: 'Support Team',
          message:
            'Thank you for reporting this. Our team is looking into the Hindi voice recognition issue. Can you please share which products are not being recognized?',
          timestamp: '2024-12-10 11:00 AM',
        },
      ],
    },
    {
      id: 'tkt-2',
      ticketNumber: 'TKT-002',
      userId: 'user-2',
      userName: 'Priya Patel',
      userEmail: 'priya@example.com',
      subject: 'Need help upgrading to Automation plan',
      message:
        'I want to upgrade from Pro to Automation plan but payment is failing. Please assist.',
      category: 'billing',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Unassigned',
      createdAt: '2024-12-10 08:15 AM',
      updatedAt: '2024-12-10 08:15 AM',
      responses: [],
    },
    {
      id: 'tkt-3',
      ticketNumber: 'TKT-003',
      userId: 'user-3',
      userName: 'Suresh Kumar',
      userEmail: 'suresh@example.com',
      subject: 'Can we get barcode scanner feature?',
      message:
        'It would be very helpful if we could scan product barcodes instead of typing. Is this feature available?',
      category: 'feature',
      priority: 'low',
      status: 'resolved',
      assignedTo: 'Product Team',
      createdAt: '2024-12-09 06:45 PM',
      updatedAt: '2024-12-09 08:30 PM',
      responses: [
        {
          from: 'Product Team',
          message:
            'Great news! Barcode scanner is already available in the app. Go to Settings {">"} Enable Barcode Scanner. Let us know if you need any help!',
          timestamp: '2024-12-09 08:30 PM',
        },
      ],
    },
    {
      id: 'tkt-4',
      ticketNumber: 'TKT-004',
      userId: 'user-4',
      userName: 'Anjali Mehta',
      userEmail: 'anjali@example.com',
      subject: 'WhatsApp bill sharing not working',
      message: 'Customer bills are not being sent via WhatsApp. Shows error every time.',
      category: 'technical',
      priority: 'urgent',
      status: 'open',
      assignedTo: 'Unassigned',
      createdAt: '2024-12-10 07:00 AM',
      updatedAt: '2024-12-10 07:00 AM',
      responses: [],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const sendReply = (ticketId: string) => {
    const reply = replyText[ticketId];
    if (!reply?.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'in-progress',
              updatedAt: new Date().toLocaleString(),
              responses: [
                ...t.responses,
                {
                  from: 'Support Admin',
                  message: reply,
                  timestamp: new Date().toLocaleString(),
                },
              ],
            }
          : t
      )
    );

    setReplyText({ ...replyText, [ticketId]: '' });
    toast.success('Reply sent successfully');
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? { ...t, status, updatedAt: new Date().toLocaleString() }
          : t
      )
    );
    toast.success(`Ticket status updated to ${status}`);
  };

  const assignTicket = (ticketId: string, assignee: string) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? { ...t, assignedTo: assignee, updatedAt: new Date().toLocaleString() }
          : t
      )
    );
    toast.success(`Ticket assigned to ${assignee}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-purple-500';
      case 'resolved':
        return 'bg-green-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <AlertCircle className="w-4 h-4" />;
      case 'billing':
        return <Tag className="w-4 h-4" />;
      case 'feature':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{tickets.length}</div>
              <div className="text-sm text-blue-700">Total Tickets</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">{openTickets}</div>
              <div className="text-sm text-orange-700">Open</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {inProgressTickets}
              </div>
              <div className="text-sm text-purple-700">In Progress</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{resolvedTickets}</div>
              <div className="text-sm text-green-700">Resolved</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by ticket number, user name, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Ticket Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{ticket.subject}</h3>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50">
                      {getCategoryIcon(ticket.category)}
                      <span className="ml-1 capitalize">{ticket.category}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {ticket.userName}
                    </span>
                    <span>{ticket.userEmail}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {ticket.createdAt}
                    </span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {ticket.ticketNumber}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{ticket.message}</p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Assigned to: {ticket.assignedTo}</span>
                    <span>•</span>
                    <span>Last updated: {ticket.updatedAt}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)
                  }
                >
                  {expandedTicket === ticket.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <select
                  onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                  value={ticket.status}
                  className="p-2 text-sm border rounded-lg"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  onChange={(e) => assignTicket(ticket.id, e.target.value)}
                  value={ticket.assignedTo}
                  className="p-2 text-sm border rounded-lg"
                >
                  <option value="Unassigned">Unassigned</option>
                  <option value="Support Team">Support Team</option>
                  <option value="Product Team">Product Team</option>
                  <option value="Technical Team">Technical Team</option>
                  <option value="Billing Team">Billing Team</option>
                </select>
              </div>

              {/* Expanded View - Responses */}
              {expandedTicket === ticket.id && (
                <div className="pt-4 border-t">
                  {ticket.responses.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <h4 className="font-bold text-sm text-gray-700">Responses:</h4>
                      {ticket.responses.map((response, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {response.from}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {response.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Send Reply:
                    </label>
                    <Textarea
                      placeholder="Type your response..."
                      value={replyText[ticket.id] || ''}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [ticket.id]: e.target.value })
                      }
                      rows={3}
                    />
                    <Button
                      onClick={() => sendReply(ticket.id)}
                      className="bg-blue-600"
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-gray-500">
            <Headphones className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No tickets found matching your search.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
