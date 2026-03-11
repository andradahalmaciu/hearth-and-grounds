import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/index'
import { getDb } from '../src/db/schema'

let token: string
let messageId: number

beforeAll(async () => {
  getDb()
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'hearth2025' })
  token = res.body.token
})

describe('POST /api/contact', () => {
  it('returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Test' })
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test', email: 'bad-email', message: 'Hello there!' })
    expect(res.status).toBe(400)
  })

  it('returns 400 for message too short', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test', email: 'a@b.com', message: 'Hi' })
    expect(res.status).toBe(400)
  })

  it('creates a contact message successfully', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Andrada',
      email: 'andrada@example.com',
      message: 'Looking forward to visiting your café!',
    })
    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.id).toBeTruthy()
    messageId = res.body.id
  })
})

describe('GET /api/contact (admin)', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/contact')
    expect(res.status).toBe(401)
  })

  it('returns messages with valid token', async () => {
    const res = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('unread messages appear first', async () => {
    const res = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${token}`)
    const unreadFirst = res.body.findIndex((m: { read: number }) => m.read === 0)
    const readFirst = res.body.findIndex((m: { read: number }) => m.read === 1)
    if (unreadFirst !== -1 && readFirst !== -1) {
      expect(unreadFirst).toBeLessThan(readFirst)
    }
  })
})

describe('PATCH /api/contact/:id/read (admin)', () => {
  it('marks a message as read', async () => {
    const patchRes = await request(app)
      .patch(`/api/contact/${messageId}/read`)
      .set('Authorization', `Bearer ${token}`)
    expect(patchRes.status).toBe(200)
    expect(patchRes.body.success).toBe(true)

    // Verify it's now read
    const getRes = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${token}`)
    const msg = getRes.body.find((m: { id: number }) => m.id === messageId)
    expect(msg.read).toBe(1)
  })

  it('returns 404 for unknown message id', async () => {
    const res = await request(app)
      .patch('/api/contact/99999/read')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})
