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
      langEN.addEventListener('click', () => this.switchLanguage('en'));
    }

    if (langPT) {
      langPT.addEventListener('click', () => this.switchLanguage('pt'));
    }
  },

  switchLanguage(lang) {
    if (lang === this.currentLang) return;

    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.updateLanguage(lang, true);
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
