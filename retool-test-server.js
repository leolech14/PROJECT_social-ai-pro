import express from 'express'
import cors from 'cors'
import VoiceGenerator from './src/services/voiceGenerator.js'
import retoolRoutes from './src/routes/retool.js'

const app = express()
const PORT = 4445

// Initialize voice generator
const voiceGenerator = new VoiceGenerator()

// Middleware
app.use(cors({
  origin: ['http://localhost:*', 'https://*.retool.com'],
  credentials: true
}))
app.use(express.json())

// Basic routes
app.get('/api/voices', async (req, res) => {
  const result = await voiceGenerator.getVoices()
  res.json(result)
})

app.post('/api/generate-script', (req, res) => {
  res.json({
    success: true,
    id: Date.now(),
    title: "Test Script",
    hook: "This is a test hook for Retool",
    mainPoints: [
      "Point 1: Compact UI is 40% smaller",
      "Point 2: Google AI Studio voices integrated",
      "Point 3: Retool integration complete"
    ],
    callToAction: "Try it now!",
    duration: req.body.duration || 30
  })
})

app.post('/api/voice-preview', async (req, res) => {
  const { voiceId, demoText } = req.body
  res.json({
    success: true,
    voice: {
      id: Date.now(),
      voiceId,
      audioUrl: "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA",
      duration: 5,
      status: "ready"
    }
  })
})

// Add Retool routes
retoolRoutes(app)

app.listen(PORT, () => {
  console.log(`🚀 Retool Test Server running on http://localhost:${PORT}`)
  console.log(`🔧 Test endpoints:`)
  console.log(`   - http://localhost:${PORT}/api/retool/health`)
  console.log(`   - http://localhost:${PORT}/api/retool/app-data`)
  console.log(`   - http://localhost:${PORT}/api/voices`)
})