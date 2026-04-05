import ReactMarkdown from 'react-markdown'
import './MessageBubble.css'

function formatTime(ts) {
  if (ts instanceof Date) return ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (typeof ts === 'string' || typeof ts === 'number') {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return ''
}

const markdownComponents = {
  p: ({ children, ...props }) => (
    <p className="message-bubble__md-block" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="message-bubble__md-list" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="message-bubble__md-list message-bubble__md-list--ordered" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="message-bubble__md-li" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="message-bubble__md-strong" {...props}>
      {children}
    </strong>
  ),
  code: ({ children, ...props }) => (
    <code className="message-bubble__md-code" {...props}>
      {children}
    </code>
  ),
}

/**
 * @param {{ text: string; sender: 'user' | 'bot'; timestamp: Date | string | number }} props
 */
export default function MessageBubble({ text, sender, timestamp }) {
  const isUser = sender === 'user'
  return (
    <article
      className={`message-bubble message-bubble--${sender}`}
      data-sender={sender}
      aria-label={isUser ? 'You' : 'Assistant'}
    >
      <div className="message-bubble__content">
        {isUser ? (
          <p className="message-bubble__text">{text}</p>
        ) : (
          <div className="message-bubble__rich">
            <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
          </div>
        )}
        <time className="message-bubble__time" dateTime={timestamp instanceof Date ? timestamp.toISOString() : String(timestamp)}>
          {formatTime(timestamp)}
        </time>
      </div>
    </article>
  )
}
