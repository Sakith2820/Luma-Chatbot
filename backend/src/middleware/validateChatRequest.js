export function validateChatRequest(req, _res, next) {
  const { message, history } = req.body ?? {}

  if (typeof message !== 'string' || !message.trim()) {
    const err = new Error('message is required')
    err.status = 422
    return next(err)
  }

  if (history !== undefined && !Array.isArray(history)) {
    const err = new Error('history must be an array')
    err.status = 422
    return next(err)
  }

  if (Array.isArray(history)) {
    for (const item of history) {
      if (
        !item ||
        typeof item !== 'object' ||
        (item.role !== 'user' && item.role !== 'assistant') ||
        typeof item.content !== 'string'
      ) {
        const err = new Error(
          'each history item must have role (user|assistant) and content (string)',
        )
        err.status = 422
        return next(err)
      }
    }
  }

  req.chatInput = {
    message: message.trim(),
    history: history ?? [],
  }
  next()
}
