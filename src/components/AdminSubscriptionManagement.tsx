import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { AdminCouponManager } from './AdminCouponManager';
import { AdminTransactionViewer } from './AdminTransactionViewer';
import {
  DollarSign,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  TrendingUp,
  Users,
  Zap,
  Crown,
  Star,
  CheckCircle2,
  Save,
  Ticket,
  CreditCard,
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  highlighted: boolean;
  active: boolean;
  userCount: number;
  revenue: number;
  color: string;
}

type SubscriptionTab = 'pricing' | 'coupons' | 'transactions';

export function AdminSubscriptionManagement() {
  const [activeSubTab, setActiveSubTab] = useState<SubscriptionTab>('pricing');
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      id: 'free',
      name: 'free',
      displayName: 'Free',
      price: 0,
      currency: '₹',
      interval: 'month',
      features: [
        'Up to 100 bills/month',
        'Basic inventory management',
        '1 store',
        'Digital bill sharing',
        'Basic reports',
      ],
      highlighted: false,
      active: true,
      userCount: 8245,
      revenue: 0,
      color: 'gray',
    },
    {
      id: 'pro',
      name: 'pro',
      displayName: 'Pro',
      price: 999,
      currency: '₹',
      interval: 'month',
      features: [
        'Unlimited bills',
        'Advanced inventory',
        'Up to 3 stores',
        'Voice billing',
        'WhatsApp integration',
        'Barcode scanner',
        'Custom bill designs',
        'Priority support',
      ],
      highlighted: true,
      active: true,
      userCount: 5892,
      revenue: 5886108,
      color: 'blue',
    },
    {
      id: 'automation',
      name: 'automation',
      displayName: 'Automation Pro',
      price: 1998,
      currency: '₹',
      interval: 'month',
      features: [
        'Everything in Pro',
        'WhatsApp automation',
        'AI business insights',
        'Unlimited stores',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
        'API access',
      ],
      highlighted: false,
      active: true,
      userCount: 1710,
      revenue: 3416580,
      color: 'orange',
    },
  ]);

  const [editingPlan, setEditingPlan] = useState<string | null>(null);

  const totalUsers = plans.reduce((sum, plan) => sum + plan.userCount, 0);
  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);

  const updatePlanPrice = (planId: string, newPrice: number) => {
    setPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, price: newPrice } : p))
    );
    toast.success('Plan price updated');
  };

  const togglePlanActive = (planId: string) => {
    setPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, active: !p.active } : p))
    );
    toast.success('Plan status updated');
  };

  const addFeature = (planId: string, feature: string) => {
    if (!feature.trim()) return;
    setPlans(prev =>
      prev.map(p =>
        p.id === planId ? { ...p, features: [...p.features, feature] } : p
      )
    );
    toast.success('Feature added');
  };

  const removeFeature = (planId: string, featureIndex: number) => {
    setPlans(prev =>
      prev.map(p =>
        p.id === planId
          ? { ...p, features: p.features.filter((_, i) => i !== featureIndex) }
          : p
      )
    );
    toast.success('Feature removed');
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'free':
        return Users;
      case 'pro':
        return Crown;
      case 'automation':
        return Zap;
      default:
        return Star;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="p-2">
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveSubTab('pricing')}
            variant={activeSubTab === 'pricing' ? 'default' : 'ghost'}
            className={activeSubTab === 'pricing' ? 'bg-blue-600' : ''}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Pricing Plans
          </Button>
          <Button
            onClick={() => setActiveSubTab('coupons')}
            variant={activeSubTab === 'coupons' ? 'default' : 'ghost'}
            className={activeSubTab === 'coupons' ? 'bg-blue-600' : ''}
          >
            <Ticket className="w-4 h-4 mr-2" />
            Coupons
          </Button>
          <Button
            onClick={() => setActiveSubTab('transactions')}
            variant={activeSubTab === 'transactions' ? 'default' : 'ghost'}
            className={activeSubTab === 'transactions' ? 'bg-blue-600' : ''}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Transactions
          </Button>
        </div>
      </Card>

      {/* Render active tab content */}
      {activeSubTab === 'coupons' && <AdminCouponManager />}
      {activeSubTab === 'transactions' && <AdminTransactionViewer />}
      {activeSubTab === 'pricing' && (
        <>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-blue-700">Total Subscribers</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                ₹{(totalRevenue / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-green-700">Monthly Recurring Revenue</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                ₹{Math.round(totalRevenue / (totalUsers - plans[0].userCount))}
              </div>
              <div className="text-sm text-purple-700">Avg Revenue Per User</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = getPlanIcon(plan.name);
          const isEditing = editingPlan === plan.id;

          return (
            <Card
              key={plan.id}
              className={`p-6 ${
                plan.highlighted
                  ? 'border-2 border-blue-500 shadow-lg'
                  : ''
              } ${!plan.active ? 'opacity-60' : ''}`}
            >
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      plan.color === 'blue'
                        ? 'from-blue-500 to-blue-600'
                        : plan.color === 'orange'
                        ? 'from-orange-500 to-orange-600'
                        : 'from-gray-400 to-gray-500'
                    } flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {plan.displayName}
                    </h3>
                    {plan.highlighted && (
                      <Badge className="bg-blue-600 text-xs">Most Popular</Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPlan(isEditing ? null : plan.id)}
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>

              {/* Price */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) =>
                        updatePlanPrice(plan.id, parseInt(e.target.value) || 0)
                      }
                      className="w-32"
                    />
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.currency}
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Users</div>
                  <div className="font-bold text-gray-900">
                    {plan.userCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Revenue</div>
                  <div className="font-bold text-green-600">
                    ₹{(plan.revenue / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="font-medium text-sm text-gray-700 mb-2">Features:</div>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {isEditing ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="flex-1 text-gray-700">{feature}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(plan.id, index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      placeholder="Add feature..."
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addFeature(plan.id, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  variant={plan.active ? 'default' : 'outline'}
                  className={`w-full ${
                    plan.active
                      ? plan.color === 'blue'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : plan.color === 'orange'
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                      : ''
                  }`}
                  onClick={() => togglePlanActive(plan.id)}
                >
                  {plan.active ? 'Active' : 'Inactive'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEditingPlan(null);
                      toast.success('Changes saved');
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Subscription History */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Subscription Trends
        </h3>
        <div className="space-y-4">
          {plans.map((plan) => {
            const percentage = (plan.userCount / totalUsers) * 100;
            return (
              <div key={plan.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {plan.displayName}
                    </span>
                    <Badge
                      className={
                        plan.color === 'blue'
                          ? 'bg-blue-500'
                          : plan.color === 'orange'
                          ? 'bg-orange-500'
                          : 'bg-gray-400'
                      }
                    >
                      {plan.userCount.toLocaleString()} users
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      plan.color === 'blue'
                        ? 'bg-blue-500'
                        : plan.color === 'orange'
                        ? 'bg-orange-500'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" onClick={() => toast.info('Creating new plan...')}>
            <Plus className="w-4 h-4 mr-2" />
            New Plan
          </Button>
          <Button variant="outline" onClick={() => toast.info('Exporting data...')}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={() => toast.info('Viewing analytics...')}>
            <DollarSign className="w-4 h-4 mr-2" />
            Revenue Analytics
          </Button>
          <Button variant="outline" onClick={() => toast.info('Managing coupons...')}>
            <Star className="w-4 h-4 mr-2" />
            Manage Coupons
          </Button>
        </div>
      </Card>
        </>
      )}
    </div>
  );
}