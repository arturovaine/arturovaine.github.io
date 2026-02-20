import { ThemeManager } from './components/ThemeManager.js';

export const MetaprojectLoader = {
  components: [
    'metaproject-header',
    'metaproject-hero',
    'metaproject-architecture',
    'metaproject-timeline',
    'metaproject-techstack',
    'metaproject-cta',
    'metaproject-footer'
  ],

  async loadComponent(name) {
    try {
      const response = await fetch(`./components/${name}.html`);
      if (!response.ok) throw new Error(`Failed to load ${name}: ${response.status}`);
      return await response.text();
    } catch (error) {
      console.error(`Error loading component ${name}:`, error);
      return '';
    }
  },

  async loadAll() {
    const headerContainer = document.getElementById('metaproject-header');
    const mainContainer = document.getElementById('metaproject-main');
    const footerContainer = document.getElementById('metaproject-footer');

    // Load header
    if (headerContainer) {
      const headerHtml = await this.loadComponent('metaproject-header');
      headerContainer.innerHTML = headerHtml;
    }

    // Load main content components
    if (mainContainer) {
      const mainComponents = [
        'metaproject-hero',
        'metaproject-architecture',
        // 'metaproject-timeline',
        'metaproject-techstack',
        'metaproject-cta'
      ];

      for (const componentName of mainComponents) {
        const html = await this.loadComponent(componentName);
        mainContainer.insertAdjacentHTML('beforeend', html);
      }
    }

    // Load footer
    if (footerContainer) {
      const footerHtml = await this.loadComponent('metaproject-footer');
      footerContainer.innerHTML = footerHtml;
    }

    // Initialize Lucide icons
    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    // Initialize theme manager
    ThemeManager.init();

    // Setup mobile menu
    this.setupMobileMenu();

    // Setup active nav state
    this.setupActiveNav();

    // Setup scroll to top button
    this.setupScrollToTop();

    // Setup performance grid
    this.setupPerfGrid();

    window.dispatchEvent(new CustomEvent('metaprojectLoaded'));
  },

  setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        const isOpen = !mobileNav.classList.contains('hidden');
        mobileNav.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', !isOpen);
      });

      // Close menu when clicking a link
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.add('hidden');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  },

  setupActiveNav() {
    const sections = ['architecture', 'diagrams', 'tech-stack', 'performance'];
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            if (isActive) {
              link.classList.add('text-white', 'bg-white/40', 'font-semibold', 'ring-2', 'ring-white/50');
              link.classList.remove('text-neutral-400', 'font-normal');
            } else {
              link.classList.remove('text-white', 'bg-white/40', 'font-semibold', 'ring-2', 'ring-white/50');
              link.classList.add('text-neutral-400', 'font-normal');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  },

  setupPerfGrid() {
    const items = document.querySelectorAll('.perf-item');
    const detail = document.getElementById('perf-detail');
    const detailCategory = document.getElementById('perf-detail-category');
    const detailTitle = document.getElementById('perf-detail-title');
    const detailDesc = document.getElementById('perf-detail-desc');
    const detailExtra = document.getElementById('perf-detail-extra');
    const detailClose = document.getElementById('perf-detail-close');

    if (!detail) return;

    // Set initial state for animation
    detail.style.maxHeight = '0';
    detail.style.opacity = '0';
    detail.style.overflow = 'hidden';
    detail.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';

    let activeItem = null;

    const showDetail = (item) => {
      detailCategory.textContent = item.dataset.category;
      detailTitle.textContent = item.dataset.title;
      detailDesc.textContent = item.dataset.desc;

      // Load template content
      const tplId = item.dataset.tpl;
      const tpl = document.getElementById(tplId);
      if (tpl && detailExtra) {
        detailExtra.innerHTML = '';
        detailExtra.appendChild(tpl.content.cloneNode(true));
        // Re-initialize lucide icons in the new content
        if (window.lucide) {
          lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
        }
      }

      detail.classList.remove('hidden');
      // Trigger reflow
      detail.offsetHeight;
      detail.style.maxHeight = '400px';
      detail.style.opacity = '1';

      // Highlight active item
      items.forEach(i => i.classList.remove('ring-2', 'ring-white/30'));
      item.classList.add('ring-2', 'ring-white/30');
      activeItem = item;
    };

    const hideDetail = () => {
      detail.style.maxHeight = '0';
      detail.style.opacity = '0';
      setTimeout(() => detail.classList.add('hidden'), 300);
      items.forEach(i => i.classList.remove('ring-2', 'ring-white/30'));
      activeItem = null;
    };

    items.forEach(item => {
      item.addEventListener('click', () => {
        if (activeItem === item) {
          hideDetail();
        } else {
          showDetail(item);
        }
      });
    });

    detailClose?.addEventListener('click', hideDetail);

    // Filter functionality
    const filters = document.querySelectorAll('.perf-filter');

    // Add smooth transition styles to all items
    items.forEach(item => {
      item.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        const category = filter.dataset.filter;

        // Update active state
        filters.forEach(f => {
          f.classList.remove('active', 'bg-white/20', 'text-white', 'border-white/30');
          if (f.dataset.filter !== 'all') {
            const colorMap = { Loading: 'blue', Assets: 'purple', Rendering: 'cyan', CSS: 'orange' };
            const color = colorMap[f.dataset.filter];
            f.classList.add(`border-${color}-500/30`, `text-${color}-400`);
          }
        });
        filter.classList.add('active', 'bg-white/20', 'text-white', 'border-white/30');

        // Filter items with staggered animation
        items.forEach((item, index) => {
          const shouldShow = category === 'all' || item.dataset.category === category;
          const delay = shouldShow ? index * 40 : 0;

          setTimeout(() => {
            if (shouldShow) {
              item.style.display = '';
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  item.style.opacity = '1';
                  item.style.transform = 'scale(1)';
                });
              });
            } else {
              item.style.opacity = '0';
              item.style.transform = 'scale(0.97)';
              setTimeout(() => {
                item.style.display = 'none';
              }, 500);
            }
          }, delay);
        });

        // Hide detail if open
        hideDetail();
      });
    });
  },

  setupScrollToTop() {
    // Create button
    const btn = document.createElement('button');
    btn.id = 'scrollToTop';
    btn.className = 'fixed bottom-6 right-6 z-40 p-3 rounded-full border border-white/10 bg-neutral-900/90 text-neutral-400 hover:text-white hover:border-white/20 transition-all duration-300 opacity-0 invisible';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
    document.body.appendChild(btn);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.remove('opacity-0', 'invisible');
        btn.classList.add('opacity-100', 'visible');
      } else {
        btn.classList.remove('opacity-100', 'visible');
        btn.classList.add('opacity-0', 'invisible');
      }
    });

    // Scroll to top on click
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  MetaprojectLoader.loadAll();
});
