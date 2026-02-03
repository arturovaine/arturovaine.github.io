export const ComponentLoader = {
  headerComponents: ['backdrop', 'header'],
  mainComponents: [
    'hero',
    'hero-cards',
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

  async loadComponent(name) {
    try {
      const response = await fetch(`./components/${name}.html`);
      if (!response.ok) throw new Error(`Failed to load ${name}: ${response.status}`);
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

  async loadAll() {
    await this.loadComponentsInto(this.headerComponents, 'header-content');
    await this.loadComponentsInto(this.mainComponents, 'main-content');
    await this.loadComponentsInto(this.footerComponents, 'footer-content');

    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  }
};
