import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App'

// Mock fetch
global.fetch = jest.fn()

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockReset()
  })

  it('renders hero heading', () => {
    render(<App />)
    expect(screen.getByText('Social Media Science')).toBeInTheDocument()
  })

  it('displays an error notification when script generation fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, error: 'Test error' })
    })

    render(<App />)

    fireEvent.click(screen.getByText('Start Creating'))

    const textarea = await screen.findByPlaceholderText('e.g., How to make perfect coffee at home')
    fireEvent.change(textarea, { target: { value: 'Test video' } })

    const toneButton = await screen.findByText('Professional')
    fireEvent.click(toneButton)

    const platformButton = await screen.findByText(/TikTok|Tik/i)
    fireEvent.click(platformButton)

    const generateButton = screen.getByText('Generate Smart Script')
    fireEvent.click(generateButton.closest('button'))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to generate script: Test error')
    })
  })
})
