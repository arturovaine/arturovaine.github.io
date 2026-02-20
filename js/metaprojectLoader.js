import { ThemeManager } from './components/ThemeManager.js';

export const MetaprojectLoader = {
  components: [
    'metaproject-header',
    'metaproject-hero',
    'metaproject-architecture',
    'metaproject-timeline',
    'metaproject-techstack',
    'metaproject-cta',
    'metaproject-footer'
  ],

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

  async loadAll() {
    const headerContainer = document.getElementById('metaproject-header');
    const mainContainer = document.getElementById('metaproject-main');
    const footerContainer = document.getElementById('metaproject-footer');

    // Load header
    if (headerContainer) {
      const headerHtml = await this.loadComponent('metaproject-header');
      headerContainer.innerHTML = headerHtml;
    }

    // Load main content components
    if (mainContainer) {
      const mainComponents = [
        'metaproject-hero',
        'metaproject-architecture',
        // 'metaproject-timeline',
        'metaproject-techstack',
        'metaproject-cta'
      ];

      for (const componentName of mainComponents) {
        const html = await this.loadComponent(componentName);
        mainContainer.insertAdjacentHTML('beforeend', html);
      }
    }

    // Load footer
    if (footerContainer) {
      const footerHtml = await this.loadComponent('metaproject-footer');
      footerContainer.innerHTML = footerHtml;
    }

    // Initialize Lucide icons
    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    // Initialize theme manager
    ThemeManager.init();

    // Setup mobile menu
    this.setupMobileMenu();

    window.dispatchEvent(new CustomEvent('metaprojectLoaded'));
  },

  setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        const isOpen = !mobileNav.classList.contains('hidden');
        mobileNav.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', !isOpen);
      });

      // Close menu when clicking a link
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.add('hidden');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MetaprojectLoader.loadAll();
});
