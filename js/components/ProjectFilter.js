export const ProjectFilter = {
  init() {
    this.chips = Array.from(document.querySelectorAll('.btn-chip[data-filter]'));
    this.cards = Array.from(document.querySelectorAll('.project'));
    this.setupFilters();
    this.updateCounters();

    window.addEventListener('projectsRendered', () => {
      this.cards = Array.from(document.querySelectorAll('.project'));
      this.updateCounters();
    });
  },

  updateCounters() {
    const counts = { all: this.cards.length };

    this.cards.forEach(card => {
      const cats = (card.getAttribute('data-category') || '').toLowerCase();
      ['design', 'engineering', 'open-source', 'experiment'].forEach(cat => {
        if (cats.includes(cat)) {
          counts[cat] = (counts[cat] || 0) + 1;
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

  getLabel(filter) {
    const labels = {
      'all': 'All',
      'design': 'Design',
      'engineering': 'Engineering',
      'open-source': 'Open Source',
      'experiment': 'Experiments'
    };
    return labels[filter] || filter;
  },

  setupFilters() {
    this.chips.forEach(chip => {
      chip.addEventListener('click', () => this.filter(chip), { passive: true });
    });

    const defaultChip = document.querySelector('.btn-chip[data-filter="all"]');
    if (defaultChip) this.setActive(defaultChip);
  },

  setActive(target) {
    this.chips.forEach(c => {
      c.classList.remove('active');
    });
    target.classList.add('active');
  },

  filter(chip) {
    const filter = chip.getAttribute('data-filter');
    this.setActive(chip);

    this.cards.forEach((card, index) => {
      const cats = (card.getAttribute('data-category') || '').toLowerCase();
      const shouldShow = !filter || filter === 'all' || cats.includes(filter);

      if (shouldShow) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(10px)';

        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'scale(1) translateY(0)';
        }, index * 50);
      } else {
        card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';

        setTimeout(() => {
          card.classList.add('hidden');
        }, 200);
      }
    });
  }
};
