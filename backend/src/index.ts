import express from 'express'
import cors from 'cors'
import { getDb } from './db/schema'
import authRoutes from './routes/auth'
import menuRoutes from './routes/menu'
import reservationRoutes from './routes/reservations'
import contactRoutes from './routes/contact'

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/contact', contactRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Initialise DB on startup
getDb()

export default app

// Only bind to port when running directly (not imported by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`🫖 Hearth & Grounds API running on http://localhost:${PORT}`)
  })
}
