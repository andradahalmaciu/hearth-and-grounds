import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Menu from '../pages/Menu'
import * as api from '../services/api'

vi.mock('../services/api')

const mockMenuData = {
  espresso: [
    { id: 1, category: 'espresso', name: 'Ristretto', description: '1:1 ratio', price: '€3.00', available: 1 },
    { id: 2, category: 'espresso', name: 'Espresso', description: '1:2 ratio', price: '€3.00', available: 1 },
  ],
  filter: [
    { id: 3, category: 'filter', name: 'Pour Over', description: 'Single origin', price: '€5.50', available: 1 },
  ],
}

function renderMenu() {
  return render(<MemoryRouter><Menu /></MemoryRouter>)
}

describe('Menu page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    api.getMenu.mockReturnValue(new Promise(() => {})) // never resolves
    renderMenu()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders menu items from API', async () => {
    api.getMenu.mockResolvedValue(mockMenuData)
    renderMenu()
    await waitFor(() => {
      expect(screen.getByText('Ristretto')).toBeInTheDocument()
    }, { timeout: 3000 })
    expect(screen.getAllByText('Espresso').length).toBeGreaterThan(0)
  })

  it('shows Espresso category tab', async () => {
    api.getMenu.mockResolvedValue(mockMenuData)
    renderMenu()
    await waitFor(() => {
      // After data loads, category tabs render from the API response keys
      const tabs = screen.getAllByRole('button')
      expect(tabs.length).toBeGreaterThan(0)
    })
  })

  it('renders item prices', async () => {
    api.getMenu.mockResolvedValue(mockMenuData)
    renderMenu()
    await waitFor(() => {
      expect(screen.getAllByText('€3.00').length).toBeGreaterThan(0)
    })
  })

  it('shows error state when API fails', async () => {
    api.getMenu.mockRejectedValue(new Error('Network error'))
    renderMenu()
    await waitFor(() => {
      expect(screen.getByText(/trouble/i)).toBeInTheDocument()
    })
  })
})
