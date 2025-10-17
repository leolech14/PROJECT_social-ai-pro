import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

// Retool Builder - Creates the entire Social AI Pro app programmatically
class RetoolBuilder {
  constructor(apiKey, baseUrl = 'https://leonardolech1.retool.com') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  async createApp() {
    console.log('🚀 Building Social AI Pro in Retool...\n')

    // Step 1: Create the app
    const app = await this.createBaseApp()
    console.log('✅ App created:', app.id)

    // Step 2: Add state variable
    await this.createStateVariable(app.id)
    console.log('✅ State variable added')

    // Step 3: Create queries
    await this.createQueries(app.id)
    console.log('✅ Queries created')

    // Step 4: Build UI components
    await this.buildUI(app.id)
    console.log('✅ UI components built')

    // Step 5: Add custom CSS
    await this.addCustomCSS(app.id)
    console.log('✅ Custom CSS applied')

    console.log(`\n🎉 Social AI Pro app created successfully!`)
    console.log(`📱 Open in Retool: ${this.baseUrl}/apps/${app.id}`)
  }

  async createBaseApp() {
    const response = await fetch(`${this.baseUrl}/api/v1/apps`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: 'Social AI Pro',
        description: 'AI-powered video script and voice generation with compact UI'
      })
    })
    return response.json()
  }

  async createStateVariable(appId) {
    const stateConfig = {
      name: 'appState',
      defaultValue: {
        stage: 0,
        description: '',
        tone: 'Educational',
        platforms: ['YouTube'],
        duration: 30,
        activeProvider: 'all',
        voiceSearch: '',
        selectedVoice: null,
        script: null,
        audioUrl: null
      }
    }

    return fetch(`${this.baseUrl}/api/v1/apps/${appId}/variables`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(stateConfig)
    })
  }

  async createQueries(appId) {
    const queries = [
      {
        name: 'getVoices',
        resourceName: 'SocialAIProAPI',
        type: 'restapi',
        runWhenPageLoads: true,
        method: 'GET',
        url: '/api/voices'
      },
      {
        name: 'generateScript',
        resourceName: 'SocialAIProAPI',
        type: 'restapi',
        method: 'POST',
        url: '/api/generate-script',
        body: `{{ {
          description: inputDescription.value,
          tone: selectTone.value,
          platforms: multiselectPlatforms.value,
          duration: numberDuration.value
        } }}`,
        onSuccess: `appState.setValue({...appState.value, script: data, stage: 2})`
      },
      {
        name: 'previewVoice',
        resourceName: 'SocialAIProAPI',
        type: 'restapi',
        method: 'POST',
        url: '/api/voice-preview',
        body: `{{ {
          voiceId: tableVoices.selectedRow.id,
          demoText: 'Testing the new compact UI with Google AI Studio voices'
        } }}`
      },
      {
        name: 'generateVoice',
        resourceName: 'SocialAIProAPI',
        type: 'restapi',
        method: 'POST',
        url: '/api/generate-voice',
        body: `{{ {
          scriptId: appState.value.script.id,
          voiceId: appState.value.selectedVoice.id,
          text: appState.value.script.hook + ' ' + appState.value.script.mainPoints.join(' ') + ' ' + appState.value.script.callToAction
        } }}`,
        onSuccess: `appState.setValue({...appState.value, audioUrl: data.voice.audioUrl, stage: 4})`
      }
    ]

    for (const query of queries) {
      await fetch(`${this.baseUrl}/api/v1/apps/${appId}/queries`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(query)
      })
    }
  }

  async buildUI(appId) {
    const components = {
      // Main container
      mainContainer: {
        type: 'container',
        name: 'mainContainer',
        properties: {
          style: {
            background: '#111827',
            padding: '24px',
            minHeight: '100vh'
          }
        }
      },

      // Stage 0: Hero
      heroContainer: {
        type: 'container',
        name: 'heroContainer',
        parent: 'mainContainer',
        properties: {
          hidden: '{{ appState.value.stage !== 0 }}'
        },
        children: [
          {
            type: 'text',
            name: 'titleText',
            properties: {
              value: 'Social Media Science',
              style: {
                fontSize: '32px',
                color: '#ffffff',
                fontWeight: 'bold',
                textAlign: 'center'
              }
            }
          },
          {
            type: 'text',
            name: 'subtitleText',
            properties: {
              value: 'Transform user inputs into viral-worthy video scripts using AI',
              style: {
                fontSize: '16px',
                color: '#9CA3AF',
                textAlign: 'center',
                marginBottom: '24px'
              }
            }
          },
          {
            type: 'button',
            name: 'startButton',
            properties: {
              text: 'Start Creating',
              style: {
                background: '#7C3AED',
                color: '#ffffff',
                fontSize: '14px',
                padding: '8px 24px'
              },
              onClick: 'appState.setValue({...appState.value, stage: 1})'
            }
          }
        ]
      },

      // Stage 1: Input Form
      inputContainer: {
        type: 'container',
        name: 'inputContainer',
        parent: 'mainContainer',
        properties: {
          hidden: '{{ appState.value.stage !== 1 }}'
        },
        children: [
          {
            type: 'text',
            name: 'inputTitle',
            properties: {
              value: 'Describe Your Video Idea',
              style: {
                fontSize: '24px',
                color: '#ffffff',
                fontWeight: 'bold',
                marginBottom: '16px'
              }
            }
          },
          {
            type: 'textInput',
            name: 'inputDescription',
            properties: {
              placeholder: 'e.g., How to make perfect coffee at home',
              label: '',
              style: {
                marginBottom: '16px'
              }
            }
          },
          {
            type: 'select',
            name: 'selectTone',
            properties: {
              label: 'Tone',
              data: ['Professional', 'Educational', 'Fun', 'Inspiring'],
              defaultValue: 'Educational',
              style: {
                marginBottom: '16px'
              }
            }
          },
          {
            type: 'multiselect',
            name: 'multiselectPlatforms',
            properties: {
              label: 'Platforms',
              data: ['TikTok', 'Instagram', 'YouTube'],
              defaultValue: ['YouTube'],
              style: {
                marginBottom: '16px'
              }
            }
          },
          {
            type: 'numberInput',
            name: 'numberDuration',
            properties: {
              label: 'Duration (seconds)',
              defaultValue: 30,
              min: 10,
              max: 120,
              step: 10,
              style: {
                marginBottom: '24px'
              }
            }
          },
          {
            type: 'button',
            name: 'generateScriptButton',
            properties: {
              text: 'Generate Smart Script',
              style: {
                background: '#7C3AED',
                color: '#ffffff',
                fontSize: '14px',
                padding: '8px 24px'
              },
              onClick: 'generateScript.trigger()'
            }
          }
        ]
      },

      // Stage 3: Voice Selection
      voiceContainer: {
        type: 'container',
        name: 'voiceContainer',
        parent: 'mainContainer',
        properties: {
          hidden: '{{ appState.value.stage !== 3 }}',
          style: {
            background: '#1F2937',
            padding: '16px',
            borderRadius: '8px'
          }
        },
        children: [
          {
            type: 'text',
            name: 'voiceTitle',
            properties: {
              value: '🎤 Select Your AI Voice',
              style: {
                fontSize: '18px',
                color: '#ffffff',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '16px'
              }
            }
          },
          {
            type: 'textInput',
            name: 'searchVoices',
            properties: {
              placeholder: 'Search voices by name, style, or description...',
              style: {
                marginBottom: '12px'
              }
            }
          },
          {
            type: 'segmentedControl',
            name: 'providerFilter',
            properties: {
              items: [
                { label: 'All (43)', value: 'all' },
                { label: '🤖 OpenAI (11)', value: 'openai' },
                { label: '🎙️ ElevenLabs (24)', value: 'elevenlabs' },
                { label: '🌐 Google AI (8)', value: 'google' }
              ],
              defaultValue: 'all',
              style: {
                marginBottom: '16px'
              }
            }
          },
          {
            type: 'table',
            name: 'tableVoices',
            properties: {
              data: '{{ getVoices.data.filter(v => providerFilter.value === "all" || v.provider.toLowerCase() === providerFilter.value).filter(v => !searchVoices.value || v.name.toLowerCase().includes(searchVoices.value.toLowerCase())) }}',
              columns: [
                { key: 'name', label: 'Voice Name' },
                { key: 'style', label: 'Style' },
                { key: 'description', label: 'Description' },
                { key: 'provider', label: 'Provider' }
              ],
              rowHeight: 'compact',
              style: {
                fontSize: '12px'
              }
            }
          }
        ]
      }
    }

    // Create components via API
    for (const [key, component] of Object.entries(components)) {
      await this.createComponent(appId, component)
    }
  }

  async createComponent(appId, component) {
    return fetch(`${this.baseUrl}/api/v1/apps/${appId}/components`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(component)
    })
  }

  async addCustomCSS(appId) {
    const css = `
/* Compact UI - 40% smaller fonts */
:root {
  font-size: 60%;
}

/* Dark theme */
body {
  background: #0F172A;
}

/* Compact buttons */
button {
  padding: 6px 16px !important;
  font-size: 14px !important;
}

/* Compact inputs */
input, textarea, select {
  padding: 4px 8px !important;
  font-size: 12px !important;
}

/* Compact table */
._retool-tableVoices {
  font-size: 12px;
}

._retool-tableVoices th,
._retool-tableVoices td {
  padding: 4px 8px !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #111827;
}

::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}
`

    return fetch(`${this.baseUrl}/api/v1/apps/${appId}/settings`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ customCSS: css })
    })
  }
}

// Run the builder
async function main() {
  const apiKey = process.env.RETOOL_API_KEY
  
  if (!apiKey) {
    console.error('❌ Please set RETOOL_API_KEY environment variable')
    console.log('\nTo get your API key:')
    console.log('1. Go to Retool Settings')
    console.log('2. Click on API')
    console.log('3. Generate a new API key')
    console.log('\nThen run:')
    console.log('export RETOOL_API_KEY="your-api-key"')
    console.log('node retool-builder.js')
    process.exit(1)
  }

  const builder = new RetoolBuilder(apiKey)
  
  try {
    await builder.createApp()
  } catch (error) {
    console.error('❌ Error creating app:', error.message)
    console.log('\nTroubleshooting:')
    console.log('1. Make sure your API key is valid')
    console.log('2. Check that you have permissions to create apps')
    console.log('3. Ensure the SocialAIProAPI resource exists in Retool')
  }
}

// Check if we can use the Retool API
console.log('📝 Note: Retool API access depends on your plan')
console.log('- Business/Enterprise: Full API access')
console.log('- Team: Limited API access')
console.log('- Free: No API access\n')

main()