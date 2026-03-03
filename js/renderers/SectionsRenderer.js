export const SectionsRenderer = {
  translations: null,
  currentLang: 'en',

  async init() {
    this.currentLang = localStorage.getItem('language') || 'en';

    try {
      const response = await fetch('./data/translations.json');
      this.translations = await response.json();
      this.render();

      // Listen for language changes
      window.addEventListener('languageChanged', (event) => {
        this.currentLang = event.detail.language;
        this.render();
      });
    } catch (error) {
      console.error('Failed to load sections translations:', error);
    }
  },

  render() {
    if (!this.translations) return;

    const t = this.translations[this.currentLang].sections;

    // Experience section
    const expTitle = document.querySelector('#experience h2');
    if (expTitle) {
      expTitle.textContent = t.experience.title;
    }

    const highlightsTitle = document.querySelector('#experience .flex.items-center.gap-2.text-sm.text-neutral-300');
    if (highlightsTitle) {
      highlightsTitle.innerHTML = `<i data-lucide="trophy" class="w-4 h-4"></i> ${t.experience.highlights.title}`;
      // Re-initialize lucide icons for the updated element
      if (window.lucide) {
        lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
      }
    }

    const highlightsList = document.querySelector('#experience ul.space-y-3');
    if (highlightsList) {
      highlightsList.innerHTML = t.experience.highlights.items.map(item =>
        `<li class="flex items-start gap-2"><i data-lucide="check-circle-2" class="w-4 h-4 mt-0.5 text-emerald-400"></i> ${item}</li>`
      ).join('');
      // Re-initialize lucide icons for the updated list
      if (window.lucide) {
        lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
      }
    }

    // Awards section
    const awardsTitle = document.querySelector('#awards h2');
    if (awardsTitle) {
      awardsTitle.textContent = t.awards.title;
    }

    const awardsSubtitle = document.querySelector('#awards p.text-neutral-400');
    if (awardsSubtitle) {
      awardsSubtitle.textContent = t.awards.subtitle;
    }

    // Posts section
    const postsTitle = document.querySelector('#posts h2');
    if (postsTitle) {
      postsTitle.textContent = t.posts.title;
    }

    const postsSubtitle = document.querySelector('#posts p.text-neutral-400');
    if (postsSubtitle) {
      postsSubtitle.textContent = t.posts.subtitle;
    }

    // Volunteering section
    const volTitle = document.querySelector('#volunteering h2');
    if (volTitle) {
      volTitle.textContent = t.volunteering.title;
    }

    // Bootstrapping section
    const bootTitle = document.querySelector('#bootstrapping h2');
    if (bootTitle) {
      bootTitle.textContent = t.bootstrapping.title;
    }

    // Artworks section
    const artTitle = document.querySelector('#artworks h2');
    if (artTitle) {
      artTitle.textContent = t.artworks.title;
    }

    const artSubtitle = document.querySelector('#artworks p.text-neutral-400');
    if (artSubtitle) {
      artSubtitle.textContent = t.artworks.subtitle;
    }
  }
};
