import { useCallback, useRef } from 'react'
import './ChatInput.css'

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

/**
 * @param {{ onSubmit?: (text: string) => void; disabled?: boolean }} props
 */
export default function ChatInput({ onSubmit, disabled = false }) {
  const textareaRef = useRef(null)

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (disabled) return
    const el = textareaRef.current
    const text = el?.value?.trim() ?? ''
    if (!text) return
    onSubmit?.(text)
    if (el) {
      el.value = ''
      resizeTextarea()
    }
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="chat-input__field"
        name="message"
        rows={1}
        placeholder="Message…"
        disabled={disabled}
        onInput={resizeTextarea}
      />
      <button type="submit" className="chat-input__send" aria-label="Send message" disabled={disabled}>
        <SendIcon />
      </button>
    </form>
  )
}
