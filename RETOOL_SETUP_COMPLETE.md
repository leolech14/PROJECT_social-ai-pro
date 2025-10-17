# Social AI Pro - Complete Retool Setup

## ✅ Setup Complete!

Your Social AI Pro project is now fully configured for Retool integration.

## 🚀 Quick Start for Retool

### 1. In Your Retool App

Update your REST API resource base URL to:
```
http://localhost:4445
```

### 2. Available Endpoints

#### Core API Endpoints
- `GET /api/voices` - Returns all 43 voices (Google, OpenAI, ElevenLabs)
- `POST /api/generate-script` - Generate AI script
- `POST /api/voice-preview` - Preview voice with demo text
- `POST /api/generate-voice` - Generate final voice audio

#### Retool-Specific Endpoints
- `GET /api/retool/health` - Health check
- `GET /api/retool/app-data` - Get app configuration
- `POST /api/webhooks/retool` - Webhook handler

### 3. Test Your Connection

In Retool, create a test query:
```javascript
// Query Name: testConnection
// Resource: SocialAIProAPI
// Method: GET
// URL endpoint: /api/voices
```

### 4. Complete App Structure

The app includes 5 stages:
1. **Hero Screen** - Welcome message
2. **Input Form** - Video details (description, tone, platforms, duration)
3. **Script Review** - AI-generated script display
4. **Voice Selection** - 43 voices with compact UI
5. **Audio Output** - Final generated audio

### 5. State Management

Create a variable in Retool:
```javascript
{
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
}
```

### 6. Compact UI CSS

Add to Retool's Custom CSS:
```css
/* 40% smaller fonts */
:root {
  font-size: 60%;
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

/* Dark theme */
._retool-container1 {
  background: #111827;
}
```

### 7. Voice Breakdown

Total: **43 voices**
- **Google AI Studio**: 8 voices (NEW!)
  - Zephyr, Puck, Isla, Echo, Orbit, Nova, Sage, Luna
- **OpenAI**: 11 voices
  - Alloy, Echo, Fable, Onyx, Nova, Shimmer + 5 new 2025 voices
- **ElevenLabs**: 24 premium voices

### 8. Files Created

- `src/routes/retool.js` - Retool-specific routes
- `retool-config.json` - Configuration file
- `retool-test-server.js` - Test server for development
- `RETOOL_MANUAL_SETUP.md` - Step-by-step guide

### 9. Testing

The test server is running on port 4445. You can test:
```bash
# Test voices endpoint
curl http://localhost:4445/api/voices

# Test script generation
curl -X POST http://localhost:4445/api/generate-script \
  -H "Content-Type: application/json" \
  -d '{"description":"Test","tone":"Educational","platforms":["YouTube"],"duration":30}'
```

### 10. Next Steps in Retool

1. Create the UI components following the manual setup guide
2. Connect queries to your REST API resource
3. Test voice preview functionality
4. Style with the compact UI CSS

## 🎉 You're Ready!

Your backend is fully configured for Retool. The compact UI with 40% smaller fonts and all 43 voices are ready to use!