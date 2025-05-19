// ProfileSection.js – No Swiper, no modal – External links restored
class ProfileSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.visible  = false;
    this.data     = null;
  }

  /* ───────────────────────────
   *  Lifecycle
   * ─────────────────────────── */
  async connectedCallback() {
    await this.loadData();
    this.render();
    this.setupCollapsibleSections();

    // Toggle visibility when the host app changes tabs
    document.addEventListener('tab-changed', (e) => {
      this.visible = e.detail.tab === 'profile';
      const profile = this.shadowRoot.querySelector('.profile');
      if (profile) profile.style.display = this.visible ? 'block' : 'none';
    });
  }

  /* ───────────────────────────
   *  Data
   * ─────────────────────────── */
  async loadData() {
    try {
      const res  = await fetch('/src/data/profile.json');
      this.data  = await res.json();
    } catch (err) {
      console.error('Error loading profile data:', err);
      this.data = {
        about:        { paragraphs: [] },
        experience:   [],
        awards:       [],
        volunteering: { organization: '', description: '', experiences: [] },
        artworks:     []
      };
    }
  }

  /* ───────────────────────────
   *  UI helpers
   * ─────────────────────────── */
  setupCollapsibleSections() {
    this.shadowRoot.querySelectorAll('.section').forEach(section => {
      const title   = section.querySelector('.section-title');
      const content = section.querySelector('.section-content');

      title.addEventListener('click', () => {
        const open = content.style.maxHeight !== '0px';
        content.style.maxHeight = open ? '0px' : `${content.scrollHeight}px`;
        title.classList.toggle('collapsed');
      });

      // Start expanded by default
      content.style.maxHeight = `${content.scrollHeight}px`;
    });
  }

  getImageForType(type, idx) {
    const imgs = {
      awards: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=60'
      ],
      volunteering: [
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=60'
      ],
      artworks: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=60'
      ]
    };
    return imgs[type][idx] ?? imgs[type][0];
  }

  /* ───────────────────────────
   *  Render
   * ─────────────────────────── */
  render() {
    if (!this.data) return;

    this.shadowRoot.innerHTML = `
      <style>${this.baseStyles}</style>
      <section class="profile">
        ${this.aboutSection}
        ${this.experienceSection}
        ${this.awardsSection}
        ${this.volunteeringSection}
        ${this.artworksSection}
      </section>
    `;
  }

  /* ───────────────────────────
   *  Styles (base only)
   * ─────────────────────────── */
  get baseStyles() {
    return `
      :host { display:block; }
      .profile { display:${this.visible ? 'block' : 'none'}; max-width:757px; margin:0 auto; padding:0 1rem; margin-top:-32px; }
      .section { background:var(--light-card-bg,#fff); border-radius:15px; padding:1.5rem; margin-bottom:1rem; box-shadow:0 2px 4px rgba(0,0,0,.05); transition:box-shadow .3s ease; }
      .section:hover { box-shadow:0 4px 8px rgba(0,0,0,.1); }
      .section-title { font-size:1.25rem; font-weight:500; color:var(--light-text-primary,#3d3d3d); cursor:pointer; user-select:none; display:flex; align-items:center; }
      .section-title::after { content:''; width:24px; height:24px; margin-left:auto; background:url('https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg') center/contain no-repeat; transition:transform .3s ease; opacity:.5; }
      .section-title.collapsed::after { transform:rotate(180deg); }
      .section-content { overflow:hidden; transition:max-height .3s ease; margin-top:1.25rem; color:var(--light-text-secondary,#575757); font-size:.9rem; line-height:1.6; }
      .item { margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid var(--light-bg,#eaebec); }
      .item:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }
      .item-title { font-size:1rem; font-weight:500; display:flex; align-items:center; justify-content:space-between; color:var(--light-text-primary,#3d3d3d); margin:0 0 .5rem 0; }
      .item-description { margin:.25rem 0; }
      .item-link { color:var(--accent-light,#f7d039); text-decoration:none; font-size:.9rem; display:flex; align-items:center; gap:.4rem; }
      .item-link img { width:16px; height:16px; }
      .item-link:hover { color:var(--accent-dark,#ffe071); }
      /* Dark mode */
      :host-context(body.dark-mode) .section { background:#171f26; }
      :host-context(body.dark-mode) .section-title { color:#f1f2f4; }
      :host-context(body.dark-mode) .section-content { color:#a3abb2; }
      :host-context(body.dark-mode) .item { border-bottom-color:#0c151d; }
      /* Responsive */
      @media (max-width:1024px) {
        .profile{padding:0 .75rem;margin-top:-26px;}
        .section{padding:1.25rem;}
        .section-title{font-size:1.125rem;}
      }
      @media (max-width:600px) {
        .profile{padding:0 .5rem;margin-top:-20px;}
        .section{padding:1rem;margin-bottom:.75rem;}
        .section-title{font-size:1rem;}
        .section-content{font-size:.85rem;margin-top:1rem;}
      }
    `;
  }

  /* ───────────────────────────
   *  Section builders
   * ─────────────────────────── */
  get aboutSection() {
    return `
      <div class="section">
        <h2 class="section-title">About</h2>
        <div class="section-content">
          ${this.data.about.paragraphs
            .map(p => `<p style="margin:0 0 1rem 0">${p}</p>`)
            .join('')}
        </div>
      </div>`;
  }

  get experienceSection() {
    return `
      <div class="section">
        <h2 class="section-title">Experience</h2>
        <div class="section-content">
          ${this.data.experience
            .map(job => `
              <div class="item">
                <h3 class="item-title">${job.title}</h3>
                <div class="item-company">${job.company}</div>
                <div class="item-date">${job.period}</div>
                <ul class="item-description">
                  ${job.responsibilities.map(r => `<li>${r}</li>`).join('')}
                </ul>
              </div>
            `)
            .join('')}
        </div>
      </div>`;
  }

  get awardsSection() {
    return `
      <div class="section">
        <h2 class="section-title">Awards</h2>
        <div class="section-content">
          ${this.data.awards
            .map(
              (award, i) => `
                <div class="item">
                  <h3 class="item-title">
                    <span>${award.year} – ${award.title}</span>
                    ${
                      award.link
                        ? `<a href="${award.link}" target="_blank" class="item-link">
                             <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/external-link.svg" alt="External">Details
                           </a>`
                        : ''
                    }
                  </h3>
                  <img
                    src="${this.getImageForType('awards', i)}"
                    alt="${award.title}"
                    style="width:100%;border-radius:8px;margin:0.5rem 0;"
                  >
                  <p class="item-description">${award.description}</p>
                </div>
              `
            )
            .join('')}
        </div>
      </div>`;
  }

  get volunteeringSection() {
    const v = this.data.volunteering;
    return `
      <div class="section">
        <h2 class="section-title">Volunteering</h2>
        <div class="section-content">
          <div class="item">
            <h3 class="item-title">
              <span>${v.organization}</span>
              <a href="https://teto.org.br" target="_blank" class="item-link">
                <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/external-link.svg" alt="External">
                Visit Website
              </a>
            </h3>
            <img
              src="${this.getImageForType('volunteering', 0)}"
              alt="Volunteer"
              style="width:100%;border-radius:8px;margin:0.5rem 0;"
            >
            <p class="item-description">${v.description}</p>
            <strong>Main experiences as volunteer:</strong>
            <ul class="item-description">
              ${v.experiences.map(exp => `<li>${exp}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>`;
  }

  get artworksSection() {
    return `
      <div class="section">
        <h2 class="section-title">Artworks</h2>
        <div class="section-content">
          ${this.data.artworks
            .map(
              (art, i) => `
                <div class="item">
                  <h3 class="item-title">
                    <span>${art.title}</span>
                    <a href="${art.link}" target="_blank" class="item-link">
                      <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/external-link.svg" alt="External">
                      View Details
                    </a>
                  </h3>
                  <img
                    src="${this.getImageForType('artworks', i)}"
                    alt="${art.title}"
                    style="width:100%;border-radius:8px;margin:0.5rem 0;"
                  >
                  <p class="item-description">${art.description}</p>
                </div>
              `
            )
            .join('')}
        </div>
      </div>`;
  }
}

customElements.define('profile-section', ProfileSection);
export default ProfileSection;
