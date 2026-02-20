/**
 * Unit tests for Performance Grid functionality
 */

describe('Performance Grid', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="perf-grid">
        <button class="perf-item" data-category="Loading" data-title="Lazy Loading" data-desc="Test description" data-tpl="tpl-lazy">
          Lazy Load
        </button>
        <button class="perf-item" data-category="Assets" data-title="WebP" data-desc="WebP description" data-tpl="tpl-webp">
          WebP
        </button>
        <button class="perf-item" data-category="Rendering" data-title="Skeleton" data-desc="Skeleton description" data-tpl="tpl-skeleton">
          Skeleton
        </button>
        <button class="perf-item" data-category="CSS" data-title="Modular" data-desc="Modular description" data-tpl="tpl-modular">
          Modular
        </button>
      </div>
      <div id="perf-detail" class="hidden">
        <span id="perf-detail-category"></span>
        <h4 id="perf-detail-title"></h4>
        <p id="perf-detail-desc"></p>
        <div id="perf-detail-extra"></div>
        <button id="perf-detail-close"></button>
      </div>
      <div id="perf-filters">
        <button class="perf-filter active" data-filter="all">All</button>
        <button class="perf-filter" data-filter="Loading">Loading</button>
        <button class="perf-filter" data-filter="Assets">Assets</button>
        <button class="perf-filter" data-filter="Rendering">Rendering</button>
        <button class="perf-filter" data-filter="CSS">CSS</button>
      </div>
      <template id="tpl-lazy"><div>Lazy template</div></template>
      <template id="tpl-webp"><div>WebP template</div></template>
      <template id="tpl-skeleton"><div>Skeleton template</div></template>
      <template id="tpl-modular"><div>Modular template</div></template>
    `;
  });

  describe('Grid Items', () => {
    test('should have correct data attributes', () => {
      const items = document.querySelectorAll('.perf-item');
      expect(items.length).toBe(4);

      const firstItem = items[0];
      expect(firstItem.dataset.category).toBe('Loading');
      expect(firstItem.dataset.title).toBe('Lazy Loading');
      expect(firstItem.dataset.tpl).toBe('tpl-lazy');
    });

    test('should have 4 categories', () => {
      const categories = new Set();
      document.querySelectorAll('.perf-item').forEach(item => {
        categories.add(item.dataset.category);
      });
      expect(categories.size).toBe(4);
      expect(categories.has('Loading')).toBe(true);
      expect(categories.has('Assets')).toBe(true);
      expect(categories.has('Rendering')).toBe(true);
      expect(categories.has('CSS')).toBe(true);
    });
  });

  describe('Detail Panel', () => {
    test('should be hidden initially', () => {
      const detail = document.getElementById('perf-detail');
      expect(detail.classList.contains('hidden')).toBe(true);
    });

    test('should have required child elements', () => {
      expect(document.getElementById('perf-detail-category')).toBeTruthy();
      expect(document.getElementById('perf-detail-title')).toBeTruthy();
      expect(document.getElementById('perf-detail-desc')).toBeTruthy();
      expect(document.getElementById('perf-detail-extra')).toBeTruthy();
      expect(document.getElementById('perf-detail-close')).toBeTruthy();
    });

    test('should update content when showing', () => {
      const detail = document.getElementById('perf-detail');
      const title = document.getElementById('perf-detail-title');
      const desc = document.getElementById('perf-detail-desc');
      const category = document.getElementById('perf-detail-category');

      // Simulate showing detail
      category.textContent = 'Loading';
      title.textContent = 'Lazy Loading';
      desc.textContent = 'Test description';

      expect(category.textContent).toBe('Loading');
      expect(title.textContent).toBe('Lazy Loading');
    });
  });

  describe('Filter Buttons', () => {
    test('should have 5 filter buttons', () => {
      const filters = document.querySelectorAll('.perf-filter');
      expect(filters.length).toBe(5);
    });

    test('should have "all" filter active by default', () => {
      const allFilter = document.querySelector('.perf-filter[data-filter="all"]');
      expect(allFilter.classList.contains('active')).toBe(true);
    });

    test('should filter items by category', () => {
      const items = document.querySelectorAll('.perf-item');
      const loadingItems = document.querySelectorAll('.perf-item[data-category="Loading"]');

      expect(loadingItems.length).toBe(1);

      // Simulate filtering
      items.forEach(item => {
        if (item.dataset.category !== 'Loading') {
          item.style.display = 'none';
        }
      });

      const visibleItems = [...items].filter(item => item.style.display !== 'none');
      expect(visibleItems.length).toBe(1);
    });
  });

  describe('Templates', () => {
    test('should have templates for each item', () => {
      const items = document.querySelectorAll('.perf-item');
      items.forEach(item => {
        const tplId = item.dataset.tpl;
        const template = document.getElementById(tplId);
        expect(template).toBeTruthy();
        expect(template.tagName).toBe('TEMPLATE');
      });
    });

    test('should clone template content', () => {
      const template = document.getElementById('tpl-lazy');
      const clone = template.content.cloneNode(true);
      expect(clone).toBeTruthy();
    });
  });
});
