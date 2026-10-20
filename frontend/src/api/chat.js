export async function sendChatMessage(message, history = []) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      detail = data.detail || data.response || detail
    } catch {
      // keep default detail
    }
    throw new Error(detail)
  }

  const data = await res.json()
  return data.response
}
