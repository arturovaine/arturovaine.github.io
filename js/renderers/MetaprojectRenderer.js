export const MetaprojectRenderer = {
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
        console.error('Failed to load metaproject translations:', error);
        return;
      }
    }

    // Render every time init is called
    this.render();
  },

  render() {
    if (!this.translations) return;

    const t = this.translations[this.currentLang].metaproject;

    // Update title
    const title = document.querySelector('#metaproject h2');
    if (title) {
      title.textContent = t.title;
    }

    // Update subtitle
    const subtitle = document.querySelector('#metaproject h2 + p');
    if (subtitle) {
      subtitle.textContent = t.subtitle;
    }

    // Update section titles and descriptions
    const sections = document.querySelectorAll('#metaproject .space-y-6 > div');

    if (sections.length >= 4) {
      // Component Architecture
      const archTitle = sections[0].querySelector('h3');
      const archDesc = sections[0].querySelector('p');
      if (archTitle && archDesc) {
        archTitle.innerHTML = `<i data-lucide="boxes" class="w-5 h-5 text-neutral-400"></i> ${t.sections.architecture.title}`;
        archDesc.textContent = t.sections.architecture.description;
      }

      // Data-Driven Rendering
      const dataTitle = sections[1].querySelector('h3');
      const dataDesc = sections[1].querySelector('p');
      if (dataTitle && dataDesc) {
        dataTitle.innerHTML = `<i data-lucide="database" class="w-5 h-5 text-neutral-400"></i> ${t.sections.dataRendering.title}`;
        dataDesc.textContent = t.sections.dataRendering.description;
      }

      // Performance First
      const perfTitle = sections[2].querySelector('h3');
      const perfDesc = sections[2].querySelector('p');
      if (perfTitle && perfDesc) {
        perfTitle.innerHTML = `<i data-lucide="zap" class="w-5 h-5 text-neutral-400"></i> ${t.sections.performance.title}`;
        perfDesc.textContent = t.sections.performance.description;
      }

      // Dark/Light Theme
      const themeTitle = sections[3].querySelector('h3');
      const themeDesc = sections[3].querySelector('p');
      if (themeTitle && themeDesc) {
        themeTitle.innerHTML = `<i data-lucide="moon" class="w-5 h-5 text-neutral-400"></i> ${t.sections.theme.title}`;
        themeDesc.textContent = t.sections.theme.description;
      }

      // Re-initialize lucide icons
      if (window.lucide) {
        lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
      }
    }

    // Update button text
    const learnMoreBtn = document.querySelector('.metaproject-learn-more span');
    if (learnMoreBtn) {
      learnMoreBtn.textContent = t.learnMore;
    }

    const viewSourceBtn = document.querySelector('#metaproject a[href*="github"] span');
    if (viewSourceBtn) {
      viewSourceBtn.textContent = t.viewSource;
    }
  }
};
