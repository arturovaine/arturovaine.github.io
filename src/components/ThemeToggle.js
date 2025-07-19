import themeManager from '../utils/ThemeManager.js';

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isDarkMode = false;
    this.unsubscribe = null;
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    
    // Subscribe to theme changes
    this.unsubscribe = themeManager.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
      this.updateThemeIcon();
    });
  }

  disconnectedCallback() {
    // Clean up subscription
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  addEventListeners() {
    const button = this.shadowRoot.querySelector('.theme-toggle-btn');
    button.addEventListener('click', this.toggleTheme.bind(this));
  }

  toggleTheme() {
    themeManager.toggleTheme();
  }

  updateThemeIcon() {
    const iconImg = this.shadowRoot.querySelector('.theme-toggle-img');
    if (iconImg) {
      iconImg.src = this.isDarkMode 
        ? '/src/assets/icons/sun.svg' 
        : '/src/assets/icons/moon.svg';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .header {
          margin: 33px auto 65px;
          display: none;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .theme-toggle-btn {
          width: 80px;
          height: 80px;
          cursor: pointer;
          background-color: var(--light-card-bg, #ffffff);
          border: none;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--transition-time, 0.7s) ease, transform 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .theme-toggle-btn:hover {
          transform: translateY(-3px);
        }
        .theme-toggle-img {
          width: 40px;
          height: 40px;
          transition: transform 0.3s ease;
        }
        .theme-toggle-btn:hover .theme-toggle-img {
          transform: rotate(30deg);
        }
        :host-context(body.dark-mode) .theme-toggle-btn {
          background-color: var(--dark-card-bg, #181f26);
        }
        
        @media (max-width: 1024px) {
          .header {
            margin: 27px auto 53px;
          }
          .theme-toggle-btn {
            width: 64px;
            height: 64px;
          }
          .theme-toggle-img {
            width: 32px;
            height: 32px;
          }
        }
        
        @media (max-width: 600px) {
          .header {
            margin: 20px auto 30px;
          }
          .theme-toggle-btn {
            width: 48px;
            height: 48px;
          }
          .theme-toggle-img {
            width: 24px;
            height: 24px;
          }
        }
      </style>
      
      <div class="header">
        <button class="theme-toggle-btn" aria-label="Toggle light/dark theme">
          <img class="theme-toggle-img" src="${this.isDarkMode 
            ? '/src/assets/icons/sun.svg' 
            : '/src/assets/icons/moon.svg'}" 
            alt="Theme Toggle Icon" />
        </button>
      </div>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);

export default ThemeToggle;