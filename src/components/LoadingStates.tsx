/**
 * Loading State Components
 * Reusable loading skeletons and spinners
 */

import { Loader2 } from 'lucide-react';
import React from 'react';

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
}

export function FullPageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
      <div className="bg-gray-200 h-32 rounded-lg mb-3" />
      <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
      <div className="bg-gray-200 h-4 rounded w-1/2" />
    </div>
  );
}

export function ProductListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-gray-200 w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <div className="bg-gray-200 h-4 rounded w-1/2 mb-2" />
          <div className="bg-gray-200 h-6 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <DashboardCardSkeleton key={i} />
        ))}
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
        <div className="bg-gray-200 h-6 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-gray-200 w-10 h-10 rounded" />
              <div className="flex-1">
                <div className="bg-gray-200 h-4 rounded w-2/3 mb-2" />
                <div className="bg-gray-200 h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-100 p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-4 rounded" />
            ))}
          </div>
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="bg-gray-200 h-4 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorMessage({
  message,
  retry,
  onDismiss,
}: {
  message: string;
  retry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start gap-3">
        <div className="text-red-600 flex-shrink-0">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-red-800 font-medium mb-1">Error</p>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
      </div>
      {(retry || onDismiss) && (
        <div className="flex gap-2 mt-3">
          {retry && (
            <button
              onClick={retry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg text-sm hover:bg-red-50 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon?: React.ComponentType<{ className?: string }> | string;
  title: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      {icon && (
        typeof icon === 'string' ? (
          <div className="text-6xl mb-4" role="img" aria-label="icon">
            {icon}
          </div>
        ) : (
          React.createElement(icon, { className: "w-16 h-16 text-gray-400 mb-4" })
        )
      )}
      <h3 className="text-gray-900 font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600 text-sm mb-4 max-w-md">{description}</p>}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}