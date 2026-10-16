export default function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`card p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            {title && <h3 className="font-display text-base font-semibold text-ink">{title}</h3>}
            {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
