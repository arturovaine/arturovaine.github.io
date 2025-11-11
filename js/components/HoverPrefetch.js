// Hover Prefetch - McMaster-Carr inspired
// Prefetches HTML content when user hovers over navigation links

export const HoverPrefetch = {
  prefetchedComponents: new Map(),
  componentMapping: {
    '#work': 'work',
    '#experience': 'experience',
    '#awards': 'hero-cards',
    '#posts': 'posts',
    '#volunteering': 'volunteering',
    '#artworks': 'artworks',
    '#bootstrapping': 'bootstrapping'
  },

  init() {
    // Add hover listeners to all navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const componentName = this.componentMapping[href];

      if (componentName) {
        link.addEventListener('mouseenter', () => this.prefetch(componentName), { passive: true });
        link.addEventListener('touchstart', () => this.prefetch(componentName), { passive: true });
      }
    });
  },

  async prefetch(componentName) {
    // Skip if already prefetched
    if (this.prefetchedComponents.has(componentName)) {
      return;
    }

    try {
      const response = await fetch(`./components/${componentName}.html`);
      if (response.ok) {
        const html = await response.text();
        this.prefetchedComponents.set(componentName, html);
        console.log(`✓ Prefetched: ${componentName}`);
      }
    } catch (error) {
      console.warn(`Prefetch failed for ${componentName}:`, error);
    }
  },

  // Get prefetched content if available
  get(componentName) {
    return this.prefetchedComponents.get(componentName);
  }
};
