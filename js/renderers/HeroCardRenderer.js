export const HeroCardRenderer = {
  async init() {
    const container = document.getElementById('hero-cards-grid');
    if (!container) return;

    try {
      const response = await fetch('./data/hero-cards.json');
      const cards = await response.json();
      this.render(container, cards);
    } catch (error) {
      console.error('Failed to load hero cards:', error);
    }
  },

  renderCard(card) {
    return `
      <a href="${card.href}" class="card group">
        <div class="card-image aspect-[3/4]">
          <img loading="lazy" src="${card.image}" alt="${card.alt}">
        </div>
        <div class="card-overlay">
          <h3 class="card-title">${card.title}</h3>
          <p class="card-description">${card.description}</p>
        </div>
      </a>
    `;
  },

  render(container, cards) {
    container.innerHTML = cards.map(card => this.renderCard(card)).join('');
  }
};
