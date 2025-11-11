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
          border-radius: 10px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hero__action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .hero__action-btn:active {
          transform: translateY(0);
        }
        .hero__action-btn--primary {
          background-color: var(--accent-light, #f7d039);
          transition: background-color var(--transition-time, 0.7s) ease;
        }
        .hero__action-btn--secondary {
          background-color: var(--light-card-bg, #ffffff);
          transition: background-color var(--transition-time, 0.7s) ease, color var(--transition-time, 0.7s) ease;
          color: var(--light-text-primary, #3d3d3d);
        }
        .icon--download {
          height: 24px;
          margin-left: 10px;
        }
        :host-context(body.dark-mode) .hero__action-btn--primary {
          background-color: var(--accent-dark, #ffe071);
        }
        :host-context(body.dark-mode) .hero__action-btn--secondary {
          background-color: var(--dark-card-bg, #171f26);
          color: var(--dark-text-secondary, #a3abb2);
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
            border-radius: 8px;
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
            border-radius: 10px;
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