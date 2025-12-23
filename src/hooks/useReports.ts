/**
 * useReports Hook
 * Manages reports and analytics with async data loading
 */

import { useState, useEffect, useMemo } from 'react';
import { storage } from '../utils/storage';

interface SalesData {
  date: string;
  amount: number;
  count: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface ReportsData {
  totalSales: number;
  totalBills: number;
  averageBillValue: number;
  topProducts: TopProduct[];
  salesByDate: SalesData[];
  todaySales: number;
  weekSales: number;
  monthSales: number;
}

interface UseReportsReturn {
  data: ReportsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  dateRange: 'today' | 'week' | 'month' | 'all';
  setDateRange: (range: 'today' | 'week' | 'month' | 'all') => void;
}

export function useReports(): UseReportsReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load bills (could be async in future)
      const bills = storage.getBills();

      // Calculate date ranges
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Filter bills by date range
      const getFilteredBills = () => {
        if (dateRange === 'today') {
          return bills.filter(b => new Date(b.date) >= today);
        } else if (dateRange === 'week') {
          return bills.filter(b => new Date(b.date) >= weekAgo);
        } else if (dateRange === 'month') {
          return bills.filter(b => new Date(b.date) >= monthAgo);
        }
        return bills;
      };

      const filteredBills = getFilteredBills();

      // Calculate metrics
      const totalSales = filteredBills.reduce((sum, b) => sum + (b.total || 0), 0);
      const totalBills = filteredBills.length;
      const averageBillValue = totalBills > 0 ? totalSales / totalBills : 0;

      // Today's sales
      const todayBills = bills.filter(b => new Date(b.date) >= today);
      const todaySales = todayBills.reduce((sum, b) => sum + (b.total || 0), 0);

      // Week's sales
      const weekBills = bills.filter(b => new Date(b.date) >= weekAgo);
      const weekSales = weekBills.reduce((sum, b) => sum + (b.total || 0), 0);

      // Month's sales
      const monthBills = bills.filter(b => new Date(b.date) >= monthAgo);
      const monthSales = monthBills.reduce((sum, b) => sum + (b.total || 0), 0);

      // Top products
      const productStats: Record<string, { quantity: number; revenue: number }> = {};
      
      filteredBills.forEach(bill => {
        if (bill.items) {
          bill.items.forEach(item => {
            if (!productStats[item.productName]) {
              productStats[item.productName] = { quantity: 0, revenue: 0 };
            }
            productStats[item.productName].quantity += item.quantity;
            productStats[item.productName].revenue += item.total;
          });
        }
      });

      const topProducts: TopProduct[] = Object.entries(productStats)
        .map(([name, stats]) => ({
          name,
          quantity: stats.quantity,
          revenue: stats.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Sales by date
      const salesByDateMap: Record<string, { amount: number; count: number }> = {};
      
      filteredBills.forEach(bill => {
        const date = new Date(bill.date).toISOString().split('T')[0];
        if (!salesByDateMap[date]) {
          salesByDateMap[date] = { amount: 0, count: 0 };
        }
        salesByDateMap[date].amount += bill.total || 0;
        salesByDateMap[date].count += 1;
      });

      const salesByDate: SalesData[] = Object.entries(salesByDateMap)
        .map(([date, data]) => ({
          date,
          amount: data.amount,
          count: data.count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setReportsData({
        totalSales,
        totalBills,
        averageBillValue,
        topProducts,
        salesByDate,
        todaySales,
        weekSales,
        monthSales,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reports';
      setError(message);
      console.error('Load reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  return {
    data: reportsData,
    loading,
    error,
    refresh: loadReports,
    dateRange,
    setDateRange,
  };
}
