import { test, expect } from '@playwright/test';

test.describe('Performance Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/metaproject.html');
    await page.waitForSelector('#perf-grid');
    // Scroll to performance section
    await page.click('nav a[href="#performance"]');
    await page.waitForTimeout(500);
  });

  test.describe('Grid Layout', () => {
    test('should display 16 optimization items', async ({ page }) => {
      const items = page.locator('.perf-item');
      await expect(items).toHaveCount(16);
    });

    test('should have 4 items per category', async ({ page }) => {
      const loadingItems = page.locator('.perf-item[data-category="Loading"]');
      const assetsItems = page.locator('.perf-item[data-category="Assets"]');
      const renderingItems = page.locator('.perf-item[data-category="Rendering"]');
      const cssItems = page.locator('.perf-item[data-category="CSS"]');

      await expect(loadingItems).toHaveCount(4);
      await expect(assetsItems).toHaveCount(4);
      await expect(renderingItems).toHaveCount(4);
      await expect(cssItems).toHaveCount(4);
    });
  });

  test.describe('Filter Buttons', () => {
    test('should display 5 filter buttons', async ({ page }) => {
      const filters = page.locator('.perf-filter');
      await expect(filters).toHaveCount(5);
    });

    test('should have "All" filter active by default', async ({ page }) => {
      const allFilter = page.locator('.perf-filter[data-filter="all"]');
      await expect(allFilter).toHaveClass(/active/);
    });

    test('should filter to show only Loading items', async ({ page }) => {
      await page.click('.perf-filter[data-filter="Loading"]');
      await page.waitForTimeout(600);

      const visibleItems = page.locator('.perf-item:visible');
      const loadingItems = page.locator('.perf-item[data-category="Loading"]:visible');

      // Only Loading items should be visible
      await expect(loadingItems).toHaveCount(4);
    });

    test('should filter to show only Assets items', async ({ page }) => {
      await page.click('.perf-filter[data-filter="Assets"]');
      await page.waitForTimeout(600);

      const assetsItems = page.locator('.perf-item[data-category="Assets"]:visible');
      await expect(assetsItems).toHaveCount(4);
    });

    test('should show all items when clicking "All" filter', async ({ page }) => {
      // First filter by category
      await page.click('.perf-filter[data-filter="Loading"]');
      await page.waitForTimeout(600);

      // Then click All
      await page.click('.perf-filter[data-filter="all"]');
      await page.waitForTimeout(600);

      const allItems = page.locator('.perf-item:visible');
      await expect(allItems).toHaveCount(16);
    });

    test('should update active state on filter click', async ({ page }) => {
      await page.click('.perf-filter[data-filter="Assets"]');
      await page.waitForTimeout(100);

      const assetsFilter = page.locator('.perf-filter[data-filter="Assets"]');
      const allFilter = page.locator('.perf-filter[data-filter="all"]');

      await expect(assetsFilter).toHaveClass(/active/);
      await expect(allFilter).not.toHaveClass(/active/);
    });
  });

  test.describe('Detail Panel', () => {
    test('should be hidden initially', async ({ page }) => {
      const detail = page.locator('#perf-detail');
      await expect(detail).toHaveClass(/hidden/);
    });

    test('should open when clicking a grid item', async ({ page }) => {
      await page.locator('.perf-item[data-category="Loading"]').first().click();
      await page.waitForTimeout(400);

      const detail = page.locator('#perf-detail');
      await expect(detail).not.toHaveClass(/hidden/);
    });

    test('should display correct title and description', async ({ page }) => {
      const firstItem = page.locator('.perf-item').first();
      const expectedTitle = await firstItem.getAttribute('data-title');

      await firstItem.click();
      await page.waitForTimeout(400);

      const title = page.locator('#perf-detail-title');
      await expect(title).toHaveText(expectedTitle);
    });

    test('should display category badge', async ({ page }) => {
      const firstItem = page.locator('.perf-item').first();
      const expectedCategory = await firstItem.getAttribute('data-category');

      await firstItem.click();
      await page.waitForTimeout(400);

      const category = page.locator('#perf-detail-category');
      await expect(category).toHaveText(expectedCategory);
    });

    test('should load template content', async ({ page }) => {
      await page.click('.perf-item[data-tpl="tpl-lazy"]');
      await page.waitForTimeout(400);

      const extra = page.locator('#perf-detail-extra');
      await expect(extra).not.toBeEmpty();
    });

    test('should close when clicking close button', async ({ page }) => {
      await page.locator('.perf-item').first().click();
      await page.waitForTimeout(400);

      await page.click('#perf-detail-close');
      await page.waitForTimeout(400);

      const detail = page.locator('#perf-detail');
      await expect(detail).toHaveClass(/hidden/);
    });

    test('should close when clicking same item again', async ({ page }) => {
      const firstItem = page.locator('.perf-item').first();

      await firstItem.click();
      await page.waitForTimeout(400);
      await expect(page.locator('#perf-detail')).not.toHaveClass(/hidden/);

      await firstItem.click();
      await page.waitForTimeout(400);
      await expect(page.locator('#perf-detail')).toHaveClass(/hidden/);
    });

    test('should switch content when clicking different item', async ({ page }) => {
      const firstItem = page.locator('.perf-item').first();
      const secondItem = page.locator('.perf-item').nth(1);

      await firstItem.click();
      await page.waitForTimeout(400);
      const firstTitle = await page.locator('#perf-detail-title').textContent();

      await secondItem.click();
      await page.waitForTimeout(400);
      const secondTitle = await page.locator('#perf-detail-title').textContent();

      expect(firstTitle).not.toBe(secondTitle);
    });

    test('should highlight active item with ring', async ({ page }) => {
      const firstItem = page.locator('.perf-item').first();
      await firstItem.click();
      await page.waitForTimeout(400);

      await expect(firstItem).toHaveClass(/ring-2/);
    });

    test('should close detail panel when filtering', async ({ page }) => {
      // Open detail panel
      await page.locator('.perf-item').first().click();
      await page.waitForTimeout(400);
      await expect(page.locator('#perf-detail')).not.toHaveClass(/hidden/);

      // Click filter
      await page.click('.perf-filter[data-filter="Assets"]');
      await page.waitForTimeout(400);

      // Detail should be closed
      await expect(page.locator('#perf-detail')).toHaveClass(/hidden/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have focusable grid items', async ({ page }) => {
      const firstItem = page.locator('.perf-item').first();
      await firstItem.focus();
      await expect(firstItem).toBeFocused();
    });

    test('should have proper button semantics', async ({ page }) => {
      const items = page.locator('.perf-item');
      const count = await items.count();

      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        const tagName = await item.evaluate(el => el.tagName);
        expect(tagName).toBe('BUTTON');
      }
    });
  });
});
