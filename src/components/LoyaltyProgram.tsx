import { useState, useEffect } from 'react';
import { ArrowLeft, Award, TrendingUp, Users, Gift, Settings as SettingsIcon, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  loyaltyStorage, 
  getCurrentTier, 
  getNextTier,
  type LoyaltyConfig,
  type CustomerLoyalty 
} from '../utils/loyalty';
import type { Screen } from '../types';

interface LoyaltyProgramProps {
  onNavigate: (screen: Screen) => void;
}

export function LoyaltyProgram({ onNavigate }: LoyaltyProgramProps) {
  const [config, setConfig] = useState<LoyaltyConfig>(loyaltyStorage.getConfig());
  const [customers, setCustomers] = useState<CustomerLoyalty[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setCustomers(loyaltyStorage.getAllCustomerLoyalty());
  }, []);

  const handleSaveConfig = () => {
    loyaltyStorage.setConfig(config);
    toast.success('Loyalty program settings saved!');
  };

  const totalCustomers = customers.length;
  const totalPoints = customers.reduce((sum, c) => sum + c.totalPoints, 0);
  const totalSpend = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);

  const topCustomers = [...customers]
    .sort((a, b) => b.lifetimeSpend - a.lifetimeSpend)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-white/20 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl">Loyalty Program</h1>
              <p className="text-sm text-blue-100">Reward your regular customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl">{totalCustomers}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-2xl">{totalPoints.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl">₹{totalSpend.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tiers Info */}
            <Card className="p-6">
              <h2 className="text-lg mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-500" />
                Membership Tiers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {config.bonusTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="p-4 rounded-lg border-2"
                    style={{ borderColor: tier.color }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5" style={{ color: tier.color }} />
                      <h3>{tier.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Spend: ₹{tier.minSpend.toLocaleString()}+
                    </p>
                    <Badge variant="secondary">
                      {tier.bonusMultiplier}x Points
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Customers */}
            <Card className="p-6">
              <h2 className="text-lg mb-4">Top Loyalty Members</h2>
              <div className="space-y-3">
                {topCustomers.map((customer, index) => {
                  const tier = getCurrentTier(customer.lifetimeSpend, config);
                  return (
                    <div key={customer.customerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p>{customer.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {customer.totalPoints} points • ₹{customer.lifetimeSpend.toLocaleString()} spent
                          </p>
                        </div>
                      </div>
                      <Badge style={{ backgroundColor: tier.color, color: 'white' }}>
                        {tier.name}
                      </Badge>
                    </div>
                  );
                })}
                {topCustomers.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No loyalty members yet. Start rewarding your customers!
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg mb-4">All Loyalty Members</h2>
              <div className="space-y-3">
                {customers.map((customer) => {
                  const tier = getCurrentTier(customer.lifetimeSpend, config);
                  const nextTierInfo = getNextTier(tier, config);
                  
                  return (
                    <div key={customer.customerId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3>{customer.customerName}</h3>
                          <p className="text-sm text-gray-600">
                            Member since {new Date(customer.pointsHistory[customer.pointsHistory.length - 1]?.date || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge style={{ backgroundColor: tier.color, color: 'white' }}>
                          {tier.name}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Total Points</p>
                          <p className="text-lg">{customer.totalPoints}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Lifetime Spend</p>
                          <p className="text-lg">₹{customer.lifetimeSpend.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Redeemable Value</p>
                          <p className="text-lg">
                            ₹{Math.floor(customer.totalPoints * config.redeemRate)}
                          </p>
                        </div>
                      </div>

                      {nextTierInfo && (
                        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                          Spend ₹{nextTierInfo.amountNeeded.toLocaleString()} more to reach {nextTierInfo.tier.name} tier
                        </div>
                      )}
                    </div>
                  );
                })}
                {customers.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No loyalty members yet
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg">Enable Loyalty Program</h2>
                  <p className="text-sm text-gray-600">Automatically reward customers with points</p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                />
              </div>

              {config.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Points Per ₹100 Spent</Label>
                      <Input
                        type="number"
                        value={config.pointsPerRupee}
                        onChange={(e) => setConfig({ ...config, pointsPerRupee: parseFloat(e.target.value) })}
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <Label>Redemption Rate (₹ per 10 points)</Label>
                      <Input
                        type="number"
                        value={config.redeemRate * 10}
                        onChange={(e) => setConfig({ ...config, redeemRate: parseFloat(e.target.value) / 10 })}
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <Label>Minimum Purchase for Points (₹)</Label>
                      <Input
                        type="number"
                        value={config.minPurchaseForPoints}
                        onChange={(e) => setConfig({ ...config, minPurchaseForPoints: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>

                    <div>
                      <Label>Minimum Points to Redeem</Label>
                      <Input
                        type="number"
                        value={config.minPointsToRedeem}
                        onChange={(e) => setConfig({ ...config, minPointsToRedeem: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveConfig} className="w-full bg-gradient-to-r from-blue-600 to-orange-500">
                    Save Settings
                  </Button>
                </div>
              )}
            </Card>

            {/* Example Calculation */}
            {config.enabled && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  Example Calculation
                </h3>
                <div className="space-y-2 text-sm">
                  <p>• Customer spends ₹1000</p>
                  <p>• Earns {(1000 / 100) * config.pointsPerRupee} points (Bronze tier)</p>
                  <p>• Can redeem {config.minPointsToRedeem} points for ₹{Math.floor(config.minPointsToRedeem * config.redeemRate)} discount</p>
                  <p>• Silver tier members get {config.bonusTiers[1].bonusMultiplier}x points</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}