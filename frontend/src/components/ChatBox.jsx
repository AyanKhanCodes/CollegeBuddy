import { useState } from 'react'
import ChatInput from './ChatInput.jsx'
import MessageBubble from './MessageBubble.jsx'

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

  const handleUserSubmit = (text) => {
    setMessages((prev) => [...prev, createMessage(text, 'user')])
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
      </div>
      <div className="chat-box__input-area">
        <ChatInput onSubmit={handleUserSubmit} />
      </div>
    </div>
  )
}
