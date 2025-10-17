#!/bin/bash

# 🎭 Playwright Setup for Retool GUI Automation

echo "╔════════════════════════════════════════════╗"
echo "║    Setting up Playwright for Retool GUI    ║"
echo "╚════════════════════════════════════════════╝"
echo

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}npm not found. Please install Node.js first.${NC}"
    exit 1
fi

# Create package.json if it doesn't exist
if [ ! -f "playwright-package.json" ]; then
    echo -e "${BLUE}Creating package.json for Playwright...${NC}"
    cat > playwright-package.json << 'EOF'
{
  "name": "retool-playwright-automation",
  "version": "1.0.0",
  "description": "Automated Retool app creation using Playwright",
  "main": "retool-playwright-automation.js",
  "scripts": {
    "start": "node retool-playwright-automation.js",
    "test": "playwright test",
    "ui": "playwright test --ui",
    "record": "playwright codegen https://retool.com"
  },
  "dependencies": {
    "@playwright/test": "^1.40.0",
    "playwright": "^1.40.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "prettier": "^3.0.0"
  }
}
EOF
fi

# Install Playwright
echo -e "${BLUE}Installing Playwright and dependencies...${NC}"
npm install --save playwright @playwright/test dotenv

# Install browsers
echo -e "${BLUE}Installing Playwright browsers...${NC}"
npx playwright install chromium

# Create .env template
if [ ! -f ".env.playwright" ]; then
    echo -e "${BLUE}Creating .env template...${NC}"
    cat > .env.playwright << 'EOF'
# Retool Credentials
RETOOL_URL=https://leonardolech1.retool.com
RETOOL_EMAIL=your-email@example.com
RETOOL_PASSWORD=your-password

# Automation Settings
HEADLESS=false
SLOW_MO=100
EOF
    echo -e "${YELLOW}⚠️  Please update .env.playwright with your Retool credentials${NC}"
fi

# Create enhanced automation script
echo -e "${BLUE}Creating enhanced automation script...${NC}"
cat > retool-gui-automator.js << 'EOF'
// 🚀 Enhanced Retool GUI Automator
// Automatically creates complete Retool apps through the UI

const { chromium, firefox, webkit } = require('playwright');
require('dotenv').config({ path: '.env.playwright' });

class EnhancedRetoolAutomator {
  constructor(options = {}) {
    this.options = {
      browser: options.browser || 'chromium',
      headless: options.headless ?? false,
      slowMo: options.slowMo || 50,
      video: options.video || 'on',
      screenshot: options.screenshot || 'only-on-failure',
      ...options
    };
  }

