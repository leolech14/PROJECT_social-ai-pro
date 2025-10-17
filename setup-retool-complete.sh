#!/bin/bash

# Social AI Pro - Complete Retool Setup Script
echo "🚀 Setting up Social AI Pro for Retool..."

# 1. Create Retool-specific endpoints
echo "📝 Creating Retool endpoints..."
cat > src/routes/retool.js << 'EOF'
export default function retoolRoutes(app) {
  // Health check for Retool
  app.get('/api/retool/health', (req, res) => {
    res.json({ 
      status: 'connected',
      timestamp: new Date(),
      endpoints: [
        '/api/voices',
        '/api/generate-script',
        '/api/voice-preview',
        '/api/generate-voice'
      ]
    });
  });

  // Get complete app data for Retool
  app.get('/api/retool/app-data', async (req, res) => {
    try {
      // Return all configuration needed for Retool
      res.json({
        voices: {
          google: [
            { id: 'google_zephyr', name: 'Zephyr', provider: 'Google', style: 'Bright', description: 'Bright and cheerful voice' },
            { id: 'google_puck', name: 'Puck', provider: 'Google', style: 'Upbeat', description: 'Upbeat and energetic voice' },
            { id: 'google_isla', name: 'Isla', provider: 'Google', style: 'Expressive', description: 'Expressive and dynamic voice' },
            { id: 'google_echo', name: 'Echo', provider: 'Google', style: 'Professional', description: 'Professional and clear voice' },
            { id: 'google_orbit', name: 'Orbit', provider: 'Google', style: 'Futuristic', description: 'Modern futuristic voice' },
            { id: 'google_nova', name: 'Nova (Google)', provider: 'Google', style: 'Warm', description: 'Warm and friendly voice' },
            { id: 'google_sage', name: 'Sage', provider: 'Google', style: 'Wise', description: 'Wise and thoughtful voice' },
            { id: 'google_luna', name: 'Luna', provider: 'Google', style: 'Dreamy', description: 'Soft and dreamy voice' }
          ],
          openai: [
            { id: 'openai_alloy', name: 'Alloy', provider: 'OpenAI', style: 'Balanced', description: 'Neutral and balanced voice' },
            { id: 'openai_echo', name: 'Echo', provider: 'OpenAI', style: 'Smooth', description: 'Smooth male voice' },
            { id: 'openai_fable', name: 'Fable', provider: 'OpenAI', style: 'Expressive', description: 'Expressive storyteller voice' },
            { id: 'openai_onyx', name: 'Onyx', provider: 'OpenAI', style: 'Deep', description: 'Deep and authoritative voice' },
            { id: 'openai_nova', name: 'Nova', provider: 'OpenAI', style: 'Friendly', description: 'Friendly and warm voice' },
            { id: 'openai_shimmer', name: 'Shimmer', provider: 'OpenAI', style: 'Warm', description: 'Warm and inviting voice' }
          ]
        },
        tones: ['Professional', 'Educational', 'Fun', 'Inspiring'],
        platforms: ['TikTok', 'Instagram', 'YouTube'],
        durations: [10, 20, 30, 60, 90, 120]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
EOF

# 2. Update server.js to include Retool routes
echo "🔧 Updating server.js..."
cat >> server.js << 'EOF'

// Retool-specific routes
import retoolRoutes from './src/routes/retool.js';
retoolRoutes(app);

// Enhanced CORS for Retool
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin.includes('retool.com')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});
EOF

# 3. Create Retool configuration file
echo "📋 Creating Retool configuration..."
cat > retool-config.json << 'EOF'
{
  "appName": "Social AI Pro",
  "version": "1.0.0",
  "api": {
    "baseUrl": "http://localhost:4444",
    "endpoints": {
      "voices": "/api/voices",
      "generateScript": "/api/generate-script",
      "voicePreview": "/api/voice-preview",
      "generateVoice": "/api/generate-voice",
      "retoolHealth": "/api/retool/health",
      "appData": "/api/retool/app-data"
    }
  },
  "ui": {
    "compactMode": true,
    "fontSize": "60%",
    "theme": "dark",
    "colors": {
      "primary": "#7C3AED",
      "secondary": "#EC4899",
      "background": "#111827",
      "surface": "#1F2937",
      "text": "#FFFFFF",
      "textSecondary": "#9CA3AF"
    }
  },
  "features": {
    "voiceProviders": ["Google", "OpenAI", "ElevenLabs"],
    "totalVoices": 43,
    "stages": ["Hero", "Input", "Script", "Voice", "Output"]
  }
}
EOF

# 4. Create Retool import helper
echo "🛠️ Creating Retool import helper..."
cat > generate-retool-app.js << 'EOF'
const fs = require('fs');

// Generate complete Retool app structure
const retoolApp = {
  name: "Social AI Pro",
  version: "3.0.0",
  queries: [
    {
      id: "getVoices",
      resourceName: "SocialAIProAPI",
      type: "GET",
      url: "/api/voices",
      runWhenPageLoads: true
    },
    {
      id: "generateScript",
      resourceName: "SocialAIProAPI", 
      type: "POST",
      url: "/api/generate-script",
      body: `{{
        {
          description: inputDescription.value,
          tone: selectTone.value,
          platforms: multiselectPlatforms.value,
          duration: numberDuration.value
        }
      }}`
    },
    {
      id: "previewVoice",
      resourceName: "SocialAIProAPI",
      type: "POST",
      url: "/api/voice-preview",
      body: `{{
        {
          voiceId: table1.selectedRow.id,
          demoText: "Testing the new compact UI with Google AI Studio voices"
        }
      }}`
    }
  ],
  components: {
    container1: {
      type: "container",
      properties: {
        backgroundColor: "#111827"
      }
    },
    textTitle: {
      type: "text",
      properties: {
        value: "Social Media Science",
        style: {
          fontSize: "32px",
          color: "#ffffff",
          fontWeight: "bold"
        }
      }
    },
    buttonStart: {
      type: "button",
      properties: {
        text: "Start Creating",
        style: {
          backgroundColor: "#7C3AED"
        }
      }
    }
  }
};

console.log(JSON.stringify(retoolApp, null, 2));
fs.writeFileSync('retool-app-complete.json', JSON.stringify(retoolApp, null, 2));
console.log('✅ Retool app structure generated!');
EOF

# 5. Create test data generator
echo "📊 Creating test data generator..."
cat > generate-test-data.js << 'EOF'
// Generate test data for Retool
const testData = {
  mockScript: {
    id: Date.now(),
    title: "How to Master AI Voice Generation",
    hook: "Ever wondered how to create perfect AI voices? Here's the secret!",
    mainPoints: [
      "Choose the right voice for your content",
      "Optimize your script for voice synthesis",
      "Use the compact UI for better workflow"
    ],
    callToAction: "Try it yourself with our 43 amazing voices!",
    duration: 30
  },
  mockVoiceData: {
    audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA",
    duration: 30,
    status: "ready"
  }
};

console.log(JSON.stringify(testData, null, 2));
EOF

# 6. Create Retool webhook handler
echo "🔗 Setting up webhook handler..."
cat > src/webhooks/retool-webhook.js << 'EOF'
export function handleRetoolWebhook(app) {
  app.post('/api/webhooks/retool', (req, res) => {
    const { event, data } = req.body;
    
    console.log(`Retool webhook received: ${event}`);
    
    switch(event) {
      case 'app.loaded':
        res.json({ 
          message: 'App loaded successfully',
          config: {
            compactUI: true,
            voiceCount: 43
          }
        });
        break;
        
      case 'voice.selected':
        res.json({ 
          message: 'Voice selected',
          voiceId: data.voiceId 
        });
        break;
        
      default:
        res.json({ message: 'Event received' });
    }
  });
}
EOF

# 7. Create deployment script for production
echo "🚀 Creating production deployment script..."
cat > deploy-for-retool.sh << 'EOF'
#!/bin/bash
echo "Deploying Social AI Pro for Retool..."

# Build frontend
npm run build

# Set production environment
export NODE_ENV=production
export CORS_ORIGIN="https://*.retool.com"

# Start server
pm2 start server.js --name social-ai-pro-api

echo "✅ Deployment complete!"
echo "API URL: http://localhost:4444"
echo "Test endpoint: http://localhost:4444/api/retool/health"
EOF

chmod +x deploy-for-retool.sh

# 8. Generate complete documentation
echo "📚 Generating Retool documentation..."
cat > RETOOL_COMPLETE_SETUP.md << 'EOF'
# Social AI Pro - Complete Retool Setup

## Quick Start
1. Run `./setup-retool-complete.sh`
2. Start server: `npm run server`
3. Import configuration in Retool

## API Endpoints

### Core Endpoints
- GET `/api/voices` - Get all 43 voices
- POST `/api/generate-script` - Generate AI script
- POST `/api/voice-preview` - Preview voice
- POST `/api/generate-voice` - Generate final audio

### Retool-Specific
- GET `/api/retool/health` - Health check
- GET `/api/retool/app-data` - Get app configuration
- POST `/api/webhooks/retool` - Webhook handler

## Retool Resource Configuration
```javascript
{
  name: "SocialAIProAPI",
  baseUrl: "http://localhost:4444",
  headers: {
    "Content-Type": "application/json"
  }
}
```

## Components Structure
1. **Stage 0**: Hero Screen
2. **Stage 1**: Input Form (Description, Tone, Platforms, Duration)
3. **Stage 2**: Script Review
4. **Stage 3**: Voice Selection (43 voices with compact UI)
5. **Stage 4**: Audio Output

## Compact UI CSS
```css
:root { font-size: 60%; }
```

## State Management
```javascript
{
  stage: 0,
  description: "",
  tone: "Educational",
  platforms: ["YouTube"],
  duration: 30,
  activeProvider: "all",
  selectedVoice: null,
  script: null,
  audioUrl: null
}
```
EOF

# 9. Test the setup
echo "🧪 Testing setup..."
node generate-retool-app.js
node generate-test-data.js

echo "✅ Retool setup complete!"
echo ""
echo "Next steps:"
echo "1. Start your server: npm run server"
echo "2. Test API: curl http://localhost:4444/api/retool/health"
echo "3. In Retool, create resource with base URL: http://localhost:4444"
echo "4. Import the generated configurations"
echo ""
echo "Files created:"
echo "- src/routes/retool.js"
echo "- retool-config.json"
echo "- retool-app-complete.json"
echo "- RETOOL_COMPLETE_SETUP.md"