export const ImageSlider = {
  images: [],
  currentIndex: 0,
  interval: null,

  async init() {
    try {
      const response = await fetch('./src/data/pixelart-frames.json');
      const data = await response.json();
      this.images = data.images || [];

      if (this.images.length > 0) {
        this.update();
        this.showImages();
        this.startAnimation();
      }
    } catch (error) {
      console.error('Failed to load image slider data:', error);
      this.images = [
        { src: './src/assets/images/pxart/pxArt.png', alt: 'Pixel Art', title: 'Pixel Art' }
      ];
      this.update();
      this.showImages();
    }
  },

  showImages() {
    const placeholder = document.getElementById('slider-placeholder');
    const leftImg = document.getElementById('slider-left');
    const centerImg = document.getElementById('slider-center');
    const rightImg = document.getElementById('slider-right');

    if (placeholder) placeholder.style.display = 'none';
    if (leftImg) leftImg.style.opacity = '0.7';
    if (centerImg) centerImg.style.opacity = '1';
    if (rightImg) rightImg.style.opacity = '0.7';
  },

  fixPath(path) {
    return path.startsWith('src/') ? '/' + path : path;
  },

  update() {
    const leftImg = document.getElementById('slider-left');
    const centerImg = document.getElementById('slider-center');
    const rightImg = document.getElementById('slider-right');

    if (!leftImg || !centerImg || !rightImg || this.images.length === 0) return;

    const prevIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    const nextIndex = (this.currentIndex + 1) % this.images.length;

    const currentImg = this.images[this.currentIndex];
    const prevImg = this.images[prevIndex];
    const nextImg = this.images[nextIndex];

    if (currentImg) {
      centerImg.src = this.fixPath(currentImg.webp || currentImg.src);
      centerImg.alt = currentImg.alt || 'Current artwork';
      centerImg.title = currentImg.title || '';
    }

    if (prevImg) {
      leftImg.src = this.fixPath(prevImg.webp || prevImg.src);
      leftImg.alt = prevImg.alt || 'Previous artwork';
      leftImg.title = prevImg.title || '';
    }

    if (nextImg) {
      rightImg.src = this.fixPath(nextImg.webp || nextImg.src);
      rightImg.alt = nextImg.alt || 'Next artwork';
      rightImg.title = nextImg.title || '';
    }
  },

  startAnimation() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.update();
    }, 133);
  }
};
