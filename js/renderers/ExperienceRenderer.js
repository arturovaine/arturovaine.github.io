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

  renderItem(experience, isLast) {
    const marginClass = isLast ? '' : 'mb-10';
    const logoHtml = experience.logo ? `
      <img src="${experience.logo}" alt="${experience.title}" class="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0">
    ` : '';

    return `
      <li class="ml-6 ${marginClass}">
        <span class="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full bg-white"></span>
        <div class="border border-white/10 bg-neutral-900/60 p-4" style="border-radius: 15px;">
          <div class="flex items-center justify-between">
            <div class="text-sm text-neutral-400">${experience.period}</div>
            <div class="text-sm text-neutral-300">${experience.location}</div>
          </div>
          <div class="flex items-center gap-3 mt-2">
            ${logoHtml}
            <h3 class="text-lg font-semibold tracking-tight">${experience.title}</h3>
          </div>
          <p class="mt-2 text-sm text-neutral-400">${experience.description}</p>
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
