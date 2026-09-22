export const ComponentLoader = {
  headerComponents: ['backdrop', 'header'],
  footerComponents: ['footer', 'cookie-banner'],
  loadedComponents: new Set(),

  // Per-page configuration, declared on each page as:
  //   window.PAGE = { slots: { 'slot-id': ['component', ...] }, main: ['component', ...] }
  // - slots  : components injected into a specific static container id (home uses these)
  // - main   : section components appended into #main-content (subpages use these)
  getPageConfig() {
    const cfg = (typeof window !== 'undefined' && window.PAGE) ? window.PAGE : {};
    return { slots: cfg.slots || {}, main: cfg.main || [] };
  },

  async loadComponent(name) {
    if (this.loadedComponents.has(name)) return '';

    try {
      const response = await fetch(`./components/${name}.html`);
      if (!response.ok) throw new Error(`Failed to load ${name}: ${response.status}`);
      this.loadedComponents.add(name);
      return await response.text();
    } catch (error) {
      console.error(`Error loading component ${name}:`, error);
      return '';
    }
  },

  async loadComponentsInto(componentList, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !componentList || !componentList.length) return;

    // Fetch all fragments concurrently, then insert in declared order to preserve layout.
    const htmls = await Promise.all(componentList.map((name) => this.loadComponent(name)));
    componentList.forEach((componentName, i) => {
      container.insertAdjacentHTML('beforeend', htmls[i]);
      window.dispatchEvent(new CustomEvent('componentLoaded', { detail: { name: componentName } }));
    });
  },

  async loadAll() {
    const cfg = this.getPageConfig();

    await this.loadComponentsInto(this.headerComponents, 'header-content');

    // Page-specific slots (home: trusted-content, practices-content, ...)
    for (const [slot, comps] of Object.entries(cfg.slots)) {
      await this.loadComponentsInto(comps, slot);
    }

    // Page's main section components -> #main-content (subpages).
    // Injected eagerly in document order; off-screen images keep loading="lazy",
    // so this stays cheap while avoiding layout shift.
    await this.loadComponentsInto(cfg.main, 'main-content');

    await this.loadComponentsInto(this.footerComponents, 'footer-content');

    if (window.lucide) {
      requestIdleCallback(() => lucide.createIcons({ attrs: { 'stroke-width': 1.5 } }));
    }

    this.setupAnchorNavigation();

    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  },

  // Smooth-scroll for any in-page anchors that actually exist on the current page.
  // Cross-page links (work.html, etc.) are plain navigations and untouched here.
  setupAnchorNavigation() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();
      const headerHeight = 64;
      const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', `#${targetId}`);
    });
  }
};
