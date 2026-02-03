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
    const centerImg = document.getElementById('slider-center');

    if (placeholder) placeholder.style.display = 'none';
    if (centerImg) centerImg.style.opacity = '1';
  },

  fixPath(path) {
    return path.startsWith('src/') ? '/' + path : path;
  },

  update() {
    const centerImg = document.getElementById('slider-center');

    if (!centerImg || this.images.length === 0) return;

    const currentImg = this.images[this.currentIndex];

    if (currentImg) {
      centerImg.src = this.fixPath(currentImg.webp || currentImg.src);
      centerImg.alt = currentImg.alt || 'Pixel Art';
      centerImg.title = currentImg.title || '';
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
