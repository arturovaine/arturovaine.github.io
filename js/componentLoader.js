export const ComponentLoader = {
  headerComponents: ['backdrop', 'header'],
  criticalComponents: ['hero', 'logo-carousel', 'hero-cards'],
  lazyComponents: [
    'work',
    'metaproject',
    'experience',
    'awards',
    'award-highlights',
    'posts',
    'volunteering',
    'bootstrapping',
    'artworks'
  ],
  footerComponents: ['footer', 'cookie-banner'],
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

      // Recreate Lucide icons after each component is loaded
      if (window.lucide) {
        lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
      }

      // Dispatch componentLoaded event for each component
      window.dispatchEvent(new CustomEvent('componentLoaded', { detail: { name: componentName } }));
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

    this.setupAnchorNavigation();

    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  },

  setupAnchorNavigation() {
    document.addEventListener('click', async (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      e.preventDefault();

      let targetElement = document.getElementById(targetId);

      // If element doesn't exist, check if it's a lazy component
      if (!targetElement && this.lazyComponents.includes(targetId)) {
        const placeholder = document.querySelector(`[data-component="${targetId}"]`);
        if (placeholder && !this.loadedComponents.has(targetId)) {
          const html = await this.loadComponent(targetId);
          placeholder.outerHTML = html;

          if (window.lucide) {
            lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
          }

          window.dispatchEvent(new CustomEvent('componentLoaded', { detail: { name: targetId } }));
        }

        // Small delay to let DOM update
        await new Promise(resolve => setTimeout(resolve, 50));
        targetElement = document.getElementById(targetId);
      }

      if (targetElement) {
        const headerHeight = 64;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerHeight,
          behavior: 'smooth'
        });
        history.pushState(null, '', `#${targetId}`);
      }
    });
  }
};
