import express from 'express'
import VoiceGenerator from '../services/voiceGenerator.js'
import DemoGenerator from '../services/demoGenerator.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()
const voiceGenerator = new VoiceGenerator()
const demoGenerator = new DemoGenerator()

// Get available voices
router.get('/voices', async (req, res) => {
  try {
    const result = await voiceGenerator.getVoices()
    res.json(result)
  } catch (error) {
    console.error('Get voices error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voices'
    })
  }
})

// Generate contextual demo sentences for voices
router.post('/generate-demos', async (req, res) => {
  try {
    const { description, tone, platforms, duration } = req.body

    if (!description || !tone || !platforms) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: description, tone, platforms'
      })
    }

    const result = await demoGenerator.generateDemoSentences({
      description,
      tone,
      platforms,
      duration: duration || 30
    })

    res.json(result)
  } catch (error) {
    console.error('Demo generation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate demo sentences'
    })
  }
})

// Generate voice preview with demo text
router.post('/voice-preview', async (req, res) => {
  try {
    const { voiceId, demoText, voiceInstruction } = req.body

    if (!voiceId || !demoText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: voiceId, demoText'
      })
    }

    const limitedText = demoText.slice(0, 200)

    const result = await voiceGenerator.generateVoice({
      text: limitedText,
      voiceId,
      scriptId: `demo_${Date.now()}`,
      userId: null,
      voiceInstruction,
      isDemo: true
    })

    res.json(result)
  } catch (error) {
    console.error('Voice preview error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate voice preview'
    })
  }
})

// Voice generation endpoint
router.post('/generate-voice', optionalAuth, async (req, res) => {
  try {
    const { scriptId, voiceId, text, voiceInstruction } = req.body

    if (!scriptId || !voiceId || !text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    const voiceInfo = await voiceGenerator.getVoiceInfo(voiceId)
    if (voiceInfo.premium && !req.user) {
      return res.status(401).json({
        success: false,
        error: 'Premium voices require authentication'
      })
    }

    const result = await voiceGenerator.generateVoice({
      text,
      voiceId,
      scriptId,
      userId: req.user?.userId,
      voiceInstruction
    })

    res.json(result)
  } catch (error) {
    console.error('Voice generation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate voice'
    })
  }
})

export default router
