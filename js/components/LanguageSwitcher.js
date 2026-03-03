export const LanguageSwitcher = {
  currentLang: 'en',

  init() {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.updateLanguage(this.currentLang, false);
    this.setupEventListeners();
  },

  setupEventListeners() {
    const langEN = document.getElementById('langEN');
    const langPT = document.getElementById('langPT');

    if (langEN) {
      langEN.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.switchLanguage('en');
      });
    }

    if (langPT) {
      langPT.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.switchLanguage('pt');
      });
    }
  },

  switchLanguage(lang) {
    if (lang === this.currentLang) return;

    this.currentLang = lang;
    localStorage.setItem('language', lang);

    // Save current scroll position
    const scrollY = window.scrollY;
    const currentHash = window.location.hash;

    // Temporarily remove hash to prevent auto-scrolling
    if (currentHash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    this.updateLanguage(lang, true);

    // Restore scroll position and hash after content updates
    setTimeout(() => {
      window.scrollTo(0, scrollY);
      if (currentHash) {
        history.replaceState(null, '', currentHash);
      }
    }, 100);
  },

  updateLanguage(lang, animate = true) {
    // Update active button state
    const buttons = document.querySelectorAll('.language-toggle');
    buttons.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: lang, animate }
    }));
  },

  getCurrentLanguage() {
    return this.currentLang;
  }
};
