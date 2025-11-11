/**
 * Performance monitoring utilities
 * Track Core Web Vitals and custom metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.initWebVitals();
  }

  initWebVitals() {
    // Track LCP (Largest Contentful Paint)
    this.observeLCP();
    
    // Track FID/INP (First Input Delay / Interaction to Next Paint)
    this.observeINP();
    
    // Track CLS (Cumulative Layout Shift)
    this.observeCLS();
  }

  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = Math.round(lastEntry.startTime);
      this.reportMetric('LCP', this.metrics.lcp);
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Browser doesn't support LCP
    }
  }

  observeINP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.processingStart && entry.startTime) {
          const inp = Math.round(entry.processingStart - entry.startTime);
          this.metrics.inp = Math.max(this.metrics.inp || 0, inp);
          this.reportMetric('INP', inp);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['event'] });
    } catch (e) {
      // Fallback for older browsers
    }
  }

  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = Math.round(clsValue * 1000) / 1000;
          this.reportMetric('CLS', this.metrics.cls);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Browser doesn't support CLS
    }
  }

  reportMetric(name, value) {
    // Only log in development
    if (import.meta.env?.DEV) {
      console.log(`📊 ${name}: ${value}${name === 'CLS' ? '' : 'ms'}`);
    }
    
    // In production, you could send to analytics
    // analytics.track('web-vital', { metric: name, value });
  }

  // Track custom component loading times
  markComponentStart(componentName) {
    performance.mark(`${componentName}-start`);
  }

  markComponentEnd(componentName) {
    performance.mark(`${componentName}-end`);
    try {
      performance.measure(
        `${componentName}-duration`,
        `${componentName}-start`,
        `${componentName}-end`
      );
      
      const measure = performance.getEntriesByName(`${componentName}-duration`)[0];
      const duration = Math.round(measure.duration);
      
      if (import.meta.env?.DEV) {
        console.log(`⚡ ${componentName} loaded in ${duration}ms`);
      }
    } catch (e) {
      // Measurement failed
    }
  }

  getMetrics() {
    return this.metrics;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;