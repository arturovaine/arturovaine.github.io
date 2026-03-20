export const ProjectModal = {
  modalElement: null,
  backdropElement: null,
  currentProject: null,
  translations: null,
  currentLang: 'en',

  async init() {
    this.currentLang = localStorage.getItem('language') || 'en';

    try {
      const response = await fetch('./data/translations.json');
      this.translations = await response.json();
    } catch (error) {
      console.error('Failed to load modal translations:', error);
    }

    this.createModalElements();
    this.setupEventListeners();

    window.addEventListener('languageChanged', (event) => {
      this.currentLang = event.detail.language;
      this.updateTranslations();
    });
  },

  createModalElements() {
    this.backdropElement = document.createElement('div');
    this.backdropElement.className = 'modal-backdrop';
    this.backdropElement.id = 'project-modal-backdrop';

    this.modalElement = document.createElement('div');
    this.modalElement.className = 'modal';
    this.modalElement.id = 'project-modal';
    this.modalElement.innerHTML = `
      <div class="modal-header">
        <img class="modal-image" src="" alt="">
        <button class="modal-close" aria-label="Close modal">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="modal-title-row">
          <h2 class="modal-title"></h2>
          <div class="modal-actions">
            <a class="btn btn-primary btn-sm modal-link" href="" target="_blank" rel="noopener">
              <i data-lucide="external-link" class="w-4 h-4"></i>
              <span class="modal-view-project-text">View Project</span>
            </a>
            <button class="btn btn-secondary btn-sm modal-close-btn">Close</button>
          </div>
        </div>
        <p class="modal-subtitle"></p>
        <span class="modal-status"></span>
        <p class="modal-description"></p>
        <div class="modal-features-section">
          <h3 class="modal-section-title modal-features-title">Key Features</h3>
          <ul class="modal-features"></ul>
        </div>
        <div class="modal-tech-section">
          <h3 class="modal-section-title modal-tech-title">Tech Stack</h3>
          <div class="modal-tech-stack"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.backdropElement);
    document.body.appendChild(this.modalElement);

    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    this.updateTranslations();
  },

  updateTranslations() {
    if (!this.translations || !this.modalElement) return;

    const t = this.translations[this.currentLang]?.projects?.modal;
    if (!t) return;

    const viewProjectText = this.modalElement.querySelector('.modal-view-project-text');
    if (viewProjectText) {
      viewProjectText.textContent = t.viewProject;
    }

    const closeBtn = this.modalElement.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.textContent = t.close;
    }

    const featuresTitle = this.modalElement.querySelector('.modal-features-title');
    if (featuresTitle) {
      featuresTitle.textContent = t.keyFeatures;
    }

    const techTitle = this.modalElement.querySelector('.modal-tech-title');
    if (techTitle) {
      techTitle.textContent = t.techStack;
    }
  },

  setupEventListeners() {
    this.backdropElement.addEventListener('click', () => this.close());

    const closeBtn = this.modalElement.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    const closeBtnFooter = this.modalElement.querySelector('.modal-close-btn');
    if (closeBtnFooter) {
      closeBtnFooter.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalElement.classList.contains('active')) {
        this.close();
      }
    });

    this.modalElement.addEventListener('click', (e) => e.stopPropagation());
  },

  open(project) {
    this.currentProject = project;
    this.updateContent(project);

    this.backdropElement.classList.add('active');
    this.modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.backdropElement.classList.remove('active');
    this.modalElement.classList.remove('active');
    document.body.style.overflow = '';
  },

  updateContent(project) {
    const modal = this.modalElement;
    const { modal: modalData } = project;

    const img = modal.querySelector('.modal-image');
    img.src = project.image;
    img.alt = project.alt;

    modal.querySelector('.modal-title').textContent = project.title;
    modal.querySelector('.modal-subtitle').textContent = modalData?.subtitle || project.description;

    const statusEl = modal.querySelector('.modal-status');
    const status = modalData?.status || 'Unknown';
    statusEl.textContent = status;
    statusEl.className = 'modal-status';
    if (status.toLowerCase().includes('development')) {
      statusEl.classList.add('in-development');
    } else if (status.toLowerCase().includes('open source')) {
      statusEl.classList.add('open-source');
    } else if (status.toLowerCase().includes('production')) {
      statusEl.classList.add('production');
    }

    const description = modalData?.fullDescription || project.description;
    modal.querySelector('.modal-description').textContent = description;

    const featuresSection = modal.querySelector('.modal-features-section');
    const featuresList = modal.querySelector('.modal-features');
    if (modalData?.features && modalData.features.length > 0) {
      featuresSection.style.display = 'block';
      featuresList.innerHTML = modalData.features
        .map(feature => `<li>${feature}</li>`)
        .join('');
    } else {
      featuresSection.style.display = 'none';
    }

    const techSection = modal.querySelector('.modal-tech-section');
    const techStack = modal.querySelector('.modal-tech-stack');
    if (modalData?.techStack && modalData.techStack.length > 0) {
      techSection.style.display = 'block';
      techStack.innerHTML = modalData.techStack
        .map(tech => `<span class="modal-tech-tag">${tech}</span>`)
        .join('');
    } else {
      techSection.style.display = 'none';
    }

    const linkBtn = modal.querySelector('.modal-link');
    if (project.url) {
      linkBtn.href = project.url;
      linkBtn.style.display = 'inline-flex';
    } else {
      linkBtn.style.display = 'none';
    }
  }
};
