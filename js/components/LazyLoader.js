// Lazy Loader - Intersection Observer for components
// Only loads components when they become visible in viewport

export const LazyLoader = {
  observer: null,
  loadedComponents: new Set(),

  init() {
    // Create Intersection Observer with rootMargin for early loading
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadComponent(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Load 50px before entering viewport
        threshold: 0.01
      }
    );

    // Observe all lazy-loadable sections
    document.querySelectorAll('[data-lazy-component]').forEach((section) => {
      this.observer.observe(section);
    });
  },

  async loadComponent(element) {
    const componentName = element.getAttribute('data-lazy-component');

    // Skip if already loaded
    if (this.loadedComponents.has(componentName)) {
      return;
    }

    // Mark as loaded
    this.loadedComponents.add(componentName);

    try {
      // Remove skeleton loader
      element.classList.remove('component-loading');

      // Component already loaded by ComponentLoader
      // This just removes the loading state
      console.log(`✓ Lazy loaded: ${componentName}`);

      // Stop observing this element
      this.observer.unobserve(element);
    } catch (error) {
      console.error(`Error lazy loading ${componentName}:`, error);
    }
  },

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
