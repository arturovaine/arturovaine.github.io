class PortfolioSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.visible = true;
    this.data = null;
  }

  async connectedCallback() {
    await this.loadData();
    this.render();
    
    document.addEventListener('tab-changed', (e) => {
      this.visible = e.detail.tab === 'portfolio';
      this.shadowRoot.querySelector('.portfolio').style.display = this.visible ? 'block' : 'none';
    });
  }

  async loadData() {
    try {
      const response = await fetch('src/data/portfolio.json');
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      this.data = { projects: [] };
    }
  }

  renderProjects() {
    return this.data.projects.map((project, index) => `
      <a href="${project.link}" target="_blank" class="project-card" style="background-image: url('${project.image}')">
        <div class="project-card--title">${project.title}</div>
        <div class="project-card--description">${project.description}</div>
        <div class="project-card--link-btn">
          <img src="src/assets/icons/external-link.svg" 
            alt="Link icon" class="project-card--link-icon" loading="${index < 3 ? 'eager' : 'lazy'}">
        </div>
      </a>
    `).join('');
  }

  render() {
    if (!this.data) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .portfolio {
          display: ${this.visible ? 'block' : 'none'};
        }
        .portfolio__wrapper {
          max-width: 757px;
          margin: 0 auto;
          padding-bottom: 0;
        }
        .portfolio__grid {
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr 1fr 1fr;
        }
        .project-card {
          position: relative;
          overflow: hidden;
          border-radius: 0;
          text-align: center;
          border: 1px solid #b8a02b;
          aspect-ratio: 1;
          width: 100%;
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #f0f0f0;
        }
        .project-card {
          text-decoration: none;
          color: inherit;
        }
        .project-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(247, 208, 57, 0.9);
          opacity: 1;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .project-card:hover::after {
          opacity: 0;
        }
        .project-card--title {
          height: 28px;
          width: 90%;
          position: absolute;
          z-index: 1;
          opacity: 1;
          font-size: 18px;
          font-weight: 500;
          color: var(--light-text-primary, #3d3d3d);
          display: flex;
          align-items: center;
          justify-content: center;
          left: 50%;
          top: 25%;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
          text-align: center;
        }
        .project-card:hover .project-card--title {
          opacity: 0;
        }
        .project-card--description {
          height: 36px;
          width: 85%;
          position: absolute;
          z-index: 1;
          opacity: 1;
          font-size: 12px;
          font-weight: 400;
          color: var(--light-text-primary, #3d3d3d);
          display: flex;
          align-items: center;
          justify-content: center;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
          text-align: center;
        }
        .project-card:hover .project-card--description {
          opacity: 0;
        }
        .project-card--link-btn {
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          z-index: 1;
          opacity: 1;
          background-color: var(--light-card-bg, #ffffff);
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          left: 50%;
          top: 75%;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
        }
        .project-card--link-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
        }
        .project-card:hover .project-card--link-btn {
          opacity: 0;
        }
        
        @media (max-width: 1024px) {
          .portfolio__wrapper {
            max-width: 720px;
          }
          .portfolio__grid {
            gap: 12px;
            grid-template-columns: 1fr 1fr 1fr;
          }
          .project__thumbnail {
            width: 100%;
            height: 100%;
            border-radius: 0;
            border: 0;
          }
          .project-card--title {
            margin-top: 28px;
            font-size: 16px;
          }
          .project-card--description {
            width: 85%;
            font-size: 10px;
            margin-top: 60px;
          }
          .project-card--link-btn {
            margin-top: 100px;
            width: 28px;
            height: 28px;
          }
        }
        
        @media (max-width: 600px) {
          .portfolio__wrapper {
            max-width: 375px;
            padding: 0 20px;
          }
          .portfolio__grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .project__thumbnail {
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: 0;
          }
          .project-card--title {
            margin-top: 20px;
            font-size: 14px;
          }
          .project-card--description {
            width: 90%;
            font-size: 9px;
            margin-top: 45px;
          }
          .project-card--link-btn {
            margin-top: 80px;
            width: 24px;
            height: 24px;
          }
        }
      </style>
      
      <section class="portfolio">
        <div class="portfolio__wrapper">
          <div class="portfolio__grid">
            ${this.renderProjects()}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('portfolio-section', PortfolioSection);

export default PortfolioSection;