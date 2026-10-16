export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lift",
    secondary: "bg-white text-primary border border-primary/25 hover:bg-primary-50",
    ghost: "text-ink hover:bg-primary-50",
    danger: "bg-danger text-white hover:bg-danger/90",
  }
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && iconPosition === "left" && <Icon size={18} strokeWidth={2.25} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={18} strokeWidth={2.25} />}
    </button>
  )
}
