export const StylingManager = {
  init() {
    this.applyBorderRadius();
  },

  applyBorderRadius() {
    requestAnimationFrame(() => {
      const radiused = document.querySelectorAll('[class*="rounded"]');
      radiused.forEach(el => {
        el.style.borderRadius = '5px';
      });

      const projectCards = document.querySelectorAll('.project');
      projectCards.forEach(card => {
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
      });

      const artworkCards = document.querySelectorAll('#artworks article');
      artworkCards.forEach(card => {
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
      });

      const awardCards = document.querySelectorAll('#awards article');
      awardCards.forEach(card => {
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
      });
    });
  }
};
