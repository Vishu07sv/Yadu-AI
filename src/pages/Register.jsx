import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Lock, MapPin, Home, ArrowRight, LocateFixed } from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import Input from '../components/Input'
import Button from '../components/Button'
import { useFarmer } from '../context/FarmerContext'
import { statesAndDistricts, cropOptions } from '../data/mockData'
import { detectLocation } from '../services/api'
import { Spinner } from '../components/LoadingAnimation'

const states = Object.keys(statesAndDistricts)

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', mobile: '', password: '', state: '', district: '', village: '',
    farmArea: '', mainCrop: '',
  })
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useFarmer()
  const navigate = useNavigate()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value, ...(field === 'state' ? { district: '' } : {}) }))
  }

  async function handleUseLocation() {
    setLocating(true)
    try {
      const loc = await detectLocation()
      setForm((f) => ({ ...f, state: loc.state, district: loc.district, village: loc.village }))
    } finally {
      setLocating(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fullName || !form.mobile || !form.password || !form.state || !form.district) {
      setError('Please fill in all required fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await register({ ...form, farmArea: Number(form.farmArea) || 0 })
      navigate('/dashboard')
    } catch {
      setError('Could not create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <span className="text-3xl" aria-hidden="true">🌾</span>
            <h1 className="font-display text-2xl font-semibold text-ink mt-3">Create your farm account</h1>
            <p className="text-sm text-ink-muted mt-1">Takes less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <Input label="Full Name" icon={User} placeholder="Ramesh Verma" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Mobile Number" type="tel" icon={Phone} placeholder="98765 43210" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} />
              <Input label="Password" type="password" icon={Lock} placeholder="••••••••" value={form.password} onChange={(e) => update('password', e.target.value)} />
            </div>

            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary border border-dashed border-primary/40 rounded-xl py-2.5 hover:bg-primary-50 transition-colors"
            >
              {locating ? <Spinner size={15} /> : <LocateFixed size={15} />}
              {locating ? 'Detecting your location…' : '📍 Use my current location'}
            </button>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="state">State</label>
                <select id="state" className="input-field" value={form.state} onChange={(e) => update('state', e.target.value)}>
                  <option value="">Select state</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="district">District</label>
                <select id="district" className="input-field" value={form.district} onChange={(e) => update('district', e.target.value)} disabled={!form.state}>
                  <option value="">Select district</option>
                  {(statesAndDistricts[form.state] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <Input label="Village" icon={Home} placeholder="Kharora" value={form.village} onChange={(e) => update('village', e.target.value)} />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Farm Area (acres)" type="number" icon={MapPin} placeholder="4" value={form.farmArea} onChange={(e) => update('farmArea', e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="mainCrop">Main Crop</label>
                <select id="mainCrop" className="input-field" value={form.mainCrop} onChange={(e) => update('mainCrop', e.target.value)}>
                  <option value="">Select crop</option>
                  {cropOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'} <ArrowRight size={17} />
            </Button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
