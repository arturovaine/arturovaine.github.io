export const VolunteeringRenderer = {
  loaded: false,

  init() {
    const container = document.getElementById('volunteering-list');
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
      const response = await fetch('./data/volunteering.json');
      const data = await response.json();
      this.render(container, data);
      if (window.lucide) lucide.createIcons();
    } catch (error) {
      console.error('Failed to load volunteering:', error);
    }
  },

  renderExperiences(experiences, color) {
    return experiences.map(exp => `
      <li class="flex items-start gap-2 text-sm text-neutral-400">
        <i data-lucide="check" class="w-4 h-4 mt-0.5 text-${color}-400"></i>
        <span>${exp}</span>
      </li>
    `).join('');
  },

  renderMediaCard(media) {
    const bgStyle = media.bgColor ? `background-color: ${media.bgColor};` : '';
    const sourceHtml = media.source ? `
      <div class="flex items-center gap-2 text-xs text-neutral-500">
        <i data-lucide="${media.source.icon}" class="w-3.5 h-3.5"></i>
        <a href="${media.source.url}" target="_blank" rel="noopener" class="hover:text-neutral-300 transition-colors">${media.source.text}</a>
      </div>
    ` : '';
    const linkHtml = media.link ? `
      <a href="${media.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
        <span>${media.linkText}</span>
        <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
      </a>
    ` : '';

    return `
      <div class="border border-white/10 bg-neutral-900/60 overflow-hidden" style="border-radius: 15px;">
        <div class="${media.type === 'map' ? 'h-56' : 'aspect-[4/3]'} ${media.type === 'map' ? 'flex items-center justify-center' : 'bg-neutral-950'}" style="${bgStyle}">
          <img loading="lazy" src="${media.image}" alt="${media.alt}" class="${media.type === 'map' ? 'w-full h-full object-contain' : 'h-full w-full object-cover'}">
        </div>
        <div class="p-4">
          <div class="${media.link ? 'flex items-center justify-between' : 'flex flex-col gap-2'}">
            <div class="flex items-center gap-2 text-sm text-neutral-300">
              <i data-lucide="${media.captionIcon}" class="w-4 h-4"></i>
              <span>${media.caption}</span>
            </div>
            ${linkHtml}
            ${sourceHtml}
          </div>
        </div>
      </div>
    `;
  },

  renderItem(item, isLast) {
    const marginClass = isLast ? '' : 'mb-10';
    const mainMedia = item.media.find(m => m.type === 'map') || null;
    const sideMedia = item.media.filter(m => m.type !== 'map' || item.media.indexOf(m) > 0);

    return `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 ${marginClass} items-start">
        <div class="lg:col-span-7 space-y-6">
          <div class="border border-white/10 bg-neutral-900/60 p-6" style="border-radius: 15px;">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-4">
                <a href="${item.url}" target="_blank" rel="noopener" class="p-3 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center hover:bg-${item.color}-500/15 transition-colors" aria-label="Visit ${item.title} website">
                  <img loading="lazy" src="${item.icon}" alt="${item.title} icon" class="w-10 h-10 object-contain">
                </a>
                <div>
                  <h3 class="text-xl font-semibold tracking-tight">${item.title}</h3>
                  <p class="text-sm text-neutral-400">${item.period}</p>
                </div>
              </div>
              <a href="${item.url}" target="_blank" rel="noopener" class="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-white/[0.06]" aria-label="Visit website">
                <i data-lucide="external-link" class="w-4 h-4"></i>
              </a>
            </div>
            <p class="text-neutral-300 leading-relaxed mb-4">${item.description}</p>

            <div class="mt-6">
              <h4 class="text-sm font-medium text-neutral-300 mb-3">${item.experiences.length > 1 ? 'Main experiences as volunteer' : 'Contributions'}</h4>
              <ul class="space-y-2">
                ${this.renderExperiences(item.experiences, item.color)}
              </ul>
            </div>

            <div class="mt-4 p-3 bg-white/[0.02] border border-white/5" style="border-radius: 15px;">
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 text-sm text-neutral-300">
                  <i data-lucide="${item.stats.icon}" class="w-4 h-4 text-${item.color}-400"></i>
                  <span class="font-medium">${item.stats.text}</span>
                </div>
                <div class="text-xs text-neutral-500 ml-6">${item.stats.note}</div>
              </div>
            </div>
          </div>

          ${mainMedia ? this.renderMediaCard(mainMedia) : ''}
        </div>

        <aside class="lg:col-span-5">
          <div class="space-y-4">
            ${sideMedia.map(m => this.renderMediaCard(m)).join('')}
          </div>
        </aside>
      </div>
    `;
  },

  render(container, data) {
    container.innerHTML = data.map((item, index) => this.renderItem(item, index === data.length - 1)).join('');
  }
};
