export const ExperienceRenderer = {
  loaded: false,

  init() {
    const container = document.getElementById('experience-timeline');
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
      const response = await fetch('./data/experience.json');
      const experiences = await response.json();
      this.render(container, experiences);
    } catch (error) {
      console.error('Failed to load experience:', error);
    }
  },

  renderDescription(description) {
    if (Array.isArray(description)) {
      return `
        <ul class="mt-2 space-y-1">
          ${description.map(item => `
            <li class="flex items-start gap-2 text-sm text-neutral-400">
              <span class="text-neutral-500 mt-1">•</span>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      `;
    }
    return `<p class="mt-2 text-sm text-neutral-400">${description}</p>`;
  },

  renderItem(experience, isLast) {
    const marginClass = isLast ? '' : 'mb-10';
    const logoHtml = experience.logo ? `
      <img src="${experience.logo}" alt="${experience.title}" class="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0">
    ` : '<div class="w-12 h-12 flex-shrink-0"></div>';

    return `
      <li class="ml-6 ${marginClass}">
        <span class="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full bg-white"></span>
        <div class="border border-white/10 bg-neutral-900/60 p-4" style="border-radius: 15px;">
          <div class="flex gap-4">
            ${logoHtml}
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <h3 class="text-lg font-semibold tracking-tight">${experience.title}</h3>
                <div class="text-sm text-neutral-300">${experience.location}</div>
              </div>
              <div class="text-sm text-neutral-400 mt-1">${experience.period}</div>
              ${this.renderDescription(experience.description)}
            </div>
          </div>
        </div>
      </li>
    `;
  },

  render(container, experiences) {
    container.innerHTML = experiences
      .map((exp, index) => this.renderItem(exp, index === experiences.length - 1))
      .join('');
  }
};
