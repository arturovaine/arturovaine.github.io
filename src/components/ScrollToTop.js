import themeManager from '../utils/ThemeManager.js';

class ScrollToTop extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isDarkMode = false;
    this.visible = false;
    this.unsubscribe = null;
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    
    // Subscribe to theme changes
    this.unsubscribe = themeManager.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
      this.updateIcon();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  addEventListeners() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    const button = this.shadowRoot.querySelector('.btn__scroll-to-top');
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  handleScroll() {
    if (window.scrollY > 300) {
      if (!this.visible) {
        this.visible = true;
        this.shadowRoot.querySelector('.btn__scroll-to-top').style.display = 'flex';
      }
    } else {
      if (this.visible) {
        this.visible = false;
        this.shadowRoot.querySelector('.btn__scroll-to-top').style.display = 'none';
      }
    }
  }

  updateIcon() {
    const iconImg = this.shadowRoot.querySelector('.btn__scroll-to-top--icon');
    if (iconImg) {
      iconImg.src = 'src/assets/icons/arrow-up.svg';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .btn__scroll-to-top {
          display: none;
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background-color: var(--light-card-bg, #ffffff);
          border: 3px solid var(--light-text-primary, #3d3d3d);
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          justify-content: center;
          align-items: center;
          transition: opacity 0.3s ease, background-color var(--transition-time, 0.7s) ease, transform 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }
        .btn__scroll-to-top:hover {
          transform: translateY(-5px);
        }
        .btn__scroll-to-top--icon {
          width: 24px;
          height: 24px;
        }
        :host-context(body.dark-mode) .btn__scroll-to-top {
          background-color: var(--dark-bg, #0c151d);
          border: 3px solid var(--dark-text-primary, #ffffff);
        }
      </style>
      
      <div class="btn__scroll-to-top" aria-label="Scroll to top">
        <img src="src/assets/icons/arrow-up.svg" 
          class="btn__scroll-to-top--icon" aria-label="Scroll to top">
      </div>
    `;
    
    this.updateIcon();
  }
}

customElements.define('scroll-to-top', ScrollToTop);

export default ScrollToTop;