#!/bin/bash

# Direct Retool App Creation
echo "🚀 Creating Social AI Pro in Retool..."

RETOOL_API_KEY="retool_01k1hs3x1y7a9vxds3hatcd7xh"
RETOOL_BASE_URL="https://api.retool.com"

# Test the API connection first
echo "Testing API connection..."
curl -s -H "Authorization: Bearer $RETOOL_API_KEY" \
  "$RETOOL_BASE_URL/v1/resources" | head -20

# Create a simple app
echo -e "\n📱 Creating app via API..."
curl -X POST "$RETOOL_BASE_URL/v1/apps" \
  -H "Authorization: Bearer $RETOOL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Social AI Pro",
    "description": "AI-powered video script and voice generation"
  }' | jq

echo -e "\n✅ Check your Retool dashboard for the new app!"