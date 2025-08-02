# 🚀 Production Setup Guide

Your Social AI Pro website is deployed! Here's what you need to complete the setup:

## 🌐 Deployment Status

- **Preview URL**: https://social-ai-85mscr9rw-lbl14.vercel.app
- **Production URL**: https://social-ai-p4484014k-lbl14.vercel.app
- **Vercel Dashboard**: https://vercel.com/lbl14/social-ai-pro

## ⚙️ Required: Environment Variables

You need to add these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Critical (Required for app to work):
```
SESSION_SECRET = [generate a secure random string]
JWT_SECRET = [generate another secure random string]
DATABASE_URL = [your production database URL]
```

### Optional (for full functionality):
```
# AI Services (at least one required for script generation)
GOOGLE_AI_API_KEY = [from Google AI Studio]
OPENAI_API_KEY = [from OpenAI]

# Voice Services
ELEVENLABS_API_KEY = [from ElevenLabs]

# Stock Media
PEXELS_API_KEY = [from Pexels]
UNSPLASH_ACCESS_KEY = [from Unsplash]
```

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Easiest)
1. Go to Vercel Dashboard → Storage
2. Create a new Postgres database
3. It will automatically set DATABASE_URL

### Option 2: External Database (Supabase, Neon, etc.)
1. Create a PostgreSQL database
2. Get the connection string
3. Add as DATABASE_URL in Vercel

### Run Migrations
After setting DATABASE_URL, run migrations:
```bash
# Clone the repo locally
git clone https://github.com/leolech14/social-ai-pro.git
cd social-ai-pro

# Set DATABASE_URL to your production database
export DATABASE_URL="your-production-database-url"

# Run migrations
npm install
npm run migrate
```

## 🔑 Getting API Keys

### Google AI Studio (Recommended for Script Generation)
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Add as GOOGLE_AI_API_KEY

### OpenAI (Alternative)
1. Visit: https://platform.openai.com/api-keys
2. Create new secret key
3. Add as OPENAI_API_KEY

### ElevenLabs (Voice Generation)
1. Visit: https://elevenlabs.io/api
2. Get your API key
3. Add as ELEVENLABS_API_KEY

### Pexels (Stock Videos)
1. Visit: https://www.pexels.com/api/
2. Get your API key
3. Add as PEXELS_API_KEY

## 🎯 Quick Start Commands

### Add Environment Variables via CLI:
```bash
# Set required secrets
vercel env add SESSION_SECRET production
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production

# Set API keys
vercel env add GOOGLE_AI_API_KEY production
vercel env add ELEVENLABS_API_KEY production
```

### Redeploy After Adding Env Vars:
```bash
vercel --prod
```

## 🌍 Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., social-ai.pro)
3. Update DNS records as instructed
4. SSL certificate is automatic

## 📊 Monitoring

- **Analytics**: Already integrated with Vercel Analytics
- **Logs**: Check Vercel Dashboard → Functions → Logs
- **Performance**: Monitor in Vercel Dashboard → Analytics

## ✅ Final Checklist

- [ ] Add SESSION_SECRET and JWT_SECRET
- [ ] Set up production database
- [ ] Run database migrations
- [ ] Add at least one AI API key
- [ ] Test the application
- [ ] Configure custom domain (optional)
- [ ] Enable Vercel Analytics (optional)

## 🎉 Success!

Once you've added the environment variables and database, your app will be fully functional at:
https://social-ai-pro.vercel.app (or your custom domain)

Need help? Check the [deployment guide](./docs/guides/DEPLOYMENT_GUIDE.md) or [Vercel docs](https://vercel.com/docs).