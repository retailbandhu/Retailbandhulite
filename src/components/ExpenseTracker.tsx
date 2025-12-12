import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, TrendingDown, Calendar, Tag, Trash2, Download, Filter, X, Repeat, Paperclip, Upload, Edit2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Screen } from '../App';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  icon: string;
  partyName?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
  attachment?: string;
}

interface ExpenseTrackerProps {
  onNavigate: (screen: Screen) => void;
}

export function ExpenseTracker({ onNavigate }: ExpenseTrackerProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Rent', amount: 5000, description: 'Shop rent', date: '2024-11-10', icon: '🏠' },
    { id: '2', category: 'Electricity', amount: 850, description: 'Bijli bill', date: '2024-11-08', icon: '⚡' },
    { id: '3', category: 'Transport', amount: 300, description: 'Delivery charges', date: '2024-11-12', icon: '🚚' },
    { id: '4', category: 'Stock Purchase', amount: 12000, description: 'Wholesale market', date: '2024-11-11', icon: '📦' },
    { id: '5', category: 'Staff Salary', amount: 8000, description: 'Helper salary', date: '2024-11-01', icon: '👤' }
  ]);

  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: ''
  });

  const categories = [
    { name: 'Rent', icon: '🏠' },
    { name: 'Electricity', icon: '⚡' },
    { name: 'Transport', icon: '🚚' },
    { name: 'Stock Purchase', icon: '📦' },
    { name: 'Staff Salary', icon: '👤' },
    { name: 'Other', icon: '💰' }
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const todayExpenses = expenses.filter(exp => exp.date === new Date().toISOString().split('T')[0]);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.description) {
      const category = categories.find(c => c.name === newExpense.category);
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: new Date().toISOString().split('T')[0],
        icon: category?.icon || '💰'
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({ category: '', amount: '', description: '' });
      setShowAddExpense(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/5 to-[#FF6F00]/5 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl">Expense Tracker</h1>
          <button onClick={() => setShowAddExpense(true)} className="text-white">
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/90 text-center">Apne dukaan ke kharche track karein</p>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-6 h-6" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
            </div>
            <p className="text-2xl mb-1">₹{totalExpenses}</p>
            <p className="text-white/80 text-sm">This Month</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6" />
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Today</span>
            </div>
            <p className="text-2xl mb-1">₹{todayTotal}</p>
            <p className="text-white/80 text-sm">{todayExpenses.length} Expenses</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <h3 className="text-gray-900 mb-3">Category-wise Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([category, amount]) => {
              const categoryData = categories.find(c => c.name === category);
              const percentage = (amount / totalExpenses) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{categoryData?.icon}</span>
                      <span className="text-gray-700 text-sm">{category}</span>
                    </div>
                    <span className="text-gray-900">₹{amount}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Recent Expenses ({expenses.length})</h3>
            <button className="text-[#1E88E5] text-sm">Filter</button>
          </div>

          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{expense.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{expense.category}</h4>
                      <p className="text-gray-500 text-sm mb-1">{expense.description}</p>
                      <p className="text-gray-400 text-xs">{new Date(expense.date).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-right">
                      <p className="text-red-600">-₹{expense.amount}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Add Expense</h2>
              <button onClick={() => setShowAddExpense(false)} className="text-gray-400">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setNewExpense({ ...newExpense, category: cat.name })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        newExpense.category === cat.name
                          ? 'border-[#1E88E5] bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <p className="text-xs text-gray-600">{cat.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Description</label>
                <Input
                  type="text"
                  placeholder="Enter description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddExpense}
                  className="flex-1 bg-gradient-to-r from-[#1E88E5] to-[#FF6F00]"
                  disabled={!newExpense.category || !newExpense.amount || !newExpense.description}
                >
                  Add Expense
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}