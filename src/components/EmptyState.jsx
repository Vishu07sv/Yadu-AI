export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="card flex flex-col items-center text-center px-6 py-14 sm:py-16">
      {icon && <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="text-sm text-ink-muted mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
