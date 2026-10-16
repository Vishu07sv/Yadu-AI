import { useEffect, useRef } from "react"
import { Bell } from "lucide-react"

export default function NotificationDropdown({ notifications, isOpen, onToggle, onClose }) {
  const ref = useRef(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    if (isOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen, onClose])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        className="relative p-2.5 rounded-full hover:bg-primary-50 transition-colors"
      >
        <Bell size={19} strokeWidth={2.25} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] card p-2 z-40 animate-fade-up">
          <div className="px-3 py-2 flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && <span className="chip chip-danger">{unreadCount} new</span>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  n.read ? "" : "bg-primary-50/60"
                }`}
              >
                <span className="text-lg leading-none mt-0.5">{n.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm text-ink leading-snug">{n.text}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
