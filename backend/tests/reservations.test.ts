import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/index'
import { getDb } from '../src/db/schema'

let token: string

beforeAll(async () => {
  getDb()
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'hearth2025' })
  token = res.body.token
})

const validReservation = {
  name: 'Andrada H',
  email: 'andrada@example.com',
  phone: '+34 600 000 001',
  date: '2025-12-20',
  time: '14:00',
  party_size: 2,
  notes: 'Window seat please',
}

describe('POST /api/reservations', () => {
  it('returns 400 for missing required fields', async () => {
    const res = await request(app).post('/api/reservations').send({ name: 'Only name' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ ...validReservation, email: 'not-an-email' })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid date format', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ ...validReservation, date: '20-12-2025' })
    expect(res.status).toBe(400)
  })

  it('creates a reservation successfully', async () => {
    const res = await request(app).post('/api/reservations').send(validReservation)
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Andrada H')
    expect(res.body.status).toBe('pending')
    expect(res.body.id).toBeTruthy()
  })
})

describe('GET /api/reservations (admin)', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/reservations')
    expect(res.status).toBe(401)
  })

  it('returns list of reservations with token', async () => {
    const res = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('filters by date', async () => {
    const res = await request(app)
      .get('/api/reservations?date=2025-12-20')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.every((r: { date: string }) => r.date === '2025-12-20')).toBe(true)
  })
})

describe('GET /api/reservations/export (admin)', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/reservations/export')
    expect(res.status).toBe(401)
  })

  it('returns CSV with correct headers', async () => {
    const res = await request(app)
      .get('/api/reservations/export')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/csv/)
    expect(res.headers['content-disposition']).toContain('reservations.csv')
    const firstLine = res.text.split('\n')[0]
    expect(firstLine).toBe('id,name,email,phone,date,time,party_size,status,notes,created_at')
  })

  it('includes reservation data rows', async () => {
    await request(app).post('/api/reservations').send(validReservation)
    const res = await request(app)
      .get('/api/reservations/export')
      .set('Authorization', `Bearer ${token}`)
    const lines = res.text.split('\n')
    expect(lines.length).toBeGreaterThan(1)
    expect(lines.some(line => line.includes('Andrada H'))).toBe(true)
  })

  it('filters by date when ?date= is provided', async () => {
    const res = await request(app)
      .get('/api/reservations/export?date=2025-12-20')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const dataLines = res.text.split('\n').slice(1).filter(Boolean)
    expect(dataLines.every(line => line.includes('2025-12-20'))).toBe(true)
  })
})

describe('PATCH /api/reservations/:id (admin)', () => {
  it('updates reservation status to confirmed', async () => {
    const createRes = await request(app).post('/api/reservations').send(validReservation)
    const id = createRes.body.id

    const patchRes = await request(app)
      .patch(`/api/reservations/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'confirmed' })
    expect(patchRes.status).toBe(200)
    expect(patchRes.body.status).toBe('confirmed')
  })

  it('returns 400 for invalid status', async () => {
    const createRes = await request(app).post('/api/reservations').send(validReservation)
    const id = createRes.body.id

    const patchRes = await request(app)
      .patch(`/api/reservations/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'invalid-status' })
    expect(patchRes.status).toBe(400)
  })
})
