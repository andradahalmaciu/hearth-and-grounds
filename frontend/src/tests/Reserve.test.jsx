import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Reserve from '../pages/Reserve'
import * as api from '../services/api'

vi.mock('../services/api')

function renderReserve() {
  return render(<MemoryRouter><Reserve /></MemoryRouter>)
}

async function fillRequiredFields(user, container) {
  await user.type(screen.getByPlaceholderText(/your name/i), 'Andrada')
  await user.type(screen.getByPlaceholderText(/email@example/i), 'a@example.com')
  fireEvent.change(container.querySelector('input[type="date"]'), {
    target: { value: '2025-12-20' },
  })
}

describe('Reserve page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the reservation form', () => {
    renderReserve()
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email@example/i)).toBeInTheDocument()
  })

  it('shows the page heading', () => {
    renderReserve()
    expect(screen.getByText(/reserve a table/i)).toBeInTheDocument()
  })

  it('renders party size selector', () => {
    renderReserve()
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBeGreaterThan(0)
  })

  it('renders time slot selector', () => {
    renderReserve()
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBeGreaterThanOrEqual(2)
  })

  it('calls API on form submission', async () => {
    api.createReservation.mockResolvedValue({
      id: 1, name: 'Andrada', date: '2025-12-20', time: '14:00', party_size: 2, status: 'pending',
    })
    const user = userEvent.setup()
    const { container } = renderReserve()

    await fillRequiredFields(user, container)
    await user.click(screen.getByRole('button', { name: /reserve/i }))

    await waitFor(() => {
      expect(api.createReservation).toHaveBeenCalled()
    })
  })

  it('shows error message on API failure', async () => {
    api.createReservation.mockRejectedValue(new Error('Booking failed'))
    const user = userEvent.setup()
    const { container } = renderReserve()

    await fillRequiredFields(user, container)
    await user.click(screen.getByRole('button', { name: /reserve/i }))

    await waitFor(() => {
      expect(screen.getByText(/booking failed/i)).toBeInTheDocument()
    })
  })
})
