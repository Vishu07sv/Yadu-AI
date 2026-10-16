import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function PublicHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🌾</span>
          <span className="font-display font-semibold text-lg text-primary">Yadu AI</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Log In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </nav>
        <button className="sm:hidden p-2 -mr-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-2">
          <Link to="/login" className="btn-secondary w-full" onClick={() => setOpen(false)}>Log In</Link>
          <Link to="/register" className="btn-primary w-full" onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      )}
    </header>
  )
}
