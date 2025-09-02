import React, { useEffect, useCallback, useRef } from 'react';

// Web Vitals types
interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
}

type WebVitalsCallback = (metric: WebVitalsMetric) => void;

interface PerformanceMetrics {
  cls?: number;
  fid?: number;
  lcp?: number;
  fcp?: number;
  ttfb?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  firstByte?: number;
  domInteractive?: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({});

  const reportWebVitals = useCallback((callback: WebVitalsCallback) => {
    // Placeholder for web-vitals integration
    console.log('Web Vitals reporting not implemented');
  }, []);

  useEffect(() => {
    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      setMetrics(prev => ({
        ...prev,
        // Core Web Vitals (will be populated by web-vitals library)
        ttfb: navigation.responseStart - navigation.requestStart || 0,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart || 0,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart || 0,
        firstByte: navigation.responseStart - navigation.requestStart || 0,
        domInteractive: navigation.domInteractive - navigation.fetchStart || 0,
      }));
    }
  }, []);

  return { metrics, reportWebVitals };
};

export const useComponentPerformance = (componentName: string) => {
  const renderStartTime = useRef<number>();

  useEffect(() => {
    renderStartTime.current = performance.now();

    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
};
