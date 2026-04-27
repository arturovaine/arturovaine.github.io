export const ProjectFilter = {
  translations: null,
  currentLang: 'en',
  activeFilter: 'all',
  searchQuery: '',

  async init() {
    this.chips = Array.from(document.querySelectorAll('.btn-chip[data-filter]'));
    this.cards = Array.from(document.querySelectorAll('.project'));
    this.searchInput = document.getElementById('project-search');

    await this.loadTranslations();
    this.currentLang = localStorage.getItem('language') || 'en';

    if (this.searchInput) {
      const t = this.translations?.[this.currentLang]?.projects;
      if (t?.searchPlaceholder) {
        this.searchInput.placeholder = t.searchPlaceholder;
        this.searchInput.setAttribute('aria-label', t.searchPlaceholder);
      }
    }

    this.setupFilters();
    this.updateCounters();
    this.applyFilters();

    window.addEventListener('projectsRendered', () => {
      this.cards = Array.from(document.querySelectorAll('.project'));
      this.updateCounters();
      this.applyFilters();
    });

    window.addEventListener('languageChanged', (event) => {
      this.currentLang = event.detail.language;
      if (this.searchInput) {
        const t = this.translations?.[this.currentLang]?.projects;
        if (t?.searchPlaceholder) {
          this.searchInput.placeholder = t.searchPlaceholder;
          this.searchInput.setAttribute('aria-label', t.searchPlaceholder);
        }
      }
      this.updateCounters();
      this.applyFilters();
    });
  },

  async loadTranslations() {
    try {
      const response = await fetch('./data/translations.json');
      this.translations = await response.json();
    } catch (error) {
      console.error('Failed to load filter translations:', error);
    }
  },

  updateCounters() {
    const counts = { all: this.cards.length };

    this.cards.forEach(card => {
      const branches = this.getBranches(card);
      ['development', 'data'].forEach(branch => {
        if (branches.includes(branch)) {
          counts[branch] = (counts[branch] || 0) + 1;
        }
      });
    });

    this.chips.forEach(chip => {
      const filter = chip.getAttribute('data-filter');
      const count = counts[filter] || 0;
      const label = this.getLabel(filter);
      chip.textContent = `${label} (${count})`;
    });
  },

  getBranches(card) {
    return (card.getAttribute('data-branch') || '')
      .toLowerCase()
      .split(/\s+/)
      .map(branch => branch.trim())
      .filter(Boolean);
  },

  getLabel(filter) {
    if (this.translations && this.translations[this.currentLang]?.projects?.filters) {
      return this.translations[this.currentLang].projects.filters[filter] || filter;
    }
    return filter;
  },

  setupFilters() {
    this.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.activeFilter = chip.getAttribute('data-filter') || 'all';
        this.setActive(chip);
        this.applyFilters();
      }, { passive: true });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.searchQuery = this.searchInput.value.trim().toLowerCase();
        this.applyFilters();
      });
    }

    const defaultChip = document.querySelector('.btn-chip[data-filter="all"]');
    if (defaultChip) this.setActive(defaultChip);
  },

  setActive(target) {
    this.chips.forEach(c => {
      c.classList.remove('active');
    });
    target.classList.add('active');
  },

  applyFilters() {
    this.cards.forEach(card => {
      const branches = this.getBranches(card);
      const searchIndex = (card.getAttribute('data-search') || '').toLowerCase();
      const matchesFilter = !this.activeFilter || this.activeFilter === 'all' || branches.includes(this.activeFilter);
      const matchesSearch = !this.searchQuery || searchIndex.includes(this.searchQuery);
      const shouldShow = matchesFilter && matchesSearch;

      if (shouldShow) {
        card.classList.remove('hidden');
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = 'none';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'none';
        card.style.display = 'none';
        card.classList.add('hidden');
      }
    });
  }
};
