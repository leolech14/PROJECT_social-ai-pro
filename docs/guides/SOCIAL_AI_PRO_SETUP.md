# 🚀 Deploying to social-ai.pro

## Quick Setup (5 minutes)

### 1. Deploy to Vercel First
```bash
# Login to Vercel
vercel login

# Deploy (you'll get a temporary URL)
vercel --prod
```

### 2. Add Your Domain in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Domains**
4. Add `social-ai.pro`
5. Add `www.social-ai.pro` (optional)

### 3. Configure DNS

Vercel will show you exactly what DNS records to add. It will be one of these options:

#### Option A: If you use Cloudflare (Fastest - Recommended)
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

#### Option B: For other DNS providers
```
Type    Name    Value  
CNAME   @       cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
```

### 4. DNS Provider Instructions

**Where to add these records:**

- **Namecheap**: Dashboard → Domain List → Manage → Advanced DNS
- **GoDaddy**: My Products → DNS → Manage DNS
- **Cloudflare**: DNS → Records → Add Record
- **Google Domains**: DNS → Manage custom records

### 5. Wait for DNS Propagation

- With **Cloudflare**: 1-5 minutes ⚡
- Other providers: 5-60 minutes

Check status: https://dnschecker.org/#A/social-ai.pro

## 🎯 Your Live URLs Will Be:

- Production: https://social-ai.pro
- WWW: https://www.social-ai.pro  
- Preview (on git push): https://social-ai-pro-git-branch-name.vercel.app

## 📱 Features You Get:

1. **Automatic HTTPS** - SSL certificate included
2. **Global CDN** - Fast loading worldwide
3. **Auto-deploy on git push** - Just push to GitHub
4. **Preview URLs** - Test changes before going live
5. **Instant rollback** - One-click to previous version

## 🔧 Environment Setup

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Production
VITE_API_URL=https://social-ai.pro
NODE_ENV=production

# Required for session encryption
SESSION_SECRET=your_session_secret

# Add your API keys (when ready)
GOOGLE_AI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
```

## 📊 Analytics & Monitoring

1. **Add Vercel Analytics** (free):
   ```bash
   npm install @vercel/analytics
   ```

2. **Update src/main.jsx**:
   ```jsx
   import { Analytics } from '@vercel/analytics/react';
   
   // Add in your App
   <Analytics />
   ```

## 🚀 Deployment Workflow

### First Time
```bash
vercel --prod
# Add domain in Vercel dashboard
# Configure DNS
```

### Future Updates
```bash
# Just push to GitHub
git add .
git commit -m "feat: new feature"
git push

# Auto-deploys in ~45 seconds!
```

### Preview Branches
```bash
git checkout -b feature/new-idea
git push origin feature/new-idea
# Get preview URL instantly
```

## 🎨 Brand Customization

Update these files for social-ai.pro branding:

1. **public/manifest.json** (for PWA):
   ```json
   {
     "name": "Social AI Pro",
     "short_name": "SocialAI",
     "description": "AI-Powered Social Media Video Creation"
   }
   ```

2. **Meta tags** (index.html):
   ```html
   <meta name="description" content="Create viral social media videos with AI. Transform ideas into TikTok, Instagram, and YouTube content in minutes.">
   <meta property="og:title" content="Social AI Pro - AI Video Creator">
   <meta property="og:url" content="https://social-ai.pro">
   ```

## 🔒 Security Headers

Add to vercel.json:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## ✅ Launch Checklist

- [ ] Deploy to Vercel
- [ ] Add social-ai.pro domain
- [ ] Configure DNS records
- [ ] Test HTTPS is working
- [ ] Connect GitHub for auto-deploy
- [ ] Add analytics
- [ ] Update meta tags
- [ ] Test on mobile devices
- [ ] Share your awesome new site! 🎉

---

**Your site will be live at:** https://social-ai.pro

**Need help?** The Vercel dashboard has great docs and support!