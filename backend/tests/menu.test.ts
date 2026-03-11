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

describe('GET /api/menu', () => {
  it('returns grouped menu items', async () => {
    const res = await request(app).get('/api/menu')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('espresso')
    expect(Array.isArray(res.body.espresso)).toBe(true)
    expect(res.body.espresso.length).toBeGreaterThan(0)
  })

  it('includes required fields on items', async () => {
    const res = await request(app).get('/api/menu')
    const item = res.body.espresso[0]
    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('price')
    expect(item).toHaveProperty('description')
  })
})

describe('GET /api/menu/all (admin)', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/menu/all')
    expect(res.status).toBe(401)
  })

  it('returns all items with valid token', async () => {
    const res = await request(app)
      .get('/api/menu/all')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})

describe('POST /api/menu (admin)', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/menu').send({ name: 'Test' })
    expect(res.status).toBe(401)
  })

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Incomplete' })
    expect(res.status).toBe(400)
  })

  it('creates a new menu item', async () => {
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'filter', name: 'Test Brew', description: 'A test', price: '€4.00', available: 1, position: 99 })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('Test Brew')
    expect(res.body.id).toBeTruthy()
  })
})

describe('PUT /api/menu/:id (admin)', () => {
  it('updates an existing item', async () => {
    // First create
    const createRes = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'food', name: 'Edit Me', description: 'Before', price: '€5.00', available: 1, position: 0 })
    const id = createRes.body.id

    const updateRes = await request(app)
      .put(`/api/menu/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Edited Name', price: '€6.00' })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.name).toBe('Edited Name')
    expect(updateRes.body.price).toBe('€6.00')
  })
})

describe('DELETE /api/menu/:id (admin)', () => {
  it('deletes an item', async () => {
    const createRes = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'pottery', name: 'Delete Me', description: '', price: '€1.00', available: 1, position: 0 })
    const id = createRes.body.id

    const deleteRes = await request(app)
      .delete(`/api/menu/${id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(deleteRes.status).toBe(204)

    const getRes = await request(app)
      .get('/api/menu/all')
      .set('Authorization', `Bearer ${token}`)
    const ids = getRes.body.map((i: { id: number }) => i.id)
    expect(ids).not.toContain(id)
  })
})
