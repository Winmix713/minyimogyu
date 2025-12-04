#!/usr/bin/env node

/**
 * Responsive QA testing script for WinMix static prototype
 * Tests at 320px, 768px, and 1024px+ breakpoints
 * Captures screenshots and validates layout issues
 * 
 * Usage: node scripts/dev/qa-prototype-responsive.mjs
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const PORT = 5500;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = join(process.cwd(), 'docs/prototypes/winmix-static/qa-screenshots');

// Test configurations for each breakpoint
const BREAKPOINTS = [
  { name: 'mobile', width: 320, height: 568 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

// Sections to test
const SECTIONS = [
  { id: 'hero', name: 'Hero Section' },
  { id: 'community', name: 'Community Hero' },
  { id: 'features', name: 'Feature Showcase' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'footer', name: 'Footer' },
];

async function runQA() {
  console.log('🔍 WinMix Prototype Responsive QA');
  console.log('==================================\n');

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const issues = [];

  for (const breakpoint of BREAKPOINTS) {
    console.log(`\n📱 Testing ${breakpoint.name} (${breakpoint.width}×${breakpoint.height})`);
    console.log('─'.repeat(60));

    const context = await browser.newContext({
      viewport: { width: breakpoint.width, height: breakpoint.height },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    try {
      // Navigate to prototype
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });

      // Full page screenshot
      const fullScreenshotPath = join(OUTPUT_DIR, `${breakpoint.name}-full-page.png`);
      await page.screenshot({ path: fullScreenshotPath, fullPage: true });
      console.log(`  ✓ Full page screenshot: ${fullScreenshotPath}`);

      // Test each section
      for (const section of SECTIONS) {
        const element = await page.locator(`[data-section="${section.id}"]`);
        
        if (await element.count() > 0) {
          // Scroll to section
          await element.first().scrollIntoViewIfNeeded();
          await page.waitForTimeout(500);

          // Section screenshot
          const sectionScreenshotPath = join(OUTPUT_DIR, `${breakpoint.name}-${section.id}.png`);
          await element.first().screenshot({ path: sectionScreenshotPath });
          console.log(`  ✓ ${section.name} screenshot`);

          // Check for horizontal overflow
          const overflowCheck = await element.first().evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return {
              overflow: rect.width > window.innerWidth,
              width: rect.width,
              viewportWidth: window.innerWidth,
            };
          });

          if (overflowCheck.overflow) {
            issues.push({
              breakpoint: breakpoint.name,
              section: section.name,
              issue: `Horizontal overflow detected (${overflowCheck.width}px > ${overflowCheck.viewportWidth}px)`,
            });
            console.log(`  ⚠️  Horizontal overflow in ${section.name}`);
          }

          // Check touch target sizes for interactive elements (mobile only)
          if (breakpoint.name === 'mobile') {
            const buttons = await element.locator('button, a').all();
            for (const button of buttons) {
              const box = await button.boundingBox();
              if (box && (box.width < 48 || box.height < 48)) {
                const text = await button.textContent();
                issues.push({
                  breakpoint: breakpoint.name,
                  section: section.name,
                  issue: `Touch target too small: "${text?.slice(0, 30)}" (${Math.round(box.width)}×${Math.round(box.height)}px < 48×48px)`,
                });
                console.log(`  ⚠️  Small touch target in ${section.name}`);
              }
            }
          }
        }
      }

      // Test CTA buttons
      const ctaButtons = await page.locator('.animated-cta').all();
      console.log(`  ✓ Found ${ctaButtons.length} CTA buttons`);

      // Test marquee animation
      const marquee = await page.locator('#marquee-content');
      if (await marquee.count() > 0) {
        const animationCheck = await marquee.evaluate((el) => {
          const computedStyle = window.getComputedStyle(el);
          return {
            animation: computedStyle.animation,
            hasAnimation: computedStyle.animation !== 'none',
          };
        });
        if (animationCheck.hasAnimation) {
          console.log(`  ✓ Marquee animation running`);
        } else {
          issues.push({
            breakpoint: breakpoint.name,
            section: 'Community Hero',
            issue: 'Marquee animation not running',
          });
          console.log(`  ⚠️  Marquee animation issue`);
        }
      }

    } catch (error) {
      console.error(`  ✗ Error testing ${breakpoint.name}:`, error.message);
      issues.push({
        breakpoint: breakpoint.name,
        section: 'General',
        issue: error.message,
      });
    } finally {
      await context.close();
    }
  }

  await browser.close();

  // Summary
  console.log('\n\n📊 QA Summary');
  console.log('==================================');
  console.log(`Screenshots saved to: ${OUTPUT_DIR}`);
  
  if (issues.length === 0) {
    console.log('✅ No issues detected!');
  } else {
    console.log(`⚠️  ${issues.length} issue(s) detected:\n`);
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.breakpoint}] ${issue.section}: ${issue.issue}`);
    });
  }

  return issues;
}

// Run QA
runQA()
  .then((issues) => {
    process.exit(issues.length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(2);
  });
