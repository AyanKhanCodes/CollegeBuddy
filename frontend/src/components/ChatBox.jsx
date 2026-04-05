import { useState } from 'react'
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

  const handleUserSubmit = async (text) => {
    setMessages((prev) => [...prev, createMessage(text, 'user')])
    setIsLoading(true)
    try {
      const data = await sendChatMessage(text)
      const reply = parseBotReply(data) || '(No reply)'
      setMessages((prev) => [...prev, createMessage(reply, 'bot')])
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage('Could not reach the server. Is the API running?', 'bot'),
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-box">
      <div className="chat-box__messages">
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
