# OpenAI 2025 Updates for AI Video Creator

## New Features Implemented

### 1. Text-to-Speech Updates
- **New Model**: `gpt-4o-mini-tts` ($0.60/million tokens)
- **Voice Instructions**: Can now instruct the TTS model how to speak (e.g., "talk like a sympathetic customer service agent")
- **11 Base Voices**: Extended from 6 to 11 voices
- **Pricing**: Approximately 1.5 cents per minute

### 2. Voice Options
The app now supports all 11 OpenAI voices:
- Original 6: Alloy, Echo, Fable, Onyx, Nova, Shimmer
- New 5: Aurora, Breeze, Coral, Dash, Ember

### 3. Voice Instructions Feature
You can now provide custom voice instructions for OpenAI voices:
```javascript
// Example usage
{
  text: "Your script text here",
  voiceId: "openai_nova",
  voiceInstruction: "Speak with high energy and enthusiasm, like an excited sports commentator"
}
```

### 4. Organization Configuration
- Organization ID: `org-kMMJiRlBzjmaoZSsnapWMOrx`
- Added to all OpenAI API requests for proper billing and access

## O3 Model Preparation

The script generator is ready for O3 model when it becomes available:

```javascript
// Current configuration (GPT-4 Turbo)
model: 'gpt-4-turbo-preview'

// When O3 is released, change to:
model: 'o3'
```

Location: `/src/services/scriptGenerator.js` line 76

## API Endpoints

### Script Generation
- Uses OpenAI GPT-4 Turbo (will switch to O3)
- Falls back to Google Gemini 1.5 Flash
- Supports social media optimization

### Voice Generation
- OpenAI TTS with voice instructions
- ElevenLabs for additional voices
- Google AI Studio voices (placeholder)

## Testing Voice Instructions

Try these voice instruction examples:
1. "Speak like a friendly podcast host"
2. "Use a calm, meditative tone"
3. "High-energy, eccentric, and slightly unhinged"
4. "Professional news anchor style"
5. "Warm and nurturing, like a caring teacher"

## Pricing Notes
- TTS: $0.60 per million tokens (~1.5 cents/minute)
- GPT-4 Turbo: Standard pricing applies
- O3: Pricing TBD when released

## Future Updates
- Monitor OpenAI announcements for O3 release
- Test new voices as they become available
- Explore OpenAI.fm playground for voice testing