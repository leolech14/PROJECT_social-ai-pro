import VoiceGenerator from '../../services/voiceGenerator'

describe('VoiceGenerator', () => {
  let voiceGenerator
  const originalFetch = global.fetch

  beforeEach(() => {
    delete process.env.ELEVENLABS_API_KEY
    delete process.env.OPENAI_API_KEY
    process.env.VOICE_CACHE_TTL = '10000'
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ voices: [] }) })
    voiceGenerator = new VoiceGenerator()
  })

  afterEach(() => {
    delete process.env.VOICE_CACHE_TTL
    global.fetch = originalFetch
  })

  describe('Mock Mode', () => {
    it('should initialize in mock mode when API key is not set', () => {
      expect(voiceGenerator.mockMode).toBe(true)
    })

    it('should return available voices', async () => {
      const result = await voiceGenerator.getVoices()

      expect(result.success).toBe(true)
      expect(Array.isArray(result.voices)).toBe(true)
      // In mock mode, Google voices are returned by default
      expect(result.voices.some(v => v.id === 'google_wavenet_a')).toBe(true)
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

  describe('Caching', () => {
    it('should cache voices within TTL', async () => {
      process.env.ELEVENLABS_API_KEY = 'key1'
      const vg = new VoiceGenerator()

      const first = await vg.getVoices()
      const second = await vg.getVoices()

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(second).toBe(first)
    })

    it('should invalidate cache when API keys change', async () => {
      process.env.ELEVENLABS_API_KEY = 'key1'
      const vg = new VoiceGenerator()

      const first = await vg.getVoices()
      expect(global.fetch).toHaveBeenCalledTimes(1)

      process.env.ELEVENLABS_API_KEY = 'key2'
      const second = await vg.getVoices()

      expect(global.fetch).toHaveBeenCalledTimes(2)
      expect(second).not.toBe(first)
    })
  })
})