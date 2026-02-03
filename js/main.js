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
import { ProjectModal } from './components/ProjectModal.js';
import { HeroCardRenderer } from './renderers/HeroCardRenderer.js';
import { ProjectRenderer } from './renderers/ProjectRenderer.js';
import { AwardRenderer } from './renderers/AwardRenderer.js';
import { ExperienceRenderer } from './renderers/ExperienceRenderer.js';
import { PostRenderer } from './renderers/PostRenderer.js';
import { ArtworkRenderer } from './renderers/ArtworkRenderer.js';

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

window.ModelViewer = ModelViewer;
window.ProjectModal = ProjectModal;

document.addEventListener('DOMContentLoaded', async function () {
  if (window.lucide) {
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }

  await ComponentLoader.loadAll();

  ThemeManager.init();
  MobileMenu.init();
  StylingManager.init();

  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = currentYear;
  const heroYearElement = document.getElementById('hero-year');
  if (heroYearElement) heroYearElement.textContent = currentYear;

  await new Promise(resolve => setTimeout(resolve, 0));

  // HeroCardRenderer loads immediately (above the fold)
  await HeroCardRenderer.init();

  // Other renderers use IntersectionObserver - they load when visible
  ProjectRenderer.init();
  AwardRenderer.init();
  ExperienceRenderer.init();
  PostRenderer.init();
  ArtworkRenderer.init();

  if (window.lucide) {
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }

  ProjectModal.init();
  ProjectFilter.init();

  requestIdleCallback(() => {
    ModelViewer.init();
  }, { timeout: 2000 });

  requestIdleCallback(() => {
    ImageSlider.init();
  }, { timeout: 2000 });

  requestIdleCallback(() => {
    VideoCarousel.init();
  }, { timeout: 2000 });

  setTimeout(() => {
    TetoCarousel.init();
  }, 100);

  HoverPrefetch.init();

  requestIdleCallback(() => {
    LazyLoader.init();
  }, { timeout: 1000 });
});
