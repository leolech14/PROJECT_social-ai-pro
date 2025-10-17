#!/bin/bash

# 🚀 Social AI Pro - Complete Retool Deployment Script
# This script sets up everything needed for Retool integration

echo "╔════════════════════════════════════════════╗"
echo "║     Social AI Pro - Retool Deployment      ║"
echo "║         Compact UI + 43 AI Voices          ║"
echo "╚════════════════════════════════════════════╝"
echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if server is already running
check_server() {
    if lsof -Pi :4445 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✓ Server already running on port 4445${NC}"
        return 0
    else
        return 1
    fi
}

# Start backend server
start_server() {
    echo -e "${BLUE}🚀 Starting backend server...${NC}"
    
    # Check if server is already running
    if check_server; then
        echo -e "${YELLOW}ℹ️  Server is already running. Skipping start.${NC}"
    else
        # Start server in background
        npm run server > server.log 2>&1 &
        SERVER_PID=$!
        
        # Wait for server to start
        echo -n "Waiting for server to start"
        for i in {1..30}; do
            if check_server; then
                echo -e "\n${GREEN}✓ Server started successfully (PID: $SERVER_PID)${NC}"
                break
            fi
            echo -n "."
            sleep 1
        done
        
        if ! check_server; then
            echo -e "\n${RED}✗ Failed to start server. Check server.log for details.${NC}"
            exit 1
        fi
    fi
}

