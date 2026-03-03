export const FooterRenderer = {
  currentLang: 'en',
  translations: null,

  init() {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.loadAndRender();

    // Listen for language changes
    window.addEventListener('languageChanged', (event) => {
      this.currentLang = event.detail.language;
      this.render();
    });
  },

  async loadAndRender() {
    try {
      if (!this.translations) {
        const response = await fetch('./data/translations.json');
        this.translations = await response.json();
      }
      this.render();
    } catch (error) {
      console.error('Failed to load footer translations:', error);
    }
  },

  render() {
    if (!this.translations) return;

    const t = this.translations[this.currentLang].footer;

    const copyrightEl = document.getElementById('footer-copyright');
    const portfolioEl = document.getElementById('footer-portfolio');
    const awardsEl = document.getElementById('footer-awards');
    const experienceEl = document.getElementById('footer-experience');
    const artworksEl = document.getElementById('footer-artworks');
    const githubEl = document.getElementById('footer-github');

    if (copyrightEl) copyrightEl.textContent = t.copyright;
    if (portfolioEl) portfolioEl.textContent = t.portfolio;
    if (awardsEl) awardsEl.textContent = t.awards;
    if (experienceEl) experienceEl.textContent = t.experience;
    if (artworksEl) artworksEl.textContent = t.artworks;
    if (githubEl) githubEl.textContent = t.github;
  }
};
