import { RotateCw, AlertCircle } from "lucide-react"

export default function ErrorState({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="card flex flex-col items-center text-center px-6 py-12">
      <div className="w-11 h-11 rounded-full bg-danger-light flex items-center justify-center mb-3">
        <AlertCircle size={20} className="text-danger" />
      </div>
      <p className="text-sm text-ink-muted max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-5">
          <RotateCw size={15} /> Try Again
        </button>
      )}
    </div>
  )
}
