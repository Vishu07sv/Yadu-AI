import { useEffect, useState } from 'react'
import { Pencil, Sprout, MapPin, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { FullscreenLoader } from '../components/LoadingAnimation'
import { useFarmer } from '../context/FarmerContext'
import { getCrops } from '../services/api'
import { cropOptions } from '../data/mockData'

export default function Profile() {
  const { farmer, updateProfile } = useFarmer()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [crops, setCrops] = useState(null)

  useEffect(() => {
    if (farmer) setForm(farmer)
  }, [farmer])

  useEffect(() => {
    getCrops().then(setCrops)
  }, [])

  if (!farmer || !form) return <FullscreenLoader message="Loading your profile…" />

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile({
        fullName: form.fullName,
        mobile: form.mobile,
        village: form.village,
        farmArea: Number(form.farmArea),
        mainCrop: form.mainCrop,
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const healthyCount = crops?.filter((c) => c.health === 'healthy').length ?? null
  const attentionCount = crops?.filter((c) => c.health !== 'healthy').length ?? null

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-up">
      <div className="card p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold shrink-0">
              {farmer.avatarInitials}
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-ink">{farmer.fullName}</h1>
              <p className="flex items-center gap-1 text-sm text-ink-muted mt-1">
                <MapPin size={13} className="text-primary" /> {farmer.location}
              </p>
              <p className="flex items-center gap-1 text-xs text-ink-faint mt-1">
                <Calendar size={11} /> Joined {new Date(farmer.joinedDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          {!editing && (
            <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditing(true)}>Edit</Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              <Input label="Mobile" value={form.mobile} onChange={(e) => update('mobile', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Village" value={form.village} onChange={(e) => update('village', e.target.value)} />
              <Input label="Farm Area (acres)" type="number" value={form.farmArea} onChange={(e) => update('farmArea', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="main-crop">Primary Crop</label>
              <select id="main-crop" className="input-field" value={form.mainCrop} onChange={(e) => update('mainCrop', e.target.value)}>
                {cropOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
              <Button variant="ghost" onClick={() => { setForm(farmer); setEditing(false) }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 pt-2 border-t border-border text-sm">
            <div className="flex justify-between py-1"><span className="text-ink-muted">Mobile</span><span className="font-medium text-ink">{farmer.mobile}</span></div>
            <div className="flex justify-between py-1"><span className="text-ink-muted">State</span><span className="font-medium text-ink">{farmer.state}</span></div>
            <div className="flex justify-between py-1"><span className="text-ink-muted">District</span><span className="font-medium text-ink">{farmer.district}</span></div>
            <div className="flex justify-between py-1"><span className="text-ink-muted">Village</span><span className="font-medium text-ink">{farmer.village}</span></div>
            <div className="flex justify-between py-1"><span className="text-ink-muted">Farm Area</span><span className="font-medium text-ink">{farmer.farmArea} {farmer.farmAreaUnit}</span></div>
            <div className="flex justify-between py-1"><span className="text-ink-muted">Primary Crop</span><span className="font-medium text-ink">{farmer.mainCrop}</span></div>
          </div>
        )}
      </div>

      <ChartCard title="Farm Summary">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={MapPin} iconTone="primary" label="Total Area" value={`${farmer.farmArea} ac`} />
          <StatCard icon={Sprout} iconTone="soil" label="Crops" value={crops === null ? '—' : crops.length} />
          <StatCard icon={CheckCircle2} iconTone="healthy" label="Healthy" value={healthyCount ?? '—'} />
          <StatCard icon={AlertTriangle} iconTone="warning" label="Need Attention" value={attentionCount ?? '—'} />
        </div>
      </ChartCard>
    </div>
  )
}
