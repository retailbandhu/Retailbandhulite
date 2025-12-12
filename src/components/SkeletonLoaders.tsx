import React from 'react';
import { Card } from './ui/card';

// Base Skeleton Component
export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-4">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-3 bg-white/20 backdrop-blur">
              <Skeleton className="h-8 w-16 mb-2 bg-white/30" />
              <Skeleton className="h-3 w-20 bg-white/20" />
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-4">
            <Skeleton className="w-10 h-10 rounded-full mb-2 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </Card>
        ))}
      </div>

      {/* Content Cards */}
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="p-3">
          <Skeleton className="aspect-square rounded-lg mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: items }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-gray-100">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="h-5 w-32 mb-4" />
      <div className="h-64 flex items-end gap-2">
        {[60, 80, 40, 90, 70, 50, 85].map((height, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${height}%` }} />
        ))}
      </div>
    </Card>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="p-4">
          <Skeleton className="w-10 h-10 rounded-lg mb-3" />
          <Skeleton className="h-7 w-20 mb-2" />
          <Skeleton className="h-3 w-16" />
        </Card>
      ))}
    </div>
  );
}

// Bill/Receipt Skeleton
export function BillSkeleton() {
  return (
    <Card className="p-6 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="text-center">
        <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>

      {/* Items */}
      <div className="space-y-3 py-4 border-y">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-7 w-24" />
      </div>

      {/* Button */}
      <Skeleton className="h-12 w-full rounded-lg" />
    </Card>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Avatar & Name */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="w-6 h-6" />
          </Card>
        ))}
      </div>
    </div>
  );
}

// Notification Skeleton
export function NotificationSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[1, 2, 3, 4, 5].map(i => (
        <Card key={i} className="p-4">
          <div className="flex gap-3">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Message/Chat Skeleton
export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <Card className="p-3 max-w-[70%]">
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-3 w-32" />
          </Card>
        </div>
      ))}
    </div>
  );
}
