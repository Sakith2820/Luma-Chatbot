import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')

dotenv.config({ path: path.join(repoRoot, '.env') })

export const env = {
  port: Number(process.env.PORT) || 8000,
  aiAgentUrl: process.env.AI_AGENT_URL ?? 'http://127.0.0.1:8001',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigins: (
    process.env.CORS_ORIGINS ??
    'http://localhost:5173,http://127.0.0.1:5173'
  )
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
}
