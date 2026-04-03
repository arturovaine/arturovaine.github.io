/**
 * Unit tests for Web Vitals tracking
 */
import { initWebVitals } from '../../js/webVitals.js';

describe('Web Vitals', () => {
  let observers = [];
  let originalPerformanceObserver;

  beforeEach(() => {
    observers = [];
    jest.clearAllMocks();

    originalPerformanceObserver = global.PerformanceObserver;
    global.PerformanceObserver = class MockPerformanceObserver {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {}
    };

    window.gtag = jest.fn();
  });

  afterEach(() => {
    global.PerformanceObserver = originalPerformanceObserver;
    delete window.gtag;
  });

  test('should create 3 PerformanceObservers (LCP, CLS, INP)', () => {
    initWebVitals();
    expect(observers).toHaveLength(3);
  });

  test('should report LCP metric to gtag', () => {
    initWebVitals();
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
    initWebVitals();
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
    initWebVitals();
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
    initWebVitals();
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
    initWebVitals();
    const lcpObserver = observers[0];
    // Should not throw
    expect(() => {
      lcpObserver.callback({
        getEntries: () => [{ startTime: 1500 }]
      });
    }).not.toThrow();
  });

  test('should not initialize if PerformanceObserver is not supported', () => {
    delete global.PerformanceObserver;
    expect(() => initWebVitals()).not.toThrow();
  });

  test('should accumulate CLS values across multiple entries', () => {
    initWebVitals();
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
