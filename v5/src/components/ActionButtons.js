class ActionButtons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .hero__actions {
          width: 618px;
          display: flex;
          margin: 0 auto 75px;
          gap: 38px;
          justify-content: center;
        }
        .hero__action-btn {
          width: 290px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 500;
          color: var(--light-text-primary, #3d3d3d);
          text-align: center;
          text-decoration: none;
          border-radius: 0;
          border: 1px solid #999999;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .hero__action-btn--primary {
          background-color: var(--accent-light, #f7d039);
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .hero__action-btn--primary:hover {
          background-color: #333333;
          color: #ffffff;
        }
        .hero__action-btn--secondary {
          background-color: var(--light-card-bg, #ffffff);
          transition: background-color 0.3s ease, color 0.3s ease;
          color: var(--light-text-primary, #3d3d3d);
        }
        .hero__action-btn--secondary:hover {
          background-color: #333333;
          color: #ffffff;
        }
        .icon--download {
          height: 24px;
          margin-left: 10px;
        }
        :host-context(body.dark-mode) .hero__action-btn--primary {
          background-color: var(--accent-dark, #ffe071);
          color: #333333;
        }
        :host-context(body.dark-mode) .hero__action-btn--primary:hover {
          background-color: #ffffff;
          color: #333333;
        }
        :host-context(body.dark-mode) .hero__action-btn--secondary {
          background-color: var(--dark-card-bg, #171f26);
          color: var(--dark-text-secondary, #a3abb2);
        }
        :host-context(body.dark-mode) .hero__action-btn--secondary:hover {
          background-color: #ffffff;
          color: #333333;
        }
        
        @media (max-width: 1024px) {
          .hero__actions {
            width: 500px;
            margin: 0 auto 60px;
            gap: 30px;
          }
          .hero__action-btn {
            width: 230px;
            height: 64px;
            font-size: 18px;
            border-radius: 0;
          }
          .icon--download {
            height: 20px;
          }
        }
        
        @media (max-width: 600px) {
          .hero__actions {
            width: 375px;
            height: 80px;
            margin: 0 auto 30px;
            gap: 14px;
          }
          .hero__action-btn {
            width: 158px;
            height: 44px;
            border-radius: 0;
            font-size: 12px;
          }
          .icon--download {
            height: 14px;
            margin-left: 5px;
          }
        }
      </style>
      
      <div class="hero__actions">
        <a href="src/assets/pdf/cv.pdf" class="hero__action-btn hero__action-btn--primary">
          Download CV
          <img class="icon--download" src="src/assets/icons/download.svg" alt="Download Icon">
        </a>
        <a href="mailto:arturo.vaine@gmail.com" class="hero__action-btn hero__action-btn--secondary">
          Contact me
        </a>
      </div>
    `;
  }
}

customElements.define('action-buttons', ActionButtons);

export default ActionButtons;