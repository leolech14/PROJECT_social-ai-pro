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
    generateVoice: jest.fn().mockResolvedValue({
      success: true,
      voice: { id: 1, audioUrl: '/test.mp3' }
    })
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

describe.skip('API Endpoints', () => {
  let app

  beforeEach(async () => {
    // Clear module cache to get fresh instance
    jest.resetModules()
    
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

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/generate-script')
        .send({
          description: 'Test video'
          // Missing required fields
        })
      
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Missing required fields')
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

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/generate-voice')
        .send({
          scriptId: 123
          // Missing voiceId and text
        })
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Missing required fields')
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

    it('should return 400 for missing query', async () => {
      const response = await request(app)
        .post('/api/search-media')
        .send({
          type: 'video'
        })
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Query is required')
    })
  })
})