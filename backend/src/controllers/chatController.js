import { env } from '../config/env.js'

export async function postChat(req, res, next) {
  try {
    let agentResponse
    try {
      agentResponse = await fetch(`${env.aiAgentUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.chatInput),
      })
    } catch (error) {
      const agentError = new Error(
        `AI agent is unavailable at ${env.aiAgentUrl}`,
        { cause: error },
      )
      agentError.status = 503
      throw agentError
    }

    const data = await agentResponse.json()
    if (!agentResponse.ok) {
      const error = new Error(data.detail ?? 'AI agent request failed')
      error.status = agentResponse.status
      throw error
    }

    res.json(data)
  } catch (err) {
    next(err)
  }
}
