class FooterSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const currentYear = new Date().getFullYear();
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .footer {
          margin-top: 130px;
          margin-bottom: 80px;
        }
        .footer__container {
          height: 33px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .footer__text {
          font-size: 22px;
          color: var(--light-text-secondary, #575757);
          font-weight: 500;
          transition: color var(--transition-time, 0.7s) ease;
        }
        :host-context(body.dark-mode) .footer__text {
          color: var(--dark-text-secondary, #a3abb2);
        }
        
        @media (max-width: 1024px) {
          .footer {
            margin-top: 104px;
            margin-bottom: 64px;
          }
          .footer__container {
            height: 26px;
          }
          .footer__text {
            font-size: 18px;
          }
        }
        
        @media (max-width: 600px) {
          .footer {
            margin-top: 30px;
            margin-bottom: 40px;
          }
          .footer__text {
            font-size: 14px;
          }
        }
      </style>
      
      <footer class="footer">
        <div class="footer__container">
          <p class="footer__text">
            &copy; Arturo Vaine. ${currentYear} All rights reserved.
          </p>
        </div>
      </footer>
    `;
  }
}

customElements.define('footer-section', FooterSection);

export default FooterSection;