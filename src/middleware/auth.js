import AuthService from '../services/authService.js'

const authService = new AuthService()

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    })
  }

  const decoded = authService.verifyToken(token)
  if (!decoded) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid token' 
    })
  }

  req.user = decoded
  next()
}

export const checkVideoLimit = async (req, res, next) => {
  try {
    const { allowed, remaining } = await authService.checkVideoLimit(req.user.userId)
    
    if (!allowed) {
      return res.status(403).json({
        success: false,
        error: 'Monthly video limit reached',
        upgradeUrl: '/pricing'
      })
    }

    req.videoLimit = { allowed, remaining }
    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check video limit'
    })
  }
}

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    const decoded = authService.verifyToken(token)
    if (decoded) {
      req.user = decoded
    }
  }

  next()
}