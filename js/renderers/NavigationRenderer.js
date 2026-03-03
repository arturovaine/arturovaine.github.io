export const NavigationRenderer = {
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
      console.error('Failed to load navigation translations:', error);
    }
  },

  render() {
    if (!this.translations) return;

    const t = this.translations[this.currentLang].nav;

    // Update desktop navigation
    const desktopNav = document.querySelector('header nav.hidden.md\\:flex');
    if (desktopNav) {
      const links = desktopNav.querySelectorAll('a');
      links[0].textContent = t.portfolio;
      links[1].textContent = t.experience;
      links[2].textContent = t.awards;
      links[3].textContent = t.posts;
      links[4].textContent = t.volunteering;
      links[5].textContent = t.artworks;
      links[6].textContent = t.bootstrapping;
    }

    // Update mobile navigation
    const mobileNav = document.querySelector('#mobileNav');
    if (mobileNav) {
      const links = mobileNav.querySelectorAll('a');
      links[0].textContent = t.portfolio;
      links[1].textContent = t.experience;
      links[2].textContent = t.awards;
      links[3].textContent = t.posts;
      links[4].textContent = t.volunteering;
      links[5].textContent = t.artworks;
      links[6].textContent = t.bootstrapping;
    }

    // Update home link
    const homeLink = document.querySelector('header a[aria-label="Home"] span');
    if (homeLink) {
      homeLink.textContent = t.home;
    }
  }
};
