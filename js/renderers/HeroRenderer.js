export const HeroRenderer = {
  translations: null,
  currentLang: 'en',

  async init() {
    await this.loadTranslations();
    this.currentLang = localStorage.getItem('language') || 'en';
    this.render(this.currentLang);
    this.setupLanguageListener();
  },

  async loadTranslations() {
    try {
      const response = await fetch('./data/translations.json');
      this.translations = await response.json();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  },

  setupLanguageListener() {
    window.addEventListener('languageChanged', (event) => {
      this.currentLang = event.detail.language;
      this.render(this.currentLang, event.detail.animate);
    });
  },

  render(lang, animate = false) {
    if (!this.translations) return;

    const t = this.translations[lang].hero;

    // Update badge
    const badge = document.querySelector('.badge-status span:last-child');
    if (badge) {
      const yearSpan = badge.querySelector('#hero-year');
      const year = yearSpan ? yearSpan.textContent : '';
      badge.innerHTML = `${t.badge}${year ? `<span id="hero-year">${year}</span>` : ''}`;
    }

    // Update paragraphs
    const paragraphs = document.querySelectorAll('.hero-paragraph');
    if (paragraphs[0]) paragraphs[0].innerHTML = t.paragraph1;
    if (paragraphs[1]) paragraphs[1].innerHTML = t.paragraph2;
    if (paragraphs[2]) paragraphs[2].innerHTML = t.paragraph3;

    // Update stats
    const statsLabels = document.querySelectorAll('.stat-label');
    if (statsLabels[0]) statsLabels[0].textContent = t.stats.experience;
    if (statsLabels[1]) statsLabels[1].textContent = t.stats.companies;
    if (statsLabels[2]) statsLabels[2].textContent = t.stats.acknowledgements;

    // Update core stack title
    const coreStackTitle = document.querySelector('.core-stack-title');
    if (coreStackTitle) coreStackTitle.textContent = t.coreStack;

    // Update pixel art caption
    const pixelArtTitle = document.querySelector('.pixel-art-title');
    const pixelArtDesc = document.querySelector('.pixel-art-description');
    if (pixelArtTitle) pixelArtTitle.textContent = t.pixelArt.title;
    if (pixelArtDesc) pixelArtDesc.textContent = t.pixelArt.description;

    // Add animation if needed
    if (animate) {
      document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
