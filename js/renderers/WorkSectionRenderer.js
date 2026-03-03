export const WorkSectionRenderer = {
  translations: null,
  currentLang: 'en',
  initialized: false,

  async init() {
    // Only load translations and set up listener once
    if (!this.initialized) {
      this.initialized = true;
      this.currentLang = localStorage.getItem('language') || 'en';

      try {
        const response = await fetch('./data/translations.json');
        this.translations = await response.json();

        // Listen for language changes
        window.addEventListener('languageChanged', (event) => {
          this.currentLang = event.detail.language;
          this.render();
        });
      } catch (error) {
        console.error('Failed to load work section translations:', error);
        return;
      }
    }

    // Render every time init is called
    this.render();
  },

  render() {
    if (!this.translations) return;

    const t = this.translations[this.currentLang].projects;

    // Update section heading
    const heading = document.querySelector('#work h2');
    if (heading) {
      heading.textContent = this.translations[this.currentLang].nav.portfolio;
    }

    const description = document.querySelector('#work p.text-neutral-400');
    if (description) {
      description.textContent = t.heading;
    }

    // Update filter buttons
    const filterButtons = document.querySelectorAll('#work button[data-filter]');
    filterButtons.forEach(button => {
      const filter = button.dataset.filter;
      switch(filter) {
        case 'all':
          button.textContent = t.filters.all;
          break;
        case 'design':
          button.textContent = t.filters.design;
          break;
        case 'engineering':
          button.textContent = t.filters.engineering;
          break;
        case 'open-source':
          button.textContent = t.filters.openSource;
          break;
        case 'experiment':
          button.textContent = t.filters.experiments;
          break;
      }
    });
  }
};
