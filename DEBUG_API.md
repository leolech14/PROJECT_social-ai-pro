# 🔍 API Debugging Guide

The API is returning `FUNCTION_INVOCATION_FAILED`. Here's how to debug:

## 1. Check Function Logs in Vercel Dashboard
Go to: https://vercel.com/lbl14/social-ai-pro/functions

Look for:
- Red error messages in the `/api` function
- Common issues:
  - "Invalid API Key" - OpenAI key might be wrong
  - "Module not found" - Missing dependency
  - "Environment variable not found" - Env vars not loaded

## 2. Common Causes & Solutions

### Cause 1: OpenAI API Key Issues
- The key might be invalid or have wrong permissions
- Solution: Generate a new key at https://platform.openai.com/api-keys

### Cause 2: Missing Dependencies
- The serverless function might be missing a package
- Check if all dependencies in package.json are installed

### Cause 3: Environment Variable Format
- Vercel might need the variables without quotes
- Try removing any quotes from the .env values

## 3. Quick Test

Try adding a Google AI API key as backup:
1. Get key from: https://makersuite.google.com/app/apikey
2. Add as `GOOGLE_AI_API_KEY` in Vercel
3. The app will automatically use it as fallback

## 4. Local Testing

Test locally with your keys:
```bash
cd /Users/lech/development_hub/PROJECT_media
export OPENAI_API_KEY="your-key"
export DATABASE_URL="your-neon-url"
export SESSION_SECRET="dev-secret"
export JWT_SECRET="dev-secret"
npm run server
```

Then test: `curl http://localhost:4444/api/generate-script`

## 5. Temporary Solution

While debugging, you could:
1. Add `GOOGLE_AI_API_KEY` for immediate functionality
2. Check OpenAI account/billing status
3. Try regenerating the OpenAI key

The frontend is working perfectly - just need to fix the API!