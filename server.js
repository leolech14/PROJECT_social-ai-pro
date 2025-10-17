import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import ScriptGenerator from './src/services/scriptGenerator.js'
import VoiceGenerator from './src/services/voiceGenerator.js'
import MediaService from './src/services/mediaService.js'
import AuthService from './src/services/authService.js'
import DemoGenerator from './src/services/demoGenerator.js'
import { authenticateToken, checkVideoLimit, optionalAuth } from './src/middleware/auth.js'
import retoolRoutes from './src/routes/retool.js'
import {
  apiLimiter,
  authLimiter,
  loginLimiter,
  videoGenerationLimiter,
  scriptGenerationLimiter
} from './src/middleware/rateLimiter.js'
import validate from './src/middleware/validate.js'
import {
  registerSchema,
  loginSchema,
  generateScriptSchema,
  generateDemosSchema,
  voicePreviewSchema,
  generateVoiceSchema,
  searchMediaSchema,
  assembleVideoSchema
} from './src/validation/schemas.js'

dotenv.config()

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required')
}

const app = express()
const PORT = process.env.BACKEND_PORT || process.env.PORT || 4444

const pgSession = connectPgSimple(session)

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
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
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
app.post('/api/auth/register', authLimiter, validate(registerSchema), async (req, res) => {
  try {
    const { email, password, name } = req.body
    const result = await authService.createUser({ email, password, name })
    res.json({ success: true, ...result })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
})

app.post('/api/auth/login', loginLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body
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
app.post('/api/generate-script', scriptGenerationLimiter, optionalAuth, validate(generateScriptSchema), async (req, res) => {
  try {
    const { description, tone, platforms, duration } = req.body

    // Generate script using AI
    const result = await scriptGenerator.generateScript({
      description,
      tone,
      platforms,
      duration,
      userId: req.user?.userId
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

app.post('/api/generate-demos', validate(generateDemosSchema), async (req, res) => {
  try {
    const { description, tone, platforms, duration } = req.body
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

app.post('/api/voice-preview', validate(voicePreviewSchema), async (req, res) => {
  try {
    const { voiceId, demoText, voiceInstruction } = req.body
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

// Voice generation endpoint
app.post('/api/generate-voice', optionalAuth, validate(generateVoiceSchema), async (req, res) => {
  try {
    const { scriptId, voiceId, text, voiceInstruction } = req.body

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
app.post('/api/search-media', optionalAuth, validate(searchMediaSchema), async (req, res) => {
  try {
    const { query, type, duration, count } = req.body

    let result
    if (type === 'video') {
      result = await mediaService.searchVideos(query, duration)
    } else if (type === 'image') {
      result = await mediaService.searchImages(query, count)
    } else {
      result = await mediaService.getBackgroundMusic(query)
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

// Retool-specific routes
retoolRoutes(app)

// Video assembly endpoint
app.post('/api/assemble-video', videoGenerationLimiter, authenticateToken, checkVideoLimit, validate(assembleVideoSchema), async (req, res) => {
  try {
    const { scriptId, voiceId, mediaIds, musicId, settings } = req.body

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
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✨ AI Video Creator API running on http://localhost:${PORT}`)
  })
}

export default app

