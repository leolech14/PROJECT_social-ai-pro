import { GoogleGenerativeAI } from '@google/generative-ai'

class ScriptGenerator {
  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      console.warn('GOOGLE_AI_API_KEY not set, using mock mode')
      this.mockMode = true
      return
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  async generateScript({ description, tone, platforms, duration }) {
    if (this.mockMode) {
      return this.generateMockScript({ description, tone, platforms, duration })
    }

    const platformString = platforms.join(', ')
    const prompt = `
You are an expert social media content creator specializing in viral video scripts.

Create a compelling ${duration}-second video script for ${platformString} with a ${tone.toLowerCase()} tone.

Video concept: ${description}

Requirements:
1. Hook: Start with an attention-grabbing opening (first 3 seconds are crucial)
2. Structure: Use proven viral content patterns
3. Pacing: Keep it dynamic with scene changes every 3-5 seconds
4. Call-to-Action: Include a natural CTA that fits the platform
5. Platform Optimization:
   - TikTok: Short, punchy sentences, trend-aware
   - Instagram: Visual descriptions, aesthetic focus
   - YouTube: Information-dense, searchable keywords

Format the response as JSON with the following structure:
{
  "hook": "The opening line that grabs attention",
  "scenes": [
    {
      "timestamp": "0:00-0:05",
      "narration": "What to say",
      "visual": "What to show",
      "emotion": "Target emotion"
    }
  ],
  "cta": "The call to action",
  "hashtags": ["relevant", "hashtags"],
  "tips": ["platform-specific tips"]
}
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const scriptData = JSON.parse(jsonMatch[0])
        return {
          success: true,
          script: {
            id: Date.now(),
            content: this.formatScriptContent(scriptData),
            hook: scriptData.hook,
            scenes: scriptData.scenes,
            cta: scriptData.cta,
            hashtags: scriptData.hashtags,
            tone,
            platforms,
            duration
          }
        }
      }
      
      throw new Error('Failed to parse script JSON')
    } catch (error) {
      console.error('Script generation error:', error)
      return {
        success: false,
        error: error.message,
        script: this.generateMockScript({ description, tone, platforms, duration }).script
      }
    }
  }

  formatScriptContent(scriptData) {
    let content = `HOOK: ${scriptData.hook}\n\n`
    
    scriptData.scenes.forEach((scene, index) => {
      content += `SCENE ${index + 1} [${scene.timestamp}]\n`
      content += `Narration: ${scene.narration}\n`
      content += `Visual: ${scene.visual}\n`
      content += `Emotion: ${scene.emotion}\n\n`
    })
    
    content += `CTA: ${scriptData.cta}\n\n`
    content += `HASHTAGS: ${scriptData.hashtags.join(' ')}`
    
    return content
  }

  generateMockScript({ description, tone, platforms, duration }) {
    const scenes = Math.ceil(duration / 10)
    const mockScenes = []
    
    for (let i = 0; i < scenes; i++) {
      const start = i * 10
      const end = Math.min((i + 1) * 10, duration)
      mockScenes.push({
        timestamp: `0:${start.toString().padStart(2, '0')}-0:${end.toString().padStart(2, '0')}`,
        narration: `Scene ${i + 1} narration for ${description}`,
        visual: `Visual description for scene ${i + 1}`,
        emotion: ['excitement', 'curiosity', 'inspiration', 'joy'][i % 4]
      })
    }

    return {
      success: true,
      script: {
        id: Date.now(),
        content: `Here's your ${tone.toLowerCase()} script for ${platforms.join(', ')} (${duration}s):\n\n"${description}"\n\nThis would be enhanced with AI-powered social media optimization...`,
        hook: `Did you know that ${description.slice(0, 50)}...?`,
        scenes: mockScenes,
        cta: 'Follow for more amazing content!',
        hashtags: ['#viral', '#trending', `#${platforms[0].toLowerCase()}`],
        tone,
        platforms,
        duration
      }
    }
  }
}

export default ScriptGenerator