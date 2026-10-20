function messageFromError(err) {
  if (err?.error?.error?.message) {
    return err.error.error.message
  }
  return err.message ?? 'Internal server error'
}

export function errorHandler(err, _req, res, _next) {
  console.error(err)
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500
  res.status(status).json({
    detail: messageFromError(err),
  })
}
