class ImageSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentIndex = 0;
    this.images = [];
    this.loadedImages = new Set();
    this.preloadCache = new Map();
    this.animationInterval = null;
    this.isComponentVisible = false;
  }

  async connectedCallback() {
    await this.loadImageData();
    this.render();
    this.setupIntersectionObserver();
  }

  async loadImageData() {
    try {
      const response = await fetch('src/data/pixelart-frames.json');
      const data = await response.json();
      this.images = data.images;
    } catch (error) {
      console.error('Failed to load image data:', error);
      this.images = [{ src: 'src/assets/images/pxart/pxArt.png', alt: 'Fallback artwork', title: 'pixelart_frame_0' }];
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isComponentVisible = true;
            this.startAnimation();
            this.preloadInitialImages();
            observer.unobserve(this);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(this);
  }

  preloadInitialImages() {
    const imagesToPreload = [0, 1, 2, 3, 4].map(i => i % this.images.length);
    imagesToPreload.forEach(index => this.preloadImage(index));
  }

  preloadImage(index) {
    if (this.preloadCache.has(index)) return this.preloadCache.get(index);

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      const imageData = this.images[index];
      
      img.onload = () => {
        this.loadedImages.add(index);
        resolve(img);
      };
      
      img.onerror = () => {
        // If WebP fails, try fallback
        if (imageData?.webp && img.src.endsWith('.webp')) {
          img.src = imageData.src;
        } else {
          reject(new Error(`Failed to load image at index ${index}`));
        }
      };

      // Try WebP first if available, otherwise use original
      img.src = imageData?.webp || imageData?.src || '';
    });

    this.preloadCache.set(index, promise);
    return promise;
  }

  disconnectedCallback() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  startAnimation() {
    if (this.animationInterval || !this.isComponentVisible) return;
    
    this.animationInterval = setInterval(() => {
      this.nextSlide();
    }, 133);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.preloadAdjacentImages();
    this.updateSlider();
  }

  preloadAdjacentImages() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    const prevIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    
    [this.currentIndex, nextIndex, prevIndex].forEach(index => {
      if (!this.loadedImages.has(index)) {
        this.preloadImage(index);
      }
    });
  }

  updateSlider() {
    const leftImage = this.shadowRoot.querySelector('.slider__image--left');
    const centerImage = this.shadowRoot.querySelector('.slider__image--center');
    const rightImage = this.shadowRoot.querySelector('.slider__image--right');

    if (!leftImage || !centerImage || !rightImage) return;

    const prevIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    const nextIndex = (this.currentIndex + 1) % this.images.length;

    const currentImg = this.images[this.currentIndex];
    const prevImg = this.images[prevIndex];
    const nextImg = this.images[nextIndex];

    if (currentImg) {
      centerImage.src = currentImg.webp || currentImg.src;
      centerImage.alt = currentImg.alt;
      centerImage.title = currentImg.title;
      centerImage.loading = 'eager';
      // Add fallback handling
      centerImage.onerror = () => {
        if (centerImage.src.endsWith('.webp')) {
          centerImage.src = currentImg.src;
        }
      };
    }
    
    if (prevImg) {
      leftImage.src = prevImg.webp || prevImg.src;
      leftImage.alt = prevImg.alt;
      leftImage.title = prevImg.title;
      leftImage.loading = 'lazy';
      leftImage.onerror = () => {
        if (leftImage.src.endsWith('.webp')) {
          leftImage.src = prevImg.src;
        }
      };
    }
    
    if (nextImg) {
      rightImage.src = nextImg.webp || nextImg.src;
      rightImage.alt = nextImg.alt;
      rightImage.title = nextImg.title;
      rightImage.loading = 'lazy';
      rightImage.onerror = () => {
        if (rightImage.src.endsWith('.webp')) {
          rightImage.src = nextImg.src;
        }
      };
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .image-slider {
          width: 760px;
          margin: 0 auto 20px;
          background-color: transparent;
          border: none;
          overflow: visible;
          position: relative;
        }
        .slider__container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 400px;
          padding: 20px;
          perspective: 1200px;
          perspective-origin: center center;
        }
        .slider__image {
          border-radius: 0;
          border: 1px solid #c0c0c0;
          transition: transform 0.5s ease, opacity 0.5s ease, border-color 0.3s ease;
          object-fit: cover;
          position: relative;
        }
        .slider__image--left {
          width: 240px;
          height: 320px;
          opacity: 0.7;
          transform: rotateY(-45deg) translateZ(-80px) scale(0.8);
          transform-origin: left center;
          margin-right: -40px;
        }
        .slider__image--right {
          width: 240px;
          height: 320px;
          opacity: 0.7;
          transform: rotateY(45deg) translateZ(-80px) scale(0.8);
          transform-origin: right center;
          margin-left: -40px;
        }
        .slider__image--center {
          width: 320px;
          height: 320px;
          opacity: 1;
          transform: translateZ(0px);
          border-color: #b8a02b;
          box-shadow: 0 4px 12px rgba(184, 160, 43, 0.3);
          z-index: 2;
        }
        .slider__description {
          display: none;
        }
        :host-context(body.dark-mode) .slider__description {
          color: var(--dark-text-primary, #f1f2f4);
        }
        :host-context(body.dark-mode) .slider__image {
          border-color: #c0c0c0;
        }
        :host-context(body.dark-mode) .slider__image--center {
          border-color: #b8a02b;
        }
        
        @media (max-width: 1024px) {
          .image-slider {
            width: 720px;
            margin: 0 auto 20px;
          }
          .slider__container {
            height: 320px;
            padding: 15px;
            perspective: 1000px;
          }
          .slider__image--left {
            width: 200px;
            height: 280px;
            transform: rotateY(-45deg) translateZ(-60px) scale(0.8);
            margin-right: -30px;
          }
          .slider__image--right {
            width: 200px;
            height: 280px;
            transform: rotateY(45deg) translateZ(-60px) scale(0.8);
            margin-left: -30px;
          }
          .slider__image--center {
            width: 280px;
            height: 280px;
          }
          .slider__description {
            font-size: 13px;
            padding: 16px;
          }
        }
        
        @media (max-width: 600px) {
          .image-slider {
            width: 380px;
            margin: 0 auto 10px;
          }
          .slider__container {
            height: 240px;
            padding: 10px;
            perspective: 800px;
          }
          .slider__image--left {
            width: 120px;
            height: 180px;
            transform: rotateY(-45deg) translateZ(-40px) scale(0.8);
            margin-right: -20px;
          }
          .slider__image--right {
            width: 120px;
            height: 180px;
            transform: rotateY(45deg) translateZ(-40px) scale(0.8);
            margin-left: -20px;
          }
          .slider__image--center {
            width: 180px;
            height: 180px;
          }
          .slider__description {
            font-size: 12px;
            padding: 12px;
          }
        }
      </style>
      <div class="image-slider">
        <div class="slider__container">
          <img class="slider__image slider__image--left" loading="lazy" alt="Previous artwork">
          <img class="slider__image slider__image--center" loading="eager" alt="Current artwork">
          <img class="slider__image slider__image--right" loading="lazy" alt="Next artwork">
        </div>
        <div class="slider__description">
          Mechanical Engineer, Software Developer
        </div>
      </div>
    `;
    
    this.updateSlider();
  }
}

customElements.define('image-slider', ImageSlider);

export default ImageSlider;