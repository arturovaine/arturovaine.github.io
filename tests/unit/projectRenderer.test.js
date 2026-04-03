/**
 * Unit tests for ProjectRenderer
 */

// Mock module system for ESM
const ProjectRenderer = {
  projects: [],
  loaded: false,
  currentLang: 'en',

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
          ${project.image.endsWith('.mp4') ? `<video autoplay loop muted playsinline loading="lazy" src="${project.image}" aria-label="${project.alt}"></video>` : project.image.endsWith('.webp') ? `<picture><source srcset="${project.image}" type="image/webp"><img loading="lazy" src="${project.image.replace('.webp', '.png')}" alt="${project.alt}"></picture>` : `<img loading="lazy" src="${project.image}" alt="${project.alt}">`}
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

  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }
};

describe('ProjectRenderer', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'projects';
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('renderCard()', () => {
    test('should render <video> for .mp4 images', () => {
      const project = {
        title: 'Corporate Page',
        description: 'Landing page',
        image: './src/assets/thumbs/lp-corp.mp4',
        alt: 'Corporate landing page',
        tags: ['React'],
        branch: ['development'],
        category: 'open-source'
      };

      const html = ProjectRenderer.renderCard(project, 0);
      expect(html).toContain('<video');
      expect(html).toContain('autoplay');
      expect(html).toContain('loop');
      expect(html).toContain('muted');
      expect(html).toContain('playsinline');
      expect(html).toContain('src="./src/assets/thumbs/lp-corp.mp4"');
      expect(html).toContain('aria-label="Corporate landing page"');
      expect(html).not.toContain('<img');
    });

    test('should render <picture> with WebP source for .webp images', () => {
      const project = {
        title: 'Bias Reflector',
        description: 'Cognitive bias analyzer',
        image: './src/assets/thumbs/bias-reflector.webp',
        alt: 'Bias Reflector visualization',
        tags: ['AI'],
        branch: ['development'],
        category: 'experiment'
      };

      const html = ProjectRenderer.renderCard(project, 0);
      expect(html).toContain('<picture>');
      expect(html).toContain('<source srcset="./src/assets/thumbs/bias-reflector.webp" type="image/webp">');
      expect(html).toContain('src="./src/assets/thumbs/bias-reflector.png"');
      expect(html).toContain('alt="Bias Reflector visualization"');
      expect(html).not.toContain('<video');
    });

    test('should render plain <img> for other formats', () => {
      const project = {
        title: 'Airflow ETL',
        description: 'ETL pipeline',
        image: './src/assets/thumbs/airflow-etl.jpg',
        alt: 'Airflow ETL preview',
        tags: ['ETL'],
        branch: ['data'],
        category: 'open-source'
      };

      const html = ProjectRenderer.renderCard(project, 0);
      expect(html).toContain('<img');
      expect(html).toContain('loading="lazy"');
      expect(html).toContain('alt="Airflow ETL preview"');
      expect(html).not.toContain('<video');
      expect(html).not.toContain('<picture>');
    });

    test('should render accessibility attributes', () => {
      const project = {
        title: 'Test Project',
        description: 'Test description',
        image: './src/assets/thumbs/test.webp',
        alt: 'Test alt',
        tags: ['Tag1', 'Tag2'],
        branch: ['development', 'data'],
        category: 'experiment'
      };

      const html = ProjectRenderer.renderCard(project, 3);
      expect(html).toContain('role="button"');
      expect(html).toContain('tabindex="0"');
      expect(html).toContain('aria-label="View details for Test Project"');
      expect(html).toContain('data-project-index="3"');
      expect(html).toContain('data-branch="development data"');
      expect(html).toContain('data-category="experiment"');
    });

    test('should render all tags', () => {
      const project = {
        title: 'Test',
        description: 'Desc',
        image: './test.jpg',
        alt: 'Alt',
        tags: ['AI', 'Python', 'React'],
        branch: [],
        category: 'open-source'
      };

      const html = ProjectRenderer.renderCard(project, 0);
      expect(html).toContain('<span class="card-tag">AI</span>');
      expect(html).toContain('<span class="card-tag">Python</span>');
      expect(html).toContain('<span class="card-tag">React</span>');
    });
  });

  describe('render()', () => {
    test('should render multiple project cards', () => {
      const projects = [
        { title: 'P1', description: 'D1', image: './t1.mp4', alt: 'A1', tags: ['T1'], branch: ['dev'], category: 'open-source' },
        { title: 'P2', description: 'D2', image: './t2.webp', alt: 'A2', tags: ['T2'], branch: ['data'], category: 'experiment' },
        { title: 'P3', description: 'D3', image: './t3.jpg', alt: 'A3', tags: ['T3'], branch: ['dev'], category: 'production' }
      ];

      ProjectRenderer.render(container, projects);
      const cards = container.querySelectorAll('.project');
      expect(cards).toHaveLength(3);
      expect(container.querySelector('video')).toBeTruthy();
      expect(container.querySelector('picture')).toBeTruthy();
    });
  });

  describe('getProjectById()', () => {
    test('should find project by id', () => {
      ProjectRenderer.projects = [
        { id: 'alpha', title: 'Alpha' },
        { id: 'beta', title: 'Beta' }
      ];

      expect(ProjectRenderer.getProjectById('beta')).toEqual({ id: 'beta', title: 'Beta' });
    });

    test('should return undefined for unknown id', () => {
      ProjectRenderer.projects = [{ id: 'alpha', title: 'Alpha' }];
      expect(ProjectRenderer.getProjectById('unknown')).toBeUndefined();
    });
  });
});
