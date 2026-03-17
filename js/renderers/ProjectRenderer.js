export const ProjectRenderer = {
  projects: [],
  loaded: false,
  currentLang: 'en',

  init() {
    const container = document.getElementById('projects');
    if (!container) return;

    this.currentLang = localStorage.getItem('language') || 'en';

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loaded) {
        this.loaded = true;
        this.loadAndRender(container);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    observer.observe(container);

    // Listen for language changes
    window.addEventListener('languageChanged', (event) => {
      this.currentLang = event.detail.language;
      if (this.loaded) {
        this.loadAndRender(container);
      }
    });
  },

  async loadAndRender(container) {
    try {
      const projectFile = this.currentLang === 'pt' ? './data/projects-pt.json' : './data/projects.json';
      const response = await fetch(projectFile);
      this.projects = await response.json();
      this.render(container, this.projects);
      this.setupClickHandlers();
      window.dispatchEvent(new CustomEvent('projectsRendered'));
    } catch (error) {
      console.error('Failed to load projects:', error);
      // Fallback to English if PT file doesn't exist
      if (this.currentLang === 'pt') {
        const response = await fetch('./data/projects.json');
        this.projects = await response.json();
        this.render(container, this.projects);
        this.setupClickHandlers();
        window.dispatchEvent(new CustomEvent('projectsRendered'));
      }
    }
  },

  renderCard(project, index) {
    const tags = project.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');
    const branches = Array.isArray(project.branch) ? project.branch.join(' ') : project.branch || '';

    return `
      <div class="card group project"
           data-branch="${branches}"
           data-category="${project.category}"
           data-project-index="${index}"
           role="button"
           tabindex="0"
           aria-label="View details for ${project.title}">
        <div class="card-image aspect-[3/4]">
          <img loading="lazy" src="${project.image}" alt="${project.alt}">
        </div>
        <div class="card-overlay">
          <h3 class="card-title">${project.title}</h3>
          <p class="card-description">${project.description}</p>
          <div class="card-tags">${tags}</div>
        </div>
      </div>
    `;
  },

  render(container, projects) {
    container.innerHTML = projects.map((project, index) => this.renderCard(project, index)).join('');
  },

  setupClickHandlers() {
    const cards = document.querySelectorAll('.project[data-project-index]');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.projectIndex, 10);
        const project = this.projects[index];
        if (project && window.ProjectModal) {
          window.ProjectModal.open(project);
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  },

  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }
};
