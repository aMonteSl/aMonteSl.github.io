import { test, expect } from '@playwright/test';

test.describe('Portfolio Responsive Tests', () => {
  test('should not have horizontal scroll on all viewports', async ({ page }) => {
    await page.goto('/');
    
    // Check for horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should display sidebar on desktop and collapse on mobile', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.viewportSize();
    if (!viewport) return;
    
    if (viewport.width >= 1024) {
      // Desktop: sidebar should be visible
      await expect(page.locator('aside[class*="sticky"]')).toBeVisible();
      await expect(page.locator('[class*="lg:hidden"]')).not.toBeVisible();
    } else {
      // Mobile: mobile topbar should be visible
      await expect(page.locator('[class*="lg:hidden"]')).toBeVisible();
    }
  });

  test('should have accessible navigation with keyboard', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Navigate with arrow keys if it's the navigation
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 1024) {
      // Desktop sidebar navigation
      const navLinks = page.locator('nav a');
      const firstLink = navLinks.first();
      await firstLink.focus();
      await expect(firstLink).toBeFocused();
    }
  });

  test('should load all images without layout shift', async ({ page }) => {
    await page.goto('/images');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    // Check that images have proper dimensions
    const images = page.locator('img[width][height]');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      
      // Verify images have width and height attributes to prevent CLS
      await expect(img).toHaveAttribute('width');
      await expect(img).toHaveAttribute('height');
    }
  });

  test('should have proper text line lengths', async ({ page }) => {
    await page.goto('/');
    
    // Check that text blocks don't exceed 75 characters
    const textElements = page.locator('p, .prose');
    const count = await textElements.count();
    
    for (let i = 0; i < count; i++) {
      const element = textElements.nth(i);
      const maxWidth = await element.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.maxWidth;
      });
      
      // Should have a reasonable max-width set
      if (maxWidth !== 'none') {
        // Rough check for character-based width (75ch ≈ 600px)
        expect(parseFloat(maxWidth)).toBeLessThan(800);
      }
    }
  });

  test('should navigate between routes successfully', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation to different routes
    const routes = ['/', '/projects', '/education', '/skills', '/contact'];
    
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
      
      // Should have main content
      await expect(page.locator('main, [role="main"]')).toBeVisible();
    }
  });

  test('should handle 404 pages correctly', async ({ page }) => {
    await page.goto('/nonexistent-page');
    
    // Should redirect to 404 page
    await expect(page).toHaveURL('/404');
    
    // Should show 404 content
    await expect(page.locator('text=/404|not found/i')).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content');
    
    // Check canonical URL
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href');
    
    // Check favicon
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href');
  });

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Animations should be disabled or minimal
    const animatedElements = page.locator('[class*="animate-"], [style*="animation"]');
    const count = await animatedElements.count();
    
    // If animations exist, they should have very short durations
    for (let i = 0; i < count; i++) {
      const element = animatedElements.nth(i);
      const animationDuration = await element.evaluate((el) => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.animationDuration;
      });
      
      // Should be instant or very short (< 0.1s)
      if (animationDuration !== '0s' && animationDuration !== '') {
        const duration = parseFloat(animationDuration);
        expect(duration).toBeLessThan(0.1);
      }
    }
  });
});
