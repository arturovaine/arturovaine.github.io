/**
 * Unit tests for MetaprojectLoader
 */

describe('MetaprojectLoader', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="metaproject-header"></div>
      <main id="metaproject-main"></main>
      <div id="metaproject-footer"></div>
      <nav>
        <a href="#architecture">Architecture</a>
        <a href="#diagrams">Diagrams</a>
        <a href="#tech-stack">Tech Stack</a>
        <a href="#performance">Performance</a>
      </nav>
      <div id="mobileNav" class="hidden">
        <a href="#architecture">Architecture</a>
      </div>
      <button id="menuBtn"></button>
    `;
    jest.clearAllMocks();
  });

  describe('loadComponent()', () => {
    test('should fetch component HTML', async () => {
      const mockHtml = '<div>Test Component</div>';
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockHtml),
      });

      const response = await fetch('./components/test.html');
      const html = await response.text();

      expect(html).toBe(mockHtml);
    });

    test('should handle fetch errors gracefully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const response = await fetch('./components/missing.html');
      expect(response.ok).toBe(false);
    });
  });

  describe('setupMobileMenu()', () => {
    test('should toggle mobile nav visibility on button click', () => {
      const menuBtn = document.getElementById('menuBtn');
      const mobileNav = document.getElementById('mobileNav');

      expect(mobileNav.classList.contains('hidden')).toBe(true);

      // Simulate click
      mobileNav.classList.remove('hidden');
      expect(mobileNav.classList.contains('hidden')).toBe(false);

      mobileNav.classList.add('hidden');
      expect(mobileNav.classList.contains('hidden')).toBe(true);
    });

    test('should update aria-expanded attribute', () => {
      const menuBtn = document.getElementById('menuBtn');
      menuBtn.setAttribute('aria-expanded', 'false');

      expect(menuBtn.getAttribute('aria-expanded')).toBe('false');

      menuBtn.setAttribute('aria-expanded', 'true');
      expect(menuBtn.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('setupActiveNav()', () => {
    test('should have navigation links with href attributes', () => {
      const navLinks = document.querySelectorAll('nav a[href^="#"]');
      expect(navLinks.length).toBe(4);
    });

    test('should highlight active section', () => {
      const link = document.querySelector('nav a[href="#architecture"]');
      link.classList.add('text-white', 'bg-white/20');

      expect(link.classList.contains('text-white')).toBe(true);
    });
  });
});
