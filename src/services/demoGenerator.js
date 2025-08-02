import { GoogleGenerativeAI } from '@google/generative-ai'

class DemoGenerator {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY
    this.googleKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    
    if (!this.openaiKey && !this.googleKey) {
      console.warn('No AI API keys set for demo generation, using fallback mode')
      this.fallbackMode = true
      return
    }
    
    // Initialize Google AI if available
    if (this.googleKey) {
      this.genAI = new GoogleGenerativeAI(this.googleKey)
      this.googleModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    }
  }

  async generateDemoSentences({ description, tone, platforms, duration }) {
    if (this.fallbackMode) {
      return this.generateFallbackDemos({ description, tone, platforms })
    }

    const platformString = platforms.join(', ')
    const prompt = `
Generate 30 short, engaging demo sentences for voice previews based on this video concept:

Video Topic: ${description}
Tone: ${tone}
Platforms: ${platformString}
Duration: ${duration} seconds

Requirements:
1. Each sentence should be 8-15 words long (perfect for voice demos)
2. Capture the essence of the video topic
3. Match the specified tone (${tone.toLowerCase()})
4. Be platform-appropriate for ${platformString}
5. Include variety: questions, statements, calls-to-action, emotional hooks
6. Make them fun, engaging, and representative of the content style
7. Consider the target audience for each platform

Examples of good demo sentences:
- "Did you know this simple trick could change everything?"
- "Here's the secret that 99% of people don't know!"
- "Wait until you see what happens next - mind blown!"
- "This will literally save you hours every single day."

Generate exactly 30 unique sentences that would work perfectly as voice demos for this content.

Format as a simple JSON array of strings:
["sentence 1", "sentence 2", ...]
`

    // Try OpenAI first
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
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: 'You are an expert content creator who specializes in creating engaging, platform-specific demo content. Always respond with valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.9, // Higher creativity for varied demos
            max_tokens: 800,
            response_format: { type: "json_object" }
          })
        })

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        const data = await response.json()
        const content = data.choices[0].message.content
        
        // Try to parse as direct array first, then as object
        let sentences
        try {
          sentences = JSON.parse(content)
          if (!Array.isArray(sentences)) {
            // If it's an object, try to find the array property
            const keys = Object.keys(sentences)
            const arrayKey = keys.find(key => Array.isArray(sentences[key]))
            if (arrayKey) {
              sentences = sentences[arrayKey]
            }
          }
        } catch (e) {
          console.error('Failed to parse OpenAI response:', e)
          throw new Error('Invalid JSON response from OpenAI')
        }
        
        if (!Array.isArray(sentences) || sentences.length < 20) {
          throw new Error('Invalid response format from OpenAI')
        }
        
        return {
          success: true,
          sentences: sentences.slice(0, 30), // Ensure exactly 30
          generatedBy: 'openai-gpt4'
        }
      } catch (error) {
        console.error('OpenAI demo generation error:', error)
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
        const jsonMatch = text.match(/\[[^\]]*\]/s)
        if (jsonMatch) {
          const sentences = JSON.parse(jsonMatch[0])
          
          if (!Array.isArray(sentences) || sentences.length < 20) {
            throw new Error('Invalid response format from Google AI')
          }
          
          return {
            success: true,
            sentences: sentences.slice(0, 30),
            generatedBy: 'google-gemini'
          }
        }
        
        throw new Error('Failed to parse demo sentences JSON from Google AI')
      } catch (error) {
        console.error('Google AI demo generation error:', error)
        return this.generateFallbackDemos({ description, tone, platforms })
      }
    }

    // If all else fails, use fallback
    return this.generateFallbackDemos({ description, tone, platforms })
  }

  generateFallbackDemos({ description, tone, platforms }) {
    const topicWords = description.toLowerCase().split(' ').slice(0, 3).join(' ')
    
    const baseTemplates = {
      educational: [
        `Learn how to ${topicWords} in just minutes!`,
        `The ultimate guide to ${topicWords} explained simply.`,
        `Everything you need to know about ${topicWords}.`,
        `Master ${topicWords} with this proven method.`,
        `The science behind ${topicWords} will amaze you.`
      ],
      fun: [
        `This ${topicWords} hack will blow your mind!`,
        `Wait until you see this ${topicWords} trick!`,
        `The most fun way to learn ${topicWords}!`,
        `You won't believe what happens with ${topicWords}!`,
        `This ${topicWords} moment is pure comedy gold!`
      ],
      professional: [
        `Professional insights on ${topicWords} you need.`,
        `Industry experts reveal ${topicWords} secrets.`,
        `The business case for ${topicWords} explained.`,
        `Why ${topicWords} matters in today's market.`,
        `Strategic approaches to ${topicWords} success.`
      ],
      inspiring: [
        `Transform your life with ${topicWords} today!`,
        `The ${topicWords} journey that changed everything.`,
        `Believe in the power of ${topicWords}!`,
        `Your ${topicWords} breakthrough moment awaits.`,
        `Rise above with this ${topicWords} mindset.`
      ]
    }

    const platformVariations = {
      tiktok: ['Quick tip:', 'POV:', 'This is why:', 'Fun fact:', 'Real talk:'],
      instagram: ['Swipe for more', 'Save this post', 'Double tap if', 'Story time:', 'Behind the scenes:'],
      youtube: ['In this video:', 'Don\'t forget to subscribe', 'Let me show you', 'Tutorial time:', 'Step by step:']
    }

    const toneTemplates = baseTemplates[tone.toLowerCase()] || baseTemplates.educational
    const sentences = []
    
    // Generate base sentences from templates
    toneTemplates.forEach(template => {
      sentences.push(template)
      // Create variations
      sentences.push(template.replace('you', 'everyone'))
      sentences.push(template.replace('This', 'Here\'s why this'))
    })
    
    // Add platform-specific variations
    platforms.forEach(platform => {
      const variations = platformVariations[platform.toLowerCase()] || ['Check this out:']
      variations.forEach(variation => {
        sentences.push(`${variation} ${topicWords} made simple!`)
        sentences.push(`${variation} the best ${topicWords} tips.`)
      })
    })

    // Add generic engaging sentences
    const genericSentences = [
      `Ready to discover ${topicWords} secrets?`,
      `The ${topicWords} game changer is here!`,
      `Don't miss this ${topicWords} revelation!`,
      `Your ${topicWords} questions answered today!`,
      `The ultimate ${topicWords} experience awaits!`,
      `Join thousands learning ${topicWords} right now!`,
      `This ${topicWords} tip will save your day!`,
      `Unlock the ${topicWords} potential within you!`
    ]
    
    sentences.push(...genericSentences)
    
    // Shuffle and return exactly 30
    const shuffled = sentences.sort(() => Math.random() - 0.5)
    return {
      success: true,
      sentences: shuffled.slice(0, 30),
      generatedBy: 'fallback'
    }
  }
}

export default DemoGenerator