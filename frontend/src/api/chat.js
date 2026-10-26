async function parseResponse(res) {
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
  return res.json()
}

export async function sendChatMessage(message, history = [], useRetrieval = false, chatId) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, use_retrieval: useRetrieval, chat_id: chatId }),
  })
  const data = await parseResponse(res)
  return data.response
}

export async function uploadDocument(file, chatId) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/documents/index', {
    method: 'POST',
    headers: { 'X-Chat-Id': chatId },
    body: formData,
  })
  return parseResponse(res)
}
