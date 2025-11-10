// Styling Component
export const StylingManager = {
  init() {
    this.applyBorderRadius();
  },

  applyBorderRadius() {
    requestAnimationFrame(() => {
      // Set border radius globally to 5px
      const radiused = document.querySelectorAll('[class*="rounded"]');
      radiused.forEach(el => {
        el.style.borderRadius = '5px';
      });

      // Set specific border radius for project cards
      const projectCards = document.querySelectorAll('.project');
      projectCards.forEach(card => {
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
      });

      // Set border radius for artwork cards
      const artworkCards = document.querySelectorAll('#artworks article');
      artworkCards.forEach(card => {
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
      });

      // Set border radius for award cards
      const awardCards = document.querySelectorAll('#awards article');
      awardCards.forEach(card => {
        card.style.borderRadius = '5px';
        card.style.overflow = 'hidden';
      });
    });
  }
};
