import { useEffect, useRef, useState } from 'react'

function Composer({ value, onChange, onSubmit, disabled }) {
  const ref = useRef(null)
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function handleFileChange(e) {
    setSelectedFile(e.target.files?.[0] ?? null)
  }

  async function submit(file = selectedFile) {
    await onSubmit(file)
    if (file === selectedFile) {
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <form
      className="composer"
      onSubmit={async (e) => {
        e.preventDefault()
        await submit()
      }}
    >
      <label className="composer__label" htmlFor="chat-input">
        Message
      </label>
      <div className="composer__shell">
        <button
          type="button"
          className="composer__attach"
          aria-label="Attach a file"
          title="Attach a file"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m20.5 11.5-7.9 7.9a5 5 0 0 1-7.1-7.1l8.5-8.5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-2.8-2.8l7.6-7.6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          className="composer__file-input"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <textarea
          id="chat-input"
          ref={ref}
          className={`composer__input ${selectedFile ? 'composer__input--with-file' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          rows={1}
          disabled={disabled}
        />
        {selectedFile && (
          <div className="composer__file-chip" title={selectedFile.name}>
            <span className="composer__file-icon" aria-hidden="true">PDF</span>
            <span className="composer__file-name">{selectedFile.name}</span>
            <button
              type="button"
              className="composer__file-remove"
              aria-label={`Remove ${selectedFile.name}`}
              onClick={() => {
                setSelectedFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
            >
              ×
            </button>
          </div>
        )}
        <button
          type="submit"
          className="composer__send"
          disabled={disabled || (!value.trim() && !selectedFile)}
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
