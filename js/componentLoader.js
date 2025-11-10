// Component Loader
// Loads HTML components dynamically into the page

export const ComponentLoader = {
  components: [
    'hero',
    'hero-cards',
    'work',
    'experience',
    'posts',
    'volunteering',
    'bootstrapping',
    'artworks'
  ],

  async loadComponent(name) {
    try {
      const response = await fetch(`./components/${name}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load ${name}: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error loading component ${name}:`, error);
      return `<!-- Error loading ${name} component -->`;
    }
  },

  async loadAll() {
    const container = document.getElementById('main-content');
    if (!container) {
      console.error('Main content container not found');
      return;
    }

    // Load all components in order
    for (const componentName of this.components) {
      const html = await this.loadComponent(componentName);
      container.insertAdjacentHTML('beforeend', html);
    }

    // Re-initialize Lucide icons after components are loaded
    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    // Dispatch event to notify components are loaded
    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  }
};
