# 🌐 Connect social-ai.pro to Your Vercel Deployment

The domain `social-ai.pro` is pointing to Vercel but not connected to your project. Here's how to fix it:

## Quick Fix Steps:

1. **Go to your Vercel Dashboard**:
   https://vercel.com/lbl14/social-ai-pro/settings/domains

2. **Click "Add Domain"**

3. **Enter**: `social-ai.pro`

4. **Vercel will show one of two things**:
   - ✅ "This domain is correctly configured" → Click "Add"
   - ⚠️ "Invalid Configuration" → Follow the DNS instructions

## If DNS Changes Are Needed:

Vercel will show you exactly what to add. Usually it's:
- **A Record**: `@` → `76.76.21.21`
- **CNAME**: `www` → `cname.vercel-dns.com`

## Current Working URLs:

While waiting for the domain to connect, your app is live at:
- https://social-ai-p4484014k-lbl14.vercel.app
- https://social-ai-pro.vercel.app

## Timeline:
- Adding domain in Vercel: Instant
- DNS propagation: 5-60 minutes (usually faster)

## Troubleshooting:

If you see "This domain belongs to another team":
1. You may need to verify domain ownership
2. Or the domain might be connected to another Vercel account

Let me know if you need help with the DNS provider!