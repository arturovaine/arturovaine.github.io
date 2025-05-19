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
      const response = await fetch('/src/data/portfolio.json');
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      this.data = { projects: [] };
    }
  }

  renderProjects() {
    return this.data.projects.map(project => `
      <div class="project-card">
        <a href="${project.link}" target="_blank">
          <div class="project-card--title">${project.title}</div>
          <div class="project-card--description">${project.description}</div>
          <button class="project-card--link-btn">
            <img src="src/assets/icons/external-link.svg" 
              alt="Link icon" class="project-card--link-icon">
          </button>
          <img src="${project.image}" alt="${project.title}" class="project__thumbnail">
        </a>
      </div>
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
          gap: 48px 33px;
          grid-template-columns: 1fr 1fr;
        }
        .project-card {
          position: relative;
          overflow: hidden;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .project-card a {
          display: block;
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
          background-color: rgba(247, 208, 57, 0.8);
          opacity: 1;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .project-card:hover::after {
          opacity: 0;
        }
        .project__thumbnail {
          display: block;
          margin: 0 auto;
          width: 362px;
          height: 226px;
          object-fit: cover;
          object-position: top left;
          border-radius: 15px;
        }
        .project-card--title {
          height: 33px;
          width: 80%;
          position: absolute;
          z-index: 1;
          opacity: 1;
          font-size: 24px;
          font-weight: 500;
          color: var(--light-text-primary, #3d3d3d);
          display: flex;
          margin: 0 auto;
          margin-top: 53px;
          align-items: center;
          justify-content: center;
          left: 50%;
          transform: translateX(-50%);
          transition: opacity 0.3s ease;
        }
        .project-card:hover .project-card--title {
          opacity: 0;
        }
        .project-card--description {
          height: 42px;
          width: 287px;
          position: absolute;
          z-index: 1;
          opacity: 1;
          font-size: 14px;
          font-weight: 500;
          color: var(--light-text-primary, #3d3d3d);
          display: flex;
          margin: 0 auto;
          margin-top: 90px;
          align-items: center;
          justify-content: center;
          left: 50%;
          transform: translateX(-50%);
          transition: opacity 0.3s ease;
        }
        .project-card:hover .project-card--description {
          opacity: 0;
        }
        .project-card--link-btn {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          z-index: 1;
          opacity: 1;
          background-color: var(--light-card-bg, #ffffff);
          border: none;
          display: flex;
          margin: 0 auto;
          margin-top: 150px;
          align-items: center;
          justify-content: center;
          left: 50%;
          transform: translateX(-50%);
          transition: opacity 0.3s ease;
          pointer-events: none;
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
            max-width: 568px;
          }
          .portfolio__grid {
            gap: 36px 25px;
          }
          .project__thumbnail {
            width: 271px;
            height: 170px;
            border-radius: 11px;
          }
          .project-card--title {
            margin-top: 32px;
            font-size: 19px;
          }
          .project-card--description {
            width: 80%;
            font-size: 11px;
            margin-top: 72px;
          }
          .project-card--link-btn {
            margin-top: 115px;
            transform: translateX(-50%) scale(0.8);
          }
        }
        
        @media (max-width: 600px) {
          .portfolio__grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .project-card {
            width: 340px;
            margin: 0 auto;
          }
          .project__thumbnail {
            width: 340px;
            height: 210px;
          }
          .project-card--title {
            margin-top: 42px;
            font-size: 19px;
          }
          .project-card--description {
            width: 80%;
            font-size: 12px;
            margin-top: 86px;
          }
          .project-card--link-btn {
            margin-top: 140px;
            transform: translateX(-50%) scale(1.2);
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