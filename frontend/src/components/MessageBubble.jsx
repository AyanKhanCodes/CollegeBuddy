function formatTime(ts) {
  if (ts instanceof Date) return ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (typeof ts === 'string' || typeof ts === 'number') {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return ''
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
        <p className="message-bubble__text">{text}</p>
        <time className="message-bubble__time" dateTime={timestamp instanceof Date ? timestamp.toISOString() : String(timestamp)}>
          {formatTime(timestamp)}
        </time>
      </div>
    </article>
  )
}
