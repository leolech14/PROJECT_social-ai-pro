// 🎭 Playwright Demo Test - No Login Required
// This demonstrates Playwright's capabilities without needing Retool credentials

import { chromium } from 'playwright';

async function runDemo() {
  console.log('🎭 Starting Playwright Demo...\n');
  
  // Launch browser with UI
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100 // Slow down so you can see what's happening
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    // Test 1: Basic navigation
    console.log('📍 Test 1: Navigating to Playwright website...');
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'playwright-home.png' });
    console.log('✅ Screenshot saved: playwright-home.png\n');

    // Test 2: Search functionality
    console.log('🔍 Test 2: Testing search...');
    await page.click('button[aria-label="Search"]');
    await page.fill('input[type="search"]', 'automation');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    console.log('✅ Search completed\n');

    // Test 3: Navigate to docs
    console.log('📚 Test 3: Navigating to documentation...');
    await page.goto('https://playwright.dev/docs/intro');
    await page.waitForLoadState('networkidle');
    
    // Extract some text
    const title = await page.textContent('h1');
    console.log(`✅ Found title: ${title}\n`);

    // Test 4: Demonstrate form filling on a demo site
    console.log('📝 Test 4: Form filling demo...');
    await page.goto('https://demo.playwright.dev/todomvc');
    
    // Add some todos
    const todos = ['Create Retool app', 'Test with Playwright', 'Automate everything'];
    
    for (const todo of todos) {
      await page.fill('.new-todo', todo);
      await page.keyboard.press('Enter');
      console.log(`✅ Added todo: ${todo}`);
    }
    
    // Check a todo
    await page.click('.toggle');
    console.log('✅ Marked first todo as complete\n');
    
    // Take final screenshot
    await page.screenshot({ path: 'todo-demo.png', fullPage: true });
    console.log('📸 Final screenshot saved: todo-demo.png\n');

    // Test 5: Retool landing page (no login)
    console.log('🏢 Test 5: Visiting Retool homepage...');
    await page.goto('https://retool.com');
    await page.waitForLoadState('networkidle');
    
    // Check if main elements exist
    const hasLogo = await page.isVisible('img[alt*="Retool"]');
    const hasGetStarted = await page.isVisible('text=Get started');
    
    console.log(`✅ Retool logo visible: ${hasLogo}`);
    console.log(`✅ Get started button visible: ${hasGetStarted}`);
    
    await page.screenshot({ path: 'retool-homepage.png' });
    console.log('✅ Retool homepage screenshot saved\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: `error-${Date.now()}.png` });
  }

  console.log('🎉 Demo complete! Check the screenshots:\n');
  console.log('  - playwright-home.png');
  console.log('  - todo-demo.png');
  console.log('  - retool-homepage.png\n');
  
  console.log('Press Ctrl+C to close the browser...');
  
  // Keep browser open
  await new Promise(() => {});
}

// Run the demo
console.log('╔════════════════════════════════════════════╗');
console.log('║        Playwright Demo - No Login          ║');
console.log('╚════════════════════════════════════════════╝\n');

runDemo().catch(console.error);