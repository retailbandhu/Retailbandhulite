import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  Percent,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Tag,
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usageCount: number;
  minPurchase: number;
  applicablePlans: ('free' | 'pro' | 'automation')[];
  status: 'active' | 'inactive' | 'expired';
  createdBy: string;
  revenue: number;
}

export function AdminCouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'coup-1',
      code: 'WELCOME50',
      type: 'percentage',
      value: 50,
      description: 'Welcome offer - 50% off for new users',
      validFrom: '2024-12-01',
      validUntil: '2024-12-31',
      usageLimit: 1000,
      usageCount: 342,
      minPurchase: 0,
      applicablePlans: ['pro', 'automation'],
      status: 'active',
      createdBy: 'Marketing Team',
      revenue: 171000,
    },
    {
      id: 'coup-2',
      code: 'DIWALI2024',
      type: 'percentage',
      value: 30,
      description: 'Diwali Special - 30% off on all plans',
      validFrom: '2024-11-01',
      validUntil: '2024-11-15',
      usageLimit: 500,
      usageCount: 487,
      minPurchase: 0,
      applicablePlans: ['pro', 'automation'],
      status: 'expired',
      createdBy: 'Admin',
      revenue: 145000,
    },
    {
      id: 'coup-3',
      code: 'UPGRADE100',
      type: 'fixed',
      value: 100,
      description: 'Flat ₹100 off on upgrade to Automation plan',
      validFrom: '2024-12-01',
      validUntil: '2025-01-31',
      usageLimit: 200,
      usageCount: 45,
      minPurchase: 500,
      applicablePlans: ['automation'],
      status: 'active',
      createdBy: 'Admin',
      revenue: 22500,
    },
    {
      id: 'coup-4',
      code: 'REFER25',
      type: 'percentage',
      value: 25,
      description: 'Referral reward - 25% off for both parties',
      validFrom: '2024-10-01',
      validUntil: '2025-03-31',
      usageLimit: 10000,
      usageCount: 1256,
      minPurchase: 0,
      applicablePlans: ['pro', 'automation'],
      status: 'active',
      createdBy: 'Growth Team',
      revenue: 628000,
    },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage' as const,
    value: 10,
    description: '',
    validFrom: '',
    validUntil: '',
    usageLimit: 100,
    minPurchase: 0,
    applicablePlans: ['pro'] as ('free' | 'pro' | 'automation')[],
  });

  const createCoupon = () => {
    if (!newCoupon.code || !newCoupon.description) {
      toast.error('Please fill all required fields');
      return;
    }

    const coupon: Coupon = {
      id: `coup-${Date.now()}`,
      ...newCoupon,
      usageCount: 0,
      status: 'active',
      createdBy: 'Super Admin',
      revenue: 0,
    };

    setCoupons([coupon, ...coupons]);
    setShowCreateForm(false);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 10,
      description: '',
      validFrom: '',
      validUntil: '',
      usageLimit: 100,
      minPurchase: 0,
      applicablePlans: ['pro'],
    });
    toast.success(`Coupon ${coupon.code} created successfully!`);
  };

  const toggleCouponStatus = (couponId: string) => {
    setCoupons(
      coupons.map((c) =>
        c.id === couponId
          ? {
              ...c,
              status: c.status === 'active' ? 'inactive' : 'active',
            }
          : c
      )
    );
    toast.success('Coupon status updated');
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons(coupons.filter((c) => c.id !== couponId));
    toast.success('Coupon deleted');
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard`);
  };

  const totalRevenue = coupons.reduce((sum, c) => sum + c.revenue, 0);
  const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const activeCoupons = coupons.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{coupons.length}</div>
              <div className="text-sm text-blue-700">Total Coupons</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{activeCoupons}</div>
              <div className="text-sm text-green-700">Active Coupons</div>
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
                {totalUsage.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Total Redemptions</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-900">
                ₹{(totalRevenue / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-orange-700">Revenue Generated</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Coupon */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-600" />
            Coupon & Promo Codes
          </h3>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>

        {showCreateForm && (
          <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-3">Create New Coupon</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Coupon Code *
                </label>
                <Input
                  placeholder="e.g., SAVE20"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                  }
                  className="mt-1 uppercase"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  value={newCoupon.type}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, type: e.target.value as any })
                  }
                  className="w-full p-2 border rounded-lg mt-1"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Discount Value
                </label>
                <Input
                  type="number"
                  placeholder={newCoupon.type === 'percentage' ? '10' : '100'}
                  value={newCoupon.value}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, value: parseInt(e.target.value) || 0 })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Usage Limit
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  value={newCoupon.usageLimit}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      usageLimit: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Valid From</label>
                <Input
                  type="date"
                  value={newCoupon.validFrom}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, validFrom: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Valid Until</label>
                <Input
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, validUntil: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Minimum Purchase (₹)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newCoupon.minPurchase}
                  onChange={(e) =>
                    setNewCoupon({
                      ...newCoupon,
                      minPurchase: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Applicable Plans
                </label>
                <div className="flex gap-3">
                  {['pro', 'automation'].map((plan) => (
                    <label key={plan} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newCoupon.applicablePlans.includes(plan as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCoupon({
                              ...newCoupon,
                              applicablePlans: [...newCoupon.applicablePlans, plan as any],
                            });
                          } else {
                            setNewCoupon({
                              ...newCoupon,
                              applicablePlans: newCoupon.applicablePlans.filter(
                                (p) => p !== plan
                              ),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{plan}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Description *
                </label>
                <Input
                  placeholder="e.g., Holiday special offer"
                  value={newCoupon.description}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, description: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={createCoupon} className="bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </Card>

      {/* Coupons List */}
      <div className="space-y-3">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-xl text-gray-900 font-mono">
                    {coupon.code}
                  </h3>
                  <Badge
                    className={
                      coupon.status === 'active'
                        ? 'bg-green-500'
                        : coupon.status === 'expired'
                        ? 'bg-gray-500'
                        : 'bg-red-500'
                    }
                  >
                    {coupon.status}
                  </Badge>
                  <Badge className="bg-blue-500">
                    {coupon.type === 'percentage' ? (
                      <>
                        <Percent className="w-3 h-3 mr-1" />
                        {coupon.value}% OFF
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-3 h-3 mr-1" />₹{coupon.value} OFF
                      </>
                    )}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCouponCode(coupon.code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-xs text-gray-600">Valid Period</div>
                    <div className="text-sm font-medium text-gray-900">
                      {coupon.validFrom} to {coupon.validUntil}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Usage</div>
                    <div className="text-sm font-medium text-gray-900">
                      {coupon.usageCount} / {coupon.usageLimit}
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Min Purchase</div>
                    <div className="text-sm font-medium text-gray-900">
                      {coupon.minPurchase > 0 ? `₹${coupon.minPurchase}` : 'No minimum'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Plans</div>
                    <div className="flex gap-1 mt-1">
                      {coupon.applicablePlans.map((plan) => (
                        <Badge
                          key={plan}
                          variant="outline"
                          className="text-xs bg-gray-50"
                        >
                          {plan}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Revenue</div>
                    <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />₹
                      {coupon.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-3">
                  Created by {coupon.createdBy}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCouponStatus(coupon.id)}
                  disabled={coupon.status === 'expired'}
                >
                  {coupon.status === 'active' ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteCoupon(coupon.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Coupon Performance
        </h3>
        <div className="space-y-3">
          {coupons
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-bold text-sm">{coupon.code}</div>
                    <div className="text-xs text-gray-600">
                      {coupon.usageCount} redemptions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ₹{coupon.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">revenue</div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
