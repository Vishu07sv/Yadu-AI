import { X } from "lucide-react"
import { useEffect } from "react"

export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.()
    }
    if (isOpen) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-up"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${maxWidth} bg-white rounded-t-3xl sm:rounded-3xl shadow-lift max-h-[90vh] overflow-y-auto animate-fade-up`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-white rounded-t-3xl">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-primary-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
