import { NavLink } from "react-router-dom"
import { LayoutDashboard, Sprout, Stethoscope, MessageCircle, User } from "lucide-react"

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/crops", label: "Crops", icon: Sprout },
  { to: "/crop-doctor", label: "Doctor", icon: Stethoscope },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
]

export default function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-border flex items-stretch"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isActive ? "text-primary" : "text-ink-faint"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
