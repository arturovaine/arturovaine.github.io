import { test, expect } from '@playwright/test';

test.describe('Metaproject Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/metaproject.html');
    // Wait for components to load
    await page.waitForSelector('#metaproject-header header');
  });

  test.describe('Page Load', () => {
    test('should load the page with correct title', async ({ page }) => {
      await expect(page).toHaveTitle(/Metaproject/);
    });

    test('should load all main sections', async ({ page }) => {
      await expect(page.locator('#architecture')).toBeVisible();
      await expect(page.locator('#tech-stack')).toBeVisible();
      await expect(page.locator('#performance')).toBeVisible();
    });

    test('should load header with navigation', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      await expect(nav.locator('a[href="#architecture"]')).toBeVisible();
      await expect(nav.locator('a[href="#diagrams"]')).toBeVisible();
      await expect(nav.locator('a[href="#tech-stack"]')).toBeVisible();
      await expect(nav.locator('a[href="#performance"]')).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should smooth scroll to Architecture section', async ({ page }) => {
      await page.click('nav a[href="#architecture"]');
      await page.waitForTimeout(500);
      const section = page.locator('#architecture');
      await expect(section).toBeInViewport();
    });

    test('should smooth scroll to Diagrams section', async ({ page }) => {
      await page.click('nav a[href="#diagrams"]');
      await page.waitForTimeout(500);
      const section = page.locator('#diagrams');
      await expect(section).toBeInViewport();
    });

    test('should smooth scroll to Tech Stack section', async ({ page }) => {
      await page.click('nav a[href="#tech-stack"]');
      await page.waitForTimeout(500);
      const section = page.locator('#tech-stack');
      await expect(section).toBeInViewport();
    });

    test('should smooth scroll to Performance section', async ({ page }) => {
      await page.click('nav a[href="#performance"]');
      await page.waitForTimeout(500);
      const section = page.locator('#performance');
      await expect(section).toBeInViewport();
    });

    test('should highlight active nav link on scroll', async ({ page }) => {
      await page.click('nav a[href="#architecture"]');
      await page.waitForTimeout(600);
      const activeLink = page.locator('nav a[href="#architecture"]');
      await expect(activeLink).toHaveClass(/text-white/);
    });

    test('should navigate back to portfolio', async ({ page }) => {
      const backLink = page.locator('a[href="/"]').first();
      await expect(backLink).toBeVisible();
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle theme on button click', async ({ page }) => {
      const themeBtn = page.locator('#themeToggle');
      await expect(themeBtn).toBeVisible();

      // Click to switch to light theme
      await themeBtn.click();
      await expect(page.locator('body')).toHaveClass(/light-theme/);

      // Click to switch back to dark theme
      await themeBtn.click();
      await expect(page.locator('body')).not.toHaveClass(/light-theme/);
    });

    test('should persist theme preference', async ({ page }) => {
      const themeBtn = page.locator('#themeToggle');
      await themeBtn.click();

      // Reload page
      await page.reload();
      await page.waitForSelector('#metaproject-header header');

      // Theme should persist
      await expect(page.locator('body')).toHaveClass(/light-theme/);
    });
  });

  test.describe('Scroll to Top Button', () => {
    test('should appear after scrolling down', async ({ page }) => {
      const scrollBtn = page.locator('#scrollToTop');

      // Initially hidden
      await expect(scrollBtn).toHaveCSS('opacity', '0');

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);

      // Should be visible
      await expect(scrollBtn).toHaveCSS('opacity', '1');
    });

    test('should scroll to top when clicked', async ({ page }) => {
      // Scroll down first
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(300);

      // Click scroll to top
      await page.click('#scrollToTop');
      await page.waitForTimeout(500);

      // Should be at top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    });
  });
});
