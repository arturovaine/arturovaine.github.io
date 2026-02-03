export const VideoCarousel = {
  currentIndex: 0,
  totalSlides: 3,
  carousel: null,
  indicators: null,
  videos: [],

  init() {
    this.carousel = document.getElementById('video-carousel');
    this.indicators = document.querySelectorAll('.btn-dot[data-index]');
    this.videos = document.querySelectorAll('#video-carousel video');

    if (!this.carousel) {
      return;
    }

    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    setInterval(() => this.next(), 10000);

    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    this.updateVideoPlayback();
  },

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateCarousel();
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  },

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.carousel.style.transform = `translateX(${offset}%)`;

    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    this.updateVideoPlayback();
  },

  updateVideoPlayback() {
    this.videos.forEach((video) => {
      video.pause();
    });

    if (this.videos[this.currentIndex]) {
      const currentVideo = this.videos[this.currentIndex];
      currentVideo.muted = true;
      currentVideo.play().catch(() => {});
    }
  }
};
