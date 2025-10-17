#!/bin/bash
echo "Deploying Social AI Pro for Retool..."

# Build frontend
npm run build

# Set production environment
export NODE_ENV=production
export CORS_ORIGIN="https://*.retool.com"

# Start server
pm2 start server.js --name social-ai-pro-api

echo "✅ Deployment complete!"
echo "API URL: http://localhost:4444"
echo "Test endpoint: http://localhost:4444/api/retool/health"
