# AI Integrations Guide - AI Video Creator

## Overview
This document details all AI service integrations in the AI Video Creator platform, including the latest 2025 updates.

## 1. Script Generation

### Primary: OpenAI GPT-4 Turbo
- **Model**: `gpt-4-turbo-preview` (ready to switch to `o3` when available)
- **Organization ID**: Configurable via `OPENAI_ORG_ID` (optional)
- **Features**:
  - JSON structured output
  - Social media optimization
  - Platform-specific content
  - ~1000 tokens per script

### Fallback: Google Gemini 2.5 Flash
- **Model**: `gemini-2.5-flash`
- **Features**:
  - Next generation multimodal capabilities
  - Fast and cost-efficient
  - Supports structured JSON output
  - Long context window

### Configuration Priority:
1. OpenAI GPT-4 Turbo (primary)
2. Google Gemini 2.5 Flash (fallback)
3. Mock mode (development)

## 2. Voice Synthesis

### OpenAI Text-to-Speech (2025 Update)
- **Model**: `gpt-4o-mini-tts`
- **Pricing**: $0.60/million tokens (~1.5 cents/minute)
- **Voices** (11 total):
  - Original: Alloy, Echo, Fable, Onyx, Nova, Shimmer
  - New 2025: Aurora, Breeze, Coral, Dash, Ember
- **New Feature**: Voice Instructions
  ```javascript
  voiceInstruction: "Speak like an excited sports commentator"
  ```

### ElevenLabs
- **Model**: `eleven_turbo_v2_5`
- **Features**:
  - 32 languages
  - 40,000 character limit
  - ~250-300ms latency
  - Voice settings: stability, similarity_boost, style
  - Speaker boost enabled

### Google AI Studio (Placeholder)
- WaveNet A & B
- Neural2 C & D
- Currently in mock mode

## 3. Stock Media

### Pexels
- **API Key**: Configured
- **Usage**: Video search for b-roll
- **Features**: HD video clips, free license

### Unsplash
- **Access Key**: Configured
- **Usage**: Image search for stills
- **Features**: High-quality photos, free license

## 4. API Authentication

### OpenAI
```javascript
headers: {
  'Authorization': `Bearer ${OPENAI_API_KEY}`,
  // Include only if OPENAI_ORG_ID is set
  ...(OPENAI_ORG_ID && { 'OpenAI-Organization': OPENAI_ORG_ID })
}
```

### Google AI
```javascript
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
```

### ElevenLabs
```javascript
headers: {
  'xi-api-key': ELEVENLABS_API_KEY
}
```

## 5. Voice Instruction Examples

For OpenAI TTS with voice instructions:

1. **Customer Service**: "Speak in a warm, helpful tone like a friendly customer service representative"
2. **News Anchor**: "Use a professional, authoritative news anchor voice with clear enunciation"
3. **Storyteller**: "Narrate with dramatic flair and emotion, like reading a children's story"
4. **Podcast Host**: "Casual and conversational, like chatting with a friend over coffee"
5. **Meditation Guide**: "Slow, calming, and peaceful with extended pauses"

## 6. Model Selection Strategy

### For Scripts:
- **Complex/Creative**: OpenAI GPT-4 Turbo
- **Fast/Simple**: Google Gemini 2.5 Flash
- **Cost-Sensitive**: Gemini 2.5 Flash-Lite (future)

### For Voices:
- **Custom Instructions**: OpenAI TTS
- **Multi-language**: ElevenLabs Turbo v2.5
- **Ultra-fast**: ElevenLabs Flash v2.5
- **Emotional/Dramatic**: ElevenLabs v3 Alpha

## 7. Rate Limits & Best Practices

### OpenAI
- Rate limited by organization tier
- Use voice instructions for variety
- Cache generated content

### Google AI
- Check quota in Google AI Studio
- Use appropriate model for task
- Enable caching for repeated content

### ElevenLabs
- Character limits per model
- Use Turbo v2.5 for balance
- Enable speaker boost for clarity

## 8. Future Roadmap

### Upcoming Features:
1. **OpenAI O3 Model**: Switch when available
2. **Gemini 2.5 Pro**: For complex reasoning
3. **ElevenLabs v3**: For dramatic delivery
4. **Veo 3**: Video generation integration
5. **Imagen 4**: Image generation for thumbnails

### Testing New Features:
- OpenAI Playground: https://platform.openai.com/playground
- Google AI Studio: https://aistudio.google.com
- ElevenLabs Playground: https://elevenlabs.io

## 9. Error Handling

All services have fallback strategies:
1. Primary service fails → Try secondary
2. Secondary fails → Use mock mode
3. Always return usable content

## 10. Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-proj-...
# Optional: scope requests to a specific organization
OPENAI_ORG_ID=org-kMMJiRlBzjmaoZSsnapWMOrx

# Google AI
GEMINI_API_KEY=AIza...
GOOGLE_AI_API_KEY=AIza...

# ElevenLabs
ELEVENLABS_API_KEY=sk_...

# Stock Media
PEXELS_API_KEY=...
UNSPLASH_ACCESS_KEY=...
```

## Monitoring & Debugging

Check logs for:
- Model selection decisions
- Fallback triggers
- API response times
- Error messages with service names

Example:
```
OpenAI generation error: [error details]
Falling back to Google Gemini...
```
