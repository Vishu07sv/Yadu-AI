import { Sprout } from "lucide-react"

export function Spinner({ size = 20, className = "" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function CardSkeleton({ lines = 3, className = "" }) {
  return (
    <div className={`card p-5 sm:p-6 ${className}`}>
      <div className="h-4 w-1/3 bg-primary-50 rounded animate-pulse-soft mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-primary-50 rounded animate-pulse-soft mb-2.5" style={{ width: `${85 - i * 12}%` }} />
      ))}
    </div>
  )
}

export function FullscreenLoader({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary-50" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <Sprout size={22} className="absolute inset-0 m-auto text-primary" />
      </div>
      <p className="text-ink-muted text-sm">{message}</p>
    </div>
  )
}
