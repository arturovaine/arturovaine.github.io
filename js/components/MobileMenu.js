// Mobile Menu Component
export const MobileMenu = {
  init() {
    this.menuBtn = document.getElementById('menuBtn');
    this.mobileNav = document.getElementById('mobileNav');
    if (this.menuBtn && this.mobileNav) {
      this.setupToggle();
    }
  },

  setupToggle() {
    this.menuBtn.addEventListener('click', () => this.toggle(), { passive: true });
  },

  toggle() {
    const isOpen = !this.mobileNav.classList.contains('hidden');
    this.mobileNav.classList.toggle('hidden');
    this.menuBtn.setAttribute('aria-expanded', String(!isOpen));
    this.updateIcon(isOpen);
  },

  updateIcon(isOpen) {
    const icon = this.menuBtn.querySelector('svg');
    if (icon) icon.remove();

    const iconName = isOpen ? 'menu' : 'x';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', iconName);
    i.className = 'w-5 h-5';
    this.menuBtn.appendChild(i);

    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
    }
  }
};
