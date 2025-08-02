import express from 'express'
import AuthService from '../services/authService.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const authService = new AuthService()

// Register a new user
router.post('/register', async (req, res) => {
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

// Login a user
router.post('/login', async (req, res) => {
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

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
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

export default router
