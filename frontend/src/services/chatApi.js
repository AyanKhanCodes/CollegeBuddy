import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

/**
 * POST /chat — sends the user message to the FastAPI backend.
 * @param {string} message
 * @returns {Promise<unknown>}
 */
export async function sendChatMessage(message) {
  const { data } = await api.post('/chat', { message })
  return data
}

/** Normalize common FastAPI JSON shapes to a single assistant string. */
export function parseBotReply(data) {
  if (data == null) return ''
  if (typeof data === 'string') return data
  if (typeof data === 'object') {
    const v = data.reply ?? data.response ?? data.message ?? data.text
    if (typeof v === 'string') return v
  }
  return ''
}

export { api }
