import { STARTERS } from './features/chat/constants'
import { useChat } from './features/chat/hooks/useChat'
import Composer from './components/Composer'
import Message from './components/Message'
import TypingIndicator from './components/TypingIndicator'
import './App.css'

function App() {
  const {
    messages,
    draft,
    setDraft,
    loading,
    error,
    empty,
    scrollerRef,
    handleSend,
    clearChat,
  } = useChat()

  return (
    <div className={`shell ${empty ? 'shell--empty' : ''}`}>
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb--a" />
        <div className="orb orb--b" />
        <div className="grain" />
      </div>

      <header className="topbar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">Lumen</span>
        </div>
        {!empty && (
          <button type="button" className="ghost-btn" onClick={clearChat}>
            New chat
          </button>
        )}
      </header>
      <main className="stage">
        {empty ? (
          <section className="hero">
            <p className="hero__eyebrow">Conversational AI</p>
            <h1 className="hero__title">Lumen</h1>
            <p className="hero__copy">
              Ask anything. Sharp answers, calm interface, zero clutter.
            </p>
            <div className="starters">
              {STARTERS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="starter"
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="thread" ref={scrollerRef}>
            {messages.map((msg) => (
              <Message
                key={msg.id}
                role={msg.role}
                content={msg.content}
                attachment={msg.attachment}
                animate
              />
            ))}
            {loading && (
              <div className="message message--assistant message--in">
                <div className="message__meta">
                  <span className="message__role">Lumen</span>
                </div>
                <TypingIndicator />
              </div>
            )}
          </section>
        )}

        <div className="dock">
          {error && <p className="error">{error}</p>}
          <Composer
            value={draft}
            onChange={setDraft}
            onSubmit={(file) => handleSend(draft, file)}
            disabled={loading}
          />
        </div>
      </main>
    </div>
  )
}

export default App
