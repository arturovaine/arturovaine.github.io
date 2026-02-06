export const ProjectFilter = {
  init() {
    this.chips = Array.from(document.querySelectorAll('.btn-chip[data-filter]'));
    this.cards = Array.from(document.querySelectorAll('.project'));
    this.setupFilters();

    window.addEventListener('projectsRendered', () => {
      this.cards = Array.from(document.querySelectorAll('.project'));
    });
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
