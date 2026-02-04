export const BootstrappingRenderer = {
  loaded: false,

  init() {
    const container = document.getElementById('bootstrapping-content');
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loaded) {
        this.loaded = true;
        this.loadAndRender(container);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    observer.observe(container);
  },

  async loadAndRender(container) {
    try {
      const response = await fetch('./data/bootstrapping.json');
      const data = await response.json();
      this.render(container, data);
      if (window.lucide) lucide.createIcons();
    } catch (error) {
      console.error('Failed to load bootstrapping:', error);
    }
  },

  renderFeatures(features) {
    return features.map(f => `
      <li class="flex items-start gap-2 text-sm text-neutral-300">
        <i data-lucide="check" class="w-4 h-4 mt-0.5 text-emerald-400"></i>
        <span>${f}</span>
      </li>
    `).join('');
  },

  renderLinks(links) {
    if (!links || links.length === 0) return '';
    return `
      <div class="space-y-3">
        ${links.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-neutral-200 hover:bg-white/[0.05]">
            <i data-lucide="${link.icon}" class="w-4 h-4"></i>
            ${link.text}
          </a>
        `).join('')}
      </div>
    `;
  },

  renderModelViewer(modelViewer) {
    if (!modelViewer) return '';
    return `
      <div class="relative">
        <div class="absolute -inset-1 rounded-xl bg-gradient-to-tr from-emerald-500/10 via-blue-500/5 to-emerald-500/10 blur-3xl opacity-30"></div>
        <div class="relative border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl" style="border-radius: 15px;">
          <div class="flex items-center gap-1 px-4 py-3 border-b border-white/10 bg-neutral-950/60">
            <span class="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
            <span class="ml-2 text-sm text-neutral-400">${modelViewer.fileName}</span>
            <div class="ml-auto flex items-center gap-2 text-xs text-neutral-500">
              <i data-lucide="box" class="w-3.5 h-3.5"></i>
              <span>3D Model</span>
            </div>
          </div>
          <div id="model-viewer-container" class="w-full h-[500px] md:h-[600px] relative bg-neutral-950">
            <div id="loading-indicator" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-neutral-400 z-10">
              <div class="flex flex-col items-center gap-3">
                <i data-lucide="loader-2" class="w-6 h-6 animate-spin"></i>
                <span>Loading 3D model...</span>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 border-t border-white/10 bg-neutral-950/60">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex items-start gap-2">
                <i data-lucide="info" class="w-4 h-4 mt-0.5 text-neutral-400"></i>
                <div>
                  <p class="text-sm text-neutral-300">Interactive 3D Viewer</p>
                  <p class="text-xs text-neutral-500 mt-0.5">CAD model designed in SolidWorks, rendered using Three.js. Drag to rotate, scroll to zoom.</p>
                </div>
              </div>
              <a href="${modelViewer.behanceUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-neutral-200 hover:bg-white/[0.05] outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                <i data-lucide="external-link" class="w-4 h-4"></i>
                View on Behance
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderMediaCard(media) {
    return `
      <div class="border border-white/10 bg-neutral-900/60 overflow-hidden" style="border-radius: 15px;">
        <div class="aspect-[4/3] bg-neutral-950">
          <img loading="lazy" src="${media.image}" alt="${media.alt}" class="h-full w-full object-cover">
        </div>
        <div class="p-4">
          <div class="flex items-center gap-2 text-sm text-neutral-300">
            <i data-lucide="${media.captionIcon}" class="w-4 h-4"></i>
            <span>${media.caption}</span>
          </div>
        </div>
      </div>
    `;
  },

  renderBionicHand(project) {
    return `
      <div class="mb-16">
        <h3 class="text-2xl font-semibold tracking-tight mb-6">${project.title}</h3>
        <p class="text-neutral-400 mb-8">${project.subtitle}</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="border border-white/10 bg-neutral-900/60 overflow-hidden" style="border-radius: 15px;">
            <img loading="lazy" src="${project.heroImage}" alt="${project.heroImageAlt}" class="w-full h-full object-cover">
          </div>

          <div class="border border-white/10 bg-neutral-900/60 p-6" style="border-radius: 15px;">
            <h4 class="text-xl font-semibold tracking-tight mb-4">Project Background</h4>
            ${project.background.map(p => `<p class="text-neutral-300 leading-relaxed mb-4">${p}</p>`).join('')}

            ${this.renderLinks(project.links)}

            <div class="mt-6 pt-6 border-t border-white/10">
              <h5 class="text-sm font-medium text-neutral-400 mb-3">Key Features</h5>
              <ul class="space-y-2">
                ${this.renderFeatures(project.features)}
              </ul>
            </div>
          </div>
        </div>

        ${this.renderModelViewer(project.modelViewer)}
      </div>
    `;
  },

  renderMedicationAid(project) {
    return `
      <div>
        <h3 class="text-2xl font-semibold tracking-tight mb-6">${project.title}</h3>
        <p class="text-neutral-400 mb-8">${project.subtitle}</p>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div class="lg:col-span-7">
            <div class="border border-white/10 bg-neutral-900/60 p-6" style="border-radius: 15px;">
              <h4 class="text-xl font-semibold tracking-tight mb-4">Project Overview</h4>
              ${project.background.map(p => `<p class="text-neutral-300 leading-relaxed mb-4">${p}</p>`).join('')}

              <div class="mt-6 pt-6 border-t border-white/10">
                <h5 class="text-sm font-medium text-neutral-400 mb-3">Key Features</h5>
                <ul class="space-y-2">
                  ${this.renderFeatures(project.features)}
                </ul>
              </div>
            </div>
          </div>

          <aside class="lg:col-span-5">
            <div class="space-y-4">
              ${project.media.map(m => this.renderMediaCard(m)).join('')}
            </div>
          </aside>
        </div>
      </div>
    `;
  },

  render(container, data) {
    const bionicHand = data.projects.find(p => p.id === 'bionic-hand');
    const medicationAid = data.projects.find(p => p.id === 'medication-aid');

    container.innerHTML = `
      <div class="mb-12">
        <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">${data.title}</h2>
        <p class="text-neutral-400 mb-4">${data.description}</p>
        <div class="inline-flex items-start gap-2 border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-neutral-300" style="border-radius: 15px;">
          <i data-lucide="info" class="w-4 h-4 mt-0.5 flex-shrink-0"></i>
          <p>${data.infoBox}</p>
        </div>
      </div>

      ${bionicHand ? this.renderBionicHand(bionicHand) : ''}
      ${medicationAid ? this.renderMedicationAid(medicationAid) : ''}
    `;
  }
};
