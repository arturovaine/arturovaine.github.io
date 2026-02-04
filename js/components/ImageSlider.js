export const ImageSlider = {
  images: [],
  currentIndex: 0,
  interval: null,
  preloadCache: new Map(),
  PRELOAD_AHEAD: 5,

  async init() {
    try {
      const response = await fetch('./src/data/pixelart-frames.json');
      const data = await response.json();
      this.images = data.images || [];

      if (this.images.length > 0) {
        await this.preloadInitialImages();
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

  fixPath(path) {
    return path.startsWith('src/') ? '/' + path : path;
  },

  getImageSrc(img) {
    return this.fixPath(img.webp || img.src);
  },

  preloadImage(index) {
    if (index < 0 || index >= this.images.length) return;
    const src = this.getImageSrc(this.images[index]);
    if (this.preloadCache.has(src)) return;

    const img = new Image();
    img.src = src;
    this.preloadCache.set(src, img);
  },

  async preloadInitialImages() {
    const promises = [];
    for (let i = 0; i < Math.min(this.PRELOAD_AHEAD, this.images.length); i++) {
      const src = this.getImageSrc(this.images[i]);
      const img = new Image();
      promises.push(new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      }));
      this.preloadCache.set(src, img);
    }
    await Promise.all(promises);
  },

  preloadUpcoming() {
    for (let i = 1; i <= this.PRELOAD_AHEAD; i++) {
      const nextIndex = (this.currentIndex + i) % this.images.length;
      this.preloadImage(nextIndex);
    }
  },

  showImages() {
    const placeholder = document.getElementById('slider-placeholder');
    const centerImg = document.getElementById('slider-center');

    if (placeholder) placeholder.style.display = 'none';
    if (centerImg) centerImg.style.opacity = '1';
  },

  update() {
    const centerImg = document.getElementById('slider-center');

    if (!centerImg || this.images.length === 0) return;

    const currentImg = this.images[this.currentIndex];

    if (currentImg) {
      centerImg.src = this.getImageSrc(currentImg);
      centerImg.alt = currentImg.alt || 'Pixel Art';
      centerImg.title = currentImg.title || '';
    }

    this.preloadUpcoming();
  },

  startAnimation() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.update();
    }, 133);
  }
};
