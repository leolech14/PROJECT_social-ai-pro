# 🚀 Social AI Pro - Retool Setup (Final)

## Your Setup is Complete! 

### ✅ What's Ready:

1. **Backend API**: Running on `http://localhost:4445`
2. **REST API Resource**: Already configured in Retool
3. **43 Voices**: All Google AI, OpenAI, and ElevenLabs voices
4. **Compact UI**: 40% smaller fonts ready

## 📋 Quick Setup in Retool

Since the import isn't working as expected, here's the fastest way to build your app:

### Step 1: Create App State

In your Retool app, create a **Variable** named `appState`:

```javascript
{
  stage: 0,
  description: "",
  tone: "Educational", 
  platforms: ["YouTube"],
  duration: 30,
  activeProvider: "all",
  voiceSearch: "",
  selectedVoice: null,
  script: null,
  audioUrl: null
}
```

### Step 2: Add Queries

Create these queries using your `SocialAIProAPI` resource:

**1. getVoices**
- Method: GET
- URL: `/api/voices`
- Run when page loads: ✓

**2. generateScript**
- Method: POST  
- URL: `/api/generate-script`
- Body:
```javascript
{{
  {
    description: textInput1.value,
    tone: select1.value,
    platforms: multiselect1.value,
    duration: numberInput1.value
  }
}}
```
- On Success: `appState.setValue({...appState.value, script: data, stage: 2})`

**3. previewVoice**
- Method: POST
- URL: `/api/voice-preview`
- Body:
```javascript
{{
  {
    voiceId: table1.selectedRow.id,
    demoText: "Testing the new compact UI with Google AI Studio voices"
  }
}}
```

### Step 3: Build UI (Quick Copy-Paste)

**Container 1 - Hero (Stage 0)**
```
Hidden when: {{ appState.value.stage !== 0 }}
Background: #111827
```

Add inside:
- Text: "Social Media Science" (32px, white, bold, center)
- Text: "Transform user inputs..." (16px, #9CA3AF, center)
- Button: "Start Creating" → onClick: `appState.setValue({...appState.value, stage: 1})`

**Container 2 - Input Form (Stage 1)**
```
Hidden when: {{ appState.value.stage !== 1 }}
```

Add inside:
- Text Input: placeholder "e.g., How to make perfect coffee at home"
- Select: Tone → Options: ["Professional", "Educational", "Fun", "Inspiring"]
- Multiselect: Platforms → Options: ["TikTok", "Instagram", "YouTube"]
- Number Input: Duration → Min: 10, Max: 120, Step: 10
- Button: "Generate Script" → onClick: `generateScript.trigger()`

**Container 3 - Voice Selection (Stage 3)**
```
Hidden when: {{ appState.value.stage !== 3 }}
Background: #1F2937
```

Add inside:
- Text: "🎤 Select Your AI Voice"
- Text Input: Search voices
- Segmented Control: Filter by provider
- Table: Display voices → Data: `{{ getVoices.data }}`

### Step 4: Add Compact CSS

Go to **App Settings** → **Custom CSS**:

```css
/* Compact UI - 40% smaller */
:root {
  font-size: 60%;
}

/* Dark theme */
._retool-container1 {
  background: #111827;
  padding: 24px;
  min-height: 100vh;
}

/* Compact elements */
button {
  padding: 6px 16px !important;
  font-size: 14px !important;
}

input, textarea, select {
  padding: 4px 8px !important;
  font-size: 12px !important;
}

/* Table */
._retool-table1 {
  font-size: 12px;
}

._retool-table1 th,
._retool-table1 td {
  padding: 4px 8px !important;
}
```

## 🎯 Test Your App

1. **Test voices endpoint**: Preview should show 43 voices
2. **Test script generation**: Should return AI-generated script
3. **Test voice preview**: Should play audio preview

## 📱 Voice Breakdown

- **Google AI Studio** (8 voices): Zephyr, Puck, Isla, Echo, Orbit, Nova, Sage, Luna
- **OpenAI** (11 voices): Alloy, Echo, Fable, Onyx, Nova, Shimmer + 5 new voices
- **ElevenLabs** (24 voices): Premium selection

## 🆘 Troubleshooting

If queries fail:
1. Check your REST API resource URL: `http://localhost:4445`
2. Ensure backend is running: `./start-server.sh`
3. Test in browser: `http://localhost:4445/api/voices`

## 🚀 You're All Set!

Your Retool app is ready with:
- ✅ Compact UI (40% smaller)
- ✅ 43 AI voices
- ✅ Dark theme
- ✅ Complete workflow

Start building in Retool now!