class MediaService {
  constructor() {
    this.pexelsApiKey = process.env.PEXELS_API_KEY
    this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY
    this.mockMode = !this.pexelsApiKey && !this.unsplashAccessKey
    
    if (this.mockMode) {
      console.warn('Media API keys not set, using mock mode')
    }
  }

  async searchVideos(query, duration = 30) {
    if (this.mockMode) {
      return this.getMockVideos(query, duration)
    }

    try {
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10&min_duration=${Math.max(10, duration - 10)}&max_duration=${duration + 10}`,
        {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        videos: data.videos.map(video => ({
          id: video.id,
          url: video.video_files[0].link,
          thumbnail: video.image,
          duration: video.duration,
          width: video.width,
          height: video.height,
          user: video.user.name
        }))
      }
    } catch (error) {
      console.error('Video search error:', error)
      return {
        success: false,
        error: error.message,
        videos: this.getMockVideos(query, duration).videos
      }
    }
  }

  async searchImages(query, count = 5) {
    if (this.mockMode) {
      return this.getMockImages(query, count)
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}`,
        {
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        images: data.results.map(image => ({
          id: image.id,
          url: image.urls.regular,
          thumbnail: image.urls.thumb,
          width: image.width,
          height: image.height,
          description: image.description || image.alt_description,
          user: image.user.name
        }))
      }
    } catch (error) {
      console.error('Image search error:', error)
      return {
        success: false,
        error: error.message,
        images: this.getMockImages(query, count).images
      }
    }
  }

  async getBackgroundMusic(mood = 'upbeat') {
    // In production, integrate with a music API
    // For now, return mock music options
    return {
      success: true,
      tracks: [
        {
          id: 'upbeat_1',
          name: 'Energetic Pop',
          mood: 'upbeat',
          duration: 120,
          preview_url: '/api/music/upbeat_1.mp3',
          bpm: 128
        },
        {
          id: 'chill_1',
          name: 'Relaxed Vibes',
          mood: 'chill',
          duration: 150,
          preview_url: '/api/music/chill_1.mp3',
          bpm: 90
        },
        {
          id: 'epic_1',
          name: 'Cinematic Orchestra',
          mood: 'epic',
          duration: 180,
          preview_url: '/api/music/epic_1.mp3',
          bpm: 140
        }
      ].filter(track => mood === 'all' || track.mood === mood)
    }
  }

  getMockVideos(query, duration) {
    return {
      success: true,
      videos: [
        {
          id: 'mock_1',
          url: 'https://example.com/video1.mp4',
          thumbnail: 'https://via.placeholder.com/640x360',
          duration: duration,
          width: 1920,
          height: 1080,
          user: 'Mock Creator'
        },
        {
          id: 'mock_2',
          url: 'https://example.com/video2.mp4',
          thumbnail: 'https://via.placeholder.com/640x360',
          duration: duration - 5,
          width: 1920,
          height: 1080,
          user: 'Mock Creator'
        }
      ]
    }
  }

  getMockImages(query, count) {
    const images = []
    for (let i = 0; i < count; i++) {
      images.push({
        id: `mock_img_${i}`,
        url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(query)}`,
        thumbnail: `https://via.placeholder.com/200x150?text=${encodeURIComponent(query)}`,
        width: 800,
        height: 600,
        description: `Mock image for ${query}`,
        user: 'Mock Photographer'
      })
    }
    return { success: true, images }
  }
}

export default MediaService