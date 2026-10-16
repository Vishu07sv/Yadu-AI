import { Sprout } from "lucide-react"

export default function ChatMessage({ message }) {
  const isAi = message.sender === "ai"
  return (
    <div className={`flex items-end gap-2 ${isAi ? "justify-start" : "justify-end"}`}>
      {isAi && (
        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
          <Sprout size={14} />
        </div>
      )}
      <div className={`max-w-[78%] sm:max-w-[70%] ${isAi ? "" : "order-first ml-auto"}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isAi
              ? "bg-primary-50 text-ink rounded-2xl rounded-bl-md"
              : "bg-primary text-white rounded-2xl rounded-br-md"
          }`}
        >
          {message.text}
        </div>
        <p className={`text-[11px] text-ink-faint mt-1 ${isAi ? "text-left" : "text-right"}`}>{message.time}</p>
      </div>
    </div>
  )
}
