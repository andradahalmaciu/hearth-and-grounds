import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AdminLogin from '../pages/admin/AdminLogin'
import { AuthProvider } from '../context/AuthContext'
import * as api from '../services/api'

vi.mock('../services/api')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AdminLogin />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('AdminLogin page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the login form', () => {
    const { container } = renderLogin()
    expect(screen.getByPlaceholderText(/your username/i)).toBeInTheDocument()
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
  })

  it('shows the H&G admin branding', () => {
    renderLogin()
    expect(screen.getByText(/admin/i)).toBeInTheDocument()
  })

  it('renders a sign in button', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error message on failed login', async () => {
    api.login.mockRejectedValue(new Error('Invalid credentials'))
    const user = userEvent.setup()
    const { container } = renderLogin()

    await user.type(screen.getByPlaceholderText(/your username/i), 'admin')
    await user.type(container.querySelector('input[type="password"]'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('calls login API with entered credentials', async () => {
    api.login.mockResolvedValue({ token: 'test-token', username: 'admin' })
    const user = userEvent.setup()
    const { container } = renderLogin()

    await user.type(screen.getByPlaceholderText(/your username/i), 'admin')
    await user.type(container.querySelector('input[type="password"]'), 'hearth2025')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('admin', 'hearth2025')
    })
  })
})
