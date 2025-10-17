# Social AI Pro - Retool Manual Setup Guide

## Step-by-Step Setup in Retool

### 1. Create New App
1. In Retool, click **"Create new"** → **"Create app"**
2. Name it "Social AI Pro"

### 2. Set Up Resources

#### Create REST API Resource
1. Go to **Resources** (bottom left)
2. Click **"Create new"** → **"REST API"**
3. Configure:
   ```
   Name: SocialAIProAPI
   Base URL: http://localhost:4444
   Headers:
     - Content-Type: application/json
   ```

### 3. Add State Variables
In the left panel under **State**, create a variable:
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

### 4. Build the UI Components

#### Main Container
1. Drag a **Container** to the canvas
2. Set properties:
   - Background: `rgb(17, 24, 39)`
   - Padding: `24px`
   - Layout: Stack (Vertical)

#### Stage 0: Hero Screen
1. Add **Text** component:
   - Text: `Social Media Science`
   - Font size: `32px`
   - Color: `#ffffff`
   - Hidden: `{{ state.value.stage !== 0 }}`

2. Add **Text** component:
   - Text: `Transform user inputs into viral-worthy video scripts...`
   - Font size: `16px`
   - Color: `#9CA3AF`

3. Add **Button**:
   - Text: `Start Creating`
   - Background: `#7C3AED`
   - Event handler: Run JS Code
   ```javascript
   state.setValue({...state.value, stage: 1})
   ```

#### Stage 1: Input Form
1. Add **Container**:
   - Hidden: `{{ state.value.stage !== 1 }}`

2. Inside container, add:
   - **Text Input**:
     - Placeholder: `e.g., How to make perfect coffee at home`
     - Value: `{{ state.value.description }}`
     - On change: `state.setValue({...state.value, description: self.value})`

   - **Select**:
     - Label: `Tone`
     - Options: `["Professional", "Educational", "Fun", "Inspiring"]`
     - Value: `{{ state.value.tone }}`

   - **Multiselect**:
     - Label: `Platforms`
     - Options: `["TikTok", "Instagram", "YouTube"]`
     - Value: `{{ state.value.platforms }}`

   - **Number Input**:
     - Label: `Duration (seconds)`
     - Min: `10`, Max: `120`, Step: `10`
     - Value: `{{ state.value.duration }}`

   - **Button**:
     - Text: `Generate Smart Script`
     - Run Query: `generateScript`

#### Stage 3: Voice Selection
1. Add **Container**:
   - Hidden: `{{ state.value.stage !== 3 }}`
   - Background: `rgb(31, 41, 55)`

2. Inside, add:
   - **Text**: `🎤 Select Your AI Voice`
   
   - **Text Input**:
     - Placeholder: `Search voices...`
     - Value: `{{ state.value.voiceSearch }}`

   - **Button Group** for filters:
     ```javascript
     [
       { label: "All (43)", value: "all" },
       { label: "🤖 OpenAI (11)", value: "openai" },
       { label: "🎙️ ElevenLabs (24)", value: "elevenlabs" },
       { label: "🌐 Google AI (8)", value: "google" }
     ]
     ```

   - **Table**:
     - Data: `{{ getVoices.data }}`
     - Columns: Name, Style, Description, Preview (button)

### 5. Create Queries

#### getVoices
```javascript
// Resource: SocialAIProAPI
// Method: GET
// URL: /api/voices
// Run when page loads: true

// Transformer:
const voices = data.voices || [];
const provider = state.value.activeProvider || 'all';
const search = state.value.voiceSearch || '';

return voices.filter(voice => {
  const matchesProvider = provider === 'all' || 
    voice.provider.toLowerCase() === provider;
  const matchesSearch = !search || 
    voice.name.toLowerCase().includes(search.toLowerCase());
  return matchesProvider && matchesSearch;
});
```

#### generateScript
```javascript
// Resource: SocialAIProAPI
// Method: POST
// URL: /api/generate-script
// Body:
{
  "description": {{ state.value.description }},
  "tone": {{ state.value.tone }},
  "platforms": {{ state.value.platforms }},
  "duration": {{ state.value.duration }}
}

// On Success:
state.setValue({
  ...state.value,
  script: data,
  stage: 2
})
```

#### previewVoice
```javascript
// Resource: SocialAIProAPI
// Method: POST
// URL: /api/voice-preview
// Body:
{
  "voiceId": {{ table1.selectedRow.id }},
  "demoText": "Testing the new compact UI with Google AI Studio voices"
}
```

### 6. Add Custom CSS
In App Settings → Custom CSS:
```css
:root {
  font-size: 60%;
}

/* Compact UI */
body {
  font-size: 0.875rem;
  background: #0f172a;
}

input, textarea, select {
  padding: 0.25rem 0.5rem !important;
  font-size: 0.75rem !important;
}

button {
  padding: 0.25rem 0.75rem !important;
  font-size: 0.75rem !important;
}

/* Table styles */
._retool-table1 {
  font-size: 0.75rem;
}

._retool-table1 th,
._retool-table1 td {
  padding: 0.25rem 0.5rem !important;
}
```

### 7. Mock Data for Testing

If API isn't connected, add this transformer to getVoices:
```javascript
// Mock voices data
return [
  // Google AI Voices
  { id: "google_zephyr", name: "Zephyr", provider: "Google", style: "Bright", description: "Bright and cheerful voice" },
  { id: "google_puck", name: "Puck", provider: "Google", style: "Upbeat", description: "Upbeat and energetic voice" },
  { id: "google_isla", name: "Isla", provider: "Google", style: "Expressive", description: "Expressive and dynamic voice" },
  { id: "google_echo", name: "Echo", provider: "Google", style: "Professional", description: "Professional and clear voice" },
  { id: "google_orbit", name: "Orbit", provider: "Google", style: "Futuristic", description: "Modern futuristic voice" },
  { id: "google_nova", name: "Nova (Google)", provider: "Google", style: "Warm", description: "Warm and friendly voice" },
  { id: "google_sage", name: "Sage", provider: "Google", style: "Wise", description: "Wise and thoughtful voice" },
  { id: "google_luna", name: "Luna", provider: "Google", style: "Dreamy", description: "Soft and dreamy voice" },
  // Add OpenAI voices...
  { id: "openai_alloy", name: "Alloy", provider: "OpenAI", style: "Balanced", description: "Neutral and balanced voice" },
  // Add more as needed...
];
```

## Tips for Success

1. **Build incrementally**: Start with Stage 0, test, then add next stage
2. **Use console**: Check browser console for any errors
3. **Test queries**: Use Retool's preview to test each query
4. **Component naming**: Keep consistent names (text1, button1, etc.)

## Quick Component Reference

### Visibility Controls
- Hero: `{{ state.value.stage === 0 }}`
- Input: `{{ state.value.stage === 1 }}`
- Script: `{{ state.value.stage === 2 }}`
- Voice: `{{ state.value.stage === 3 }}`
- Final: `{{ state.value.stage === 4 }}`

### State Updates
```javascript
// Change stage
state.setValue({...state.value, stage: 2})

// Update field
state.setValue({...state.value, description: "New value"})

// Reset app
state.setValue({
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
})
```

This manual approach will definitely work and gives you full control over the implementation!