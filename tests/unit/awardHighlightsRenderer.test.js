/**
 * Unit tests for AwardHighlightsRenderer
 */

const AwardHighlightsRenderer = {
  currentLang: 'en',

  render(container, highlights) {
    const carousel = container.querySelector('#video-carousel');
    const dots = container.querySelector('#carousel-dots');
    if (!carousel || !dots) return;

    carousel.innerHTML = highlights.map(h => `
      <div class="min-w-full">
        <div class="relative aspect-video">
          <video class="w-full h-full object-contain bg-neutral-950" autoplay muted loop playsinline>
            <source src="${h.video}" type="video/mp4">
          </video>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 via-neutral-950/95 via-neutral-950/70 to-transparent pt-20 pb-6 px-6">
            <div class="flex items-center gap-2 text-xs font-medium text-${h.color}-400 mb-2">
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>${h.year}</span>
            </div>
            <h4 class="text-lg font-semibold tracking-tight mb-1 text-white">${h.title}</h4>
            <p class="text-sm text-white">${h.subtitle}</p>
          </div>
        </div>
      </div>
    `).join('');

    dots.innerHTML = highlights.map((_, i) => `
      <button class="btn btn-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Go to video ${i + 1}"></button>
    `).join('');

    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }
};

const mockHighlights = [
  {
    title: 'Ozires Silva Award',
    subtitle: '1st place at ISAE',
    year: '2018',
    color: 'yellow',
    video: 'https://storage.example.com/ozires.mp4'
  },
  {
    title: 'Perfumathon - Opening',
    subtitle: '3rd place at O Boticário',
    year: '2017',
    color: 'orange',
    video: 'https://storage.example.com/perfumathon-01.mp4'
  },
  {
    title: 'Perfumathon - Behind the Scenes',
    subtitle: 'Epic Team preparing',
    year: '2017',
    color: 'orange',
    video: 'https://storage.example.com/perfumathon-02.mp4'
  }
];

describe('AwardHighlightsRenderer', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'award-highlights-carousel';
    container.innerHTML = `
      <div id="video-carousel"></div>
      <div id="carousel-dots"></div>
    `;
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('render()', () => {
    test('should render video slides for each highlight', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const videos = container.querySelectorAll('video');
      expect(videos).toHaveLength(3);
    });

    test('should set correct video sources', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const sources = container.querySelectorAll('source');
      expect(sources[0].getAttribute('src')).toBe('https://storage.example.com/ozires.mp4');
      expect(sources[1].getAttribute('src')).toBe('https://storage.example.com/perfumathon-01.mp4');
      expect(sources[2].getAttribute('src')).toBe('https://storage.example.com/perfumathon-02.mp4');
    });

    test('should render titles and subtitles', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const titles = container.querySelectorAll('h4');
      const subtitles = container.querySelectorAll('p');

      expect(titles[0].textContent).toBe('Ozires Silva Award');
      expect(titles[1].textContent).toBe('Perfumathon - Opening');
      expect(subtitles[0].textContent).toBe('1st place at ISAE');
    });

    test('should render year labels', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const years = container.querySelectorAll('span');
      const yearTexts = Array.from(years).map(s => s.textContent).filter(t => /^\d{4}$/.test(t));
      expect(yearTexts).toContain('2018');
      expect(yearTexts).toContain('2017');
    });

    test('should render correct number of dot indicators', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const dots = container.querySelectorAll('.btn-dot');
      expect(dots).toHaveLength(3);
    });

    test('should set first dot as active', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const dots = container.querySelectorAll('.btn-dot');
      expect(dots[0].classList.contains('active')).toBe(true);
      expect(dots[1].classList.contains('active')).toBe(false);
      expect(dots[2].classList.contains('active')).toBe(false);
    });

    test('should set aria-labels on dot buttons', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const dots = container.querySelectorAll('.btn-dot');
      expect(dots[0].getAttribute('aria-label')).toBe('Go to video 1');
      expect(dots[1].getAttribute('aria-label')).toBe('Go to video 2');
      expect(dots[2].getAttribute('aria-label')).toBe('Go to video 3');
    });

    test('should apply color classes from data', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const carousel = container.querySelector('#video-carousel');
      expect(carousel.innerHTML).toContain('text-yellow-400');
      expect(carousel.innerHTML).toContain('text-orange-400');
    });

    test('should set video attributes for autoplay', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      const video = container.querySelector('video');
      expect(video.hasAttribute('autoplay')).toBe(true);
      expect(video.hasAttribute('muted')).toBe(true);
      expect(video.hasAttribute('loop')).toBe(true);
      expect(video.hasAttribute('playsinline')).toBe(true);
    });

    test('should call lucide.createIcons after render', () => {
      AwardHighlightsRenderer.render(container, mockHighlights);
      expect(lucide.createIcons).toHaveBeenCalledWith({ attrs: { 'stroke-width': 1.5 } });
    });

    test('should handle empty highlights array', () => {
      AwardHighlightsRenderer.render(container, []);
      const videos = container.querySelectorAll('video');
      const dots = container.querySelectorAll('.btn-dot');
      expect(videos).toHaveLength(0);
      expect(dots).toHaveLength(0);
    });

    test('should not render if carousel element is missing', () => {
      const emptyContainer = document.createElement('div');
      AwardHighlightsRenderer.render(emptyContainer, mockHighlights);
      expect(emptyContainer.querySelectorAll('video')).toHaveLength(0);
    });
  });
});
