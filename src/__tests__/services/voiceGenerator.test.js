import VoiceGenerator from '../../services/voiceGenerator'

describe('VoiceGenerator', () => {
  let voiceGenerator

  beforeEach(() => {
    delete process.env.ELEVENLABS_API_KEY
    voiceGenerator = new VoiceGenerator()
  })

  describe('Mock Mode', () => {
    it('should initialize in mock mode when API key is not set', () => {
      expect(voiceGenerator.mockMode).toBe(true)
    })

    it('should return available voices', async () => {
      const result = await voiceGenerator.getVoices()

      expect(result.success).toBe(true)
      expect(result.voices).toHaveLength(4)
      expect(result.voices[0]).toHaveProperty('id')
      expect(result.voices[0]).toHaveProperty('name')
    })

    it('should generate mock voice', async () => {
      const params = {
        text: 'This is a test narration',
        voiceId: 'sarah_professional',
        scriptId: 12345
      }

      const result = await voiceGenerator.generateVoice(params)

      expect(result.success).toBe(true)
      expect(result.voice).toBeDefined()
      expect(result.voice.id).toBeDefined()
      expect(result.voice.scriptId).toBe(12345)
      expect(result.voice.voiceId).toBe('sarah_professional')
      expect(result.voice.audioUrl).toBe('/api/audio/demo.mp3')
      expect(result.voice.duration).toBeGreaterThan(0)
      expect(result.voice.status).toBe('ready')
    })

    it('should estimate duration based on text length', async () => {
      const shortText = 'Short'
      const longText = 'This is a much longer text that should result in a longer duration estimate'

      const shortResult = await voiceGenerator.generateVoice({
        text: shortText,
        voiceId: 'test',
        scriptId: 1
      })

      const longResult = await voiceGenerator.generateVoice({
        text: longText,
        voiceId: 'test',
        scriptId: 2
      })

      expect(longResult.voice.duration).toBeGreaterThan(shortResult.voice.duration)
    })
  })
})