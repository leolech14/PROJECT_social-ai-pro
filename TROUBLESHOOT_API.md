# 🔍 API Troubleshooting Guide

## Current Status:
- ✅ Frontend is working perfectly
- ✅ Backend validation is correct
- ❌ API calls are timing out (10+ seconds)

## Check These:

### 1. Vercel Function Logs
Go to: https://vercel.com/lbl14/social-ai-pro/functions/api/generate-script

Look for errors like:
- "API key not valid" - Need to regenerate key
- "API not enabled" - Need to enable Generative AI API
- "Cannot find module" - Missing dependency

### 2. Google AI API Setup
1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure "Generative Language API" is ENABLED
3. Check API quotas/limits

### 3. Test Your API Key Locally
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

If this works, the key is valid.

### 4. Quick Fix Options:

#### Option A: Use a Different Model
The code uses `gemini-2.5-flash` - try changing to `gemini-1.5-flash` if the newer model isn't available.

#### Option B: Add Request Timeout
The function might need a longer timeout for the first API call.

#### Option C: Check Rate Limits
Google AI has rate limits - make sure you're not hitting them.

## Next Steps:
1. Check the function logs for specific errors
2. Verify the API is enabled in Google Cloud
3. Test the API key directly
4. Let me know what error you see!