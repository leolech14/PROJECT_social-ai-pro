import express from 'express'
import MediaService from '../services/mediaService.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()
const mediaService = new MediaService()

// Search media endpoint
router.post('/search-media', optionalAuth, async (req, res) => {
  try {
    const { query, type = 'video', duration, count } = req.body

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      })
    }

    let result
    if (type === 'video') {
      result = await mediaService.searchVideos(query, duration)
    } else if (type === 'image') {
      result = await mediaService.searchImages(query, count)
    } else if (type === 'music') {
      result = await mediaService.getBackgroundMusic(query)
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid media type'
      })
    }

    res.json(result)
  } catch (error) {
    console.error('Media search error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search media'
    })
  }
})

export default router
