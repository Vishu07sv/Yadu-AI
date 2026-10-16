export default function PublicFooter() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🌾</span>
          <span className="font-display font-semibold text-primary">Yadu AI</span>
        </div>
        <p className="text-sm text-ink-muted text-center">
          Built for Indian farmers. Weather, soil, crop health and market data in one place.
        </p>
        <p className="text-xs text-ink-faint">© 2026 Yadu AI</p>
      </div>
    </footer>
  )
}
