/**
 * Analytics module for PostHog integration
 * Tracks user interactions across the portfolio
 */
export const Analytics = {
  isEnabled() {
    return typeof window.posthog !== 'undefined' &&
           localStorage.getItem('cookieConsent') === 'accepted';
  },

  capture(event, properties = {}) {
    if (this.isEnabled()) {
      window.posthog.capture(event, properties);
    }
  },

  // Language events
  trackLanguageChange(from, to) {
    this.capture('language_changed', { from, to });
  },

  // Theme events
  trackThemeChange(theme) {
    this.capture('theme_changed', { theme });
  },

  // Social link clicks
  trackSocialClick(platform) {
    this.capture('social_click', { platform });
  },

  // Project modal events
  trackProjectView(projectId, projectTitle) {
    this.capture('project_viewed', {
      project_id: projectId,
      project_title: projectTitle
    });
  },

  // Navigation events
  trackNavClick(section) {
    this.capture('nav_click', { section });
  },

  // Scroll depth tracking
  trackScrollDepth(percentage) {
    this.capture('scroll_depth', { percentage });
  },

  // Section visibility
  trackSectionView(section) {
    this.capture('section_viewed', { section });
  },

  // External link clicks
  trackExternalLink(url, context) {
    this.capture('external_link_click', { url, context });
  },

  // Initialize scroll depth tracking
  initScrollTracking() {
    if (!this.isEnabled()) return;

    const thresholds = [25, 50, 75, 100];
    const tracked = new Set();

    const checkScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;

      thresholds.forEach(threshold => {
        if (scrolled >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          this.trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
  },

  // Initialize section tracking with IntersectionObserver
  initSectionTracking() {
    if (!this.isEnabled()) return;

    const sections = ['work', 'experience', 'awards', 'posts', 'volunteering', 'bootstrapping', 'artworks', 'metaproject'];
    const tracked = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && !tracked.has(sectionId)) {
            tracked.add(sectionId);
            this.trackSectionView(sectionId);
          }
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  },

  // Initialize social link tracking
  initSocialTracking() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href*="linkedin.com"], a[href*="github.com"]');
      if (link) {
        const platform = link.href.includes('linkedin') ? 'linkedin' : 'github';
        this.trackSocialClick(platform);
      }
    });
  },

  // Initialize all tracking
  init() {
    if (!this.isEnabled()) return;

    this.initScrollTracking();
    this.initSocialTracking();

    // Delay section tracking to allow components to load
    setTimeout(() => {
      this.initSectionTracking();
    }, 2000);
  }
};
