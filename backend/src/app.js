import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import chatRoutes from './routes/chatRoutes.js'
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

  app.use(healthRoutes)
  app.use('/api', chatRoutes)

  app.use(errorHandler)

  return app
}
