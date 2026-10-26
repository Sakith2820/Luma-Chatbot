import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import chatRoutes from './routes/chatRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import healthRoutes from './routes/healthRoutes.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use('/api/documents', express.raw({ type: 'multipart/form-data', limit: '25mb' }))

  app.use(healthRoutes)
  app.use('/api', chatRoutes)
  app.use('/api/documents', documentRoutes)

  app.use(errorHandler)

  return app
}
