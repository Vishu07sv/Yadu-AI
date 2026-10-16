import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'
import FloatingChatbot from './Chatbot'
import { useFarmer } from '../context/FarmerContext'
import { getNotifications, sendChatMessage } from '../services/api'
import { mockChatHistory } from '../data/mockData'

function greetingForNow() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [chatMessages, setChatMessages] = useState(mockChatHistory)
  const [chatSending, setChatSending] = useState(false)
  const { farmer } = useFarmer()
  const location = useLocation()

  useEffect(() => {
    getNotifications().then(setNotifications)
  }, [])

  async function handleFloatingSend(text) {
    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'farmer',
      text,
      time: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
    }
    setChatMessages((prev) => [...prev, userMsg])
    setChatSending(true)
    try {
      const reply = await sendChatMessage(text)
      setChatMessages((prev) => [...prev, reply])
    } finally {
      setChatSending(false)
    }
  }

  const isChatPage = location.pathname === '/chat'

  return (
    <div className="h-screen overflow-hidden bg-bg flex">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <Navbar
          onMenuClick={() => setMobileNavOpen(true)}
          notifications={notifications}
          greeting={`${greetingForNow()}, ${farmer?.fullName?.split(' ')[0] || 'Farmer'} 👋`}
          location={farmer?.location || 'Locating…'}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      {!isChatPage && (
        <FloatingChatbot messages={chatMessages} onSend={handleFloatingSend} sending={chatSending} />
      )}
    </div>
  )
}
