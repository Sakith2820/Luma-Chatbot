import { useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../../../api/chat'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollerRef = useRef(null)
  const empty = messages.length === 0

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(text = draft) {
    const message = text.trim()
    if (!message || loading) return

    setError('')
    setDraft('')
    const history = messages.map(({ role, content }) => ({ role, content }))
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: message },
    ])
    setLoading(true)

    try {
      const response = await sendChatMessage(message, history)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: response },
      ])
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
