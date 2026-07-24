export const VideoCarousel = {
  currentIndex: 0,
  carousel: null,
  autoPlayTimer: null,

  init() {
    this.carousel = document.getElementById('video-carousel');
    if (!this.carousel) return;

    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    document.getElementById('award-highlights-carousel')?.addEventListener('click', (e) => {
      const dot = e.target.closest('.btn-dot[data-index]');
      if (dot) this.goToSlide(parseInt(dot.dataset.index, 10));
    });

    this.startAutoPlay();

    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });

    this.updateVideoPlayback();
  },

  get totalSlides() {
    return this.carousel ? this.carousel.querySelectorAll(':scope > div').length : 0;
  },

  startAutoPlay() {
    if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
    this.autoPlayTimer = setInterval(() => this.next(), 10000);
  },

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  },

  next() {
    const total = this.totalSlides;
    if (total === 0) return;
    this.currentIndex = (this.currentIndex + 1) % total;
    this.updateCarousel();
  },

  prev() {
    const total = this.totalSlides;
    if (total === 0) return;
    this.currentIndex = (this.currentIndex - 1 + total) % total;
    this.updateCarousel();
  },

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.carousel.style.transform = `translateX(${offset}%)`;

    document.querySelectorAll('.btn-dot[data-index]').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });

    this.updateVideoPlayback();
  },

  updateVideoPlayback() {
    const slides = this.carousel ? this.carousel.querySelectorAll(':scope > div') : [];
    slides.forEach((slide, index) => {
      const video = slide.querySelector('video');
      if (!video) return;
      if (index === this.currentIndex) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }
};
