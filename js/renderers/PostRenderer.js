export const PostRenderer = {
  posts: [],
  loaded: false,

  init() {
    const container = document.getElementById('posts-grid');
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
      const response = await fetch('./data/posts.json');
      this.posts = await response.json();
      this.render(container);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  },

  renderCard(post) {
    const tags = post.tags.map(tag =>
      `<span class="rounded-md border border-white/10 bg-white/[0.02] px-2 py-1">${tag}</span>`
    ).join('');

    return `
      <article class="group border border-white/10 bg-neutral-900/60 overflow-hidden hover:border-white/20 transition-colors" style="border-radius: 15px;">
        <a href="${post.url}" target="_blank" rel="noopener" class="block aspect-[16/10] overflow-hidden bg-neutral-950">
          <img loading="lazy" src="${post.image}" alt="${post.alt}" class="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300">
        </a>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold tracking-tight">${post.title}</h3>
            <a href="${post.url}" target="_blank" rel="noopener" class="p-1.5 rounded-md text-neutral-300 hover:text-white hover:bg-white/[0.06]" aria-label="Read article">
              <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
          </div>
          <p class="mt-1 text-sm text-neutral-400">${post.description}</p>
          <div class="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-300">
            ${tags}
          </div>
        </div>
      </article>
    `;
  },

  render(container) {
    container.innerHTML = this.posts.map(post => this.renderCard(post)).join('');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};
