// Theme Management Component
export const ThemeManager = {
  STORAGE_KEY: 'portfolio-theme',
  LIGHT_CLASS: 'light-theme',

  init() {
    // Prevent flash of unstyled content
    document.body.classList.add('preload');
    this.loadTheme();
    this.setupToggle();
    // Remove preload class after a brief delay
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.body.classList.remove('preload');
      }, 100);
    });
  },

  loadTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add(this.LIGHT_CLASS);
    }
    this.updateIcon(savedTheme);
  },

  toggleTheme() {
    const isLight = document.body.classList.toggle(this.LIGHT_CLASS);
    const theme = isLight ? 'light' : 'dark';
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateIcon(theme);

    // Update 3D model theme
    if (window.ModelViewer && typeof window.ModelViewer.updateTheme === 'function') {
      window.ModelViewer.updateTheme();
    }
  },

  updateIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const icon = btn.querySelector('svg');
    if (icon) icon.remove();

    const iconName = theme === 'light' ? 'sun' : 'moon';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', iconName);
    i.className = 'w-5 h-5';
    btn.appendChild(i);

    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }
  },

  setupToggle() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      // Use passive event listener for better performance
      btn.addEventListener('click', () => this.toggleTheme(), { passive: true });
    }
  }
};
