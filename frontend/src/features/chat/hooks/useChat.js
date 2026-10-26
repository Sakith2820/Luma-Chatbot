import { useEffect, useRef, useState } from 'react'
import { sendChatMessage, uploadDocument } from '../../../api/chat'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [useRetrieval, setUseRetrieval] = useState(false)
  const [chatId, setChatId] = useState(() => crypto.randomUUID())
  const scrollerRef = useRef(null)
  const empty = messages.length === 0

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(text = draft, file = null) {
    const message = text.trim()
    if ((!message && !file) || loading) return

    setError('')
    setDraft('')
    const history = messages.map(({ role, content }) => ({ role, content }))
    if (message) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          attachment: file ? { name: file.name, type: file.type } : null,
        },
      ])
    } else if (file) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: '',
          attachment: { name: file.name, type: file.type },
        },
      ])
    }
    setLoading(true)

    try {
      let documentResult
      if (file) {
        documentResult = await uploadDocument(file, chatId)
        setUseRetrieval(true)
      }
      if (message) {
        const response = await sendChatMessage(
          message,
          history,
          useRetrieval || Boolean(file),
          chatId,
        )
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: response, attachment: null },
        ])
      } else if (documentResult?.summary) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: documentResult.summary,
            attachment: null,
          },
        ])
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setMessages([])
    setError('')
    setDraft('')
    setUseRetrieval(false)
    setChatId(crypto.randomUUID())
  }

  return {
    messages,
    draft,
    setDraft,
    loading,
    error,
    empty,
    scrollerRef,
    handleSend,
    clearChat,
  }
}
