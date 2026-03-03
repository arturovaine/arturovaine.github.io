import { ComponentLoader } from './componentLoader.js';
import { ThemeManager } from './components/ThemeManager.js';
import { LanguageSwitcher } from './components/LanguageSwitcher.js';
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
import { LogoCarousel } from './components/LogoCarousel.js';
import { HeroCardRenderer } from './renderers/HeroCardRenderer.js';
import { HeroRenderer } from './renderers/HeroRenderer.js';
import { ProjectRenderer } from './renderers/ProjectRenderer.js';
import { AwardRenderer } from './renderers/AwardRenderer.js';
import { ExperienceRenderer } from './renderers/ExperienceRenderer.js';
import { PostRenderer } from './renderers/PostRenderer.js';
import { ArtworkRenderer } from './renderers/ArtworkRenderer.js';
import { VolunteeringRenderer } from './renderers/VolunteeringRenderer.js';
import { BootstrappingRenderer } from './renderers/BootstrappingRenderer.js';
import { NavigationRenderer } from './renderers/NavigationRenderer.js';
import { WorkSectionRenderer } from './renderers/WorkSectionRenderer.js';
import { SectionsRenderer } from './renderers/SectionsRenderer.js';
import { MetaprojectRenderer } from './renderers/MetaprojectRenderer.js';
import { FooterRenderer } from './renderers/FooterRenderer.js';
import { CookieConsent } from './components/CookieConsent.js';
import { ScrollToTop } from './components/ScrollToTop.js';

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

const componentInitializers = {
  'header': () => {
    NavigationRenderer.init();
  },
  'work': () => {
    ProjectRenderer.init();
    ProjectModal.init();
    ProjectFilter.init();
    WorkSectionRenderer.init();
  },
  'experience': () => {
    ExperienceRenderer.init();
    SectionsRenderer.init();
  },
  'awards': () => {
    AwardRenderer.init();
    SectionsRenderer.init();
  },
  'award-highlights': () => VideoCarousel.init(),
  'posts': () => {
    PostRenderer.init();
    SectionsRenderer.init();
  },
  'volunteering': () => {
    VolunteeringRenderer.init();
    TetoCarousel.init();
    SectionsRenderer.init();
  },
  'bootstrapping': () => {
    BootstrappingRenderer.init();
    SectionsRenderer.init();
  },
  'artworks': () => {
    ArtworkRenderer.init();
    SectionsRenderer.init();
  },
  'metaproject': () => {
    MetaprojectRenderer.init();
  },
  'footer': () => {
    FooterRenderer.init();
  }
};

document.addEventListener('DOMContentLoaded', async function () {
  if (window.lucide) {
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }

  await ComponentLoader.loadAll();

  ThemeManager.init();
  LanguageSwitcher.init();
  MobileMenu.init();
  StylingManager.init();
  LogoCarousel.init();

  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = currentYear;
  const heroYearElement = document.getElementById('hero-year');
  if (heroYearElement) heroYearElement.textContent = currentYear;

  await new Promise(resolve => setTimeout(resolve, 0));

  await HeroCardRenderer.init();
  await HeroRenderer.init();

  requestIdleCallback(() => {
    ImageSlider.init();
  }, { timeout: 1000 });

  if (window.lucide) {
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }

  HoverPrefetch.init();

  requestIdleCallback(() => {
    LazyLoader.init();
  }, { timeout: 1000 });

  CookieConsent.init();
  ScrollToTop.init();
});

window.addEventListener('componentLoaded', (event) => {
  const componentName = event.detail.name;
  const initializer = componentInitializers[componentName];

  if (initializer) {
    requestAnimationFrame(() => {
      initializer();
    });
  }
});
