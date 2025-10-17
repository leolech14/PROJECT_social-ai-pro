// 🚀 Retool GUI Automation with Playwright
// This script automatically creates a complete Retool app through the UI

const { chromium } = require('playwright');
const fs = require('fs').promises;

class RetoolGUIAutomator {
  constructor(config) {
    this.config = {
      retoolUrl: config.retoolUrl || 'https://leonardolech1.retool.com',
      email: config.email,
      password: config.password,
      headless: config.headless || false,
      slowMo: config.slowMo || 50 // Slow down for visibility
    };
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🎭 Launching Playwright browser...');
    this.browser = await chromium.launch({
      headless: this.config.headless,
      slowMo: this.config.slowMo
    });
    
    const context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    
    this.page = await context.newPage();
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser error:', msg.text());
      }
    });
  }

  async login() {
    console.log('🔐 Logging into Retool...');
    await this.page.goto(this.config.retoolUrl);
    
    // Wait for login form
    await this.page.waitForSelector('input[type="email"]', { timeout: 30000 });
    
    // Fill login credentials
    await this.page.fill('input[type="email"]', this.config.email);
    await this.page.fill('input[type="password"]', this.config.password);
    
    // Click login button
    await this.page.click('button[type="submit"]');
    
    // Wait for dashboard
    await this.page.waitForNavigation();
    await this.page.waitForTimeout(2000);
    
    console.log('✅ Logged in successfully');
  }

  async createNewApp(appName) {
    console.log(`📱 Creating new app: ${appName}`);
    
    // Click "Create new" button
    await this.page.click('button:has-text("Create new")');
    await this.page.waitForTimeout(1000);
    
    // Select "Start from scratch"
    await this.page.click('text=Start from scratch');
    
    // Enter app name
    await this.page.fill('input[placeholder*="app name"]', appName);
    
    // Click create
    await this.page.click('button:has-text("Create app")');
    
    // Wait for editor to load
    await this.page.waitForSelector('.retool-canvas', { timeout: 30000 });
    console.log('✅ App created, editor loaded');
  }

  async addContainer(name = 'mainContainer') {
    console.log(`📦 Adding container: ${name}`);
    
    // Open components panel if not open
    const componentsPanelVisible = await this.page.isVisible('text=Components');
    if (!componentsPanelVisible) {
      await this.page.click('button[aria-label="Components"]');
    }
    
    // Search for container
    await this.page.fill('input[placeholder*="Search"]', 'container');
    await this.page.waitForTimeout(500);
    
    // Drag container to canvas
    const container = await this.page.locator('div:has-text("Container")').first();
    const canvas = await this.page.locator('.retool-canvas');
    
    await container.dragTo(canvas, {
      targetPosition: { x: 100, y: 100 }
    });
    
    console.log('✅ Container added');
  }

  async addText(text, properties = {}) {
    console.log(`📝 Adding text: ${text.substring(0, 30)}...`);
    
    // Search for text component
    await this.page.fill('input[placeholder*="Search"]', 'text');
    await this.page.waitForTimeout(500);
    
    // Drag text to canvas
    const textComponent = await this.page.locator('div:has-text("Text")').nth(1);
    const canvas = await this.page.locator('.retool-canvas');
    
    await textComponent.dragTo(canvas, {
      targetPosition: { x: properties.x || 150, y: properties.y || 150 }
    });
    
    // Configure text content
    await this.page.waitForTimeout(500);
    await this.page.click('.retool-inspector input[value*="Text"]');
    await this.page.fill('.retool-inspector textarea', text);
    
    // Apply styles if provided
    if (properties.style) {
      await this.applyStyles(properties.style);
    }
    
    console.log('✅ Text added');
  }

  async addButton(text, onClick) {
    console.log(`🔘 Adding button: ${text}`);
    
    // Search for button
    await this.page.fill('input[placeholder*="Search"]', 'button');
    await this.page.waitForTimeout(500);
    
    // Drag button to canvas
    const button = await this.page.locator('div:has-text("Button")').nth(1);
    const canvas = await this.page.locator('.retool-canvas');
    
    await button.dragTo(canvas, {
      targetPosition: { x: 200, y: 300 }
    });
    
    // Configure button text
    await this.page.waitForTimeout(500);
    await this.page.click('.retool-inspector input[value*="Submit"]');
    await this.page.fill('.retool-inspector input[value*="Submit"]', text);
    
    // Add click handler if provided
    if (onClick) {
      await this.addEventHandler('click', onClick);
    }
    
    console.log('✅ Button added');
  }

  async addTable(name = 'dataTable') {
    console.log(`📊 Adding table: ${name}`);
    
    // Search for table
    await this.page.fill('input[placeholder*="Search"]', 'table');
    await this.page.waitForTimeout(500);
    
    // Drag table to canvas
    const table = await this.page.locator('div:has-text("Table")').nth(1);
    const canvas = await this.page.locator('.retool-canvas');
    
    await table.dragTo(canvas, {
      targetPosition: { x: 100, y: 400 }
    });
    
    console.log('✅ Table added');
  }

  async addQuery(queryName, queryConfig) {
    console.log(`🔍 Adding query: ${queryName}`);
    
    // Open queries panel
    await this.page.click('button[aria-label="Code"]');
    await this.page.waitForTimeout(500);
    
    // Create new query
    await this.page.click('button:has-text("New")');
    await this.page.click('text=Resource query');
    
    // Configure query
    await this.page.fill('input[placeholder*="query name"]', queryName);
    
    if (queryConfig.sql) {
      await this.page.fill('textarea[placeholder*="SELECT"]', queryConfig.sql);
    }
    
    // Set to run on page load if specified
    if (queryConfig.runOnPageLoad) {
      await this.page.check('input[type="checkbox"]:near(text="Run on page load")');
    }
    
    console.log('✅ Query added');
  }

  async addStateVariable(name, defaultValue) {
    console.log(`📦 Adding state variable: ${name}`);
    
    // Open state panel
    await this.page.click('button:has-text("State")');
    await this.page.waitForTimeout(500);
    
    // Add new variable
    await this.page.click('button[aria-label="Add variable"]');
    
    // Configure variable
    await this.page.fill('input[placeholder*="Variable name"]', name);
    await this.page.fill('textarea[placeholder*="Default value"]', JSON.stringify(defaultValue, null, 2));
    
    console.log('✅ State variable added');
  }

  async applyStyles(styles) {
    // Navigate to styles tab
    await this.page.click('text=Styles');
    await this.page.waitForTimeout(500);
    
    // Apply each style
    for (const [property, value] of Object.entries(styles)) {
      const input = await this.page.locator(`input[placeholder*="${property}"]`);
      if (await input.isVisible()) {
        await input.fill(value);
      }
    }
  }

  async addEventHandler(event, code) {
    // Navigate to event handlers
    await this.page.click('text=Event handlers');
    await this.page.waitForTimeout(500);
    
    // Add new handler
    await this.page.click('button:has-text("Add")');
    
    // Configure handler
    await this.page.selectOption('select', event);
    await this.page.fill('textarea', code);
  }

  async addCustomCSS(css) {
    console.log('🎨 Adding custom CSS...');
    
    // Open app settings
    await this.page.click('button[aria-label="App settings"]');
    await this.page.waitForTimeout(500);
    
    // Navigate to CSS tab
    await this.page.click('text=Custom CSS');
    
    // Add CSS
    await this.page.fill('.ace_editor textarea', css);
    
    // Save settings
    await this.page.click('button:has-text("Save")');
    
    console.log('✅ Custom CSS added');
  }

  async createSocialAIProApp() {
    console.log('🚀 Creating Social AI Pro app with compact UI...');
    
    // Create the app
    await this.createNewApp('Social AI Pro - Compact UI');
    
    // Add state management
    await this.addStateVariable('appState', {
      stage: 0,
      description: '',
      tone: 'Educational',
      platforms: ['YouTube'],
      duration: 30,
      activeProvider: 'all',
      voiceSearch: '',
      selectedVoice: null,
      script: null,
      audioUrl: null
    });
    
    // Add main container
    await this.addContainer('mainContainer');
    
    // Add hero section components
    await this.addText('Social Media Science', {
      x: 150,
      y: 100,
      style: {
        fontSize: '32px',
        color: '#ffffff',
        fontWeight: '700'
      }
    });
    
    await this.addText('Transform user inputs into viral-worthy video scripts using AI', {
      x: 150,
      y: 150,
      style: {
        fontSize: '16px',
        color: '#9CA3AF'
      }
    });
    
    await this.addButton('Start Creating', 'appState.setValue({...appState.value, stage: 1})');
    
    // Add table for voices
    await this.addTable('voicesTable');
    
    // Add queries
    await this.addQuery('getVoices', {
      sql: 'SELECT * FROM voices ORDER BY provider, name',
      runOnPageLoad: true
    });
    
    // Add custom CSS for compact UI
    const compactCSS = `
/* Compact UI - 40% smaller fonts */
:root {
  font-size: 60%;
}

/* Dark theme */
._retool-container1 {
  background: #111827;
  padding: 24px;
  min-height: 100vh;
}

/* Compact elements */
button {
  padding: 6px 16px !important;
  font-size: 14px !important;
}

input, textarea, select {
  padding: 4px 8px !important;
  font-size: 12px !important;
}`;
    
    await this.addCustomCSS(compactCSS);
    
    console.log('✅ Social AI Pro app created successfully!');
  }

  async saveAndPreview() {
    console.log('💾 Saving app...');
    
    // Save
    await this.page.keyboard.press('Control+S');
    await this.page.waitForTimeout(2000);
    
    // Preview
    await this.page.click('button:has-text("Preview")');
    await this.page.waitForTimeout(3000);
    
    console.log('✅ App saved and previewing');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution function
async function automateRetoolAppCreation() {
  const automator = new RetoolGUIAutomator({
    retoolUrl: process.env.RETOOL_URL || 'https://leonardolech1.retool.com',
    email: process.env.RETOOL_EMAIL,
    password: process.env.RETOOL_PASSWORD,
    headless: false, // Set to true for headless mode
    slowMo: 100 // Milliseconds between actions
  });

  try {
    await automator.init();
    await automator.login();
    await automator.createSocialAIProApp();
    await automator.saveAndPreview();
    
    console.log('🎉 Automation complete! Your Retool app is ready.');
    
    // Keep browser open for inspection
    console.log('Press Ctrl+C to close the browser...');
    
  } catch (error) {
    console.error('❌ Error:', error);
    await automator.close();
  }
}

// Export for use as module
module.exports = { RetoolGUIAutomator };

// Run if called directly
if (require.main === module) {
  automateRetoolAppCreation();
}