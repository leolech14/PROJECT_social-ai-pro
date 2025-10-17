#!/bin/bash

# Retool API Import Script for Social AI Pro
echo "🚀 Creating Social AI Pro in Retool via API..."

# You'll need to set these environment variables
RETOOL_API_KEY="${RETOOL_API_KEY}"
RETOOL_BASE_URL="${RETOOL_BASE_URL:-https://leonardolech1.retool.com}"

if [ -z "$RETOOL_API_KEY" ]; then
  echo "❌ Please set RETOOL_API_KEY environment variable"
  echo "Get it from: Retool Settings > API > Generate API Key"
  exit 1
fi

# Create the app via API
echo "📱 Creating app structure..."

curl -X POST "$RETOOL_BASE_URL/api/v1/apps" \
  -H "Authorization: Bearer $RETOOL_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF' | jq
{
  "name": "Social AI Pro",
  "description": "AI-powered video script and voice generation with compact UI",
  "folder": "Apps",
  "template": {
    "queries": [
      {
        "name": "getVoices",
        "resourceName": "SocialAIProAPI",
        "runWhenPageLoads": true,
        "type": "GET",
        "url": "/api/voices"
      },
      {
        "name": "generateScript", 
        "resourceName": "SocialAIProAPI",
        "type": "POST",
        "url": "/api/generate-script",
        "body": "{{ { description: textInput1.value, tone: select1.value, platforms: multiselect1.value, duration: numberInput1.value } }}"
      },
      {
        "name": "previewVoice",
        "resourceName": "SocialAIProAPI", 
        "type": "POST",
        "url": "/api/voice-preview",
        "body": "{{ { voiceId: table1.selectedRow.id, demoText: 'Testing compact UI with Google AI voices' } }}"
      }
    ],
    "components": [
      {
        "type": "container",
        "name": "container1",
        "style": {
          "background": "#111827",
          "padding": "24px"
        },
        "components": [
          {
            "type": "text",
            "name": "text1",
            "value": "Social Media Science",
            "style": {
              "fontSize": "32px",
              "color": "#ffffff",
              "fontWeight": "bold",
              "textAlign": "center"
            },
            "hidden": "{{ appState.value.stage !== 0 }}"
          },
          {
            "type": "button",
            "name": "button1",
            "text": "Start Creating",
            "style": {
              "background": "#7C3AED"
            },
            "handlers": {
              "click": "appState.setValue({...appState.value, stage: 1})"
            }
          }
        ]
      }
    ],
    "customCSS": ":root { font-size: 60%; }\n\nbutton { padding: 6px 16px !important; font-size: 14px !important; }\n\ninput, textarea, select { padding: 4px 8px !important; font-size: 12px !important; }"
  }
}
EOF

echo ""
echo "✅ App creation request sent!"
echo ""
echo "Next steps:"
echo "1. Check your Retool dashboard for 'Social AI Pro' app"
echo "2. The app will have the basic structure ready"
echo "3. You can continue building from there"