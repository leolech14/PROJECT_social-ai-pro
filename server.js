import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3003

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Video Creator API is running' })
})

// Script generation endpoint
app.post('/api/generate-script', async (req, res) => {
  const { description, tone, platforms, duration } = req.body
  
  // Mock script generation
  const script = {
    id: Date.now(),
    content: `Here's your ${tone.toLowerCase()} script for ${platforms.join(', ')} (${duration}s):\n\n"${description}"\n\nThis would be enhanced with AI-powered social media optimization...`,
    tone,
    platforms,
    duration,
    hooks: ['Opening hook', 'Middle hook', 'Closing CTA'],
    scenes: Math.ceil(duration / 10)
  }
  
  res.json({ success: true, script })
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
  const { scriptId, voiceId, media } = req.body
  
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