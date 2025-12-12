import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import {
  Shield,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe,
  Terminal,
  Code,
} from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
  permissions: string[];
}

interface IPWhitelist {
  id: string;
  ip: string;
  description: string;
  createdAt: string;
  active: boolean;
}

export function AdminSecurityPanel() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'rbapi_1234567890abcdefghij',
      createdAt: '2024-11-01',
      lastUsed: '2 hours ago',
      status: 'active',
      permissions: ['read', 'write', 'admin'],
    },
    {
      id: '2',
      name: 'Mobile App Key',
      key: 'rbapi_abcdefghij1234567890',
      createdAt: '2024-10-15',
      lastUsed: '5 minutes ago',
      status: 'active',
      permissions: ['read', 'write'],
    },
    {
      id: '3',
      name: 'Testing Environment',
      key: 'rbapi_test1234567890abcdef',
      createdAt: '2024-09-20',
      lastUsed: '3 days ago',
      status: 'revoked',
      permissions: ['read'],
    },
  ]);

  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelist[]>([
    {
      id: '1',
      ip: '203.0.113.0',
      description: 'Office Network',
      createdAt: '2024-11-01',
      active: true,
    },
    {
      id: '2',
      ip: '198.51.100.0',
      description: 'Development Server',
      createdAt: '2024-10-20',
      active: true,
    },
    {
      id: '3',
      ip: '192.0.2.0',
      description: 'Old Office (Deprecated)',
      createdAt: '2024-08-15',
      active: false,
    },
  ]);

  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    ipWhitelisting: false,
    apiRateLimit: 1000,
    sessionTimeout: 30,
    passwordComplexity: 'high',
    loginAttempts: 5,
  });

  const generateAPIKey = () => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `rbapi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toLocaleDateString(),
      lastUsed: 'Never',
      status: 'active',
      permissions: ['read'],
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('New API key generated!');
  };

  const revokeKey = (id: string) => {
    setApiKeys(prev =>
      prev.map(key =>
        key.id === id ? { ...key, status: 'revoked' as const } : key
      )
    );
    toast.success('API key revoked');
  };

  const deleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success('API key deleted');
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const toggleShowKey = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addIPAddress = () => {
    const ip = prompt('Enter IP address (e.g., 192.168.1.1):');
    const description = prompt('Enter description:');
    
    if (ip && description) {
      const newIP: IPWhitelist = {
        id: Date.now().toString(),
        ip,
        description,
        createdAt: new Date().toLocaleDateString(),
        active: true,
      };
      setIpWhitelist([...ipWhitelist, newIP]);
      toast.success('IP address added to whitelist');
    }
  };

  const toggleIP = (id: string) => {
    setIpWhitelist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
    toast.success('IP status updated');
  };

  const removeIP = (id: string) => {
    setIpWhitelist(prev => prev.filter(item => item.id !== id));
    toast.success('IP removed from whitelist');
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-xl">Security & Access Control</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Manage API keys, IP whitelisting, and security policies to protect your application.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{apiKeys.filter(k => k.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active API Keys</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{ipWhitelist.filter(ip => ip.active).length}</div>
            <div className="text-sm text-gray-600">Whitelisted IPs</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
            </div>
            <div className="text-sm text-gray-600">2FA Status</div>
          </div>
        </div>
      </Card>

      {/* API Keys Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">API Keys Management</h3>
          </div>
          <Button onClick={generateAPIKey} className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </div>

        <div className="space-y-3">
          {apiKeys.map((key) => (
            <Card key={key.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-900">{key.name}</h4>
                    <Badge className={key.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                      {key.status}
                    </Badge>
                    {key.permissions.includes('admin') && (
                      <Badge className="bg-purple-500">Admin Access</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4 text-gray-400" />
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {showKey[key.id] ? key.key : `${key.key.substring(0, 15)}...${key.key.substring(key.key.length - 4)}`}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleShowKey(key.id)}
                    >
                      {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyKey(key.key)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span> {key.createdAt}
                    </div>
                    <div>
                      <span className="font-medium">Last Used:</span> {key.lastUsed}
                    </div>
                    <div>
                      <span className="font-medium">Permissions:</span> {key.permissions.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {key.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeKey(key.id)}
                    >
                      <Lock className="w-4 h-4 text-orange-600" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteKey(key.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* IP Whitelisting */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">IP Whitelisting</h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSecuritySettings(prev => ({ ...prev, ipWhitelisting: !prev.ipWhitelisting }))}
            >
              {securitySettings.ipWhitelisting ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
              {securitySettings.ipWhitelisting ? 'Enabled' : 'Disabled'}
            </Button>
            <Button onClick={addIPAddress} className="bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add IP Address
            </Button>
          </div>
        </div>

        {securitySettings.ipWhitelisting && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                IP Whitelisting is enabled. Only listed IP addresses can access the admin panel.
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {ipWhitelist.map((item) => (
            <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono font-bold text-gray-900">{item.ip}</code>
                      <Badge variant={item.active ? 'default' : 'secondary'}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                    <div className="text-xs text-gray-500">Added: {item.createdAt}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleIP(item.id)}
                  >
                    {item.active ? (
                      <XCircle className="w-4 h-4 text-orange-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeIP(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">Security Settings</h3>
        </div>

        <div className="space-y-4">
          {/* Two-Factor Authentication */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">
                  Require 2FA for all admin logins
                </p>
              </div>
              <Button
                variant={securitySettings.twoFactorAuth ? 'default' : 'outline'}
                onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
              >
                {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>

          {/* API Rate Limiting */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">API Rate Limiting</h4>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={securitySettings.apiRateLimit}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">requests per hour</span>
            </div>
          </div>

          {/* Session Timeout */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Session Timeout</h4>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">minutes of inactivity</span>
            </div>
          </div>

          {/* Password Complexity */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Password Complexity</h4>
            <select
              value={securitySettings.passwordComplexity}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordComplexity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="low">Low (8+ characters)</option>
              <option value="medium">Medium (8+ chars, numbers)</option>
              <option value="high">High (8+ chars, numbers, symbols)</option>
            </select>
          </div>

          {/* Login Attempts */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-2">Max Login Attempts</h4>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">attempts before lockout</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button className="flex-1 bg-blue-600">
            <RefreshCw className="w-4 h-4 mr-2" />
            Save Security Settings
          </Button>
          <Button variant="outline">
            <Terminal className="w-4 h-4 mr-2" />
            View Security Logs
          </Button>
        </div>
      </Card>
    </div>
  );
}
