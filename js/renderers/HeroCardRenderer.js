export const HeroCardRenderer = {
  translations: null,
  currentLang: 'en',
  cards: null,

  async init() {
    const container = document.getElementById('hero-cards-grid');
    if (!container) return;

    this.currentLang = localStorage.getItem('language') || 'en';

    try {
      const [translationsRes, cardsRes] = await Promise.all([
        fetch('./data/translations.json'),
        fetch('./data/hero-cards.json')
      ]);
      this.translations = await translationsRes.json();
      this.cards = await cardsRes.json();
      this.render(container);

      // Listen for language changes
      window.addEventListener('languageChanged', (event) => {
        this.currentLang = event.detail.language;
        this.render(container);
      });
    } catch (error) {
      console.error('Failed to load hero cards:', error);
    }
  },

  renderCard(card) {
    const t = this.translations[this.currentLang].heroCards[card.id];
    return `
      <a href="${card.href}" class="card group">
        <div class="card-image aspect-[3/4]">
          <img loading="lazy" src="${card.image}" alt="${t.title}">
        </div>
        <div class="card-overlay">
          <h3 class="card-title">${t.label}</h3>
          <p class="card-description">${t.description}</p>
        </div>
      </a>
    `;
  },

  render(container) {
    if (!this.cards || !this.translations) return;
    container.innerHTML = this.cards.map(card => this.renderCard(card)).join('');
  }
};
