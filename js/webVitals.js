/**
 * Web Vitals tracking - reports LCP, CLS, INP to analytics
 */
export function initWebVitals() {
  if (!('PerformanceObserver' in window)) return;

  // Largest Contentful Paint
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.debug('[WebVitals] LCP:', Math.round(lastEntry.startTime), 'ms');
      reportMetric('LCP', lastEntry.startTime);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) { /* unsupported */ }

  // Cumulative Layout Shift
  try {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.debug('[WebVitals] CLS:', clsValue.toFixed(3));
      reportMetric('CLS', clsValue);
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) { /* unsupported */ }

  // Interaction to Next Paint
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.debug('[WebVitals] INP:', Math.round(lastEntry.duration), 'ms');
      reportMetric('INP', lastEntry.duration);
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch (e) { /* unsupported */ }
}

function reportMetric(name, value) {
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true
    });
  }
}
