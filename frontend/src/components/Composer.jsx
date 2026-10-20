import { useEffect, useRef } from 'react'

function Composer({ value, onChange, onSubmit, disabled }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <form
      className="composer"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <label className="composer__label" htmlFor="chat-input">
        Message
      </label>
      <div className="composer__shell">
        <textarea
          id="chat-input"
          ref={ref}
          className="composer__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          className="composer__send"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M3.5 10h13M11 4.5 16.5 10 11 15.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className="composer__hint">Enter to send · Shift+Enter for a new line</p>
    </form>
  )
}

export default Composer
