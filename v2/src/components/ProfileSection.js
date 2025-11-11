import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

class ProfileSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.visible = false;
    this.data = null;
    this.currentModal = null;
  }

  async connectedCallback() {
    await this.loadData();
    this.render();
    this.setupCollapsibleSections();
    this.setupModalListeners();
    
    document.addEventListener('tab-changed', (e) => {
      this.visible = e.detail.tab === 'profile';
      this.shadowRoot.querySelector('.profile').style.display = this.visible ? 'block' : 'none';
    });
  }

  async loadData() {
    try {
      const response = await fetch('/src/data/profile.json');
      this.data = await response.json();
    } catch (error) {
      console.error('Error loading profile data:', error);
      this.data = { about: {}, experience: [], awards: [], volunteering: {}, artworks: [] };
    }
  }

  setupCollapsibleSections() {
    const sections = this.shadowRoot.querySelectorAll('.section');
    sections.forEach(section => {
      const title = section.querySelector('.section-title');
      const content = section.querySelector('.section-content');
      
      title.addEventListener('click', () => {
        const isExpanded = content.style.maxHeight !== '0px';
        content.style.maxHeight = isExpanded ? '0px' : content.scrollHeight + 'px';
        title.classList.toggle('collapsed');
      });
      
      content.style.maxHeight = content.scrollHeight + 'px';
    });
  }

  setupModalListeners() {
    const modal = this.shadowRoot.querySelector('.modal');
    const closeBtn = this.shadowRoot.querySelector('.modal-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal) {
        modal.classList.remove('active');
      }
    });

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  }

  openModal(type, index) {
    const modal = this.shadowRoot.querySelector('.modal');
    const carousel = this.shadowRoot.querySelector('.swiper');
    
    let items;
    let title;
    
    switch(type) {
      case 'awards':
        items = this.data.awards;
        title = 'Awards';
        break;
      case 'volunteering':
        items = [this.data.volunteering];
        title = 'Volunteering';
        break;
      case 'artworks':
        items = this.data.artworks;
        title = 'Artworks';
        break;
    }

    const swiperWrapper = carousel.querySelector('.swiper-wrapper');
    swiperWrapper.innerHTML = items.map((item, i) => `
      <div class="swiper-slide">
        <img src="${this.getImageForType(type, i)}" alt="${item.title}" class="carousel-image">
        <div class="carousel-caption">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </div>
    `).join('');

    if (this.swiper) {
      this.swiper.destroy();
    }

    this.swiper = new Swiper(carousel, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      initialSlide: index,
    });

    modal.classList.add('active');
  }

  getImageForType(type, index) {
    const images = {
      awards: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
      ],
      volunteering: [
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
      ],
      artworks: [
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
      ]
    };

    return images[type][index] || images[type][0];
  }

  render() {
    if (!this.data) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        ${this.getModalStyles()}
      </style>
      
      <section class="profile">
        ${this.getAboutSection()}
        ${this.getExperienceSection()}
        ${this.getAwardsSection()}
        ${this.getVolunteeringSection()}
        ${this.getArtworksSection()}
      </section>

      <div class="modal">
        <div class="modal-content">
          <button class="modal-close">×</button>
          <div class="swiper">
            <div class="swiper-wrapper"></div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </div>
      </div>
    `;
  }

  getBaseStyles() {
    return `
      :host {
        display: block;
      }
      .profile {
        display: ${this.visible ? 'block' : 'none'};
        max-width: 757px;
        margin: 0 auto;
        padding: 0 1rem;
        margin-top: -32px;
      }
      .section {
        background-color: var(--light-card-bg, #ffffff);
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: all var(--transition-time, 0.7s) ease;
      }
      .section:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .section-title {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--light-text-primary, #3d3d3d);
        margin: 0;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        user-select: none;
        transition: color var(--transition-time, 0.7s) ease;
      }
      .section-title::after {
        content: '';
        width: 24px;
        height: 24px;
        margin-left: auto;
        background-image: url('https://raw.githubusercontent.com/feathericons/feather/master/icons/chevron-up.svg');
        background-size: contain;
        background-repeat: no-repeat;
        transition: transform 0.3s ease;
        opacity: 0.5;
      }
      .section-title.collapsed::after {
        transform: rotate(180deg);
      }
      .section-content {
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        margin-top: 1.25rem;
        color: var(--light-text-secondary, #575757);
        font-size: 0.9rem;
        line-height: 1.6;
      }
      .item {
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--light-bg, #eaebec);
        cursor: pointer;
        transition: transform 0.3s ease;
      }
      .item:hover {
        transform: translateY(-3px);
      }
      .item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      .item-title {
        font-size: 1rem;
        font-weight: 500;
        color: var(--light-text-primary, #3d3d3d);
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .item-link {
        color: var(--accent-light, #f7d039);
        text-decoration: none;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.3s ease;
      }
      .item-link:hover {
        color: var(--accent-dark, #ffe071);
      }
      .item-link img {
        width: 16px;
        height: 16px;
      }
      
      :host-context(body.dark-mode) .section {
        background-color: var(--dark-card-bg, #171f26);
      }
      :host-context(body.dark-mode) .section-title,
      :host-context(body.dark-mode) .item-title {
        color: var(--dark-text-primary, #f1f2f4);
      }
      :host-context(body.dark-mode) .section-content,
      :host-context(body.dark-mode) .item-description {
        color: var(--dark-text-secondary, #a3abb2);
      }
      :host-context(body.dark-mode) .item {
        border-bottom-color: var(--dark-bg, #0c151d);
      }
      
      @media (max-width: 1024px) {
        .profile {
          padding: 0 0.75rem;
          margin-top: -26px;
        }
        .section {
          padding: 1.25rem;
        }
        .section-title {
          font-size: 1.125rem;
        }
        .item-title {
          font-size: 0.95rem;
        }
      }
      
      @media (max-width: 600px) {
        .profile {
          padding: 0 0.5rem;
          margin-top: -20px;
        }
        .section {
          padding: 1rem;
          margin-bottom: 0.75rem;
        }
        .section-title {
          font-size: 1rem;
        }
        .section-content {
          font-size: 0.85rem;
          margin-top: 1rem;
        }
        .item-title {
          font-size: 0.9rem;
        }
        .item-description {
          font-size: 0.85rem;
        }
      }
    `;
  }

  getModalStyles() {
    return `
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .modal.active {
        display: flex;
        opacity: 1;
      }
      .modal-content {
        position: relative;
        width: 90%;
        max-width: 800px;
        margin: auto;
        background: var(--light-card-bg, #ffffff);
        border-radius: 15px;
        overflow: hidden;
      }
      .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border: none;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        z-index: 2;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
      }
      .modal-close:hover {
        background: rgba(0, 0, 0, 0.7);
      }
      .swiper {
        width: 100%;
        height: 500px;
      }
      .swiper-slide {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .carousel-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .carousel-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
      }
      .carousel-caption h3 {
        margin: 0 0 10px 0;
        font-size: 1.2rem;
      }
      .carousel-caption p {
        margin: 0;
        font-size: 0.9rem;
      }
      .swiper-button-next,
      .swiper-button-prev {
        color: white !important;
      }
      .swiper-pagination-bullet {
        background: white !important;
      }
      
      :host-context(body.dark-mode) .modal-content {
        background: var(--dark-card-bg, #171f26);
      }
      
      @media (max-width: 1024px) {
        .swiper {
          height: 400px;
        }
      }
      
      @media (max-width: 600px) {
        .swiper {
          height: 300px;
        }
        .carousel-caption h3 {
          font-size: 1rem;
        }
        .carousel-caption p {
          font-size: 0.8rem;
        }
      }
    `;
  }

  getAboutSection() {
    return `
      <div class="section">
        <h2 class="section-title">About</h2>
        <div class="section-content">
          ${this.data.about.paragraphs.map(p => `
            <p style="margin: 0 0 1rem 0">${p}</p>
          `).join('')}
        </div>
      </div>
    `;
  }

  getExperienceSection() {
    return `
      <div class="section">
        <h2 class="section-title">Experience</h2>
        <div class="section-content">
          ${this.data.experience.map(job => `
            <div class="item">
              <h3 class="item-title">${job.title}</h3>
              <div class="item-company">${job.company}</div>
              <div class="item-date">${job.period}</div>
              <ul class="item-description">
                ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getAwardsSection() {
    return `
      <div class="section">
        <h2 class="section-title">Awards</h2>
        <div class="section-content">
          ${this.data.awards.map((award, index) => `
            <div class="item" onclick="this.getRootNode().host.openModal('awards', ${index})">
              <h3 class="item-title">
                ${award.year} - ${award.title}
                <a href="#" class="item-link" onclick="event.stopPropagation()">
                  <img src="src/assets/icons/external-link.svg" alt="External link">
                  View Details
                </a>
              </h3>
              <p class="item-description">${award.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getVolunteeringSection() {
    return `
      <div class="section">
        <h2 class="section-title">Volunteering</h2>
        <div class="section-content">
          <div class="item" onclick="this.getRootNode().host.openModal('volunteering', 0)">
            <h3 class="item-title">
              ${this.data.volunteering.organization}
              <a href="https://teto.org.br" target="_blank" class="item-link" onclick="event.stopPropagation()">
                <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/external-link.svg" alt="External link">
                Visit Website
              </a>
            </h3>
            <p class="item-description">${this.data.volunteering.description}</p>
            <strong>Main experiences as volunteer:</strong>
            <ul class="item-description">
              ${this.data.volunteering.experiences.map(exp => `<li>${exp}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  getArtworksSection() {
    return `
      <div class="section">
        <h2 class="section-title">Artworks</h2>
        <div class="section-content">
          ${this.data.artworks.map((artwork, index) => `
            <div class="item" onclick="this.getRootNode().host.openModal('artworks', ${index})">
              <h3 class="item-title">
                ${artwork.title}
                <a href="${artwork.link}" class="item-link" onclick="event.stopPropagation()">
                  <img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/external-link.svg" alt="External link">
                  View Details
                </a>
              </h3>
              <p class="item-description">${artwork.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('profile-section', ProfileSection);

export default ProfileSection;