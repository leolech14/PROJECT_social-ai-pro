// Retool Auto-Builder Script
// Copy and paste this into your browser console while in the Retool editor

console.log('🚀 Social AI Pro Auto-Builder for Retool');

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to trigger React events
const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
  
  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
  
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

// Auto-build function
async function buildSocialAIPro() {
  console.log('Starting auto-build...\n');

  // Step 1: Add Container
  console.log('1️⃣ Adding main container...');
  // Find component panel and drag container
  const addContainer = () => {
    const componentPanel = document.querySelector('[data-testid="component-tree-add-button"]');
    if (componentPanel) {
      componentPanel.click();
      await wait(500);
      
      const containerOption = Array.from(document.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent.includes('Container'));
      if (containerOption) containerOption.click();
    }
  };

  // Step 2: Add State Variable
  console.log('2️⃣ Creating state variable...');
  const addStateVariable = async () => {
    // Click on State tab
    const stateTab = Array.from(document.querySelectorAll('[role="tab"]'))
      .find(el => el.textContent === 'State');
    if (stateTab) {
      stateTab.click();
      await wait(500);
      
      // Click add variable
      const addButton = document.querySelector('[aria-label="Add variable"]');
      if (addButton) {
        addButton.click();
        await wait(500);
        
        // Set variable name
        const nameInput = document.querySelector('input[placeholder="Variable name"]');
        if (nameInput) {
          setNativeValue(nameInput, 'appState');
          
          // Set default value
          const valueTextarea = document.querySelector('textarea[placeholder="Default value"]');
          if (valueTextarea) {
            const defaultState = {
              stage: 0,
              description: "",
              tone: "Educational",
              platforms: ["YouTube"],
              duration: 30,
              activeProvider: "all",
              voiceSearch: "",
              selectedVoice: null,
              script: null,
              audioUrl: null
            };
            
            setNativeValue(valueTextarea, JSON.stringify(defaultState, null, 2));
          }
        }
      }
    }
  };

  // Step 3: Add Components
  console.log('3️⃣ Adding UI components...');
  const components = [
    {
      type: 'Text',
      name: 'titleText',
      properties: {
        value: 'Social Media Science',
        style: 'font-size: 32px; color: #ffffff; font-weight: bold; text-align: center;'
      }
    },
    {
      type: 'Text',
      name: 'subtitleText',
      properties: {
        value: 'Transform user inputs into viral-worthy video scripts using AI',
        style: 'font-size: 16px; color: #9CA3AF; text-align: center;'
      }
    },
    {
      type: 'Button',
      name: 'startButton',
      properties: {
        text: 'Start Creating',
        onClick: 'appState.setValue({...appState.value, stage: 1})'
      }
    },
    {
      type: 'Text Input',
      name: 'inputDescription',
      properties: {
        placeholder: 'e.g., How to make perfect coffee at home',
        label: 'Video Description'
      }
    },
    {
      type: 'Select',
      name: 'selectTone',
      properties: {
        label: 'Tone',
        data: '["Professional", "Educational", "Fun", "Inspiring"]',
        defaultValue: 'Educational'
      }
    }
  ];

  // Step 4: Add Queries
  console.log('4️⃣ Creating queries...');
  const queries = [
    {
      name: 'getVoices',
      type: 'GET',
      url: '/api/voices',
      runOnPageLoad: true
    },
    {
      name: 'generateScript',
      type: 'POST',
      url: '/api/generate-script',
      body: `{
        "description": {{ inputDescription.value }},
        "tone": {{ selectTone.value }},
        "platforms": {{ multiselectPlatforms.value }},
        "duration": {{ numberDuration.value }}
      }`
    }
  ];

  // Step 5: Add Custom CSS
  console.log('5️⃣ Applying compact UI CSS...');
  const addCustomCSS = () => {
    // Find settings button
    const settingsButton = document.querySelector('[aria-label="App settings"]');
    if (settingsButton) {
      settingsButton.click();
      await wait(500);
      
      // Find CSS tab
      const cssTab = Array.from(document.querySelectorAll('[role="tab"]'))
        .find(el => el.textContent.includes('CSS'));
      if (cssTab) {
        cssTab.click();
        await wait(500);
        
        const cssEditor = document.querySelector('.ace_editor');
        if (cssEditor && cssEditor.env && cssEditor.env.editor) {
          const css = `
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
}

/* Table styles */
._retool-table1 {
  font-size: 12px;
}

._retool-table1 th,
._retool-table1 td {
  padding: 4px 8px !important;
}`;
          
          cssEditor.env.editor.setValue(css);
        }
      }
    }
  };

  // Execute steps
  try {
    await addContainer();
    await wait(1000);
    
    await addStateVariable();
    await wait(1000);
    
    console.log('✅ Basic structure created!');
    console.log('\n📝 Next steps:');
    console.log('1. Add remaining components manually');
    console.log('2. Connect queries to your REST API resource');
    console.log('3. Set component visibility based on appState.value.stage');
    console.log('\n💡 Tip: Use the manual guide for detailed component properties');
    
  } catch (error) {
    console.error('❌ Error during auto-build:', error);
    console.log('\n🔧 Try the manual setup guide instead');
  }
}

// Show instructions
console.log('\n📋 Instructions:');
console.log('1. Make sure you\'re in the Retool editor');
console.log('2. Have your REST API resource "SocialAIProAPI" created');
console.log('3. Run: buildSocialAIPro()');
console.log('\n⚠️  Note: This works best in Chrome/Edge');

// Make function available globally
window.buildSocialAIPro = buildSocialAIPro;