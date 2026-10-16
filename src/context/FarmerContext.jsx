import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getFarmerProfile, loginFarmer, registerFarmer, updateFarmerProfile } from '../services/api'

const FarmerContext = createContext(null)

export function FarmerProvider({ children }) {
  const [farmer, setFarmer] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('yadu_auth') === 'true'
  )
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    try {
      const data = await getFarmerProfile()
      setFarmer(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  async function login(credentials) {
    const res = await loginFarmer(credentials)
    setFarmer(res.farmer)
    setIsAuthenticated(true)
    localStorage.setItem('yadu_auth', 'true')
    return res
  }

  async function register(fields) {
    const res = await registerFarmer(fields)
    setFarmer(res.farmer)
    setIsAuthenticated(true)
    localStorage.setItem('yadu_auth', 'true')
    return res
  }

  function logout() {
    setIsAuthenticated(false)
    localStorage.removeItem('yadu_auth')
  }

  async function updateProfile(updates) {
    const updated = await updateFarmerProfile(updates)
    setFarmer(updated)
    return updated
  }

  return (
    <FarmerContext.Provider
      value={{ farmer, isAuthenticated, loading, login, register, logout, updateProfile }}
    >
      {children}
    </FarmerContext.Provider>
  )
}

export function useFarmer() {
  const ctx = useContext(FarmerContext)
  if (!ctx) throw new Error('useFarmer must be used within FarmerProvider')
  return ctx
}
