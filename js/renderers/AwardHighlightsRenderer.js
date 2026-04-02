export const AwardHighlightsRenderer = {
  currentLang: 'en',

  init() {
    const container = document.getElementById('award-highlights-carousel');
    if (!container) return;

    this.currentLang = localStorage.getItem('language') || 'en';
    this.loadAndRender(container);

    window.addEventListener('languageChanged', (event) => {
      this.currentLang = event.detail.language;
      this.loadAndRender(container);
    });
  },

  async loadAndRender(container) {
    try {
      const file = this.currentLang === 'pt' ? './data/award-highlights-pt.json' : './data/award-highlights.json';
      const response = await fetch(file);
      const highlights = await response.json();
      this.render(container, highlights);
    } catch (error) {
      console.error('Failed to load award highlights:', error);
    }
  },

  render(container, highlights) {
    const carousel = container.querySelector('#video-carousel');
    const dots = container.querySelector('#carousel-dots');
    if (!carousel || !dots) return;

    carousel.innerHTML = highlights.map(h => `
      <div class="min-w-full">
        <div class="relative aspect-video">
          <video class="w-full h-full object-contain bg-neutral-950" autoplay muted loop playsinline>
            <source src="${h.video}" type="video/mp4">
          </video>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 via-neutral-950/95 via-neutral-950/70 to-transparent pt-20 pb-6 px-6">
            <div class="flex items-center gap-2 text-xs font-medium text-${h.color}-400 mb-2">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>${h.year}</span>
            </div>
            <h4 class="text-lg font-semibold tracking-tight mb-1 text-white">${h.title}</h4>
            <p class="text-sm text-white">${h.subtitle}</p>
          </div>
        </div>
      </div>
    `).join('');

    dots.innerHTML = highlights.map((_, i) => `
      <button class="btn btn-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to video ${i + 1}"></button>
    `).join('');

    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }
};
