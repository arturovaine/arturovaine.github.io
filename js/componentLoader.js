export const ComponentLoader = {
  headerComponents: ['backdrop', 'header'],
  criticalComponents: ['hero', 'hero-cards'],
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

    for (const componentName of this.lazyComponents) {
      container.insertAdjacentHTML('beforeend', this.createPlaceholder(componentName));
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const placeholder = entry.target;
          const componentName = placeholder.dataset.component;

          if (!this.loadedComponents.has(componentName)) {
            const html = await this.loadComponent(componentName);
            placeholder.outerHTML = html;

            if (window.lucide) {
              lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
            }

            window.dispatchEvent(new CustomEvent('componentLoaded', { detail: { name: componentName } }));
          }

          observer.unobserve(placeholder);
        }
      });
    }, { rootMargin: '300px' });

    document.querySelectorAll('.lazy-component').forEach(el => observer.observe(el));
  },

  async loadAll() {
    await this.loadComponentsInto(this.headerComponents, 'header-content');
    await this.loadComponentsInto(this.criticalComponents, 'main-content');
    this.setupLazyLoading('main-content');
    await this.loadComponentsInto(this.footerComponents, 'footer-content');

    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  }
};
