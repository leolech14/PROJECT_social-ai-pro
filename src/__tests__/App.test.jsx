import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

// Mock fetch
global.fetch = jest.fn()

// Mock VoiceSelection to avoid complex dependencies in tests
jest.mock('../components/VoiceSelection.jsx', () => {
  const React = require('react')
  return () => React.createElement('div', { 'data-testid': 'voice-selector' })
})

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders the initial hero screen', () => {
    render(<App />)

    expect(screen.getByText('Social Media Science')).toBeInTheDocument()
    expect(screen.getByText('Start Creating')).toBeInTheDocument()
  })

  it('shows configuration options when text is entered', async () => {
    render(<App />)

    fireEvent.click(screen.getByText('Start Creating'))
    const textarea = screen.getByPlaceholderText('e.g., How to make perfect coffee at home')
    fireEvent.change(textarea, { target: { value: 'Test video content' } })
    
    await waitFor(() => {
      expect(screen.getByText('Tone')).toBeInTheDocument()
      expect(screen.getByText('Platforms')).toBeInTheDocument()
      expect(screen.getByText('Duration')).toBeInTheDocument()
    })
  })

  it('enables generate button when all fields are filled', async () => {
    render(<App />)

    fireEvent.click(screen.getByText('Start Creating'))

    // Enter text
    const textarea = screen.getByPlaceholderText('e.g., How to make perfect coffee at home')
    fireEvent.change(textarea, { target: { value: 'Test video' } })
    
    // Wait for config to show
    await waitFor(() => {
      expect(screen.getByText('Tone')).toBeInTheDocument()
    })
    
    // Select tone
    const professionalButton = screen.getByText('Professional')
    fireEvent.click(professionalButton)
    
    // Select platform
    const tiktokButton = screen.getByText(/TikTok|Tik/i)
    fireEvent.click(tiktokButton)
    
    // Check button is enabled
    const generateButton = screen.getByText('Generate Smart Script')
    expect(generateButton.closest('button')).not.toBeDisabled()
  })

  it('shows loading state when generating script', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        script: {
          id: 1,
          content: 'Generated script',
          hook: 'Great hook',
          scenes: [],
          cta: 'Follow us',
          hashtags: ['#test']
        }
      })
    })

    render(<App />)

    fireEvent.click(screen.getByText('Start Creating'))

    // Fill in required fields
    const textarea = screen.getByPlaceholderText('e.g., How to make perfect coffee at home')
    fireEvent.change(textarea, { target: { value: 'Test video' } })
    
    await waitFor(() => {
      expect(screen.getByText('Tone')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Professional'))
    fireEvent.click(screen.getByText(/TikTok|Tik/i))
    
    // Click generate
    const generateButton = screen.getByText('Generate Smart Script')
    fireEvent.click(generateButton.closest('button'))
    
    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument()
  })

  it('displays stage indicators correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        script: {
          id: 1,
          content: 'Generated script',
          tone: 'Professional',
          duration: 30,
          platforms: ['TikTok']
        }
      })
    })

    render(<App />)

    fireEvent.click(screen.getByText('Start Creating'))
    const textarea = screen.getByPlaceholderText('e.g., How to make perfect coffee at home')
    fireEvent.change(textarea, { target: { value: 'Test video' } })
    await waitFor(() => expect(screen.getByText('Tone')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Professional'))
    fireEvent.click(screen.getByText(/TikTok|Tik/i))
    fireEvent.click(screen.getByText('Generate Smart Script'))

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('toggles platform selection', async () => {
    render(<App />)

    fireEvent.click(screen.getByText('Start Creating'))

    const textarea = screen.getByPlaceholderText('e.g., How to make perfect coffee at home')
    fireEvent.change(textarea, { target: { value: 'Test' } })
    
    await waitFor(() => {
      expect(screen.getByText('Platforms')).toBeInTheDocument()
    })
    
    const getTiktokButton = () => screen.getByRole('button', { name: /TikTok|Tik/i })

    // Click to select
    fireEvent.click(getTiktokButton())
    await waitFor(() =>
      expect(getTiktokButton()).toHaveClass('border-white/30')
    )

    // Click to deselect
    fireEvent.click(getTiktokButton())
    await waitFor(() =>
      expect(getTiktokButton()).not.toHaveClass('border-white/30')
    )
  })
})