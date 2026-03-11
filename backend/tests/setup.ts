import { afterAll } from 'vitest'
import { closeDb } from '../src/db/schema'

// Use an in-memory DB for tests
process.env.DB_PATH = ':memory:'
process.env.JWT_SECRET = 'test-secret'

afterAll(() => {
  closeDb()
})
