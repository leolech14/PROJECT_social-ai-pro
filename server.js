import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import ScriptGenerator from './src/services/scriptGenerator.js'
import VoiceGenerator from './src/services/voiceGenerator.js'
import MediaService from './src/services/mediaService.js'
import AuthService from './src/services/authService.js'
import DemoGenerator from './src/services/demoGenerator.js'
import { authenticateToken, checkVideoLimit, optionalAuth } from './src/middleware/auth.js'
import { apiLimiter, authLimiter, videoGenerationLimiter, scriptGenerationLimiter } from './src/middleware/rateLimiter.js'

dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || process.env.PORT || 4444

// Initialize services
const scriptGenerator = new ScriptGenerator()
const voiceGenerator = new VoiceGenerator()
const mediaService = new MediaService()
const authService = new AuthService()
const demoGenerator = new DemoGenerator()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4445',
  credentials: true
}))
app.use(express.json())

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}))

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter)

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Video Creator API is running' })
})

// Authentication routes
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      })
    }
    
    const result = await authService.createUser({ email, password, name })
    res.json({ success: true, ...result })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }
    
    const result = await authService.loginUser({ email, password })
    res.json({ success: true, ...result })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    })
  }
})

// Script generation endpoint
app.post('/api/generate-script', scriptGenerationLimiter, optionalAuth, async (req, res) => {
  try {
    const { description, tone, platforms, duration } = req.body
    
    // Validate input
    if (!description || !tone || !platforms || !duration) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      })
    }
    
    // Generate script using AI
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

// Get available voices
app.get('/api/voices', async (req, res) => {
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
app.post('/api/generate-demos', async (req, res) => {
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
app.post('/api/voice-preview', async (req, res) => {
  try {
    const { voiceId, demoText, voiceInstruction } = req.body
    
    if (!voiceId || !demoText) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: voiceId, demoText' 
      })
    }
    
    // Limit demo text length for performance
    const limitedText = demoText.slice(0, 200)
    
    const result = await voiceGenerator.generateVoice({
      text: limitedText,
      voiceId,
      scriptId: `demo_${Date.now()}`,
      userId: null, // Demos don't require user
      voiceInstruction,
      isDemo: true // Flag for demo mode
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
app.post('/api/generate-voice', optionalAuth, async (req, res) => {
  try {
    const { scriptId, voiceId, text, voiceInstruction } = req.body
    
    if (!scriptId || !voiceId || !text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      })
    }
    
    // Check if voice requires authentication (premium voices)
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
      voiceInstruction // New 2025 feature for OpenAI voices
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

// Search media endpoint
app.post('/api/search-media', optionalAuth, async (req, res) => {
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

// Video assembly endpoint
app.post('/api/assemble-video', videoGenerationLimiter, authenticateToken, checkVideoLimit, async (req, res) => {
  try {
    const { scriptId, voiceId, mediaIds, musicId, settings } = req.body
    
    if (!scriptId || !voiceId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      })
    }
    
    // In production, this would:
    // 1. Fetch the voice audio file
    // 2. Download selected media files
    // 3. Use FFmpeg to combine everything
    // 4. Upload to cloud storage
    // 5. Return the video URL
    
    // Mock video assembly for now
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
    
    // Increment user's video count
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

// Only listen if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✨ AI Video Creator API running on http://localhost:${PORT}`)
  })
}

export default app