  async launch() {
    const browserType = { chromium, firefox, webkit }[this.options.browser];
    
    this.browser = await browserType.launch({
      headless: this.options.headless,
      slowMo: this.options.slowMo
    });

    const context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: this.options.video === 'on' ? { dir: './videos' } : undefined
    });

    this.page = await context.newPage();
    
    // Better error handling
    this.page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });

    this.page.on('requestfailed', request => {
      console.error('Request failed:', request.url());
    });

    return this;
  }

  async createCompactUIApp() {
    console.log('🎨 Creating Social AI Pro with Compact UI...\n');

    try {
      // Login
      await this.login();
      
      // Create new app
      await this.createApp('Social AI Pro - Compact');
      
      // Add components in sequence
      await this.addHeroSection();
      await this.addInputForm();
      await this.addVoiceSelection();
      await this.addResultsSection();
      
      // Configure resources
      await this.configureAPIResource();
      
      // Apply compact UI CSS
      await this.applyCompactStyles();
      
      // Save and preview
      await this.saveApp();
      
      console.log('\n✅ App creation complete!');
      
    } catch (error) {
      await this.page.screenshot({ path: `error-${Date.now()}.png` });
      throw error;
    }
  }

  async login() {
    console.log('🔐 Logging into Retool...');
    
    await this.page.goto(process.env.RETOOL_URL);
    await this.page.waitForLoadState('networkidle');
    
    // Check if already logged in
    if (await this.page.isVisible('text=Apps')) {
      console.log('✅ Already logged in');
      return;
    }
    
    // Login flow
    await this.page.fill('input[type="email"]', process.env.RETOOL_EMAIL);
    await this.page.fill('input[type="password"]', process.env.RETOOL_PASSWORD);
    await this.page.click('button[type="submit"]');
    
    await this.page.waitForSelector('text=Apps', { timeout: 30000 });
    console.log('✅ Login successful');
  }

  async createApp(appName) {
    console.log(`📱 Creating app: ${appName}`);
    
    // Click create button
    await this.page.click('button:has-text("Create"):visible');
    await this.page.waitForTimeout(1000);
    
    // Choose blank app
    const blankApp = this.page.locator('text=Start from scratch');
    if (await blankApp.isVisible()) {
      await blankApp.click();
    }
    
    // Set app name
    await this.page.fill('input[placeholder*="name"]', appName);
    await this.page.click('button:has-text("Create app")');
    
    // Wait for editor
    await this.page.waitForSelector('.retool-editor', { timeout: 30000 });
    console.log('✅ App created');
  }

  async addHeroSection() {
    console.log('🎯 Adding hero section...');
    
    // Add container
    await this.dragComponent('Container', { x: 100, y: 50 });
    
    // Add title
    await this.dragComponent('Text', { x: 150, y: 100 });
    await this.configureComponent({
      value: 'Social Media Science',
      style: { fontSize: '32px', color: '#ffffff', fontWeight: 'bold' }
    });
    
    // Add subtitle
    await this.dragComponent('Text', { x: 150, y: 150 });
    await this.configureComponent({
      value: 'Transform inputs into viral video scripts with AI',
      style: { fontSize: '16px', color: '#9CA3AF' }
    });
    
    // Add start button
    await this.dragComponent('Button', { x: 150, y: 220 });
    await this.configureComponent({
      text: 'Start Creating',
      style: { background: '#7C3AED' }
    });
  }

  async dragComponent(componentType, position) {
    // Open components panel
    const componentsBtn = this.page.locator('[aria-label="Components"]');
    if (await componentsBtn.isVisible()) {
      await componentsBtn.click();
      await this.page.waitForTimeout(500);
    }
    
    // Search for component
    await this.page.fill('input[placeholder*="Search"]', componentType);
    await this.page.waitForTimeout(500);
    
    // Drag to canvas
    const component = this.page.locator(`text=${componentType}`).first();
    const canvas = this.page.locator('.retool-canvas');
    
    await component.dragTo(canvas, {
      targetPosition: position
    });
    
    await this.page.waitForTimeout(500);
  }

  async configureComponent(config) {
    // Wait for inspector panel
    await this.page.waitForTimeout(500);
    
    // Configure properties
    for (const [key, value] of Object.entries(config)) {
      if (key === 'style') {
        await this.applyStyles(value);
      } else {
        const input = this.page.locator(`input[placeholder*="${key}"], textarea[placeholder*="${key}"]`).first();
        if (await input.isVisible()) {
          await input.fill(typeof value === 'string' ? value : JSON.stringify(value));
        }
      }
    }
  }

  async applyStyles(styles) {
    // Click styles tab
    await this.page.click('text=Styles');
    await this.page.waitForTimeout(300);
    
    // Apply each style
    for (const [prop, value] of Object.entries(styles)) {
      const styleInput = this.page.locator(`input[placeholder*="${prop}"]`).first();
      if (await styleInput.isVisible()) {
        await styleInput.fill(value);
      }
    }
  }

  async configureAPIResource() {
    console.log('🔌 Configuring API resource...');
    
    // Open resources
    await this.page.click('[aria-label="Resources"]');
    await this.page.waitForTimeout(500);
    
    // Create new REST API
    await this.page.click('button:has-text("Create new")');
    await this.page.click('text=REST API');
    
    // Configure
    await this.page.fill('input[placeholder*="name"]', 'SocialAIProAPI');
    await this.page.fill('input[placeholder*="Base URL"]', 'http://localhost:4445');
    
    // Save
    await this.page.click('button:has-text("Create resource")');
    console.log('✅ API resource configured');
  }

  async applyCompactStyles() {
    console.log('🎨 Applying compact UI styles...');
    
    // Open settings
    await this.page.click('[aria-label="Settings"]');
    await this.page.waitForTimeout(500);
    
    // Go to CSS tab
    await this.page.click('text=Custom CSS');
    
    // Add compact CSS
    const css = `
/* Compact UI - 40% smaller */
:root { font-size: 60%; }
._retool-container1 { background: #111827; }
button { padding: 6px 16px !important; font-size: 14px !important; }
input, select { padding: 4px 8px !important; font-size: 12px !important; }`;
    
    await this.page.fill('.ace_editor textarea', css);
    await this.page.click('button:has-text("Save")');
    
    console.log('✅ Compact styles applied');
  }

  async saveApp() {
    console.log('💾 Saving app...');
    await this.page.keyboard.press('Control+S');
    await this.page.waitForTimeout(2000);
    console.log('✅ App saved');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run automation
async function main() {
  const automator = new EnhancedRetoolAutomator({
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO) || 100
  });

  try {
    await automator.launch();
    await automator.createCompactUIApp();
    
    console.log('\n🎉 Success! Your Retool app is ready.');
    console.log('Press Ctrl+C to close...');
    
    // Keep browser open
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await automator.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { EnhancedRetoolAutomator };
EOF

# Create test runner
echo -e "${BLUE}Creating test runner...${NC}"
cat > run-automation.sh << 'EOF'
#!/bin/bash

echo "🎭 Retool GUI Automation Runner"
echo "=============================="
echo

# Check for .env file
if [ ! -f ".env.playwright" ]; then
    echo "❌ Error: .env.playwright not found"
    echo "Please create it with your Retool credentials"
    exit 1
fi

# Options
echo "Select mode:"
echo "1) Run with UI (watch it happen)"
echo "2) Run headless (faster)"
echo "3) Record new actions"
echo "4) Debug mode (super slow)"
echo

read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        HEADLESS=false SLOW_MO=100 node retool-gui-automator.js
        ;;
    2)
        HEADLESS=true SLOW_MO=0 node retool-gui-automator.js
        ;;
    3)
        npx playwright codegen https://retool.com
        ;;
    4)
        HEADLESS=false SLOW_MO=500 node retool-gui-automator.js
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
EOF

chmod +x run-automation.sh

# Success message
echo
echo -e "${GREEN}✅ Playwright setup complete!${NC}"
echo
echo -e "${BLUE}Next steps:${NC}"
echo "1. Update .env.playwright with your Retool credentials"
echo "2. Run: ./run-automation.sh"
echo "3. Watch as Playwright creates your app!"
echo
echo -e "${YELLOW}Tips:${NC}"
echo "- Use './run-automation.sh' option 3 to record new actions"
echo "- Videos are saved in ./videos directory"
echo "- Screenshots on errors in current directory"
echo