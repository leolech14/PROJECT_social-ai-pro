// 🎭 Quick Playwright Test
import { chromium } from 'playwright';

async function quickTest() {
  console.log('🎭 Quick Playwright Test\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50
  });

  const page = await browser.newPage();

  try {
    // Test Retool homepage
    console.log('📍 Navigating to Retool...');
    await page.goto('https://retool.com');
    
    // Take screenshot
    await page.screenshot({ path: 'retool-test.png' });
    console.log('✅ Screenshot saved: retool-test.png');
    
    // Check for key elements
    const title = await page.title();
    console.log(`✅ Page title: ${title}`);
    
    // Close after 3 seconds
    console.log('\n⏰ Closing in 3 seconds...');
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete!');
  }
}

quickTest();