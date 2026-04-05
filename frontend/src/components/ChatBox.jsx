import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ChatInput from './ChatInput.jsx'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import { parseBotReply, sendChatMessage } from '../services/chatApi.js'
import './ChatBox.css'

function createMessage(text, sender) {
  return {
    id: crypto.randomUUID(),
    text,
    sender,
    timestamp: new Date(),
  }
}

export default function ChatBox() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesRef = useRef(null)

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  const handleUserSubmit = async (text) => {
    setMessages((prev) => [...prev, createMessage(text, 'user')])
    setIsLoading(true)
    try {
      const data = await sendChatMessage(text)
      const reply = parseBotReply(data) || '(No reply)'
      setMessages((prev) => [...prev, createMessage(reply, 'bot')])
    } catch (err) {
      let message = 'Something went wrong. Please try again.'
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status != null && status >= 500) {
          message = 'The server returned an error. Please try again later.'
        } else if (err.code === 'ERR_NETWORK' || err.response == null) {
          message = 'Cannot reach the server. Is the API running?'
        }
      }
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-box">
      <div className="chat-box__messages" ref={messagesRef}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
        {isLoading ? (
          <div className="chat-box__typing-wrap">
            <TypingIndicator />
          </div>
        ) : null}
      </div>
      <div className="chat-box__input-area">
        <ChatInput onSubmit={handleUserSubmit} disabled={isLoading} />
      </div>
    </div>
  )
}
