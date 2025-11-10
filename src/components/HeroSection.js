import themeManager from '../utils/ThemeManager.js';

class HeroSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isDarkMode = false;
    this.unsubscribe = null;
  }

  connectedCallback() {
    this.render();
    
    // Subscribe to theme changes
    this.unsubscribe = themeManager.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
      this.updateIcons();
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateIcons() {
    const githubIcon = this.shadowRoot.querySelector('#icon-github');
    const linkedinIcon = this.shadowRoot.querySelector('#icon-linkedin');

    // Update icons if they exist
    if (githubIcon) {
      githubIcon.src = this.isDarkMode 
        ? 'src/assets/icons/github-dark.svg'
        : 'src/assets/icons/github.svg';
    }

    if (linkedinIcon) {
      linkedinIcon.src = this.isDarkMode 
        ? 'src/assets/icons/linkedin-dark.svg'
        : 'src/assets/icons/linkedin.svg';
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .hero {
          width: 631px;
          height: 215px;
          display: flex;
          margin: 0 auto 48px;
          margin-top: -40px;
          align-items: center;
          justify-content: center;
        }
        .hero__container {
          display: flex;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .hero__avatar-container {
          width: 215px;
          height: 215px;
          display: none;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hero__avatar-img {
          width: 192px;
          height: 192px;
          border-radius: 50%;
          object-fit: cover;
          border: 7.5px solid var(--light-card-bg, #fff);
          box-shadow: 0 0 0 4px var(--accent-light, #f7d039);
          transition: box-shadow var(--transition-time, 0.7s) ease, transform 0.3s ease;
        }
        .hero__avatar-img:hover {
          transform: scale(1.05);
        }
        .hero__intro {
          width: 372px;
          height: 156px;
          margin-left: 0px;
          text-align: center;
        }
        .hero__title {
          font-size: 46px;
          font-weight: 500;
          margin: 0;
          color: var(--light-text-primary, #3d3d3d);
          transition: color var(--transition-time, 0.7s) ease;
        }
        .hero__subtitle {
          font-size: 22px;
          font-weight: 500;
          margin: 0;
          color: var(--light-text-secondary, #575757);
          transition: color var(--transition-time, 0.7s) ease;
        }
        .hero__social-links {
          width: 80px;
          height: 36px;
          display: flex;
          margin: 30px auto 0;
          justify-content: space-between;
        }
        .social-link {
          display: inline-block;
          transition: transform 0.3s ease;
        }
        .social-link:hover {
          transform: translateY(-5px);
        }
        .icon__social_media {
          width: 36px;
          height: 36px;
          color: var(--light-text-secondary, #575757);
          fill: var(--light-text-secondary, #575757);
          transition: fill var(--transition-time, 0.7s) ease, color var(--transition-time, 0.7s) ease;
        }
        :host-context(body.dark-mode) .hero__avatar-img {
          box-shadow: 0 0 0 4px var(--accent-dark, #ffe071);
        }
        :host-context(body.dark-mode) .hero__title {
          color: var(--dark-text-primary, #f1f2f4);
        }
        :host-context(body.dark-mode) .hero__subtitle {
          color: var(--dark-text-secondary, #a3abb2);
        }
        :host-context(body.dark-mode) .icon__social_media {
          color: var(--dark-text-secondary, #a3abb2);
          fill: var(--dark-text-secondary, #a3abb2);
        }
        
        @media (max-width: 1024px) {
          .hero {
            margin: 0 auto 38px;
            width: 510px;
            height: 170px;
          }
          .hero__avatar-container {
            width: 170px;
            height: 170px;
          }
          .hero__avatar-img {
            width: 152px;
            height: 152px;
          }
          .hero__intro {
            width: 300px;
            height: 126px;
            margin-left: 32px;
          }
          .hero__title {
            font-size: 36px;
          }
          .hero__subtitle {
            font-size: 17px;
          }
          .icon__social_media {
            width: 30px;
            height: 30px;
          }
          .hero__social-links {
            width: 70px;
            margin-top: 10px;
          }
        }
        
        @media (max-width: 600px) {
          .hero {
            width: 100%;
            max-width: 386px;
            height: auto;
            margin: 0 auto 30px;
            padding: 0 20px;
          }
          .hero__container {
            flex-direction: column;
            text-align: center;
            height: auto;
            margin: 0 auto;
          }
          .hero__intro {
            width: 100%;
            height: auto;
            margin-left: 0;
            margin-top: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero__avatar-container {
            width: 124px;
            height: 124px;
            margin: 0 auto;
          }
          .hero__avatar-img {
            width: 107px;
            height: 107px;
          }
          .hero__title {
            font-size: 32px;
          }
          .hero__subtitle {
            font-size: 14px;
            margin-top: 8px;
          }
          .hero__social-links {
            width: 60px;
            height: 24px;
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .icon__social_media {
            width: 24px;
            height: 24px;
          }
        }
      </style>
      
      <section class="hero">
        <div class="hero__container">
          <div class="hero__avatar-container">
            <img src="src/assets/images/my_photo.png" 
              alt="Profile Picture" class="hero__avatar-img" loading="eager">
          </div>

          <div class="hero__intro">
            <h1 class="hero__title">Arturo Vaine</h1>
            <p class="hero__subtitle">Software Engineer</p>
            <div class="hero__social-links">
              <a href="https://github.com/arturovaine" class="social-link" target="_blank">
                <img class="icon__social_media" id="icon-github" 
                  src="src/assets/icons/github.svg"
                  alt="Github Icon" loading="eager">
              </a>
              <a href="https://www.linkedin.com/in/arturovaine/" class="social-link" target="_blank">
                <img class="icon__social_media" id="icon-linkedin" 
                  src="src/assets/icons/linkedin.svg"
                  alt="LinkedIn Icon" loading="eager">
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
    
    // Set initial theme and update icons
    this.isDarkMode = themeManager.getCurrentTheme() === 'dark';
    this.updateIcons();
  }
}

customElements.define('hero-section', HeroSection);

export default HeroSection;