# Test API endpoints
test_api() {
    echo -e "\n${BLUE}🧪 Testing API endpoints...${NC}"
    
    # Test voices endpoint
    echo -n "Testing /api/voices... "
    VOICES_RESPONSE=$(curl -s http://localhost:4445/api/voices)
    VOICE_COUNT=$(echo "$VOICES_RESPONSE" | jq length 2>/dev/null || echo "0")
    
    if [ "$VOICE_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Found $VOICE_COUNT voices${NC}"
    else
        echo -e "${RED}✗ Failed to get voices${NC}"
    fi
    
    # Test health endpoint
    echo -n "Testing /health... "
    HEALTH_STATUS=$(curl -s http://localhost:4445/health | jq -r .status 2>/dev/null)
    
    if [ "$HEALTH_STATUS" = "ok" ]; then
        echo -e "${GREEN}✓ Health check passed${NC}"
    else
        echo -e "${RED}✗ Health check failed${NC}"
    fi
}

# Generate Retool resource configuration
generate_resource_config() {
    echo -e "\n${BLUE}📋 Generating Retool resource configuration...${NC}"
    
    cat > retool-resource-config.json << 'EOF'
{
  "name": "SocialAIProAPI",
  "type": "restapi",
  "displayName": "Social AI Pro API",
  "description": "Backend API for Social AI Pro with 43 voices",
  "baseURL": "http://localhost:4445",
  "urlPath": "",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json"
    }
  ],
  "authentication": {
    "authenticationType": "none"
  },
  "dynamicWorkflowConfiguration": {
    "enabled": false
  },
  "watchedParams": [],
  "privateLinkId": null,
  "forward_logs": false
}
EOF
    
    echo -e "${GREEN}✓ Resource configuration saved to retool-resource-config.json${NC}"
}

# Generate quick setup guide
generate_quick_guide() {
    echo -e "\n${BLUE}📚 Generating quick setup guide...${NC}"
    
    cat > RETOOL_QUICK_START.md << 'EOF'
# 🚀 Social AI Pro - Retool Quick Start

## ✅ Backend is Ready!
Your API server is running at: `http://localhost:4445`

## 📱 Retool Setup (3 minutes)

### 1️⃣ Create REST API Resource
1. Go to Resources → Create New → REST API
2. Name: `SocialAIProAPI`
3. Base URL: `http://localhost:4445`
4. Save resource

### 2️⃣ Import App (Fastest Method)
1. Go to Apps → Create new → From JSON
2. Upload: `social-ai-pro-complete.retool.json`
3. Done! Your app is ready with:
   - ✅ Compact UI (40% smaller)
   - ✅ 43 AI voices
   - ✅ All queries configured
   - ✅ Dark theme

### 3️⃣ Test Your App
1. Click "Preview" in top right
2. Click "Start Creating" button
3. Fill in video details
4. Generate script
5. Select a voice
6. Generate audio

## 🎤 Available Voices
- **Google AI Studio** (8): Zephyr, Puck, Isla, Echo, Orbit, Nova, Sage, Luna
- **OpenAI** (11): Alloy, Echo, Fable, Onyx, Nova, Shimmer + 5 HD voices
- **ElevenLabs** (24): Premium selection

## 🔧 Troubleshooting
- **No voices showing?** Check console for API key errors
- **Script generation fails?** Verify OpenAI API key in .env
- **Voice preview silent?** Check browser autoplay settings

## 📊 API Endpoints
- GET `/api/voices` - List all 43 voices
- POST `/api/generate-script` - Generate AI script
- POST `/api/voice-preview` - Preview voice sample
- POST `/api/generate-voice` - Generate full audio
- GET `/health` - Health check

## 🎨 Customization
The app uses 60% base font size for compact UI. To adjust:
1. Go to App Settings → Custom CSS
2. Change `:root { font-size: 60%; }` to your preference
3. Save and refresh

Ready to create amazing content! 🎬
EOF
    
    echo -e "${GREEN}✓ Quick start guide saved to RETOOL_QUICK_START.md${NC}"
}

# Create browser console helper
create_console_helper() {
    echo -e "\n${BLUE}🔧 Creating browser console helper...${NC}"
    
    cat > retool-console-helper.js << 'EOF'
// Retool Console Helper - Paste this in browser console
console.log('%c🚀 Social AI Pro - Retool Console Helper', 'color: #7C3AED; font-size: 20px; font-weight: bold');

// Quick app state viewer
window.viewAppState = () => {
  const state = appState?.value || {};
  console.log('📊 Current App State:', state);
  console.log('🎬 Stage:', state.stage);
  console.log('🎤 Selected Voice:', state.selectedVoice);
  console.log('📝 Script:', state.script);
};

// Quick voice list
window.listVoices = () => {
  const voices = getVoices?.data || [];
  console.table(voices.map(v => ({
    Name: v.name,
    Provider: v.provider,
    Style: v.style,
    Description: v.description.substring(0, 50) + '...'
  })));
  console.log(`Total voices: ${voices.length}`);
};

// Test voice preview
window.testVoice = async (voiceName) => {
  const voices = getVoices?.data || [];
  const voice = voices.find(v => v.name.toLowerCase().includes(voiceName.toLowerCase()));
  
  if (!voice) {
    console.error(`Voice "${voiceName}" not found. Use listVoices() to see available voices.`);
    return;
  }
  
  console.log(`🎤 Testing voice: ${voice.name} (${voice.provider})`);
  
  // Set selected row in table
  tableVoices.selectRow(voices.indexOf(voice));
  
  // Trigger preview
  await previewVoice.trigger();
  
  console.log('✅ Voice preview triggered');
};

// Quick stage navigation
window.goToStage = (stage) => {
  appState.setValue({...appState.value, stage});
  console.log(`📍 Moved to stage ${stage}`);
};

// Debug mode toggle
window.debugMode = false;
window.toggleDebug = () => {
  window.debugMode = !window.debugMode;
  console.log(`🐛 Debug mode: ${window.debugMode ? 'ON' : 'OFF'}`);
  
  if (window.debugMode) {
    // Log all query executions
    ['getVoices', 'generateScript', 'previewVoice', 'generateVoice'].forEach(queryName => {
      const query = window[queryName];
      if (query) {
        const originalTrigger = query.trigger.bind(query);
        query.trigger = async (...args) => {
          console.log(`🔄 Executing ${queryName}...`);
          const result = await originalTrigger(...args);
          console.log(`✅ ${queryName} result:`, result);
          return result;
        };
      }
    });
  }
};

console.log(`
📋 Available Commands:
- viewAppState()     View current app state
- listVoices()       List all 43 voices in table
- testVoice("Luna")  Test a voice by name
- goToStage(1)       Navigate to specific stage
- toggleDebug()      Toggle debug logging

💡 Example: testVoice("Zephyr") to test Google AI voice
`);
EOF
    
    echo -e "${GREEN}✓ Console helper saved to retool-console-helper.js${NC}"
}

# Create API test collection
create_api_tests() {
    echo -e "\n${BLUE}🧪 Creating API test collection...${NC}"
    
    cat > test-api-endpoints.sh << 'EOF'
#!/bin/bash

# API Test Collection for Social AI Pro

API_BASE="http://localhost:4445"

echo "🧪 Testing Social AI Pro API Endpoints"
echo "======================================"

# Test 1: Health Check
echo -e "\n1️⃣ Health Check"
curl -s "$API_BASE/health" | jq

# Test 2: Get Voices
echo -e "\n2️⃣ Get All Voices"
VOICES=$(curl -s "$API_BASE/api/voices")
echo "Total voices: $(echo "$VOICES" | jq length)"
echo "Providers: $(echo "$VOICES" | jq -r '.[].provider' | sort | uniq -c)"

# Test 3: Generate Script
echo -e "\n3️⃣ Generate Script"
curl -s -X POST "$API_BASE/api/generate-script" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "How to make perfect coffee at home",
    "tone": "Educational",
    "platforms": ["YouTube"],
    "duration": 30
  }' | jq

# Test 4: Voice Preview (using first Google AI voice)
echo -e "\n4️⃣ Voice Preview (Google AI - Zephyr)"
ZEPHYR_ID=$(echo "$VOICES" | jq -r '.[] | select(.name == "Zephyr") | .id')
curl -s -X POST "$API_BASE/api/voice-preview" \
  -H "Content-Type: application/json" \
  -d "{
    \"voiceId\": \"$ZEPHYR_ID\",
    \"demoText\": \"Testing the new compact UI with Google AI Studio voices\"
  }" | jq

