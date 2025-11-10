// Video Carousel Component
export const VideoCarousel = {
  currentIndex: 0,
  totalSlides: 3,
  carousel: null,
  indicators: null,
  videos: [],

  init() {
    this.carousel = document.getElementById('video-carousel');
    this.indicators = document.querySelectorAll('.carousel-indicator');
    this.videos = document.querySelectorAll('#video-carousel video');

    if (!this.carousel) {
      // Silently skip initialization if carousel element doesn't exist
      return;
    }

    // Setup navigation buttons
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    // Setup indicator buttons
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Auto-play carousel every 10 seconds
    setInterval(() => this.next(), 10000);

    // Initialize lucide icons for carousel buttons
    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }

    // Pause/play videos based on visibility
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

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.remove('bg-white/30', 'hover:bg-white/50');
        indicator.classList.add('bg-white');
      } else {
        indicator.classList.remove('bg-white');
        indicator.classList.add('bg-white/30', 'hover:bg-white/50');
      }
    });

    // Update video playback
    this.updateVideoPlayback();
  },

  updateVideoPlayback() {
    // Pause all videos first
    this.videos.forEach((video) => {
      video.pause();
    });

    // Play only the current video
    if (this.videos[this.currentIndex]) {
      const currentVideo = this.videos[this.currentIndex];

      // Ensure video is muted (required for autoplay)
      currentVideo.muted = true;

      currentVideo.play().catch(() => {
        // Silently handle autoplay prevention
      });
    }
  }
};
