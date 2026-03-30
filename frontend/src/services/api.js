const BASE = '/api'

function getToken() {
  return localStorage.getItem('hg_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = res.status !== 204 ? await res.json().catch(() => null) : null
  if (!res.ok) throw Object.assign(new Error(data?.error || 'Request failed'), { status: res.status, data })
  return data
}

// Auth
export const login = (username, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })

// Menu (public)
export const getMenu = () => request('/menu')

// Menu (admin)
export const getMenuAll = () => request('/menu/all')
export const createMenuItem = (item) =>
  request('/menu', { method: 'POST', body: JSON.stringify(item) })
export const updateMenuItem = (id, item) =>
  request(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(item) })
export const deleteMenuItem = (id) =>
  request(`/menu/${id}`, { method: 'DELETE' })

// Reservations (public)
export const createReservation = (data) =>
  request('/reservations', { method: 'POST', body: JSON.stringify(data) })

// Reservations (admin)
export const getReservations = (date) =>
  request(`/reservations${date ? `?date=${date}` : ''}`)
export const updateReservationStatus = (id, status) =>
  request(`/reservations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const fetchReservationsCsvBlob = async (date) => {
  const token = getToken()
  const url = `${BASE}/reservations/export${date ? `?date=${date}` : ''}`
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}

// Contact (public)
export const sendContactMessage = (data) =>
  request('/contact', { method: 'POST', body: JSON.stringify(data) })

// Contact (admin)
export const getContactMessages = () => request('/contact')
export const markMessageRead = (id) =>
  request(`/contact/${id}/read`, { method: 'PATCH' })