echo -e "\n✅ API tests complete!"
EOF
    
    chmod +x test-api-endpoints.sh
    echo -e "${GREEN}✓ API test collection saved to test-api-endpoints.sh${NC}"
}

# Main deployment flow
main() {
    echo -e "${BLUE}Starting Retool deployment process...${NC}\n"
    
    # Step 1: Start server
    start_server
    
    # Step 2: Test API
    test_api
    
    # Step 3: Generate configurations
    generate_resource_config
    generate_quick_guide
    create_console_helper
    create_api_tests
    
    # Final instructions
    echo -e "\n${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║        ✅ Deployment Complete!             ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    
    echo -e "\n${BLUE}📋 Next Steps:${NC}"
    echo "1. Open Retool: https://leonardolech1.retool.com"
    echo "2. Create REST API Resource with config from: retool-resource-config.json"
    echo "3. Import app from: social-ai-pro-complete.retool.json"
    echo "4. Start building! 🚀"
    
    echo -e "\n${BLUE}📚 Documentation:${NC}"
    echo "- Quick Start: RETOOL_QUICK_START.md"
    echo "- Console Helper: retool-console-helper.js"
    echo "- API Tests: ./test-api-endpoints.sh"
    
    echo -e "\n${YELLOW}💡 Pro Tip:${NC}"
    echo "Use the browser console helper for debugging:"
    echo "1. Open Retool app"
    echo "2. Open browser console (F12)"
    echo "3. Paste contents of retool-console-helper.js"
    echo "4. Use commands like listVoices() and testVoice('Luna')"
    
    echo -e "\n${GREEN}🎉 Your Social AI Pro app is ready for Retool!${NC}"
}

# Run main deployment
main