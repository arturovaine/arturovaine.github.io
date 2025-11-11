class TabsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.activeTab = 'portfolio';
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    const tabs = this.shadowRoot.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.textContent.trim().toLowerCase();
        this.setActiveTab(tabName);
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.dispatchEvent(new CustomEvent('tab-changed', { 
          detail: { tab: tabName } 
        }));
      });
    });
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .tabs-section {
          height: 132px;
          width: 760px;
          display: flex;
          margin: 0 auto 65px;
          align-items: center;
        }
        .tabs__container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 0 auto;
          border-radius: 20px;
          height: 110px;
          width: 760px;
          background-color: var(--light-card-bg, #ffffff);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: background-color var(--transition-time, 0.7s) ease;
        }
        .tab {
          width: 351.45px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 500;
          color: var(--light-text-primary, #3d3d3d);
          background-color: var(--light-card-bg, #ffffff);
          text-align: center;
          text-decoration: none;
          border-radius: 10px;
          border: none;
          outline: none;
          cursor: pointer;
          transition: background-color var(--transition-time, 0.7s) ease, 
                      color var(--transition-time, 0.7s) ease,
                      transform 0.3s ease;
        }
        .tab:hover:not(.active) {
          transform: translateY(-2px);
        }
        .tab.active {
          background-color: #d7d7d7;
          transition: background-color var(--transition-time, 0.7s) ease;
        }
        :host-context(body.dark-mode) .tabs__container {
          background-color: var(--dark-card-bg, #171f26);
        }
        :host-context(body.dark-mode) .tab {
          background-color: var(--dark-card-bg, #171f26);
          color: var(--dark-text-secondary, #a3abb2);
        }
        :host-context(body.dark-mode) .tab.active {
          background-color: var(--dark-bg, #0c151d);
          color: var(--dark-text-secondary, #a3abb2);
        }
        
        @media (max-width: 1024px) {
          .tabs__container {
            width: 549px;
            height: 79px;
            gap: 16px;
            border-radius: 14px;
          }
          .tab {
            width: 252px;
            height: 58px;
            font-size: 18px;
            border-radius: 7px;
          }
          .tabs-section {
            width: 549px;
            height: 95px;
            margin: 0 auto 52px;
          }
        }
        
        @media (max-width: 600px) {
          .tabs__container {
            width: 330px;
            height: 64px;
            gap: 9px;
            border-radius: 10px;
          }
          .tab {
            width: 154px;
            height: 50.3px;
            border-radius: 10px;
            font-size: 14px;
          }
          .tabs-section {
            width: 375px;
            height: 84px;
            margin: 0 auto 30px;
          }
        }
      </style>
      
      <section class="tabs-section">
        <div class="tabs__container">
          <button class="tab active">
            Portfolio
          </button>
          <button class="tab">
            Profile
          </button>
        </div>
      </section>
    `;
  }
}

customElements.define('tabs-section', TabsSection);

export default TabsSection;