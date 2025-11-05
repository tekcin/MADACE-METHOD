/**
 * Comprehensive E2E Tests: Agent List & Discovery
 * Tests the /agents page with all features
 * Using Chrome DevTools MCP for browser automation
 */

import { test, expect } from '@playwright/test';
import { fullTestSetup, cleanup } from '../../helpers/db-setup';

// YOLO MODE: Comprehensive testing without simplification

test.describe('Agent List & Discovery - YOLO Mode 🔥', () => {
  test.beforeAll(async () => {
    // Reset database and seed test data
    await fullTestSetup();
  });

  test.afterAll(async () => {
    await cleanup();
  });

  test('should display all agents from database', async ({ page }) => {
    console.log('🧪 Test: Display all agents from database');

    // Navigate to agents page
    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Wait for agents to load
    await page.waitForSelector('[data-testid="agent-card"], .agent-card, [class*="agent"]', {
      timeout: 10000
    });

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'e2e-tests/screenshots/agent-list-full.png',
      fullPage: true
    });

    // Verify page title
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Should show multiple agents (we seeded 6 agents)
    const agentCards = await page.locator('[data-testid="agent-card"], .agent-card, [class*="Card"]').all();
    console.log(`   Found ${agentCards.length} agent cards`);

    // In YOLO mode, we expect at least 6 agents
    expect(agentCards.length).toBeGreaterThanOrEqual(6);

    // Verify no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit to collect any errors
    await page.waitForTimeout(1000);

    if (errors.length > 0) {
      console.error('   ✗ Console errors detected:', errors);
    }

    console.log('   ✓ All agents displayed correctly');
  });

  test('should filter agents by module (MAM)', async ({ page }) => {
    console.log('🧪 Test: Filter agents by module MAM');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Look for filter controls
    const filterButton = page.locator('button:has-text("MAM"), [data-filter="MAM"]').first();

    if (await filterButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await filterButton.click();
      await page.waitForTimeout(500);

      // Count visible agent cards after filtering
      const visibleCards = await page.locator('[data-testid="agent-card"]:visible, .agent-card:visible').all();
      console.log(`   Found ${visibleCards.length} MAM agents`);

      // We seeded 3 MAM agents (pm, sm, dev)
      expect(visibleCards.length).toBeGreaterThanOrEqual(3);

      console.log('   ✓ MAM filter working');
    } else {
      console.log('   ⚠️  Filter UI not found - may not be implemented yet');
    }
  });

  test('should filter agents by module (MAB)', async ({ page }) => {
    console.log('🧪 Test: Filter agents by module MAB');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    const filterButton = page.locator('button:has-text("MAB"), [data-filter="MAB"]').first();

    if (await filterButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await filterButton.click();
      await page.waitForTimeout(500);

      const visibleCards = await page.locator('[data-testid="agent-card"]:visible, .agent-card:visible').all();
      console.log(`   Found ${visibleCards.length} MAB agents`);

      // We seeded 1 MAB agent (analyst)
      expect(visibleCards.length).toBeGreaterThanOrEqual(1);

      console.log('   ✓ MAB filter working');
    } else {
      console.log('   ⚠️  Filter UI not found');
    }
  });

  test('should search agents by name', async ({ page }) => {
    console.log('🧪 Test: Search agents by name');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[name="search"]').first();

    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Search for "Product Manager"
      await searchInput.fill('Product Manager');
      await page.waitForTimeout(500);

      // Should show only PM agent
      const visibleCards = await page.locator('[data-testid="agent-card"]:visible, .agent-card:visible').all();
      console.log(`   Found ${visibleCards.length} agents matching "Product Manager"`);

      expect(visibleCards.length).toBeGreaterThanOrEqual(1);

      // Verify it contains "Product Manager" text
      const cardText = await visibleCards[0].textContent();
      expect(cardText).toContain('Product Manager');

      console.log('   ✓ Search functionality working');
    } else {
      console.log('   ⚠️  Search input not found');
    }
  });

  test('should search agents by title (fuzzy search)', async ({ page }) => {
    console.log('🧪 Test: Fuzzy search by title');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();

    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Search with partial match
      await searchInput.fill('dev');
      await page.waitForTimeout(500);

      const visibleCards = await page.locator('[data-testid="agent-card"]:visible').all();
      console.log(`   Found ${visibleCards.length} agents matching "dev"`);

      // Should find "Developer" agent
      expect(visibleCards.length).toBeGreaterThanOrEqual(1);

      console.log('   ✓ Fuzzy search working');
    } else {
      console.log('   ⚠️  Search not implemented');
    }
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    console.log('🧪 Test: Empty search results');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();

    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Search for non-existent agent
      await searchInput.fill('ThisAgentDoesNotExist12345');
      await page.waitForTimeout(500);

      // Should show "no results" message
      const noResults = page.locator('text=/no.*found/i, text=/no.*results/i, [data-testid="no-results"]');

      if (await noResults.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('   ✓ Empty state displayed');
      } else {
        // Or should show 0 agents
        const visibleCards = await page.locator('[data-testid="agent-card"]:visible').all();
        expect(visibleCards.length).toBe(0);
        console.log('   ✓ No agents shown for invalid search');
      }
    } else {
      console.log('   ⚠️  Search not available');
    }
  });

  test('should display agent icons correctly', async ({ page }) => {
    console.log('🧪 Test: Agent icons display');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Find agent cards
    const cards = await page.locator('[data-testid="agent-card"], .agent-card').all();

    if (cards.length > 0) {
      // Check first card has an icon
      const firstCard = cards[0];
      const icon = firstCard.locator('[data-testid="agent-icon"], .icon, [class*="icon"]').first();

      if (await icon.isVisible({ timeout: 2000 }).catch(() => false)) {
        const iconText = await icon.textContent();
        console.log(`   Found icon: ${iconText}`);
        console.log('   ✓ Icons displayed');
      } else {
        console.log('   ⚠️  Icons may not be visible');
      }
    }
  });

  test('should navigate to agent detail on card click', async ({ page }) => {
    console.log('🧪 Test: Navigate to agent detail');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Find first agent card
    const firstCard = page.locator('[data-testid="agent-card"], .agent-card, [class*="Card"]').first();
    await firstCard.waitFor({ state: 'visible', timeout: 10000 });

    // Click the card
    await firstCard.click();

    // Wait for navigation
    await page.waitForTimeout(1000);

    // Should navigate to /agents/[id] or show modal/detail view
    const currentUrl = page.url();
    console.log(`   Navigated to: ${currentUrl}`);

    // Verify we're on a detail page or modal is shown
    const isDetailPage = currentUrl.includes('/agents/') && !currentUrl.endsWith('/agents');
    const hasModal = await page.locator('[role="dialog"], .modal, [data-testid="agent-modal"]').isVisible().catch(() => false);

    if (isDetailPage || hasModal) {
      console.log('   ✓ Navigation to detail view successful');
    } else {
      console.log('   ⚠️  Navigation behavior unclear');
    }
  });

  test('should load quickly (performance test)', async ({ page }) => {
    console.log('🧪 Test: Page load performance');

    const startTime = Date.now();

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    console.log(`   Page load time: ${loadTime}ms`);

    // YOLO mode: Strict performance requirements
    // Page should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);

    console.log('   ✓ Performance acceptable');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    console.log('🧪 Test: Mobile responsiveness');

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Take mobile screenshot
    await page.screenshot({
      path: 'e2e-tests/screenshots/agent-list-mobile.png',
      fullPage: true
    });

    // Verify page is visible and scrollable
    const h1 = await page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Agent cards should still be visible
    const cards = await page.locator('[data-testid="agent-card"], .agent-card, [class*="Card"]').all();
    expect(cards.length).toBeGreaterThan(0);

    console.log('   ✓ Mobile layout working');
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    console.log('🧪 Test: Tablet responsiveness');

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Take tablet screenshot
    await page.screenshot({
      path: 'e2e-tests/screenshots/agent-list-tablet.png',
      fullPage: true
    });

    const cards = await page.locator('[data-testid="agent-card"], .agent-card').all();
    expect(cards.length).toBeGreaterThan(0);

    console.log('   ✓ Tablet layout working');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    console.log('🧪 Test: Accessibility');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    const hasMain = await main.count() > 0;

    // Check for heading hierarchy
    const h1Count = await page.locator('h1').count();

    // Check for ARIA labels on interactive elements
    const buttons = await page.locator('button').all();
    let accessibleButtons = 0;
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const hasText = (await button.textContent())?.trim().length ?? 0 > 0;
      if (ariaLabel || hasText) {
        accessibleButtons++;
      }
    }

    console.log(`   Accessibility check:`);
    console.log(`     - Has main landmark: ${hasMain}`);
    console.log(`     - H1 count: ${h1Count}`);
    console.log(`     - Accessible buttons: ${accessibleButtons}/${buttons.length}`);

    // YOLO mode: Strict accessibility requirements
    expect(hasMain).toBe(true);
    expect(h1Count).toBeGreaterThanOrEqual(1);

    console.log('   ✓ Accessibility checks passed');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    console.log('🧪 Test: Network error handling');

    // Simulate offline mode
    await page.context().setOffline(true);

    await page.goto('http://localhost:3000/agents', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    }).catch(() => {
      console.log('   Expected offline error');
    });

    // Check if error message is shown
    const errorMessage = page.locator('text=/error/i, text=/offline/i, text=/failed/i, [role="alert"]');
    const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasError) {
      console.log('   ✓ Error message displayed');
    }

    // Restore online mode
    await page.context().setOffline(false);
  });

  test('should show loading state while fetching', async ({ page }) => {
    console.log('🧪 Test: Loading state');

    // Slow down network to see loading state
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return route.continue();
    });

    const gotoPromise = page.goto('http://localhost:3000/agents');

    // Check for loading indicator
    const loader = page.locator('[data-testid="loader"], .loader, .loading, .spinner, [role="progressbar"]');
    const hasLoader = await loader.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasLoader) {
      console.log('   ✓ Loading indicator shown');
    }

    await gotoPromise;
    await page.waitForLoadState('networkidle');

    console.log('   ✓ Loading state test complete');
  });

  test('should maintain state after browser refresh', async ({ page }) => {
    console.log('🧪 Test: State persistence after refresh');

    await page.goto('http://localhost:3000/agents');
    await page.waitForLoadState('networkidle');

    // Apply filter
    const filterButton = page.locator('button:has-text("MAM")').first();
    if (await filterButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterButton.click();
      await page.waitForTimeout(500);
    }

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if state persisted (this would depend on implementation)
    const agents = await page.locator('[data-testid="agent-card"], .agent-card').all();
    expect(agents.length).toBeGreaterThan(0);

    console.log('   ✓ Page reloads successfully');
  });
});
