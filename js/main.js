// Main application entry point
import { ComponentLoader } from './componentLoader.js';
import { ThemeManager } from './components/ThemeManager.js';
import { MobileMenu } from './components/MobileMenu.js';
import { ProjectFilter } from './components/ProjectFilter.js';
import { ImageSlider } from './components/ImageSlider.js';
import { ModelViewer } from './components/ModelViewer.js';
import { StylingManager } from './components/StylingManager.js';
import { VideoCarousel } from './components/VideoCarousel.js';
import { TetoCarousel } from './components/TetoCarousel.js';
import { HoverPrefetch } from './components/HoverPrefetch.js';
import { LazyLoader } from './components/LazyLoader.js';

// Polyfill for requestIdleCallback
window.requestIdleCallback = window.requestIdleCallback || function (cb) {
  const start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

// Make ModelViewer available globally for theme changes
window.ModelViewer = ModelViewer;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async function () {
  // Initialize icons (first pass)
  if (window.lucide) {
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }

  // Initialize theme and basic UI immediately
  ThemeManager.init();
  MobileMenu.init();
  StylingManager.init();

  // Update year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Load HTML components
  await ComponentLoader.loadAll();

  // Wait a tick to ensure DOM is fully updated after component insertion
  await new Promise(resolve => setTimeout(resolve, 0));

  // Initialize components that depend on loaded HTML
  ProjectFilter.init();

  // Initialize 3D Model Viewer (deferred for performance)
  requestIdleCallback(() => {
    ModelViewer.init();
  }, { timeout: 2000 });

  // Initialize Image Slider (deferred for performance)
  requestIdleCallback(() => {
    ImageSlider.init();
  }, { timeout: 2000 });

  // Initialize Video Carousel (deferred for performance)
  requestIdleCallback(() => {
    VideoCarousel.init();
  }, { timeout: 2000 });

  // Initialize TETO Carousel (after DOM is ready)
  setTimeout(() => {
    TetoCarousel.init();
  }, 100);

  // Initialize Hover Prefetch for faster navigation
  HoverPrefetch.init();

  // Initialize Lazy Loader for Intersection Observer
  requestIdleCallback(() => {
    LazyLoader.init();
  }, { timeout: 1000 });
});
