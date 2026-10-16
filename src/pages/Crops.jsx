import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import CropCard from '../components/CropCard'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { CardSkeleton } from '../components/LoadingAnimation'
import { getCrops, addCrop } from '../services/api'
import { cropOptions } from '../data/mockData'

const irrigationOptions = ['Flood irrigation', 'Sprinkler', 'Drip', 'Rainfed']
const soilOptions = ['Loamy', 'Clay loam', 'Sandy', 'Black soil', 'Red soil']

const emptyForm = {
  name: '', area: '', plantedDate: '', soilType: '', irrigation: '', notes: '',
}

export default function Crops() {
  const [crops, setCrops] = useState(null)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setError(false)
    try {
      setCrops(await getCrops())
    } catch {
      setError(true)
    }
  }

  useEffect(() => { load() }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleAddCrop(e) {
    e.preventDefault()
    if (!form.name || !form.area || !form.plantedDate) return
    setSubmitting(true)
    try {
      const created = await addCrop({
        name: form.name,
        variety: '—',
        area: Number(form.area),
        areaUnit: 'acres',
        plantedDate: form.plantedDate,
        growthStage: 'Seedling',
        soilType: form.soilType || 'Loamy',
        irrigation: form.irrigation || 'Rainfed',
        notes: form.notes,
      })
      setCrops((prev) => [created, ...(prev || [])])
      setForm(emptyForm)
      setModalOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My Crops</h1>
          <p className="text-sm text-ink-muted mt-1">Track every crop on your farm in one place.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} icon={Plus}>Add New Crop</Button>
      </div>

      {error ? (
        <ErrorState message="We couldn't load your crops. Please try again." onRetry={load} />
      ) : crops === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} lines={4} />)}
        </div>
      ) : crops.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="No crops added yet."
          description="Add your first crop to start receiving personalized insights."
          action={<Button onClick={() => setModalOpen(true)} icon={Plus}>Add Crop</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((c) => <CropCard key={c.id} crop={c} />)}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Crop">
        <form onSubmit={handleAddCrop} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="crop-name">Crop Name</label>
            <select id="crop-name" className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)}>
              <option value="">Select crop</option>
              {cropOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Farm Area (acres)" type="number" placeholder="1.5" value={form.area} onChange={(e) => update('area', e.target.value)} />
            <Input label="Planting Date" type="date" value={form.plantedDate} onChange={(e) => update('plantedDate', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="soil-type">Soil Type</label>
              <select id="soil-type" className="input-field" value={form.soilType} onChange={(e) => update('soilType', e.target.value)}>
                <option value="">Select soil type</option>
                {soilOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="irrigation">Irrigation Method</label>
              <select id="irrigation" className="input-field" value={form.irrigation} onChange={(e) => update('irrigation', e.target.value)}>
                <option value="">Select method</option>
                {irrigationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              rows={3}
              className="input-field resize-none"
              placeholder="Any details worth remembering about this crop…"
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Adding crop…' : 'Add Crop'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
