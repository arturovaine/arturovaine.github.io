class PortfolioApp extends HTMLElement {
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
          width: 100%;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
      </style>
      <div class="container">
        <theme-toggle></theme-toggle>
        <hero-section></hero-section>
        <stats-section></stats-section>
        <action-buttons></action-buttons>
        <model-viewer></model-viewer>
        <tabs-section></tabs-section>
        <portfolio-section></portfolio-section>
        <profile-section></profile-section>
        <footer-section></footer-section>
        <scroll-to-top></scroll-to-top>
      </div>
    `;
  }
}

customElements.define('portfolio-app', PortfolioApp);

export default PortfolioApp;