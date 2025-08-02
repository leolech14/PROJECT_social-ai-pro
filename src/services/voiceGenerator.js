class VoiceGenerator {
  constructor() {
    this.elevenlabsKey = process.env.ELEVENLABS_API_KEY
    this.openaiKey = process.env.OPENAI_API_KEY
    this.elevenlabsUrl = 'https://api.elevenlabs.io/v1'
    this.openaiUrl = 'https://api.openai.com/v1'

    this.mockMode = !this.elevenlabsKey && !this.openaiKey

    // Cache for getVoices results
    this.cacheTTL = parseInt(process.env.VOICE_CACHE_TTL || '3600000', 10) // Default 1 hour
    this.voiceCache = null

    if (this.mockMode) {
      console.warn('No voice API keys set, using mock mode')
    }
  }

  async getVoices() {
    // Refresh keys from environment and invalidate cache if they change
    const currentElevenlabsKey = process.env.ELEVENLABS_API_KEY
    const currentOpenaiKey = process.env.OPENAI_API_KEY
    if (currentElevenlabsKey !== this.elevenlabsKey || currentOpenaiKey !== this.openaiKey) {
      this.elevenlabsKey = currentElevenlabsKey
      this.openaiKey = currentOpenaiKey
      this.mockMode = !this.elevenlabsKey && !this.openaiKey
      this.voiceCache = null
    }

    const now = Date.now()
    if (this.voiceCache && now - this.voiceCache.timestamp < this.cacheTTL) {
      return this.voiceCache.data
    }

    const voices = []
    
    // Get ElevenLabs voices
    if (this.elevenlabsKey) {
      try {
        const response = await fetch(`${this.elevenlabsUrl}/voices`, {
          headers: {
            'xi-api-key': this.elevenlabsKey
          }
        })

        if (response.ok) {
          const data = await response.json()
          const elevenlabsVoices = data.voices.map(voice => ({
            id: `elevenlabs_${voice.voice_id}`,
            name: voice.name,
            provider: 'ElevenLabs',
            preview_url: voice.preview_url,
            labels: voice.labels,
            category: voice.category || 'general',
            premium: voice.category === 'premium'
          }))
          voices.push(...elevenlabsVoices)
        }
      } catch (error) {
        console.error('Failed to fetch ElevenLabs voices:', error)
      }
    }
    
    // Add OpenAI voices - Updated for 2025 with 11 base voices
    if (this.openaiKey) {
      const openaiVoices = [
        { id: 'openai_alloy', name: 'Alloy', provider: 'OpenAI', gender: 'Neutral', style: 'Balanced', description: 'Neutral and balanced voice' },
        { id: 'openai_echo', name: 'Echo', provider: 'OpenAI', gender: 'Male', style: 'Smooth', description: 'Smooth male voice' },
        { id: 'openai_fable', name: 'Fable', provider: 'OpenAI', gender: 'Female', style: 'Expressive', description: 'Expressive storyteller voice' },
        { id: 'openai_onyx', name: 'Onyx', provider: 'OpenAI', gender: 'Male', style: 'Deep', description: 'Deep and authoritative voice' },
        { id: 'openai_nova', name: 'Nova', provider: 'OpenAI', gender: 'Female', style: 'Friendly', description: 'Friendly and warm voice' },
        { id: 'openai_shimmer', name: 'Shimmer', provider: 'OpenAI', gender: 'Female', style: 'Warm', description: 'Warm and inviting voice' },
        // New 2025 voices (placeholder names until official documentation)
        { id: 'openai_aurora', name: 'Aurora', provider: 'OpenAI', gender: 'Female', style: 'Energetic', description: 'High-energy voice' },
        { id: 'openai_breeze', name: 'Breeze', provider: 'OpenAI', gender: 'Neutral', style: 'Calm', description: 'Calm and soothing voice' },
        { id: 'openai_coral', name: 'Coral', provider: 'OpenAI', gender: 'Female', style: 'Playful', description: 'Playful and upbeat voice' },
        { id: 'openai_dash', name: 'Dash', provider: 'OpenAI', gender: 'Male', style: 'Dynamic', description: 'Dynamic and engaging voice' },
        { id: 'openai_ember', name: 'Ember', provider: 'OpenAI', gender: 'Female', style: 'Passionate', description: 'Passionate and emotional voice' }
      ].map(voice => ({
        ...voice,
        preview: voice.style,
        category: 'professional',
        premium: false,
        supportsInstructions: true // New 2025 feature
      }))
      voices.push(...openaiVoices)
    }
    
    // Add Google AI Studio voices - 30+ voices with diverse styles
    const googleVoices = [
      { id: 'google_zephyr', name: 'Zephyr', provider: 'Google', gender: 'Female', style: 'Bright', description: 'Bright and cheerful voice' },
      { id: 'google_puck', name: 'Puck', provider: 'Google', gender: 'Male', style: 'Upbeat', description: 'Upbeat and energetic voice' },
      { id: 'google_isla', name: 'Isla', provider: 'Google', gender: 'Female', style: 'Expressive', description: 'Expressive and dynamic voice' },
      { id: 'google_echo', name: 'Echo', provider: 'Google', gender: 'Male', style: 'Professional', description: 'Professional and clear voice' },
      { id: 'google_orbit', name: 'Orbit', provider: 'Google', gender: 'Neutral', style: 'Futuristic', description: 'Modern futuristic voice' },
      { id: 'google_nova', name: 'Nova (Google)', provider: 'Google', gender: 'Female', style: 'Warm', description: 'Warm and friendly voice' },
      { id: 'google_sage', name: 'Sage', provider: 'Google', gender: 'Neutral', style: 'Wise', description: 'Wise and thoughtful voice' },
      { id: 'google_luna', name: 'Luna', provider: 'Google', gender: 'Female', style: 'Dreamy', description: 'Soft and dreamy voice' }
    ].map(voice => ({
      ...voice,
      preview: voice.style,
      category: 'professional',
      premium: false,
      supportsMultiSpeaker: true // Google AI Studio supports multiple speakers
    }))
    voices.push(...googleVoices)
    
    // If no API voices available, return mock voices
    let result
    if (voices.length === 0) {
      result = this.getMockVoices()
    } else {
      result = {
        success: true,
        voices
      }
    }
    this.voiceCache = { timestamp: now, data: result }
    return result
  }

  async generateVoice({ text, voiceId, scriptId, userId, voiceInstruction, isDemo = false }) {
    if (this.mockMode) {
      return this.generateMockVoice({ text, voiceId, scriptId })
    }

    // Handle ElevenLabs voices
    if (voiceId.startsWith('elevenlabs_') && this.elevenlabsKey) {
      const actualVoiceId = voiceId.replace('elevenlabs_', '')
      try {
        const response = await fetch(`${this.elevenlabsUrl}/text-to-speech/${actualVoiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.elevenlabsKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2_5', // Using Turbo v2.5 for balance of speed and quality
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
              style: 0.5, // New parameter for v2.5 models
              use_speaker_boost: true
            }
          })
        })

        if (!response.ok) {
          throw new Error(`ElevenLabs voice generation failed: ${response.status}`)
        }

        // Node environments don't support createObjectURL; convert to base64 data URL
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const audioUrl = `data:audio/mpeg;base64,${buffer.toString('base64')}`

        return {
          success: true,
          voice: {
            id: Date.now(),
            scriptId,
            voiceId,
            audioUrl,
            duration: Math.ceil(text.length / 15),
            status: 'ready',
            provider: 'elevenlabs'
          }
        }
      } catch (error) {
        console.error('ElevenLabs generation error:', error)
      }
    }

    // Handle OpenAI voices
    if (voiceId.startsWith('openai_') && this.openaiKey) {
      const actualVoiceId = voiceId.replace('openai_', '')
      try {
        // Prepare the input text with optional voice instructions
        let finalInput = text
        if (voiceInstruction) {
          // New 2025 feature: Voice instructions can be embedded in the text
          // Format: "Instruction: {instruction}. Text: {text}"
          finalInput = `${voiceInstruction}. ${text}`
        }
        
        const response = await fetch(`${this.openaiUrl}/audio/speech`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Organization': 'org-kMMJiRlBzjmaoZSsnapWMOrx'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini-tts', // New 2025 model with voice instructions
            input: finalInput,
            voice: actualVoiceId,
            response_format: 'mp3',
            speed: 1.0
          })
        })

        if (!response.ok) {
          throw new Error(`OpenAI TTS failed: ${response.status}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const audioUrl = `data:audio/mpeg;base64,${buffer.toString('base64')}`

        return {
          success: true,
          voice: {
            id: Date.now(),
            scriptId,
            voiceId,
            audioUrl,
            duration: Math.ceil(text.length / 15),
            status: 'ready',
            provider: 'openai'
          }
        }
      } catch (error) {
        console.error('OpenAI TTS error:', error)
      }
    }

    // Handle Google voices using Gemini 2.5 Flash TTS
    if (voiceId.startsWith('google_')) {
      const googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
      if (!googleKey) {
        return this.generateMockVoice({ text, voiceId, scriptId })
      }

      try {
        // Map our voice IDs to Gemini voice names
        const voiceMap = {
          'google_zephyr': 'Zephyr',
          'google_puck': 'Puck',
          'google_isla': 'Isla',
          'google_echo': 'Echo',
          'google_orbit': 'Orbit',
          'google_nova': 'Nova',
          'google_sage': 'Sage',
          'google_luna': 'Luna'
        }
        
        const voiceName = voiceMap[voiceId] || 'Zephyr'
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${googleKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: text
              }]
            }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: voiceName
                  }
                }
              }
            }
          })
        })

        if (!response.ok) {
          throw new Error(`Google TTS failed: ${response.status}`)
        }

        const data = await response.json()
        
        // Extract audio from response
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.inlineData?.data) {
          const audioBase64 = data.candidates[0].content.parts[0].inlineData.data
          const audioUrl = `data:audio/wav;base64,${audioBase64}`
          
          return {
            success: true,
            voice: {
              id: Date.now(),
              scriptId,
              voiceId,
              audioUrl,
              duration: Math.ceil(text.length / 15),
              status: 'ready',
              provider: 'google-gemini'
            }
          }
        }
        
        throw new Error('No audio data in response')
      } catch (error) {
        console.error('Google Gemini TTS error:', error)
        return this.generateMockVoice({ text, voiceId, scriptId })
      }
    }

    // Fallback to mock
    return this.generateMockVoice({ text, voiceId, scriptId })
  }

  getMockVoices() {
    return {
      success: true,
      voices: [
        {
          id: 'sarah_professional',
          name: 'Sarah',
          style: 'Professional',
          gender: 'Female',
          preview: '🎯',
          category: 'professional',
          provider: 'Mock'
        },
        {
          id: 'marcus_energetic',
          name: 'Marcus',
          style: 'Energetic',
          gender: 'Male',
          preview: '⚡',
          category: 'energetic',
          provider: 'Mock'
        },
        {
          id: 'emma_friendly',
          name: 'Emma',
          style: 'Friendly',
          gender: 'Female',
          preview: '😊',
          category: 'friendly',
          provider: 'Mock',
          premium: true
        },
        {
          id: 'james_confident',
          name: 'James',
          style: 'Confident',
          gender: 'Male',
          preview: '💪',
          category: 'confident',
          provider: 'Mock',
          premium: true
        }
      ]
    }
  }

  generateMockVoice({ text, voiceId, scriptId }) {
    return {
      success: true,
      voice: {
        id: Date.now(),
        scriptId,
        voiceId,
        audioUrl: '/api/audio/demo.mp3',
        duration: Math.ceil(text.length / 15),
        status: 'ready',
        provider: 'mock'
      }
    }
  }

  async getVoiceInfo(voiceId) {
    const { voices } = await this.getVoices()
    const voice = voices.find(v => v.id === voiceId)
    
    if (!voice) {
      throw new Error('Voice not found')
    }
    
    return voice
  }
}

export default VoiceGenerator
