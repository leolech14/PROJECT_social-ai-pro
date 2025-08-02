import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ScriptGenerator from './src/services/scriptGenerator.js'

dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3003

// Initialize services
const scriptGenerator = new ScriptGenerator()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Video Creator API is running' })
})

// Script generation endpoint
app.post('/api/generate-script', async (req, res) => {
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

// Voice generation endpoint
app.post('/api/generate-voice', async (req, res) => {
  const { scriptId, voiceId } = req.body
  
  // Mock voice generation
  const voice = {
    id: Date.now(),
    scriptId,
    voiceId,
    audioUrl: '/api/audio/demo.mp3',
    duration: 30,
    status: 'ready'
  }
  
  res.json({ success: true, voice })
})

// Video assembly endpoint
app.post('/api/assemble-video', async (req, res) => {
  const { scriptId, voiceId, media: _media } = req.body
  
  // Mock video assembly
  const video = {
    id: Date.now(),
    scriptId,
    voiceId,
    videoUrl: '/api/video/demo.mp4',
    thumbnail: '/api/video/thumbnail.jpg',
    duration: 30,
    status: 'ready'
  }
  
  res.json({ success: true, video })
})

// Only listen if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✨ AI Video Creator API running on http://localhost:${PORT}`)
  })
}

export default app