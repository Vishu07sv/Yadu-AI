import { useState } from "react"
import { Menu, MapPin, ChevronDown, LogOut, User as UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown"
import { useFarmer } from "../context/FarmerContext"

export default function Navbar({ onMenuClick, notifications, greeting, location }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { farmer, logout } = useFarmer()
  const navigate = useNavigate()

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-2 rounded-full hover:bg-primary-50"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          {greeting ? (
            <>
              <p className="font-display text-base sm:text-lg font-semibold text-ink truncate">{greeting}</p>
              <p className="flex items-center gap-1 text-xs text-ink-muted">
                <MapPin size={12} className="text-primary shrink-0" />
                {location}
              </p>
            </>
          ) : (
            <div className="lg:hidden flex items-center gap-1.5 font-display font-semibold text-primary">
              <span aria-hidden="true">🌾</span> Yadu AI
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <NotificationDropdown
          notifications={notifications}
          isOpen={notifOpen}
          onToggle={() => setNotifOpen((v) => !v)}
          onClose={() => setNotifOpen(false)}
        />
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-primary-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
              {farmer?.avatarInitials || "FA"}
            </span>
            <ChevronDown size={14} className="text-ink-muted hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 card p-1.5 z-40 animate-fade-up">
              <button
                onClick={() => { setProfileOpen(false); navigate("/profile") }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-primary-50 text-left"
              >
                <UserIcon size={16} /> My Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); logout(); navigate("/") }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-danger-light text-danger text-left"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
