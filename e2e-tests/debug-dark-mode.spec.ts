import { test, expect } from '@playwright/test';

test.describe('Dark Mode Debugging', () => {
  test('investigate dark mode rendering issues', async ({ page }) => {
    // Navigate to assessment page
    await page.goto('http://localhost:3000/assessment');
    await page.waitForLoadState('networkidle');

    console.log('\n=== DARK MODE DEBUGGING ===\n');

    // 1. Check HTML element has dark class
    const htmlClass = await page.locator('html').getAttribute('class');
    console.log('1. HTML class attribute:', htmlClass);
    expect(htmlClass).toContain('dark');

    // 2. Take screenshot of current state
    await page.screenshot({
      path: 'e2e-tests/screenshots/dark-mode-current.png',
      fullPage: true
    });
    console.log('2. Screenshot saved to e2e-tests/screenshots/dark-mode-current.png');

    // 3. Check computed styles on key elements
    const h2Element = page.locator('h2').first();
    const h2Styles = await h2Element.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        classes: el.className,
      };
    });
    console.log('3. H2 computed styles:', h2Styles);

    // 4. Check select elements (dropdowns)
    const selectElement = page.locator('select').first();
    const selectStyles = await selectElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor,
        classes: el.className,
      };
    });
    console.log('4. Select computed styles:', selectStyles);

    // 5. Check if CSS file is loaded
    const cssLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map((link) => ({
        href: (link as HTMLLinkElement).href,
        loaded: true,
      }));
    });
    console.log('5. Loaded CSS files:', cssLinks);

    // 6. Check specific dark mode CSS rules
    const darkModeRules = await page.evaluate(() => {
      const rules: string[] = [];
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const cssRules = Array.from(sheet.cssRules || []);
          for (const rule of cssRules) {
            if (rule instanceof CSSStyleRule && rule.selectorText?.includes('html.dark')) {
              rules.push(`${rule.selectorText} { ${rule.style.cssText} }`);
              if (rules.length >= 10) break; // Limit to first 10
            }
          }
        } catch (e) {
          // Skip CORS-blocked stylesheets
        }
      }
      return rules;
    });
    console.log('6. Sample dark mode CSS rules:', darkModeRules);

    // 7. Find all elements with light backgrounds
    const lightElements = await page.evaluate(() => {
      const elements: Array<{ tag: string; classes: string; color: string; bgColor: string }> = [];
      const allElements = document.querySelectorAll('*');

      for (const el of Array.from(allElements)) {
        const computed = window.getComputedStyle(el);
        const bgColor = computed.backgroundColor;

        // Check for light backgrounds (rgb values > 200)
        const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          const [_, r, g, b] = match.map(Number);
          if (r > 200 && g > 200 && b > 200) {
            elements.push({
              tag: el.tagName.toLowerCase(),
              classes: el.className,
              color: computed.color,
              bgColor: bgColor,
            });
          }
        }
      }

      return elements.slice(0, 20); // First 20 light elements
    });
    console.log('7. Elements with light backgrounds (first 20):', lightElements);

    // 8. Check for any Bootstrap CSS interference
    const bootstrapLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links
        .filter((link) => (link as HTMLLinkElement).href.includes('bootstrap'))
        .map((link) => (link as HTMLLinkElement).href);
    });
    console.log('8. Bootstrap CSS files:', bootstrapLinks);

    // 9. Check if Tailwind classes are being applied
    const tailwindTest = await page.evaluate(() => {
      // Create a test element with dark mode classes
      const testDiv = document.createElement('div');
      testDiv.className = 'text-white dark:text-white bg-gray-800 dark:bg-gray-800';
      document.body.appendChild(testDiv);

      const computed = window.getComputedStyle(testDiv);
      const result = {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };

      document.body.removeChild(testDiv);
      return result;
    });
    console.log('9. Tailwind dark mode test:', tailwindTest);

    // 10. Get actual CSS content for dark:text-white class
    const darkTextWhiteCSS = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const cssRules = Array.from(sheet.cssRules || []);
          for (const rule of cssRules) {
            if (rule instanceof CSSStyleRule &&
                rule.selectorText?.includes('dark\\:text-white')) {
              return {
                selector: rule.selectorText,
                cssText: rule.cssText,
              };
            }
          }
        } catch (e) {
          // Skip CORS
        }
      }
      return null;
    });
    console.log('10. dark:text-white CSS rule:', darkTextWhiteCSS);

    // 11. Check body background color
    const bodyStyles = await page.evaluate(() => {
      const computed = window.getComputedStyle(document.body);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        classes: document.body.className,
      };
    });
    console.log('11. Body computed styles:', bodyStyles);

    // 12. Get the actual raw CSS from the stylesheet
    const rawCSS = await page.evaluate(async () => {
      const cssLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .find((link) => (link as HTMLLinkElement).href.includes('layout.css'));

      if (!cssLink) return null;

      const href = (cssLink as HTMLLinkElement).href;
      const response = await fetch(href);
      const cssText = await response.text();

      // Find dark:text-white rules
      const lines = cssText.split('\n');
      const darkTextWhiteIndex = lines.findIndex((line) => line.includes('dark\\:text-white'));

      if (darkTextWhiteIndex === -1) return { found: false };

      // Get 5 lines of context
      const contextLines = lines.slice(
        Math.max(0, darkTextWhiteIndex - 2),
        Math.min(lines.length, darkTextWhiteIndex + 5)
      );

      return {
        found: true,
        lineNumber: darkTextWhiteIndex + 1,
        context: contextLines.join('\n'),
      };
    });
    console.log('12. Raw CSS for dark:text-white:', rawCSS);

    console.log('\n=== END DEBUGGING ===\n');

    // Take a final screenshot with DevTools info overlay
    await page.screenshot({
      path: 'e2e-tests/screenshots/dark-mode-debug-final.png',
      fullPage: true
    });
  });
});
