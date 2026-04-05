import { useCallback, useRef } from 'react'
import './ChatInput.css'

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
        placeholder="ask anything"
        disabled={disabled}
        onInput={resizeTextarea}
      />
      <button type="submit" className="chat-input__send" aria-label="Send message" disabled={disabled}>
        -&gt;
      </button>
    </form>
  )
}
