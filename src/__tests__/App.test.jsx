import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

// Mock fetch
global.fetch = jest.fn()

describe.skip('App Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders the initial stage with title', () => {
    render(<App />)
    
    expect(screen.getByText('AI Video')).toBeInTheDocument()
    expect(screen.getByText('Creator')).toBeInTheDocument()
    expect(screen.getByText('Describe Your Video')).toBeInTheDocument()
  })

  it('shows configuration options when text is entered', async () => {
    render(<App />)
    
    const textarea = screen.getByPlaceholderText('Tell me about the video you want to create...')
    fireEvent.change(textarea, { target: { value: 'Test video content' } })
    
    await waitFor(() => {
      expect(screen.getByText('Tone')).toBeInTheDocument()
      expect(screen.getByText('Platforms')).toBeInTheDocument()
      expect(screen.getByText('Duration')).toBeInTheDocument()
    })
  })

  it('enables generate button when all fields are filled', async () => {
    render(<App />)
    
    // Enter text
    const textarea = screen.getByPlaceholderText('Tell me about the video you want to create...')
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
    const generateButton = screen.getByText('Generate Script')
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
    
    // Fill in required fields
    const textarea = screen.getByPlaceholderText('Tell me about the video you want to create...')
    fireEvent.change(textarea, { target: { value: 'Test video' } })
    
    await waitFor(() => {
      expect(screen.getByText('Tone')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Professional'))
    fireEvent.click(screen.getByText(/TikTok|Tik/i))
    
    // Click generate
    const generateButton = screen.getByText('Generate Script')
    fireEvent.click(generateButton.closest('button'))
    
    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument()
  })

  it('displays stage indicators correctly', () => {
    render(<App />)
    
    const stages = ['Script Creation', 'Voice Selection', 'Video Assembly']
    
    // Check all stages are shown
    stages.forEach((stage, index) => {
      const stageNumber = (index + 1).toString()
      expect(screen.getByText(stageNumber)).toBeInTheDocument()
    })
  })

  it('toggles platform selection', async () => {
    render(<App />)
    
    const textarea = screen.getByPlaceholderText('Tell me about the video you want to create...')
    fireEvent.change(textarea, { target: { value: 'Test' } })
    
    await waitFor(() => {
      expect(screen.getByText('Platforms')).toBeInTheDocument()
    })
    
    const tiktokButton = screen.getAllByText(/TikTok|Tik/i)[0]
    
    // Click to select
    fireEvent.click(tiktokButton)
    expect(tiktokButton.closest('button')).toHaveClass('border-white/30')
    
    // Click to deselect
    fireEvent.click(tiktokButton)
    expect(tiktokButton.closest('button')).not.toHaveClass('border-white/30')
  })
})
