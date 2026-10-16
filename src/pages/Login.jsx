import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Phone, Lock, ArrowRight } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import Input from '../components/Input'
import Button from '../components/Button'
import { useFarmer } from '../context/FarmerContext'

export default function Login() {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useFarmer()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!mobile || !password) {
      setError('Please enter your mobile number and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await login({ mobile, password })
      navigate('/dashboard')
    } catch {
      setError('Could not log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl" aria-hidden="true">🌾</span>
            <h1 className="font-display text-2xl font-semibold text-ink mt-3">Welcome back</h1>
            <p className="text-sm text-ink-muted mt-1">Log in to see today's farm insights.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <Input
              label="Mobile Number"
              type="tel"
              icon={Phone}
              placeholder="98765 43210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in…' : 'Log In'} <ArrowRight size={17} />
            </Button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            New to Yadu AI?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
