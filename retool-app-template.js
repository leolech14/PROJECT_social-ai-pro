// Social AI Pro - Retool App Template
// This file contains the complete app structure for manual creation

const SOCIAL_AI_PRO_TEMPLATE = {
  appName: "Social AI Pro",
  description: "AI-powered video script and voice generation with compact UI",
  
  // State management
  state: {
    appState: {
      type: "variable",
      defaultValue: {
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
    }
  },
  
  // API Queries
  queries: {
    getVoices: {
      type: "RESTQuery",
      method: "GET",
      endpoint: "/api/voices",
      runOnPageLoad: true,
      transformer: `
        // Sort voices by provider and name
        return data.sort((a, b) => {
          if (a.provider === b.provider) {
            return a.name.localeCompare(b.name);
          }
          return a.provider.localeCompare(b.provider);
        });
      `
    },
    
    generateScript: {
      type: "RESTQuery",
      method: "POST",
      endpoint: "/api/generate-script",
      body: `{{
        {
          description: inputDescription.value,
          tone: selectTone.value,
          platforms: multiselectPlatforms.value,
          duration: numberDuration.value
        }
      }}`,
      onSuccess: `
        appState.setValue({
          ...appState.value,
          script: data,
          stage: 2
        });
      `
    },
    
    previewVoice: {
      type: "RESTQuery",
      method: "POST",
      endpoint: "/api/voice-preview",
      body: `{{
        {
          voiceId: tableVoices.selectedRow.id,
          demoText: "Testing the new compact UI with Google AI Studio voices"
        }
      }}`,
      onSuccess: `
        // Play audio preview
        const audio = new Audio(data.audioUrl);
        audio.play();
      `
    },
    
    generateVoice: {
      type: "RESTQuery",
      method: "POST",
      endpoint: "/api/generate-voice",
      body: `{{
        {
          scriptId: appState.value.script.id,
          voiceId: appState.value.selectedVoice.id,
          text: appState.value.script.hook + ' ' + 
                appState.value.script.mainPoints.join(' ') + ' ' + 
                appState.value.script.callToAction
        }
      }}`,
      onSuccess: `
        appState.setValue({
          ...appState.value,
          audioUrl: data.voice.audioUrl,
          stage: 4
        });
      `
    }
  },
  
  // UI Components Structure
  components: {
    // Main container
    mainContainer: {
      type: "container",
      style: {
        background: "#111827",
        minHeight: "100vh",
        padding: "24px"
      },
      children: [
        // Stage 0: Hero
        {
          name: "heroContainer",
          type: "container",
          hidden: "{{ appState.value.stage !== 0 }}",
          children: [
            {
              name: "titleText",
              type: "text",
              value: "Social Media Science",
              style: {
                fontSize: "32px",
                color: "#ffffff",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "16px"
              }
            },
            {
              name: "subtitleText",
              type: "text",
              value: "Transform user inputs into viral-worthy video scripts using research-backed principles and AI intelligence",
              style: {
                fontSize: "16px",
                color: "#9CA3AF",
                textAlign: "center",
                marginBottom: "32px"
              }
            },
            {
              name: "startButton",
              type: "button",
              text: "Start Creating",
              style: {
                background: "#7C3AED",
                color: "white",
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px"
              },
              onClick: "appState.setValue({...appState.value, stage: 1})"
            }
          ]
        },
        
        // Stage 1: Input Form
        {
          name: "inputContainer",
          type: "container",
          hidden: "{{ appState.value.stage !== 1 }}",
          children: [
            {
              name: "inputTitle",
              type: "text",
              value: "📝 Describe Your Video Idea",
              style: {
                fontSize: "24px",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "24px"
              }
            },
            {
              name: "inputDescription",
              type: "textInput",
              placeholder: "e.g., How to make perfect coffee at home",
              label: "Video Description",
              required: true
            },
            {
              name: "selectTone",
              type: "select",
              label: "Tone",
              data: ["Professional", "Educational", "Fun", "Inspiring"],
              defaultValue: "Educational"
            },
            {
              name: "multiselectPlatforms",
              type: "multiselect",
              label: "Target Platforms",
              data: ["TikTok", "Instagram", "YouTube"],
              defaultValue: ["YouTube"]
            },
            {
              name: "numberDuration",
              type: "numberInput",
              label: "Duration (seconds)",
              min: 10,
              max: 120,
              step: 10,
              defaultValue: 30
            },
            {
              name: "generateScriptButton",
              type: "button",
              text: "Generate Smart Script",
              style: {
                background: "#7C3AED",
                marginTop: "24px"
              },
              onClick: "generateScript.trigger()",
              loading: "{{ generateScript.isFetching }}"
            }
          ]
        },
        
        // Stage 2: Script Review
        {
          name: "scriptContainer",
          type: "container",
          hidden: "{{ appState.value.stage !== 2 }}",
          children: [
            {
              name: "scriptTitle",
              type: "text",
              value: "📜 Your AI-Generated Script",
              style: {
                fontSize: "24px",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: "24px"
              }
            },
            {
              name: "scriptContent",
              type: "container",
              style: {
                background: "#1F2937",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "24px"
              },
              children: [
                {
                  name: "hookText",
                  type: "text",
                  value: "{{ '🎯 Hook: ' + appState.value.script?.hook }}",
                  style: { color: "#10B981", marginBottom: "12px" }
                },
                {
                  name: "mainPointsList",
                  type: "text",
                  value: "{{ '📍 Main Points:\\n' + appState.value.script?.mainPoints.join('\\n') }}",
                  style: { color: "#ffffff", marginBottom: "12px" }
                },
                {
                  name: "ctaText",
                  type: "text",
                  value: "{{ '💬 Call to Action: ' + appState.value.script?.callToAction }}",
                  style: { color: "#F59E0B" }
                }
              ]
            },
            {
              name: "continueToVoiceButton",
              type: "button",
              text: "Select AI Voice",
              style: { background: "#7C3AED" },
              onClick: "appState.setValue({...appState.value, stage: 3})"
            }
          ]
        },
        
        // Stage 3: Voice Selection
        {
          name: "voiceContainer",
          type: "container",
          hidden: "{{ appState.value.stage !== 3 }}",
          style: {
            background: "#1F2937",
            padding: "24px",
            borderRadius: "8px"
          },
          children: [
            {
              name: "voiceTitle",
              type: "text",
              value: "🎤 Select Your AI Voice",
              style: {
                fontSize: "24px",
                fontWeight: "700",
                color: "#ffffff",
                textAlign: "center",
                marginBottom: "24px"
              }
            },
            {
              name: "searchVoices",
              type: "textInput",
              placeholder: "Search voices by name, style, or description...",
              value: "{{ appState.value.voiceSearch }}",
              onChange: "appState.setValue({...appState.value, voiceSearch: event.target.value})"
            },
            {
              name: "providerFilter",
              type: "segmentedControl",
              items: [
                { label: "All (43)", value: "all" },
                { label: "🤖 OpenAI (11)", value: "openai" },
                { label: "🎙️ ElevenLabs (24)", value: "elevenlabs" },
                { label: "🌐 Google AI (8)", value: "google" }
              ],
              value: "{{ appState.value.activeProvider }}",
              onChange: "appState.setValue({...appState.value, activeProvider: value})"
            },
            {
              name: "tableVoices",
              type: "table",
              data: `{{ 
                getVoices.data.filter(v => 
                  (appState.value.activeProvider === 'all' || 
                   v.provider.toLowerCase() === appState.value.activeProvider) &&
                  (!appState.value.voiceSearch || 
                   v.name.toLowerCase().includes(appState.value.voiceSearch.toLowerCase()) ||
                   v.description.toLowerCase().includes(appState.value.voiceSearch.toLowerCase()))
                )
              }}`,
              columns: [
                { key: "name", name: "Voice Name", width: "150px" },
                { key: "style", name: "Style", width: "120px" },
                { key: "description", name: "Description" },
                { key: "provider", name: "Provider", width: "100px" }
              ],
              rowHeight: 40,
              onRowClick: `
                appState.setValue({
                  ...appState.value,
                  selectedVoice: currentRow
                });
                previewVoice.trigger();
              `
            },
            {
              name: "generateVoiceButton",
              type: "button",
              text: "Generate Voice",
              style: {
                background: "#7C3AED",
                marginTop: "24px"
              },
              disabled: "{{ !appState.value.selectedVoice }}",
              onClick: "generateVoice.trigger()",
              loading: "{{ generateVoice.isFetching }}"
            }
          ]
        },
        
        // Stage 4: Final Result
        {
          name: "resultContainer",
          type: "container",
          hidden: "{{ appState.value.stage !== 4 }}",
          children: [
            {
              name: "successTitle",
              type: "text",
              value: "🎉 Your Content is Ready!",
              style: {
                fontSize: "32px",
                fontWeight: "700",
                color: "#10B981",
                textAlign: "center",
                marginBottom: "24px"
              }
            },
            {
              name: "audioPlayer",
              type: "audio",
              src: "{{ appState.value.audioUrl }}",
              controls: true,
              autoplay: true
            },
            {
              name: "downloadButton",
              type: "button",
              text: "Download Audio",
              style: {
                background: "#10B981",
                marginTop: "24px"
              },
              onClick: `
                const a = document.createElement('a');
                a.href = appState.value.audioUrl;
                a.download = 'social-media-script.mp3';
                a.click();
              `
            },
            {
              name: "startOverButton",
              type: "button",
              text: "Create Another",
              style: {
                background: "#6B7280",
                marginTop: "12px"
              },
              onClick: `
                appState.setValue({
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
                });
              `
            }
          ]
        }
      ]
    }
  },
  
  // Custom CSS for compact UI
  customCSS: `
/* Compact UI - 40% smaller fonts */
:root {
  font-size: 60%;
}

/* Dark theme styling */
._retool-container1 {
  background: #111827;
  padding: 24px;
  min-height: 100vh;
}

/* Compact form elements */
button {
  padding: 6px 16px !important;
  font-size: 14px !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

input, textarea, select {
  padding: 4px 8px !important;
  font-size: 12px !important;
  background: #374151 !important;
  border: 1px solid #4B5563 !important;
  color: #F3F4F6 !important;
}

/* Compact table */
._retool-table1 {
  font-size: 12px;
  background: #1F2937;
}

._retool-table1 th {
  background: #111827 !important;
  color: #9CA3AF !important;
  font-weight: 600 !important;
  padding: 6px 8px !important;
}

._retool-table1 td {
  padding: 4px 8px !important;
  color: #F3F4F6 !important;
}

._retool-table1 tr:hover {
  background: #374151 !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #111827;
}

::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4B5563;
}

/* Loading states */
.retool-loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Segmented control styling */
._retool-segmentedcontrol1 {
  background: #1F2937 !important;
  border-radius: 8px !important;
  padding: 4px !important;
}

._retool-segmentedcontrol1 button {
  background: transparent !important;
  color: #9CA3AF !important;
}

._retool-segmentedcontrol1 button.selected {
  background: #7C3AED !important;
  color: white !important;
}
  `,
  
  // Voice data summary
  voiceProviders: {
    google: {
      count: 8,
      voices: ["Zephyr", "Puck", "Isla", "Echo", "Orbit", "Nova", "Sage", "Luna"],
      features: "Natural-sounding TTS from Google AI Studio"
    },
    openai: {
      count: 11,
      voices: ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer", "Alloy HD", "Echo HD", "Fable HD", "Onyx HD", "Shimmer HD"],
      features: "High-quality neural voices with HD variants"
    },
    elevenlabs: {
      count: 24,
      voices: ["Adam", "Antoni", "Arnold", "Bella", "Domi", "Drew", "Elli", "Emily", "Ethan", "Fin", "Grace", "Harry", "James", "Josh", "Liam", "Matilda", "Matthew", "Michael", "Mimi", "Nicole", "Rachel", "Sam", "Serena", "Thomas"],
      features: "Premium voice cloning and synthesis"
    }
  }
};

// Export for use in Retool
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SOCIAL_AI_PRO_TEMPLATE;
}