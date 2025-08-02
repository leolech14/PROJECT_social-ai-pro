import request from 'supertest'
import express from 'express'

// Mock the services
jest.mock('../../services/scriptGenerator.js', () => {
  return jest.fn().mockImplementation(() => ({
    generateScript: jest.fn().mockResolvedValue({
      success: true,
      script: {
        id: 1,
        content: 'Test script',
        tone: 'Professional',
        platforms: ['TikTok'],
        duration: 30
      }
    })
  }))
})

jest.mock('../../services/voiceGenerator.js', () => {
  return jest.fn().mockImplementation(() => ({
    getVoices: jest.fn().mockResolvedValue({
      success: true,
      voices: [{ id: 'test', name: 'Test Voice' }]
    }),
    getVoiceInfo: jest.fn().mockResolvedValue({ id: 'test', premium: false }),
    generateVoice: jest.fn().mockResolvedValue({
      success: true,
      voice: { id: 1, audioUrl: '/test.mp3' }
    }),
    getVoiceInfo: jest.fn().mockResolvedValue({ premium: false })
  }))
})

jest.mock('../../services/mediaService.js', () => {
  return jest.fn().mockImplementation(() => ({
    searchVideos: jest.fn().mockResolvedValue({
      success: true,
      videos: [{ id: 'video1', url: '/video.mp4' }]
    })
  }))
})

jest.mock('../../services/authService.js', () => {
  const users = new Map()
  return jest.fn().mockImplementation(() => ({
    createUser: jest.fn(async ({ email, password, name }) => {
      if (users.has(email)) {
        throw new Error('User already exists')
      }
      const user = {
        id: users.size + 1,
        email,
        name,
        password,
        createdAt: new Date(),
        subscription: 'free',
        videosCreated: 0,
        monthlyLimit: 3
      }
      users.set(email, user)
      const { password: _p, ...userWithoutPassword } = user
      return { user: userWithoutPassword, token: 'token-' + user.id }
    }),
    loginUser: jest.fn(async ({ email, password }) => {
      const user = users.get(email)
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials')
      }
      const { password: _p, ...userWithoutPassword } = user
      return { user: userWithoutPassword, token: 'token-' + user.id }
    }),
    getUserById: jest.fn(async (id) => {
      for (const user of users.values()) {
        if (user.id === id) {
          const { password: _p, ...userWithoutPassword } = user
          return userWithoutPassword
        }
      }
      return null
    }),
    incrementVideoCount: jest.fn(async (id) => {
      for (const user of users.values()) {
        if (user.id === id) {
          user.videosCreated += 1
          return user.videosCreated
        }
      }
      throw new Error('User not found')
    }),
    checkVideoLimit: jest.fn(async (id) => {
      for (const user of users.values()) {
        if (user.id === id) {
          const allowed = user.subscription !== 'free' ? true : user.videosCreated < user.monthlyLimit
          const remaining = user.subscription !== 'free' ? -1 : Math.max(0, user.monthlyLimit - user.videosCreated)
          return { allowed, remaining }
        }
      }
      throw new Error('User not found')
    }),
    verifyToken: jest.fn(() => ({ userId: 1, email: 'test@example.com' }))
  }))
})

describe('API Endpoints', () => {
  let app

  beforeEach(async () => {
    // Clear module cache to get fresh instance
    jest.resetModules()
    // Provide a dummy database URL for services that require it
    process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/testdb'
    process.env.SESSION_SECRET = 'test-session-secret'

    // Import server after mocks are set up
    const serverModule = await import('../../../server.js')
    app = serverModule.default
  })

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        status: 'ok',
        message: 'AI Video Creator API is running'
      })
    })
  })

  describe('POST /api/generate-script', () => {
    it('should generate script with valid input', async () => {
      const response = await request(app)
        .post('/api/generate-script')
        .send({
          description: 'Test video',
          tone: 'Professional',
          platforms: ['TikTok'],
          duration: 30
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.script).toBeDefined()
    })

      it('should return validation errors for missing fields', async () => {
        const response = await request(app)
          .post('/api/generate-script')
          .send({
            description: 'Test video'
          })

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Validation error')
        expect(Array.isArray(response.body.details)).toBe(true)
      })
  })

  describe('GET /api/voices', () => {
    it('should return available voices', async () => {
      const response = await request(app).get('/api/voices')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.voices).toHaveLength(1)
    })
  })

  describe('POST /api/generate-voice', () => {
    it('should generate voice with valid input', async () => {
      const response = await request(app)
        .post('/api/generate-voice')
        .send({
          scriptId: 123,
          voiceId: 'test_voice',
          text: 'Test narration'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.voice).toBeDefined()
    })

      it('should return validation errors for missing fields', async () => {
        const response = await request(app)
          .post('/api/generate-voice')
          .send({
            scriptId: 123
          })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Validation error')
        expect(Array.isArray(response.body.details)).toBe(true)
      })
  })

  describe('POST /api/search-media', () => {
    it('should search for videos', async () => {
      const response = await request(app)
        .post('/api/search-media')
        .send({
          query: 'nature',
          type: 'video',
          duration: 30
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.videos).toBeDefined()
    })

      it('should return validation errors for missing query', async () => {
        const response = await request(app)
          .post('/api/search-media')
          .send({
            type: 'video'
          })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Validation error')
        expect(Array.isArray(response.body.details)).toBe(true)
      })
  })

  describe('POST /api/auth/login', () => {
    it('should rate limit repeated successful login attempts', async () => {
      const credentials = { email: 'test@example.com', password: 'password', name: 'Tester' }

      // register user first
      await request(app).post('/api/auth/register').send(credentials)

      // first 5 logins succeed
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/api/auth/login').send({ email: credentials.email, password: credentials.password })
        expect(res.status).toBe(200)
      }

      // 6th attempt should be rate limited
      const limited = await request(app)
        .post('/api/auth/login')
        .send({ email: credentials.email, password: credentials.password })

      expect(limited.status).toBe(429)
      expect(limited.body.success).toBe(false)
    })
  })
})
