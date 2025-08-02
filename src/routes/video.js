import express from 'express'
import AuthService from '../services/authService.js'
import { authenticateToken, checkVideoLimit } from '../middleware/auth.js'
import { videoGenerationLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()
const authService = new AuthService()

// Video assembly endpoint
router.post('/assemble-video', videoGenerationLimiter, authenticateToken, checkVideoLimit, async (req, res) => {
  try {
    const { scriptId, voiceId, mediaIds, musicId, settings } = req.body

    if (!scriptId || !voiceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    const video = {
      id: Date.now(),
      scriptId,
      voiceId,
      videoUrl: '/api/video/demo.mp4',
      thumbnail: '/api/video/thumbnail.jpg',
      duration: settings?.duration || 30,
      status: 'ready',
      settings,
      userId: req.user.userId
    }

    await authService.incrementVideoCount(req.user.userId)

    res.json({
      success: true,
      video,
      videoLimit: req.videoLimit
    })
  } catch (error) {
    console.error('Video assembly error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to assemble video'
    })
  }
})

export default router
