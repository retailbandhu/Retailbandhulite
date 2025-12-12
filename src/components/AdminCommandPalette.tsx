import React, { useState, useEffect } from 'react';
import { Command } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Users,
  Zap,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Bell,
  Database,
  Server,
  Terminal,
  Lock,
  Unlock,
  Download,
  Upload,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Play,
  Pause,
  Activity,
  Globe,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (command: CommandItem) => void;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  action: string;
  keywords: string[];
  shortcut?: string;
}

export function AdminCommandPalette({ isOpen, onClose, onExecute }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-overview',
      title: 'Go to Overview',
      description: 'View dashboard and metrics',
      category: 'Navigation',
      icon: Activity,
      action: 'navigate:overview',
      keywords: ['overview', 'dashboard', 'home', 'metrics'],
    },
    {
      id: 'nav-users',
      title: 'Go to User Management',
      description: 'Manage users and permissions',
      category: 'Navigation',
      icon: Users,
      action: 'navigate:users',
      keywords: ['users', 'management', 'customers'],
    },
    {
      id: 'nav-features',
      title: 'Go to Feature Flags',
      description: 'Control feature rollout',
      category: 'Navigation',
      icon: Zap,
      action: 'navigate:features',
      keywords: ['features', 'flags', 'toggle', 'rollout'],
    },
    {
      id: 'nav-security',
      title: 'Go to Security',
      description: 'Manage API keys and security',
      category: 'Navigation',
      icon: Shield,
      action: 'navigate:security',
      keywords: ['security', 'api', 'keys', 'ip', 'whitelist'],
    },
    {
      id: 'nav-database',
      title: 'Go to Database',
      description: 'View system health',
      category: 'Navigation',
      icon: Server,
      action: 'navigate:database',
      keywords: ['database', 'health', 'system', 'status'],
    },
    {
      id: 'nav-logs',
      title: 'Go to Audit Logs',
      description: 'View action history',
      category: 'Navigation',
      icon: Terminal,
      action: 'navigate:logs',
      keywords: ['logs', 'audit', 'history', 'actions'],
    },

    // Quick Actions
    {
      id: 'action-maintenance-on',
      title: 'Enable Maintenance Mode',
      description: 'Block user access',
      category: 'Quick Actions',
      icon: Lock,
      action: 'maintenance:enable',
      keywords: ['maintenance', 'lock', 'disable', 'block'],
      shortcut: 'M',
    },
    {
      id: 'action-maintenance-off',
      title: 'Disable Maintenance Mode',
      description: 'Restore user access',
      category: 'Quick Actions',
      icon: Unlock,
      action: 'maintenance:disable',
      keywords: ['maintenance', 'unlock', 'enable', 'restore'],
      shortcut: 'M',
    },
    {
      id: 'action-export',
      title: 'Export All Data',
      description: 'Download complete database',
      category: 'Quick Actions',
      icon: Download,
      action: 'data:export',
      keywords: ['export', 'download', 'backup', 'data'],
      shortcut: 'E',
    },
    {
      id: 'action-import',
      title: 'Import Data',
      description: 'Upload data from file',
      category: 'Quick Actions',
      icon: Upload,
      action: 'data:import',
      keywords: ['import', 'upload', 'restore', 'data'],
      shortcut: 'I',
    },
    {
      id: 'action-refresh',
      title: 'Refresh Metrics',
      description: 'Update dashboard data',
      category: 'Quick Actions',
      icon: RefreshCw,
      action: 'metrics:refresh',
      keywords: ['refresh', 'reload', 'update', 'sync'],
      shortcut: 'R',
    },
    {
      id: 'action-api-key',
      title: 'Generate API Key',
      description: 'Create new API key',
      category: 'Quick Actions',
      icon: Shield,
      action: 'security:generate-key',
      keywords: ['api', 'key', 'generate', 'create', 'token'],
      shortcut: 'K',
    },
    {
      id: 'action-health',
      title: 'Check System Health',
      description: 'Run health diagnostics',
      category: 'Quick Actions',
      icon: Activity,
      action: 'system:health-check',
      keywords: ['health', 'check', 'status', 'diagnostics'],
      shortcut: 'H',
    },

    // User Actions
    {
      id: 'user-search',
      title: 'Search Users',
      description: 'Find users by name or email',
      category: 'User Management',
      icon: Search,
      action: 'users:search',
      keywords: ['search', 'find', 'users', 'filter'],
      shortcut: '/',
    },
    {
      id: 'user-add',
      title: 'Add New User',
      description: 'Create new user account',
      category: 'User Management',
      icon: Users,
      action: 'users:add',
      keywords: ['add', 'create', 'new', 'user'],
      shortcut: 'N',
    },
    {
      id: 'user-export',
      title: 'Export Users',
      description: 'Download user list as CSV',
      category: 'User Management',
      icon: Download,
      action: 'users:export',
      keywords: ['export', 'users', 'csv', 'download'],
    },

    // Feature Management
    {
      id: 'feature-enable-all',
      title: 'Enable All Features',
      description: 'Turn on all feature flags',
      category: 'Feature Management',
      icon: Eye,
      action: 'features:enable-all',
      keywords: ['enable', 'all', 'features', 'on'],
    },
    {
      id: 'feature-disable-all',
      title: 'Disable All Features',
      description: 'Turn off all feature flags',
      category: 'Feature Management',
      icon: EyeOff,
      action: 'features:disable-all',
      keywords: ['disable', 'all', 'features', 'off'],
    },

    // Analytics
    {
      id: 'analytics-view',
      title: 'View Analytics',
      description: 'Open analytics dashboard',
      category: 'Analytics',
      icon: BarChart3,
      action: 'navigate:analytics',
      keywords: ['analytics', 'charts', 'reports', 'insights'],
      shortcut: 'A',
    },

    // Help
    {
      id: 'help-docs',
      title: 'View Documentation',
      description: 'Open admin documentation',
      category: 'Help',
      icon: FileText,
      action: 'help:docs',
      keywords: ['help', 'docs', 'documentation', 'guide'],
      shortcut: '?',
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.description.toLowerCase().includes(searchLower) ||
      cmd.keywords.some((k) => k.includes(searchLower))
    );
  });

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onExecute(filteredCommands[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose, onExecute]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-32">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search... (Press ESC to close)"
              className="pl-10 pr-4 py-3 text-lg border-0 focus:ring-0"
              autoFocus
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {category}
              </div>
              {cmds.map((cmd, index) => {
                const globalIndex = filteredCommands.indexOf(cmd);
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      onExecute(cmd);
                      onClose();
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      globalIndex === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        globalIndex === selectedIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{cmd.title}</div>
                      <div className="text-sm text-gray-500">{cmd.description}</div>
                    </div>
                    {cmd.shortcut && (
                      <Badge variant="outline" className="text-xs font-mono">
                        {cmd.shortcut}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No commands found</p>
              <p className="text-sm text-gray-400 mt-1">Try searching for something else</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">ESC</kbd>
              <span>Close</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
}
