import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import { apiLimiter, authLimiter } from './src/middleware/rateLimiter.js'
import authRoutes from './src/routes/auth.js'
import scriptRoutes from './src/routes/script.js'
import voiceRoutes from './src/routes/voice.js'
import mediaRoutes from './src/routes/media.js'
import videoRoutes from './src/routes/video.js'

dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || process.env.PORT || 4444

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

// Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Video Creator API is running' })
})

// Mount routers with appropriate middleware
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api', scriptRoutes)
app.use('/api', voiceRoutes)
app.use('/api', mediaRoutes)
app.use('/api', videoRoutes)

// Only listen if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✨ AI Video Creator API running on http://localhost:${PORT}`)
  })
}

export default app
