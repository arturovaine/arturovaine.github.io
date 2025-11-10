// TETO Carousel Component
// Manual carousel for TETO volunteering images

export const TetoCarousel = {
  images: [
    {
      src: './src/assets/images/teto-timelapse.gif',
      alt: 'TETO house construction timelapse'
    },
    {
      src: './src/assets/images/teto-1.jpg',
      alt: 'TETO volunteer team group photo'
    }
  ],
  currentIndex: 0,

  init() {
    this.img = document.getElementById('teto-carousel-img');
    this.counter = document.getElementById('teto-carousel-counter');
    this.prevBtn = document.getElementById('teto-carousel-prev');
    this.nextBtn = document.getElementById('teto-carousel-next');
    this.credit = document.getElementById('teto-carousel-credit');

    if (!this.img || !this.counter || !this.prevBtn || !this.nextBtn) {
      console.log('TETO Carousel: Elements not found');
      return;
    }

    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Re-initialize Lucide icons for the carousel buttons
    if (window.lucide) {
      lucide.createIcons();
    }

    this.updateImage();
    console.log('TETO Carousel: Initialized successfully');
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  },

  updateImage() {
    const image = this.images[this.currentIndex];
    this.img.src = image.src;
    this.img.alt = image.alt;
    this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

    // Show credit only for the GIF (first image)
    if (this.credit) {
      this.credit.style.display = this.currentIndex === 0 ? 'flex' : 'none';
    }
  }
};
