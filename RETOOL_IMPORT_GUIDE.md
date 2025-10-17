# Social AI Pro - Retool Import Guide

## Prerequisites
- Retool Business Account
- Access to create new apps
- API endpoints deployed (or use mock mode)

## Import Steps

### 1. Import the App
1. Log into your Retool account
2. From the homepage, click **"Create new"** → **"From JSON/ZIP"**
3. Upload the `social-ai-pro-retool-app.json` file
4. Name your app "Social AI Pro"

### 2. Configure Resources
Since resources aren't included in the export, you'll need to create:

#### REST API Resource
1. Go to **Resources** → **Create new resource** → **REST API**
2. Configure:
   - Name: `SocialAIProAPI`
   - Base URL: `http://localhost:4444` (or your deployed API URL)
   - Headers:
     - `Content-Type`: `application/json`

### 3. Update Query Endpoints
Update each query to use the new resource:
1. `generateScript` → Point to `SocialAIProAPI`
2. `getVoices` → Point to `SocialAIProAPI`
3. `previewVoice` → Point to `SocialAIProAPI`
4. `generateVoice` → Point to `SocialAIProAPI`

### 4. Environment Variables
In App Settings, add:
```javascript
{
  "API_URL": "http://localhost:4444",
  "FRONTEND_URL": "http://localhost:4445",
  "OPENAI_API_KEY": "your-key",
  "ELEVENLABS_API_KEY": "your-key",
  "GOOGLE_AI_API_KEY": "your-key"
}
```

### 5. Custom Components (Optional)
For advanced features, you can add:

#### Audio Player Component
```javascript
// Custom component for voice preview
<audio-player>
  <audio controls src="{{previewVoice.data.audioUrl}}" />
</audio-player>
```

#### Progress Indicator
```javascript
// Add to queries for loading states
{{generateScript.isLoading ? "Generating script..." : ""}}
```

## Features Included

### ✅ Complete UI Flow
1. **Hero Screen** - Welcome page with start button
2. **Input Form** - Video description, tone, platforms, duration
3. **Script Review** - AI-generated script display
4. **Voice Selection** - 43 voices with compact UI
5. **Video Generation** - Final video output

### ✅ Compact UI Implementation
- Global 40% font size reduction
- Reduced padding and spacing
- Dark theme optimized for readability

### ✅ Voice Providers
- **OpenAI**: 11 voices with instruction support
- **ElevenLabs**: 24 premium voices
- **Google AI Studio**: 8 new voices

### ✅ State Management
- Stage-based navigation
- Provider filtering
- Search functionality
- Voice selection tracking

## Testing the App

### Mock Mode
If APIs aren't connected, the app includes mock data:
1. Mock script generation
2. Mock voice list (43 voices)
3. Mock audio previews

### Live Mode
With APIs connected:
1. Real AI script generation
2. Live voice synthesis
3. Actual audio playback

## Customization Options

### Styling
Modify the `customCSS` section to adjust:
- Font sizes (currently 60% base)
- Colors and theme
- Spacing and layout

### Adding Features
1. **Video Templates**: Add template selection before script generation
2. **Multi-language**: Add language selection for voices
3. **Export Options**: Add buttons to export scripts/audio
4. **Analytics**: Track popular voices and successful scripts

## Troubleshooting

### Common Issues
1. **"Resource not found"**: Create the REST API resource first
2. **"Query failed"**: Check API endpoint URLs
3. **"No voices showing"**: Verify getVoices query is set to run on page load
4. **"Preview not working"**: Check CORS settings on your API

### Debug Mode
Enable debug mode in Retool to see:
- Query responses
- State changes
- Console logs

## Advanced Configuration

### For Production
1. Replace localhost URLs with production APIs
2. Add authentication headers if needed
3. Enable caching for voice lists
4. Add error handling for all queries

### Performance Optimization
1. Enable query caching for `getVoices`
2. Debounce the voice search input
3. Lazy load voice previews
4. Paginate voice list if needed

## Support
- Check query logs in Retool's debug panel
- Export with hard-coded results for debugging
- Use browser console for JavaScript errors