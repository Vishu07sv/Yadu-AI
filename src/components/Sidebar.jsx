import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  Mountain,
  LineChart,
  Stethoscope,
  MessageCircle,
  User,
  X,
  Calculator,
  Wheat,
  CalendarDays
} from "lucide-react"

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crops", label: "My Crops", icon: Sprout },
  {
  to: "/crop-recommendation",
  label: "Crop Recommendation",
  icon: Wheat,
},
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/soil", label: "Soil", icon: Mountain },
  { to: "/market", label: "Market Prices", icon: LineChart },
  { to: "/farm-economics", label: "Farm Economics", icon: Calculator },
  { to: "/crop-doctor", label: "AI Crop Doctor", icon: Stethoscope },
  { to: "/chat", label: "Yadu AI Chat", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/crop-calendar", label: "Crop Calendar", icon: CalendarDays },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 px-3 space-y-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-ink-muted hover:bg-primary-50 hover:text-primary"
            }`
          }
        >
          <Icon size={18} strokeWidth={2.25} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-border bg-white h-screen sticky top-0">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <span className="text-2xl" aria-hidden="true">🌾</span>
          <span className="font-display font-semibold text-lg text-primary">Yadu AI</span>
        </div>
        <div className="py-4 flex-1 flex flex-col overflow-y-auto">
          <NavItems />
        </div>
        <div className="field-divider" />
      </aside>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white flex flex-col animate-fade-up">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">🌾</span>
                <span className="font-display font-semibold text-lg text-primary">Yadu AI</span>
              </div>
              <button onClick={onClose} aria-label="Close menu" className="p-2 rounded-full hover:bg-primary-50">
                <X size={20} />
              </button>
            </div>
            <div className="py-4 flex-1 overflow-y-auto">
              <NavItems onNavigate={onClose} />
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
