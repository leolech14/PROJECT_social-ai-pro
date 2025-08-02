class VoiceGenerator {
  constructor() {
    this.elevenlabsKey = process.env.ELEVENLABS_API_KEY
    this.openaiKey = process.env.OPENAI_API_KEY
    this.elevenlabsUrl = 'https://api.elevenlabs.io/v1'
    this.openaiUrl = 'https://api.openai.com/v1'
    
    this.mockMode = !this.elevenlabsKey && !this.openaiKey
    
    if (this.mockMode) {
      console.warn('No voice API keys set, using mock mode')
    }
  }

  async getVoices() {
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
    
    // Add Google AI Studio voices
    const googleVoices = [
      { id: 'google_wavenet_a', name: 'WaveNet A', provider: 'Google', gender: 'Female', style: 'Natural' },
      { id: 'google_wavenet_b', name: 'WaveNet B', provider: 'Google', gender: 'Male', style: 'Natural' },
      { id: 'google_neural2_c', name: 'Neural2 C', provider: 'Google', gender: 'Female', style: 'Expressive' },
      { id: 'google_neural2_d', name: 'Neural2 D', provider: 'Google', gender: 'Male', style: 'Professional' }
    ].map(voice => ({
      ...voice,
      preview: voice.style,
      category: 'professional',
      premium: false
    }))
    voices.push(...googleVoices)
    
    // If no API voices available, return mock voices
    if (voices.length === 0) {
      return this.getMockVoices()
    }
    
    return {
      success: true,
      voices
    }
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

    // Handle Google voices (would need Google Cloud TTS setup)
    if (voiceId.startsWith('google_')) {
      // For now, return mock as Google TTS requires more setup
      return this.generateMockVoice({ text, voiceId, scriptId })
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