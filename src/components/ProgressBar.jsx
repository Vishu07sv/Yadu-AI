const toneClasses = {
  healthy: "bg-healthy",
  warning: "bg-warning",
  danger: "bg-danger",
  primary: "bg-primary",
  soil: "bg-soil",
  sky: "bg-sky",
}

export default function ProgressBar({ value, tone = "primary", label, valueLabel, height = "h-2" }) {
  return (
    <div className="w-full">
      {(label || valueLabel) && (
        <div className="flex items-center justify-between mb-1.5 text-sm">
          {label && <span className="text-ink-muted">{label}</span>}
          {valueLabel && <span className="font-semibold text-ink">{valueLabel}</span>}
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-primary-50 overflow-hidden`}>
        <div
          className={`${height} rounded-full ${toneClasses[tone]} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
