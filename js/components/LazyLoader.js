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
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    document.querySelectorAll('[data-lazy-component]').forEach((section) => {
      this.observer.observe(section);
    });
  },

  async loadComponent(element) {
    const componentName = element.getAttribute('data-lazy-component');

    if (this.loadedComponents.has(componentName)) {
      return;
    }

    this.loadedComponents.add(componentName);

    try {
      element.classList.remove('component-loading');
      console.log(`✓ Lazy loaded: ${componentName}`);
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
