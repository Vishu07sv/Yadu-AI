export default function Input({ label, error, icon: Icon, className = "", id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        )}
        <input
          id={inputId}
          className={`input-field ${Icon ? "pl-11" : ""} ${error ? "!border-danger" : ""}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
