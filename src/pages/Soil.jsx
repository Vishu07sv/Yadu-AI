import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'
import HealthScore from '../components/HealthScore'
import ProgressBar from '../components/ProgressBar'
import ChartCard from '../components/ChartCard'
import { FullscreenLoader } from '../components/LoadingAnimation'
import ErrorState from '../components/ErrorState'
import { getSoilData } from '../services/api'

const levelTone = { Low: 'warning', Normal: 'primary', Good: 'healthy' }

export default function Soil() {
  const [soil, setSoil] = useState(null)
  const [error, setError] = useState(false)

  async function load() {
    setError(false)
    setSoil(null)
    try {
      setSoil(await getSoilData())
    } catch {
      setError(true)
    }
  }

  useEffect(() => { load() }, [])

  if (error) return <ErrorState message="We couldn't load your soil information. Please try again." onRetry={load} />
  if (!soil) return <FullscreenLoader message="Reading your soil data…" />

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Soil Information</h1>
        <p className="text-sm text-ink-muted mt-1">A closer look at what's happening beneath your crops.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ChartCard title="Soil Health Score" className="flex flex-col items-center text-center justify-center">
          <HealthScore score={soil.healthScore} size={128} strokeWidth={11} label="Soil Health" />
          <p className="text-sm text-ink-muted mt-4">{soil.soilType} soil · pH {soil.ph}</p>
        </ChartCard>

        <ChartCard title="Nutrient Levels (NPK)" className="lg:col-span-2">
          <div className="space-y-5">
            <ProgressBar label="Nitrogen (N)" valueLabel={soil.nitrogen.level} value={soil.nitrogen.value} tone={levelTone[soil.nitrogen.level]} />
            <ProgressBar label="Phosphorus (P)" valueLabel={soil.phosphorus.level} value={soil.phosphorus.value} tone={levelTone[soil.phosphorus.level]} />
            <ProgressBar label="Potassium (K)" valueLabel={soil.potassium.level} value={soil.potassium.value} tone={levelTone[soil.potassium.level]} />
          </div>
        </ChartCard>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <ChartCard title="Moisture">
          <ProgressBar value={soil.moisture} valueLabel={`${soil.moisture}%`} tone="sky" height="h-3" />
        </ChartCard>
        <ChartCard title="Organic Matter">
          <ProgressBar value={soil.organicMatter * 20} valueLabel={`${soil.organicMatter}%`} tone="soil" height="h-3" />
        </ChartCard>
        <ChartCard title="Soil Type">
          <p className="font-display text-lg font-semibold text-ink">{soil.soilType}</p>
          <p className="text-sm text-ink-muted mt-1">pH {soil.ph} · slightly acidic to neutral</p>
        </ChartCard>
      </div>

      <ChartCard title="Soil Recommendation" action={<Info size={18} className="text-warning" />}>
        <p className="text-sm text-ink-muted leading-relaxed">{soil.recommendation}</p>
        {soil.isMockData && (
          <p className="text-[11px] text-ink-faint mt-3">
            These are sample values for demonstration. Connect a soil sensor or lab test for live readings from your field.
          </p>
        )}
      </ChartCard>
    </div>
  )
}
