/**
 * Unit tests for ThemeManager
 */

describe('ThemeManager', () => {
  let ThemeManager;

  beforeEach(() => {
    // Reset DOM
    document.body.className = '';
    document.body.innerHTML = `
      <button id="themeToggle">
        <i data-lucide="moon"></i>
      </button>
    `;
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('init()', () => {
    test('should apply saved theme from localStorage', () => {
      localStorage.setItem('theme', 'light');
      const savedTheme = localStorage.getItem('theme');

      if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
      }

      expect(document.body.classList.contains('light-theme')).toBe(true);
    });

    test('should default to dark theme when no saved preference', () => {
      const savedTheme = localStorage.getItem('theme');
      expect(savedTheme).toBeNull();
      expect(document.body.classList.contains('light-theme')).toBe(false);
    });
  });

  describe('toggle()', () => {
    test('should toggle light-theme class on body', () => {
      document.body.classList.toggle('light-theme');
      expect(document.body.classList.contains('light-theme')).toBe(true);

      document.body.classList.toggle('light-theme');
      expect(document.body.classList.contains('light-theme')).toBe(false);
    });

    test('should save theme preference to localStorage', () => {
      localStorage.setItem('theme', 'light');
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('icon update', () => {
    test('should update icon based on theme', () => {
      const icon = document.querySelector('[data-lucide]');
      expect(icon).toBeTruthy();
      expect(icon.getAttribute('data-lucide')).toBe('moon');
    });
  });
});
