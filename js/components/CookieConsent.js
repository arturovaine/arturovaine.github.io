export const CookieConsent = {
  init() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    if (!localStorage.getItem('cookieConsent')) {
      banner.classList.remove('hidden');
    }

    document.getElementById('cookie-accept')?.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      banner.classList.add('hidden');
      this.loadGA();
    });

    document.getElementById('cookie-reject')?.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      banner.classList.add('hidden');
    });
  },

  loadGA() {
    if (typeof gtag === 'function') {
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    }
  }
};
