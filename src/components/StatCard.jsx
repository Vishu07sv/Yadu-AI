export default function StatCard({ icon: Icon, iconTone = "primary", label, value, sub, trend }) {
  const toneClasses = {
    primary: "bg-primary-50 text-primary",
    sky: "bg-sky-light text-sky",
    soil: "bg-soil-light text-soil",
    healthy: "bg-healthy-light text-healthy",
    warning: "bg-warning-light text-warning",
    danger: "bg-danger-light text-danger",
  }
  return (
    <div className="card p-5 flex items-start gap-4 animate-fade-up">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[iconTone]}`}>
        <Icon size={20} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-mono uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="font-display text-xl font-semibold text-ink mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-ink-muted mt-1">{sub}</p>}
        {trend && (
          <p className={`text-xs mt-1 font-semibold ${trend.startsWith("+") ? "text-healthy" : "text-danger"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  )
}
