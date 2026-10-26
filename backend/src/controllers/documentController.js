import { env } from '../config/env.js'

async function readAgentResponse(response) {
  const body = await response.text()
  let data
  try {
    data = JSON.parse(body)
  } catch {
    const error = new Error(body || 'Document request failed')
    error.status = response.status
    throw error
  }
  if (!response.ok) {
    const error = new Error(data.detail ?? 'Document request failed')
    error.status = response.status
    throw error
  }
  return data
}

export async function getDocumentStatus(req, res, next) {
  try {
    const response = await fetch(`${env.aiAgentUrl}/documents/status`, {
      headers: { 'X-Chat-Id': req.headers['x-chat-id'] },
    })
    res.json(await readAgentResponse(response))
  } catch (err) {
    next(err)
  }
}

export async function uploadDocument(req, res, next) {
  try {
    if (!req.body?.length) {
      const error = new Error('PDF file is required')
      error.status = 422
      throw error
    }
    if (!req.headers['x-chat-id']) {
      const error = new Error('chat id is required')
      error.status = 422
      throw error
    }

    const response = await fetch(`${env.aiAgentUrl}/documents/index`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
        'X-Chat-Id': req.headers['x-chat-id'],
      },
      body: req.body,
    })
    res.json(await readAgentResponse(response))
  } catch (err) {
    next(err)
  }
}
