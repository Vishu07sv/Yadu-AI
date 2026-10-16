import { useEffect, useRef, useState } from "react"
import { Send, Paperclip, MessageCircle, X, Circle } from "lucide-react"
import ChatMessage from "./ChatMessage"
import TypingIndicator from "./TypingIndicator"
import { quickQuestions } from "../data/mockData"

export function ChatPanel({ messages, onSend, sending, showQuickQuestions = true, compact = false }) {
  const [input, setInput] = useState("")
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className={`flex-1 overflow-y-auto space-y-4 ${compact ? "p-4" : "p-4 sm:p-6"}`}>
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {sending && <TypingIndicator />}
      </div>

      {showQuickQuestions && (
        <div className="px-4 sm:px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => onSend(q)}
              className="shrink-0 text-xs font-medium px-3.5 py-2 rounded-full bg-primary-50 text-primary hover:bg-primary-100 transition-colors whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-border flex items-center gap-2">
        <button
          type="button"
          aria-label="Attach a photo"
          className="p-2.5 rounded-full text-ink-muted hover:bg-primary-50 shrink-0"
        >
          <Paperclip size={19} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Yadu AI about your farm…"
          aria-label="Message Yadu AI"
          className="flex-1 min-w-0 rounded-full border border-border px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!input.trim()}
          className="p-2.5 rounded-full bg-primary text-white hover:bg-primary-dark disabled:opacity-40 shrink-0 transition-colors"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  )
}

export default function FloatingChatbot({ messages, onSend, sending }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 h-[70vh] sm:h-[520px] card flex flex-col overflow-hidden animate-fade-up">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-primary-50/60">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">🤖</span>
              <div>
                <p className="font-display font-semibold text-sm leading-none">Yadu AI</p>
                <p className="flex items-center gap-1 text-[11px] text-healthy mt-1">
                  <Circle size={6} fill="currentColor" /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1.5 rounded-full hover:bg-white">
              <X size={17} />
            </button>
          </div>
          <ChatPanel messages={messages} onSend={onSend} sending={sending} compact />
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Yadu AI chat" : "Open Yadu AI chat"}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lift flex items-center justify-center hover:bg-primary-dark transition-colors active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}
