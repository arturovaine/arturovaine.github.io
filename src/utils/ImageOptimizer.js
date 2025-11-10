/**
 * Image Optimization Utilities
 * Provides WebP support with fallbacks and lazy loading helpers
 */

class ImageOptimizer {
  constructor() {
    this.webpSupport = null;
    this.checkWebPSupport();
  }

  /**
   * Check if browser supports WebP format
   */
  async checkWebPSupport() {
    if (this.webpSupport !== null) return this.webpSupport;

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.webpSupport = (webP.height === 2);
        resolve(this.webpSupport);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get optimized image source with WebP fallback
   */
  async getOptimizedSrc(originalSrc) {
    const supportsWebP = await this.checkWebPSupport();
    
    if (supportsWebP && originalSrc.match(/\.(jpg|jpeg|png)$/i)) {
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Check if WebP version exists
      try {
        const response = await fetch(webpSrc, { method: 'HEAD' });
        if (response.ok) {
          return webpSrc;
        }
      } catch (error) {
        // WebP doesn't exist, fallback to original
      }
    }
    
    return originalSrc;
  }

  /**
   * Create a picture element with WebP support
   */
  createPictureElement(src, alt = '', className = '', loading = 'lazy') {
    const picture = document.createElement('picture');
    
    // Add WebP source if available
    if (src.match(/\.(jpg|jpeg|png)$/i)) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const sourceWebP = document.createElement('source');
      sourceWebP.srcset = webpSrc;
      sourceWebP.type = 'image/webp';
      picture.appendChild(sourceWebP);
    }
    
    // Add fallback image
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = loading;
    if (className) img.className = className;
    
    picture.appendChild(img);
    
    return picture;
  }

  /**
   * Preload critical images
   */
  preloadImage(src, crossorigin = null) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (crossorigin) link.crossOrigin = crossorigin;
      
      link.onload = () => resolve(src);
      link.onerror = reject;
      
      document.head.appendChild(link);
    });
  }

  /**
   * Lazy load images with Intersection Observer
   */
  setupLazyLoading(selector = 'img[loading="lazy"]') {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      const images = document.querySelectorAll(selector);
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    const lazyImages = document.querySelectorAll(selector);
    lazyImages.forEach(img => {
      img.classList.add('lazy-loading');
      imageObserver.observe(img);
    });
  }

  /**
   * Add CSS for lazy loading transitions
   */
  static addLazyLoadingCSS() {
    if (document.getElementById('lazy-loading-styles')) return;

    const style = document.createElement('style');
    style.id = 'lazy-loading-styles';
    style.textContent = `
      img.lazy-loading {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      img.lazy-loaded {
        opacity: 1;
      }
      
      /* Loading placeholder */
      img[loading="lazy"]:not([src]) {
        background-color: var(--light-card-bg, #f8f9fa);
        background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        background-size: 200px 100%;
        background-repeat: no-repeat;
        animation: loading-shimmer 1.5s infinite;
      }
      
      @keyframes loading-shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: 200px 0; }
      }
      
      :host-context(body.dark-mode) img[loading="lazy"]:not([src]) {
        background-color: var(--dark-card-bg, #181f26);
        background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      }
    `;
    document.head.appendChild(style);
  }
}

// Create singleton instance
const imageOptimizer = new ImageOptimizer();

// Add CSS when module loads
ImageOptimizer.addLazyLoadingCSS();

export default imageOptimizer;