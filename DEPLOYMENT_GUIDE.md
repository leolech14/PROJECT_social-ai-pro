# 🚀 AI Video Creator - Deployment Guide

## Quick Deploy (2 minutes)

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy
vercel --prod

# Done! You'll get a URL like: https://your-app.vercel.app
```

## Best Setup for Live Updates & Fast DNS

### Option 1: Vercel (Recommended) ⭐
**Why it's the best:**
- **Preview Deployments**: Every git push gets a unique URL
- **< 60 second DNS**: Fastest DNS propagation
- **Global CDN**: 100+ edge locations
- **Serverless API**: Backend scales automatically
- **Free SSL**: HTTPS included

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy
vercel --prod

# Connect to GitHub (for auto-deploy)
# Visit: https://vercel.com/dashboard → Your Project → Settings → Git
```

### Option 2: Netlify + Render
**For separate frontend/backend:**
- **Frontend**: Netlify (instant deploys)
- **Backend**: Render.com (auto-scaling)

```bash
# Frontend (Netlify)
npm run build
# Drag 'dist' folder to netlify.com

# Backend (Render)
# 1. Push to GitHub
# 2. Connect at render.com
# 3. Auto-deploys on push
```

### Option 3: Railway.app
**All-in-one platform:**
- One-click deploy from GitHub
- Preview environments
- Built-in database
- WebSockets support

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway up
```

## Features Comparison

| Feature | Vercel | Netlify | Railway | Render |
|---------|---------|---------|---------|--------|
| Preview URLs | ✅ Instant | ✅ On PR | ✅ | ✅ |
| DNS Speed | < 60s | < 5min | < 5min | < 10min |
| Free Tier | Generous | Good | Limited | Good |
| Serverless | ✅ Native | Functions | ✅ | ✅ |
| WebSockets | Via Pusher | No | ✅ | ✅ |
| Custom Domain | ✅ Free | ✅ Free | ✅ | ✅ |

## Setting Up Automatic Deployments

### 1. Push to GitHub
```bash
# Create repo on GitHub
gh repo create ai-video-creator --public

# Push code
git remote add origin https://github.com/YOUR_USERNAME/ai-video-creator
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select your GitHub repo
4. Deploy!

### 3. Environment Variables
Add these in Vercel dashboard → Settings → Environment Variables:
```
NODE_ENV=production
# Add any API keys here
```

## Custom Domain Setup

### Vercel (Fastest DNS)
1. Dashboard → Settings → Domains
2. Add domain: `yourdomain.com`
3. Add DNS records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
4. Live in < 60 seconds!

### DNS Providers Ranked by Speed
1. **Cloudflare**: 1-5 minutes
2. **Google Domains**: 5-15 minutes  
3. **Namecheap**: 15-30 minutes
4. **GoDaddy**: 30-60 minutes

## Development Workflow

### Local Development
```bash
# Start both frontend & backend
npm run dev:all

# Frontend only
npm run dev

# Backend only
npm run server
```

### Push to Production
```bash
git add .
git commit -m "feat: your changes"
git push

# Vercel auto-deploys in ~45 seconds
```

### Preview Branches
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature

# Get preview URL: https://ai-video-creator-git-feature-new-feature.vercel.app
```

## Monitoring & Analytics

### Vercel Dashboard Shows
- Real-time visitors
- Performance metrics
- Error logs
- Function invocations

### Adding Custom Analytics
```javascript
// In src/main.jsx
// Add Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

// In your App component
<Analytics />
```

## Troubleshooting

### API Not Working?
Check vercel.json rewrites:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

### Build Failing?
```bash
# Check locally
npm run build

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Slow Performance?
1. Enable Vercel Edge Network
2. Use `next/image` for images
3. Lazy load components

## 🎯 Quick Deploy Command

```bash
# After initial setup, deploy anytime with:
vercel --prod

# Or just push to GitHub if connected:
git push
```

---

**Need help?** Check your deployment at: https://vercel.com/dashboard