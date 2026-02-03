export const ComponentLoader = {
  headerComponents: ['backdrop', 'header'],

  // Components that load immediately (above the fold)
  criticalComponents: ['hero', 'hero-cards'],

  // Components that load lazily (below the fold)
  lazyComponents: [
    'work',
    'experience',
    'awards',
    'award-highlights',
    'posts',
    'volunteering',
    'bootstrapping',
    'artworks'
  ],

  footerComponents: ['footer'],

  loadedComponents: new Set(),

  async loadComponent(name) {
    if (this.loadedComponents.has(name)) return '';

    try {
      const response = await fetch(`./components/${name}.html`);
      if (!response.ok) throw new Error(`Failed to load ${name}: ${response.status}`);
      this.loadedComponents.add(name);
      return await response.text();
    } catch (error) {
      console.error(`Error loading component ${name}:`, error);
      return '';
    }
  },

  async loadComponentsInto(componentList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (const componentName of componentList) {
      const html = await this.loadComponent(componentName);
      container.insertAdjacentHTML('beforeend', html);
    }
  },

  createPlaceholder(name) {
    return `<div id="lazy-${name}" class="lazy-component" data-component="${name}" style="min-height: 200px;"></div>`;
  },

  setupLazyLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Insert placeholders for lazy components
    for (const componentName of this.lazyComponents) {
      container.insertAdjacentHTML('beforeend', this.createPlaceholder(componentName));
    }

    // Set up intersection observer for each placeholder
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const placeholder = entry.target;
          const componentName = placeholder.dataset.component;

          if (!this.loadedComponents.has(componentName)) {
            const html = await this.loadComponent(componentName);
            placeholder.outerHTML = html;

            // Reinitialize Lucide icons for the new content
            if (window.lucide) {
              lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
            }

            // Dispatch event for this specific component
            window.dispatchEvent(new CustomEvent('componentLoaded', { detail: { name: componentName } }));
          }

          observer.unobserve(placeholder);
        }
      });
    }, { rootMargin: '300px' });

    // Observe all placeholders
    document.querySelectorAll('.lazy-component').forEach(el => observer.observe(el));
  },

  async loadAll() {
    // Load header immediately
    await this.loadComponentsInto(this.headerComponents, 'header-content');

    // Load critical (above the fold) components immediately
    await this.loadComponentsInto(this.criticalComponents, 'main-content');

    // Set up lazy loading for below-the-fold components
    this.setupLazyLoading('main-content');

    // Load footer immediately
    await this.loadComponentsInto(this.footerComponents, 'footer-content');

    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  }
};
