class StatsSection extends HTMLElement {
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
        .stats {
          width: 634px;
          height: 142px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin: 0 auto 47px;
        }
        .stats__item {
          width: 180px;
          height: 102px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: transform 0.3s ease;
        }
        .stats__item:hover {
          transform: translateY(-5px);
        }
        .stats__number {
          font-size: 24px;
          font-weight: 500;
          color: var(--light-text-primary, #3a3a3a);
          transition: color var(--transition-time, 0.7s) ease;
        }
        .stats__label {
          font-size: 22px;
          color: var(--light-text-secondary, #555);
          transition: color var(--transition-time, 0.7s) ease;
        }
        :host-context(body.dark-mode) .stats__number {
          color: var(--dark-text-secondary, #a3abb2);
        }
        :host-context(body.dark-mode) .stats__label {
          color: var(--dark-text-secondary, #a3abb2);
        }
        
        @media (max-width: 1024px) {
          .stats {
            width: 514px;
            height: 114px;
            margin: 0 auto 40px;
          }
          .stats__item {
            width: 144px;
            height: 82px;
          }
          .stats__number {
            font-size: 19px;
          }
          .stats__label {
            font-size: 18px;
          }
        }
        
        @media (max-width: 600px) {
          .stats {
            width: 375px;
            height: 106px;
            margin: 0 auto 30px;
          }
          .stats__item {
            width: 103px;
            height: 66px;
          }
          .stats__number {
            font-size: 16px;
          }
          .stats__label {
            font-size: 14px;
          }
        }
      </style>
      
      <section class="stats">
        <div class="stats__item">
          <div class="stats__number">5</div>
          <div class="stats__label">Years of work</div>
        </div>
        <div class="stats__item">
          <div class="stats__number">50+</div>
          <div class="stats__label">Projects</div>
        </div>
        <div class="stats__item">
          <div class="stats__number">20+</div>
          <div class="stats__label">Clients</div>
        </div>
      </section>
    `;
  }
}


customElements.define('stats-section', StatsSection);

export default StatsSection;