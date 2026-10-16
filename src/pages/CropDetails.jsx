import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Droplets, CloudSun, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import HealthScore from '../components/HealthScore'
import ChartCard from '../components/ChartCard'
import { FullscreenLoader } from '../components/LoadingAnimation'
import ErrorState from '../components/ErrorState'
import { getCropById } from '../services/api'

function ageInDays(plantedDate) {
  const diff = Date.now() - new Date(plantedDate).getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export default function CropDetails() {
  const { id } = useParams()
  const [crop, setCrop] = useState(undefined)
  const [error, setError] = useState(false)

  async function load() {
    setError(false)
    setCrop(undefined)
    try {
      const data = await getCropById(id)
      setCrop(data)
    } catch {
      setError(true)
    }
  }

  useEffect(() => { load() }, [id])

  if (error) return <ErrorState message="We couldn't load this crop. Please try again." onRetry={load} />
  if (crop === undefined) return <FullscreenLoader message="Loading crop details…" />
  if (crop === null) {
    return (
      <ErrorState message="We couldn't find that crop — it may have been removed." />
    )
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <Link to="/crops" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-primary">
        <ArrowLeft size={15} /> Back to My Crops
      </Link>

      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
        <div>
          <p className="label-eyebrow mb-1">{crop.variety}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{crop.name}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {crop.area} {crop.areaUnit}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Planted {new Date(crop.plantedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5">🌱 {ageInDays(crop.plantedDate)} days old</span>
          </div>
        </div>
        <HealthScore score={crop.healthScore} size={104} strokeWidth={10} label="Crop Health" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Crop Health" subtitle="Weekly health score trend">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={crop.healthHistory} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E1D3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6C7062' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6C7062' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Health']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D3', fontSize: 13 }}
                />
                <Line type="monotone" dataKey="score" stroke="#1F5F3D" strokeWidth={2.5} dot={{ r: 4, fill: '#1F5F3D' }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Potential Risks">
            <ul className="space-y-2.5">
              {crop.risks.length === 0 && <p className="text-sm text-ink-muted">No active risks detected for this crop.</p>}
              {crop.risks.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-ink">
                  <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard title="Recommended Actions">
            <ul className="space-y-2.5">
              {crop.recommendations.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-ink">
                  <CheckCircle2 size={16} className="text-healthy shrink-0 mt-0.5" /> {r}
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <ChartCard title="Farm Conditions">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Droplets size={17} className="text-sky mt-0.5" />
                <div>
                  <p className="font-medium text-ink">Water Requirement</p>
                  <p className="text-ink-muted mt-0.5">{crop.waterRequirement}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CloudSun size={17} className="text-sky mt-0.5" />
                <div>
                  <p className="font-medium text-ink">Weather Impact</p>
                  <p className="text-ink-muted mt-0.5">{crop.weatherImpact}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between"><span className="text-ink-muted">Soil</span><span className="font-medium">{crop.soilType}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Irrigation</span><span className="font-medium">{crop.irrigation}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Growth Stage</span><span className="font-medium">{crop.growthStage}</span></div>
              </div>
            </div>
          </ChartCard>

          {crop.notes && (
            <ChartCard title="Notes">
              <p className="text-sm text-ink-muted leading-relaxed">{crop.notes}</p>
            </ChartCard>
          )}
        </div>
      </div>
    </div>
  )
}
