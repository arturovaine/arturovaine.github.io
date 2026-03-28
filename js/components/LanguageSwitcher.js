import { Analytics } from '../analytics.js';

export const LanguageSwitcher = {
  currentLang: 'en',

  detectBrowserLanguage() {
    // Get browser language
    const browserLang = navigator.language || navigator.userLanguage;

    // Check if browser language is Portuguese (pt, pt-BR, pt-PT, etc.)
    if (browserLang && browserLang.toLowerCase().startsWith('pt')) {
      return 'pt';
    }

    return 'en';
  },

  init() {
    // Use saved preference, or detect browser language on first visit
    const savedLang = localStorage.getItem('language');
    this.currentLang = savedLang || this.detectBrowserLanguage();

    // Save detected language if no preference exists
    if (!savedLang) {
      localStorage.setItem('language', this.currentLang);
    }

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

    const previousLang = this.currentLang;
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    Analytics.trackLanguageChange(previousLang, lang);

    // Remove hash from URL
    const currentHash = window.location.hash;
    if (currentHash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    this.updateLanguage(lang, true);

    // Scroll to top after content updates
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
