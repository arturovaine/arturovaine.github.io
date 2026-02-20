export const ScrollToTop = {
  init() {
    this.button = document.getElementById('scrollToTop');
    if (!this.button) return;

    this.setupScrollListener();
    this.setupClickHandler();
  },

  setupScrollListener() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  },

  toggleVisibility() {
    const scrollY = window.scrollY;
    const showThreshold = 400;

    if (scrollY > showThreshold) {
      this.button.classList.remove('opacity-0', 'invisible', 'translate-y-4');
      this.button.classList.add('opacity-100', 'visible', 'translate-y-0');
    } else {
      this.button.classList.add('opacity-0', 'invisible', 'translate-y-4');
      this.button.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }
  },

  setupClickHandler() {
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, { passive: true });
  }
};
