# 🔧 API Fix Guide

## Current Issues:

1. **Frontend-Backend Mismatch**:
   - Frontend sends: `topic`, `tone: "excited"`, `platform: "tiktok"`
   - Backend expects: `description`, `tone: "Fun"`, `platforms: ["TikTok"]`

2. **API Timeout**: OpenAI call is timing out (10+ seconds)

## Solutions:

### Option 1: Add Google AI Key (Fastest Fix)
1. Get key from: https://makersuite.google.com/app/apikey
2. Add to Vercel as `GOOGLE_AI_API_KEY`
3. The app will use it automatically

### Option 2: Fix OpenAI Key
1. Check your OpenAI account: https://platform.openai.com/usage
2. Ensure you have credits/active billing
3. Generate new key if needed

### Option 3: Fix Frontend-Backend Mismatch
The frontend is sending wrong field names. This needs code fixes:
- Change `topic` → `description`
- Map frontend tones to backend tones
- Change `platform` → `platforms` array

## Quick Test Command:
```bash
curl -X POST https://social-ai.pro/api/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test video",
    "tone": "Fun",
    "platforms": ["TikTok"],
    "duration": 30
  }'
```

If this times out, it's an API key issue. If it works, it's a frontend issue.