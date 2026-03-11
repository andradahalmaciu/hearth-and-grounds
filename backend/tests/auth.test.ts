import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/index'
import { getDb } from '../src/db/schema'

// Ensure DB is seeded before tests
beforeAll(() => { getDb() })

describe('POST /api/auth/login', () => {
  it('returns 400 when body is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({})
    expect(res.status).toBe(400)
  })

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' })
    expect(res.status).toBe(401)
    expect(res.body.error).toMatch(/invalid/i)
  })

  it('returns 401 for unknown user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nobody', password: 'pass' })
    expect(res.status).toBe(401)
  })

  it('returns token for correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'hearth2025' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeTruthy()
    expect(res.body.username).toBe('admin')
  })
})
