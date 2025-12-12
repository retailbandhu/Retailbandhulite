import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import {
  DollarSign,
  Search,
  Filter,
  Download,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye,
  RotateCcw,
} from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  plan: 'pro' | 'automation';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  status: 'success' | 'failed' | 'pending' | 'refunded';
  transactionId: string;
  date: string;
  couponUsed?: string;
  discount: number;
  gateway: 'razorpay' | 'paytm' | 'phonepe';
}

export function AdminTransactionViewer() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn-1',
      userId: 'user-1',
      userName: 'Ramesh Sharma',
      userEmail: 'ramesh@example.com',
      amount: 999,
      plan: 'pro',
      paymentMethod: 'upi',
      status: 'success',
      transactionId: 'RZP_TXN_123456789',
      date: '2024-12-10 10:30 AM',
      couponUsed: 'WELCOME50',
      discount: 500,
      gateway: 'razorpay',
    },
    {
      id: 'txn-2',
      userId: 'user-2',
      userName: 'Priya Patel',
      userEmail: 'priya@example.com',
      amount: 1999,
      plan: 'automation',
      paymentMethod: 'card',
      status: 'success',
      transactionId: 'RZP_TXN_987654321',
      date: '2024-12-10 09:15 AM',
      discount: 0,
      gateway: 'razorpay',
    },
    {
      id: 'txn-3',
      userId: 'user-3',
      userName: 'Suresh Kumar',
      userEmail: 'suresh@example.com',
      amount: 999,
      plan: 'pro',
      paymentMethod: 'upi',
      status: 'failed',
      transactionId: 'RZP_TXN_555444333',
      date: '2024-12-09 08:45 PM',
      discount: 0,
      gateway: 'razorpay',
    },
    {
      id: 'txn-4',
      userId: 'user-4',
      userName: 'Anjali Mehta',
      userEmail: 'anjali@example.com',
      amount: 1999,
      plan: 'automation',
      paymentMethod: 'netbanking',
      status: 'success',
      transactionId: 'PAYTM_TXN_111222333',
      date: '2024-12-09 06:20 PM',
      couponUsed: 'DIWALI2024',
      discount: 600,
      gateway: 'paytm',
    },
    {
      id: 'txn-5',
      userId: 'user-5',
      userName: 'Vikram Singh',
      userEmail: 'vikram@example.com',
      amount: 999,
      plan: 'pro',
      paymentMethod: 'wallet',
      status: 'pending',
      transactionId: 'PHONEPE_TXN_777888999',
      date: '2024-12-09 05:30 PM',
      discount: 0,
      gateway: 'phonepe',
    },
    {
      id: 'txn-6',
      userId: 'user-6',
      userName: 'Kavita Desai',
      userEmail: 'kavita@example.com',
      amount: 1999,
      plan: 'automation',
      paymentMethod: 'upi',
      status: 'refunded',
      transactionId: 'RZP_TXN_666555444',
      date: '2024-12-08 03:15 PM',
      discount: 0,
      gateway: 'razorpay',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const totalRevenue = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const successfulTransactions = transactions.filter(
    (t) => t.status === 'success'
  ).length;

  const failedTransactions = transactions.filter((t) => t.status === 'failed').length;

  const pendingTransactions = transactions.filter(
    (t) => t.status === 'pending'
  ).length;

  const refundedAmount = transactions
    .filter((t) => t.status === 'refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  const processRefund = (transactionId: string) => {
    toast.loading('Processing refund...', { id: 'refund' });

    setTimeout(() => {
      setTransactions(
        transactions.map((t) =>
          t.id === transactionId ? { ...t, status: 'refunded' } : t
        )
      );
      toast.success('Refund processed successfully', { id: 'refund' });
    }, 2000);
  };

  const retryTransaction = (transactionId: string) => {
    toast.loading('Retrying transaction...', { id: 'retry' });

    setTimeout(() => {
      setTransactions(
        transactions.map((t) =>
          t.id === transactionId
            ? { ...t, status: Math.random() > 0.5 ? 'success' : 'failed' }
            : t
        )
      );
      toast.success('Transaction retry completed', { id: 'retry' });
    }, 2000);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'upi':
        return <Smartphone className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'netbanking':
        return <Building className="w-4 h-4" />;
      case 'wallet':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'refunded':
        return <RotateCcw className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || t.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">
                ₹{(totalRevenue / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-green-700">Total Revenue</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {successfulTransactions}
              </div>
              <div className="text-sm text-blue-700">Successful</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-900">{failedTransactions}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">
                ₹{(refundedAmount / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-purple-700">Refunded</div>
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
              placeholder="Search by name, email, or transaction ID..."
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
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Payment Transactions ({filteredTransactions.length})
        </h3>

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(transaction.status)}
                    <h4 className="font-bold text-gray-900">{transaction.userName}</h4>
                    <Badge
                      className={
                        transaction.status === 'success'
                          ? 'bg-green-500'
                          : transaction.status === 'failed'
                          ? 'bg-red-500'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-500'
                          : 'bg-purple-500'
                      }
                    >
                      {transaction.status}
                    </Badge>
                    <Badge
                      className={
                        transaction.plan === 'pro' ? 'bg-blue-500' : 'bg-orange-500'
                      }
                    >
                      {transaction.plan.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-2">
                    <div>
                      <div className="text-xs text-gray-600">Amount</div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{transaction.amount}
                      </div>
                      {transaction.discount > 0 && (
                        <div className="text-xs text-green-600">
                          -₹{transaction.discount} discount
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Payment Method</div>
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span className="capitalize">{transaction.paymentMethod}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Transaction ID</div>
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {transaction.transactionId}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Date & Time</div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.date}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Gateway</div>
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {transaction.gateway}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{transaction.userEmail}</span>
                    {transaction.couponUsed && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        Coupon: {transaction.couponUsed}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {transaction.status === 'success' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => processRefund(transaction.id)}
                    >
                      <RotateCcw className="w-4 h-4 text-purple-600" />
                    </Button>
                  )}
                  {(transaction.status === 'failed' ||
                    transaction.status === 'pending') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => retryTransaction(transaction.id)}
                    >
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Payment Method Breakdown */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Payment Method Breakdown
        </h3>
        <div className="space-y-3">
          {['upi', 'card', 'netbanking', 'wallet'].map((method) => {
            const count = transactions.filter((t) => t.paymentMethod === method).length;
            const revenue = transactions
              .filter((t) => t.paymentMethod === method && t.status === 'success')
              .reduce((sum, t) => sum + t.amount, 0);
            const percentage = (count / transactions.length) * 100;

            return (
              <div key={method} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(method)}
                    <span className="text-sm font-medium capitalize">{method}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                      {count} transactions
                    </div>
                    <div className="text-xs text-green-600">
                      ₹{revenue.toLocaleString()} revenue
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
