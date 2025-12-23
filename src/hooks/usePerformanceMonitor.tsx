import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

const performanceLog: PerformanceMetrics[] = [];

export function usePerformanceMonitor(componentName: string, enabled = false) {
  const renderStart = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStart.current;
    renderCount.current += 1;

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    };

    performanceLog.push(metrics);

    // Log slow renders (>16ms = not 60fps)
    if (renderTime > 16) {
      console.warn(
        `[Performance] Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
      );
    }

    // Keep log size manageable
    if (performanceLog.length > 100) {
      performanceLog.shift();
    }
  });

  // Update render start time for next render
  renderStart.current = performance.now();

  return {
    getRenderCount: () => renderCount.current,
    getAverageRenderTime: () => {
      const componentMetrics = performanceLog.filter(m => m.componentName === componentName);
      if (componentMetrics.length === 0) return 0;
      const sum = componentMetrics.reduce((acc, m) => acc + m.renderTime, 0);
      return sum / componentMetrics.length;
    },
    getAllMetrics: () => performanceLog
  };
}

// Helper to get overall app performance
export function getAppPerformanceMetrics() {
  if (performanceLog.length === 0) {
    return {
      averageRenderTime: 0,
      slowRenders: 0,
      totalRenders: 0
    };
  }

  const avgRenderTime = performanceLog.reduce((acc, m) => acc + m.renderTime, 0) / performanceLog.length;
  const slowRenders = performanceLog.filter(m => m.renderTime > 16).length;

  return {
    averageRenderTime: avgRenderTime,
    slowRenders,
    totalRenders: performanceLog.length,
    byComponent: performanceLog.reduce((acc, m) => {
      if (!acc[m.componentName]) {
        acc[m.componentName] = { count: 0, totalTime: 0 };
      }
      acc[m.componentName].count += 1;
      acc[m.componentName].totalTime += m.renderTime;
      return acc;
    }, {} as Record<string, { count: number; totalTime: number }>)
  };
}
