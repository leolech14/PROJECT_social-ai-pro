import express from 'express'
import ScriptGenerator from '../services/scriptGenerator.js'
import { optionalAuth } from '../middleware/auth.js'
import { scriptGenerationLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()
const scriptGenerator = new ScriptGenerator()

// Script generation endpoint
router.post('/generate-script', scriptGenerationLimiter, optionalAuth, async (req, res) => {
  try {
    const { description, tone, platforms, duration } = req.body

    if (!description || !tone || !platforms || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    const result = await scriptGenerator.generateScript({
      description,
      tone,
      platforms,
      duration
    })

    res.json(result)
  } catch (error) {
    console.error('Script generation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate script'
    })
  }
})

export default router
