import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Crops from './pages/Crops'
import CropDetails from './pages/CropDetails'
import CropDoctor from './pages/CropDoctor'
import Weather from './pages/Weather'
import Soil from './pages/Soil'
import Market from './pages/Market'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import DashboardLayout from './components/DashboardLayout'
import { useFarmer } from './context/FarmerContext'
import CropRecommendation from './pages/CropRecommendation'
import FarmEconomics from './pages/FarmEconomics'
import GovSchemes from './pages/GovSchemes'


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useFarmer()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />}/>
        <Route path="/crops/:id" element={<CropDetails />} />
        <Route path="/crop-doctor" element={<CropDoctor />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/soil" element={<Soil />} />
        <Route path="/market" element={<Market />} />
        <Route path="/farm-economics" element={<FarmEconomics />} />
        <Route path="/schemes" element={<GovSchemes />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
