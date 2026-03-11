import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import GalleryContact from '../pages/GalleryContact'
import * as api from '../services/api'

vi.mock('../services/api')

function renderGallery() {
  return render(<MemoryRouter><GalleryContact /></MemoryRouter>)
}

describe('GalleryContact page — contact form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the contact form', () => {
    renderGallery()
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email@example/i)).toBeInTheDocument()
  })

  it('shows the gallery section heading', () => {
    renderGallery()
    expect(screen.getByText(/a glimpse inside/i)).toBeInTheDocument()
  })

  it('renders the Send Message button', () => {
    renderGallery()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('shows success message after submission', async () => {
    api.sendContactMessage.mockResolvedValue({ success: true, id: 1 })
    const user = userEvent.setup()
    renderGallery()

    await user.type(screen.getByPlaceholderText(/your name/i), 'Andrada')
    await user.type(screen.getByPlaceholderText(/email@example/i), 'andrada@example.com')
    await user.type(screen.getByPlaceholderText(/what.*on your mind/i), 'Looking forward to visiting!')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(api.sendContactMessage).toHaveBeenCalledWith({
        name: 'Andrada',
        email: 'andrada@example.com',
        message: 'Looking forward to visiting!',
      })
    })
  })

  it('shows error message when API fails', async () => {
    api.sendContactMessage.mockRejectedValue(new Error('Server error'))
    const user = userEvent.setup()
    renderGallery()

    await user.type(screen.getByPlaceholderText(/your name/i), 'Andrada')
    await user.type(screen.getByPlaceholderText(/email@example/i), 'andrada@example.com')
    await user.type(screen.getByPlaceholderText(/what.*on your mind/i), 'Test message here')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument()
    })
  })
})
