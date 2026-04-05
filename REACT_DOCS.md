# React Architectural Documentation

## Core Structure
The frontend of **CollegeBuddy** is bootstrapped using Vite and React. The entrypoint `main.jsx` invokes `App.jsx` cleanly.

### Component Hierarchy
- `App.jsx`: Hosts the core layout and titles.
  - `ChatBox.jsx`: Manages the overall chat UX.
    - `MessageBubble.jsx`: Maps through dialogue history displaying user and AI messages.
    - `ChatInput.jsx`: A pure presentational field for textarea logic processing.
    - `TypingIndicator.jsx`: Conditional rendering element shown while fetching payload.

### State Management
State is constrained to `ChatBox.jsx`:
```jsx
const [messages, setMessages] = useState([])
const [isLoading, setIsLoading] = useState(false)
```

Messages are injected into the array via the `Axios` post to our FastAPI backend (`/chat`). The `isLoading` state concurrently disables the `ChatInput` field while a response is being formulated by the Ollama Llama-3.2 runner.
