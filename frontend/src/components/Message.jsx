import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function Message({ role, content, attachment, animate }) {
  const isUser = role === 'user'

  return (
    <article
      className={`message ${isUser ? 'message--user' : 'message--assistant'} ${animate ? 'message--in' : ''}`}
    >
      <div className="message__meta">
        <span className="message__role">{isUser ? 'You' : 'Lumen'}</span>
      </div>
      {attachment && (
        <div className="message__attachment">
          <span className="message__attachment-icon" aria-hidden="true">PDF</span>
          <span>{attachment.name}</span>
        </div>
      )}
      {isUser ? (
        content && <div className="message__body message__body--plain">{content}</div>
      ) : (
        <div className="message__body markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </article>
  )
}

export default Message
