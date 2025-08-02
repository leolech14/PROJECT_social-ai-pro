import ScriptGenerator from '../../services/scriptGenerator'

describe('ScriptGenerator', () => {
  let scriptGenerator

  beforeEach(() => {
    // Clear environment variable to use mock mode
    delete process.env.GOOGLE_AI_API_KEY
    scriptGenerator = new ScriptGenerator()
  })

  describe('Mock Mode', () => {
    it('should initialize in mock mode when API key is not set', () => {
      expect(scriptGenerator.mockMode).toBe(true)
    })

    it('should generate a mock script with required fields', async () => {
      const params = {
        description: 'Test video about AI',
        tone: 'Professional',
        platforms: ['TikTok', 'Instagram'],
        duration: 30
      }

      const result = await scriptGenerator.generateScript(params)

      expect(result.success).toBe(true)
      expect(result.script).toBeDefined()
      expect(result.script.id).toBeDefined()
      expect(result.script.content).toContain('Test video about AI')
      expect(result.script.tone).toBe('Professional')
      expect(result.script.platforms).toEqual(['TikTok', 'Instagram'])
      expect(result.script.duration).toBe(30)
      expect(result.script.hook).toBeDefined()
      expect(result.script.scenes).toHaveLength(3) // 30 seconds = 3 scenes
      expect(result.script.cta).toBeDefined()
      expect(result.script.hashtags).toHaveLength(3)
    })

    it('should generate correct number of scenes based on duration', async () => {
      const params = {
        description: 'Test',
        tone: 'Fun',
        platforms: ['YouTube'],
        duration: 60
      }

      const result = await scriptGenerator.generateScript(params)

      expect(result.script.scenes).toHaveLength(6) // 60 seconds = 6 scenes
    })
  })

  describe('formatScriptContent', () => {
    it('should format script data into readable content', () => {
      const scriptData = {
        hook: 'Amazing opening',
        scenes: [
          {
            timestamp: '0:00-0:05',
            narration: 'First scene',
            visual: 'Show logo',
            emotion: 'excitement'
          }
        ],
        cta: 'Follow us',
        hashtags: ['#viral', '#ai']
      }

      const formatted = scriptGenerator.formatScriptContent(scriptData)

      expect(formatted).toContain('HOOK: Amazing opening')
      expect(formatted).toContain('SCENE 1 [0:00-0:05]')
      expect(formatted).toContain('Narration: First scene')
      expect(formatted).toContain('Visual: Show logo')
      expect(formatted).toContain('Emotion: excitement')
      expect(formatted).toContain('CTA: Follow us')
      expect(formatted).toContain('HASHTAGS: #viral #ai')
    })
  })
})