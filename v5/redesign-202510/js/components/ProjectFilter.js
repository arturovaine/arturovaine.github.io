// Project Filter Component
export const ProjectFilter = {
  init() {
    this.chips = Array.from(document.querySelectorAll('.filter-chip'));
    this.cards = Array.from(document.querySelectorAll('.project'));
    this.setupFilters();
  },

  setupFilters() {
    this.chips.forEach(chip => {
      chip.addEventListener('click', () => this.filter(chip), { passive: true });
    });

    // Set default active
    const defaultChip = document.querySelector('.filter-chip[data-filter="all"]');
    if (defaultChip) this.setActive(defaultChip);
  },

  setActive(target) {
    this.chips.forEach(c => {
      c.classList.remove('bg-white', 'text-neutral-900');
      c.classList.add('bg-neutral-900', 'text-neutral-300');
    });
    target.classList.add('bg-white', 'text-neutral-900');
    target.classList.remove('bg-neutral-900', 'text-neutral-300');
  },

  filter(chip) {
    const filter = chip.getAttribute('data-filter');
    this.setActive(chip);

    if (!filter || filter === 'all') {
      this.cards.forEach(card => card.classList.remove('hidden'));
      return;
    }

    this.cards.forEach(card => {
      const cats = (card.getAttribute('data-category') || '').toLowerCase();
      card.classList.toggle('hidden', !cats.includes(filter));
    });
  }
};
