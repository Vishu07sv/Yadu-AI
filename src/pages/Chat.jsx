import { useState } from 'react'
import { Circle } from 'lucide-react'
import { ChatPanel } from '../components/Chatbot'
import { mockChatHistory } from '../data/mockData'
import { sendChatMessage } from '../services/api'

export default function Chat() {
  const [messages, setMessages] = useState(mockChatHistory)
  const [sending, setSending] = useState(false)

  async function handleSend(text) {
    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'farmer',
      text,
      time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setSending(true)
    try {
      const reply = await sendChatMessage(text)
      setMessages((prev) => [...prev, reply])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-full min-h-[520px] flex flex-col animate-fade-up">
      <div className="card flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-primary-50/50 shrink-0">
          <span className="text-2xl" aria-hidden="true">🤖</span>
          <div>
            <p className="font-display font-semibold">Yadu AI</p>
            <p className="flex items-center gap-1.5 text-xs text-healthy">
              <Circle size={7} fill="currentColor" /> Online
            </p>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ChatPanel messages={messages} onSend={handleSend} sending={sending} />
        </div>
      </div>
    </div>
  )
}
