# Google Cloud Text-to-Speech API Key Required

The voice preview functionality is failing with validation errors. To enable Google voice previews, you need to:

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Enable the Text-to-Speech API
3. Create an API key
4. Add to your Vercel environment variables:
   - Key: `GOOGLE_CLOUD_TTS_API_KEY`
   - Value: Your API key
   - Environment: Production

This will enable voice previews for the Google voices (WaveNet and Neural2).

Note: The app will still work without this - you just won't be able to preview Google voices before generation.