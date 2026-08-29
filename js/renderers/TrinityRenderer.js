export const TrinityRenderer = {
  loaded: false,
  currentLang: 'en',

  init() {
    const container = document.getElementById('aeronautical-trinity-content');
    if (!container) return;

    this.currentLang = localStorage.getItem('language') || 'en';

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loaded) {
        this.loaded = true;
        this.loadAndRender(container);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    observer.observe(container);

    // Listen for language changes
    window.addEventListener('languageChanged', (event) => {
      this.currentLang = event.detail.language;
      if (this.loaded) {
        this.loadAndRender(container);
      }
    });
  },

  async loadAndRender(container) {
    try {
      const file = this.currentLang === 'pt'
        ? './data/aeronautical-trinity-pt.json'
        : './data/aeronautical-trinity.json';
      const response = await fetch(file);
      const data = await response.json();
      this.render(container, data);
    } catch (error) {
      console.error('Failed to load Ozires Silva section:', error);
      // Fallback to English if PT file doesn't exist
      if (this.currentLang === 'pt') {
        const response = await fetch('./data/aeronautical-trinity.json');
        this.render(container, await response.json());
      }
    }
  },

  render(container, data) {
    const paragraphs = data.panel.paragraphs.map(p => `<p>${p}</p>`).join('');

    container.innerHTML = `
      <div class="flex items-center gap-2 mb-3">
        <i data-lucide="plane" class="w-5 h-5 text-emerald-400"></i>
        <h3 class="text-xl font-semibold tracking-tight">${data.title}</h3>
      </div>
      <p class="max-w-3xl text-neutral-400 mb-10 leading-relaxed">${data.intro}</p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:items-stretch">
        <figure class="group relative overflow-hidden border-2 border-emerald-400/70 ring-2 ring-emerald-400/25 shadow-2xl shadow-emerald-500/25 bg-neutral-900 min-h-[460px] lg:min-h-0" style="border-radius: 15px;">
          <img src="${data.hero.image}" alt="${data.hero.alt}" loading="lazy" class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105">
          <figcaption class="absolute inset-x-0 bottom-0 z-10 p-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
            <p class="text-xs uppercase tracking-widest text-emerald-300">${data.hero.role}</p>
            <h4 class="mt-1 text-2xl font-semibold tracking-tight text-white" style="color: #ffffff !important;">${data.hero.name}</h4>
          </figcaption>
        </figure>

        <div class="border border-white/10 bg-neutral-900/60 p-6 sm:p-8 leading-relaxed flex flex-col justify-center" style="border-radius: 15px;">
          <h4 class="text-lg font-semibold tracking-tight mb-3">${data.panel.heading}</h4>
          <div class="space-y-3 text-sm text-neutral-400">
            ${paragraphs}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) {
      requestIdleCallback(() => window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } }));
    }
  }
};
