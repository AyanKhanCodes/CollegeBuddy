import './TypingIndicator.css'

export default function TypingIndicator() {
  return (
    <div className="typing-indicator" role="status" aria-live="polite" aria-label="Assistant is typing">
      <span className="typing-indicator__dot" />
      <span className="typing-indicator__dot" />
      <span className="typing-indicator__dot" />
    </div>
  )
}
