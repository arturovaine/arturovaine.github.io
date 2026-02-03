export const AwardRenderer = {
  loaded: false,

  init() {
    const container = document.getElementById('awards-grid');
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loaded) {
        this.loaded = true;
        this.loadAndRender(container);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    observer.observe(container);
  },

  async loadAndRender(container) {
    try {
      const response = await fetch('./data/awards.json');
      const awards = await response.json();
      this.render(container, awards);
    } catch (error) {
      console.error('Failed to load awards:', error);
    }
  },

  renderCard(award) {
    const logoSize = award.logoSize === 'large' ? 'w-24 h-24' : 'w-20 h-20';
    const minHeight = award.logoSize === 'large' ? '336px' : '280px';
    const logoBgStyle = award.logoBg ? `background-color: ${award.logoBg};` : '';
    const logoRounded = award.logoBg ? 'rounded-lg' : '';

    const externalLink = award.url ? `
      <a href="${award.url}" target="_blank" rel="noopener"
         class="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-white/[0.06]"
         aria-label="View award details">
        <i data-lucide="external-link" class="w-4 h-4"></i>
      </a>
    ` : '';

    return `
      <article class="group border border-white/10 bg-neutral-900/60 hover:border-white/20 transition-colors flex flex-col p-6" style="border-radius: 15px; min-height: ${minHeight};">
        <div class="flex items-center justify-between mb-4">
          <div class="text-xs font-medium text-neutral-400">${award.year}</div>
          ${externalLink}
        </div>
        <div class="flex-1 flex flex-col items-center justify-center text-center mb-4">
          <div class="${logoSize} mb-4 flex items-center justify-center ${logoRounded}" style="${logoBgStyle}">
            <img src="${award.logo}" alt="${award.logoAlt}" class="max-w-full max-h-full object-contain">
          </div>
          <h3 class="text-sm font-semibold tracking-tight mb-2">${award.title}</h3>
          <p class="text-xs text-neutral-400">${award.description}</p>
        </div>
      </article>
    `;
  },

  render(container, awards) {
    container.innerHTML = awards.map(award => this.renderCard(award)).join('');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};
