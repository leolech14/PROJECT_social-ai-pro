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
