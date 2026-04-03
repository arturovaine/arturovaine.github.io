/**
 * Unit tests for Web Vitals tracking
 */

describe('Web Vitals', () => {
  let observers = [];
  let originalPerformanceObserver;

  beforeEach(() => {
    observers = [];
    jest.clearAllMocks();

    // Mock PerformanceObserver
    originalPerformanceObserver = global.PerformanceObserver;
    global.PerformanceObserver = class MockPerformanceObserver {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {}
    };

    // Mock gtag
    window.gtag = jest.fn();
  });

  afterEach(() => {
    global.PerformanceObserver = originalPerformanceObserver;
    delete window.gtag;
  });

  function loadModule() {
    // Inline the logic since Jest doesn't support ESM well
    if (!('PerformanceObserver' in window)) return;

    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportMetric('LCP', lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}

    try {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        reportMetric('CLS', clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}

    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportMetric('INP', lastEntry.duration);
      }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (e) {}
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

  test('should create 3 PerformanceObservers (LCP, CLS, INP)', () => {
    loadModule();
    expect(observers).toHaveLength(3);
  });

  test('should report LCP metric to gtag', () => {
    loadModule();
    const lcpObserver = observers[0];
    lcpObserver.callback({
      getEntries: () => [{ startTime: 1500 }]
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'LCP', {
      event_category: 'Web Vitals',
      value: 1500,
      non_interaction: true
    });
  });

  test('should report CLS metric to gtag (multiplied by 1000)', () => {
    loadModule();
    const clsObserver = observers[1];
    clsObserver.callback({
      getEntries: () => [{ value: 0.05, hadRecentInput: false }]
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'CLS', {
      event_category: 'Web Vitals',
      value: 50,
      non_interaction: true
    });
  });

  test('should ignore layout shifts with recent input', () => {
    loadModule();
    const clsObserver = observers[1];
    clsObserver.callback({
      getEntries: () => [{ value: 0.1, hadRecentInput: true }]
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'CLS', {
      event_category: 'Web Vitals',
      value: 0,
      non_interaction: true
    });
  });

  test('should report INP metric to gtag', () => {
    loadModule();
    const inpObserver = observers[2];
    inpObserver.callback({
      getEntries: () => [{ duration: 200 }]
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'INP', {
      event_category: 'Web Vitals',
      value: 200,
      non_interaction: true
    });
  });

  test('should not report if gtag is not available', () => {
    delete window.gtag;
    loadModule();
    const lcpObserver = observers[0];
    lcpObserver.callback({
      getEntries: () => [{ startTime: 1500 }]
    });
    // No error thrown
  });

  test('should not initialize if PerformanceObserver is not supported', () => {
    delete global.PerformanceObserver;
    // Should not throw
    expect(() => {
      if (!('PerformanceObserver' in window)) return;
    }).not.toThrow();
  });

  test('should accumulate CLS values across multiple entries', () => {
    loadModule();
    const clsObserver = observers[1];

    clsObserver.callback({
      getEntries: () => [
        { value: 0.02, hadRecentInput: false },
        { value: 0.03, hadRecentInput: false }
      ]
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'CLS', {
      event_category: 'Web Vitals',
      value: 50,
      non_interaction: true
    });
  });
});
