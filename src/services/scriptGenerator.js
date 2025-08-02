import { GoogleGenerativeAI } from '@google/generative-ai'

class ScriptGenerator {
  constructor() {
    // Try OpenAI first
    this.openaiKey = process.env.OPENAI_API_KEY
    this.googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    
    if (!this.openaiKey && !this.googleKey) {
      console.warn('No AI API keys set, using mock mode')
      this.mockMode = true
      return
    }
    
    // Initialize Google AI if available
    if (this.googleKey) {
      this.genAI = new GoogleGenerativeAI(this.googleKey)
      // Updated to use latest Gemini 2.5 Flash model
      this.googleModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    }
  }

  async generateScript({ description, tone, platforms, duration }) {
    if (this.mockMode) {
      return this.generateMockScript({ description, tone, platforms, duration })
    }

    const platformString = platforms.join(', ')
    const prompt = `
You are an expert social media content creator with deep knowledge of viral video psychology and engagement science.

Create a compelling ${duration}-second video script for ${platformString} with a ${tone.toLowerCase()} tone.

Video concept: ${description}

CRITICAL SUCCESS PRINCIPLES (Research-Based):

1. THE 3-SECOND RULE: The first 3 seconds determine if viewers stay or scroll. Front-load your most compelling content.

2. HOOK STRATEGIES (Choose the best for this content):
   - Bold Visual/Shock Factor: Eye-catching, unexpected opening
   - Provocative Question: "Did you know 85% of people do X?"
   - Secret Value: "Here's a trick 99% of businesses don't know..."
   - Relatable Problem: Start with a common pain point
   - Dynamic Movement: High-energy opening with action

3. STORYTELLING STRUCTURE:
   - Beginning (Hook/Setup): First 3-5 seconds
   - Middle (Build Tension/Value): Develop the idea, heighten emotion
   - End (Climax/Resolution): Big reveal, then immediate CTA

4. PACING & PATTERN INTERRUPTS:
   - Change something every 5-10 seconds (visual, text, angle)
   - Use pattern interrupts: text flashes, sound effects, cutaways
   - No static moments - constant engagement

5. EMOTIONAL ENGAGEMENT:
   - Target high-arousal emotions: awe, amusement, surprise, excitement
   - Include an emotional peak around 2/3 mark of the video
   - Make viewers feel something to drive sharing

6. PLATFORM-SPECIFIC OPTIMIZATION:
   - TikTok: Ultra-fast-paced, authentic, trend-driven, 15-30s sweet spot
   - Instagram: Slightly polished, aesthetic, mute-friendly with captions
   - YouTube: Can handle slight setup, educational, searchable keywords

7. ENGAGEMENT TECHNIQUES:
   - Direct questions: "Which would you try? Comment below!"
   - Share prompts: "Tag someone who needs this!"
   - Clear, action-oriented CTAs

Format as JSON with detailed scene breakdown:
{
  "hook": "The opening line (3-second rule compliant)",
  "hookType": "question|secret|problem|shock|movement",
  "scenes": [
    {
      "timestamp": "0:00-0:05",
      "narration": "Exact words to say",
      "visual": "Specific visual description",
      "textOverlay": "On-screen text if any",
      "emotion": "Target emotion",
      "patternInterrupt": "Visual/audio change to maintain attention"
    }
  ],
  "emotionalPeak": {
    "timestamp": "Timing of emotional climax",
    "description": "The wow moment that drives sharing"
  },
  "cta": "Clear, action-oriented call to action",
  "hashtags": ["viral-potential", "platform-optimized", "hashtags"],
  "engagementPrompts": ["Questions or prompts to drive comments/shares"],
  "retentionTactics": ["Specific techniques used to maintain viewership"]
}
`

    // Try OpenAI first (using GPT-4 until O3 is available)
    if (this.openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiKey}`,
            'OpenAI-Organization': 'org-kMMJiRlBzjmaoZSsnapWMOrx'
          },
          body: JSON.stringify({
            // Note: Change to 'o3' when OpenAI releases the model
            // Currently using GPT-4 Turbo which is the most advanced available model
            model: 'gpt-4-turbo-preview', // Will update to 'o3' when available
            messages: [
              {
                role: 'system',
                content: 'You are an expert social media content creator. Always respond with valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.8,
            max_tokens: 1000,
            response_format: { type: "json_object" }
          })
        })

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        const scriptData = JSON.parse(data.choices[0].message.content)
        
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
            duration,
            generatedBy: 'openai-gpt4' // Will be 'openai-o3' when available
          }
        }
      } catch (error) {
        console.error('OpenAI generation error:', error)
        // Fall through to Google AI
      }
    }

    // Try Google AI as fallback
    if (this.googleModel) {
      try {
        const result = await this.googleModel.generateContent(prompt)
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
              duration,
              generatedBy: 'google-gemini'
            }
          }
        }
        
        throw new Error('Failed to parse script JSON')
      } catch (error) {
        console.error('Google AI generation error:', error)
        return {
          success: false,
          error: error.message,
          script: this.generateMockScript({ description, tone, platforms, duration }).script
        }
      }
    }

    // If all else fails, use mock
    return this.generateMockScript({ description, tone, platforms, duration })
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
        duration,
        generatedBy: 'mock'
      }
    }
  }
}

export default ScriptGenerator