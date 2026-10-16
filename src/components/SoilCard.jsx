import { Info } from "lucide-react"
import ProgressBar from "./ProgressBar"

const levelTone = {
  Low: "warning",
  Normal: "primary",
  Good: "healthy",
}

export default function SoilCard({ soil, detailed = false }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-semibold">Soil Insights</h3>
          <p className="text-sm text-ink-muted mt-0.5">{soil.soilType} soil · pH {soil.ph}</p>
        </div>
        <span className="chip chip-soil">🪱 {soil.soilType}</span>
      </div>

      <div className="space-y-4">
        <ProgressBar label="Nitrogen" valueLabel={soil.nitrogen.level} value={soil.nitrogen.value} tone={levelTone[soil.nitrogen.level]} />
        <ProgressBar label="Phosphorus" valueLabel={soil.phosphorus.level} value={soil.phosphorus.value} tone={levelTone[soil.phosphorus.level]} />
        <ProgressBar label="Potassium" valueLabel={soil.potassium.level} value={soil.potassium.value} tone={levelTone[soil.potassium.level]} />
        <ProgressBar label="Moisture" valueLabel={`${soil.moisture}%`} value={soil.moisture} tone="sky" />
        {detailed && (
          <ProgressBar label="Organic Matter" valueLabel={`${soil.organicMatter}%`} value={soil.organicMatter * 20} tone="primary" />
        )}
      </div>

      {soil.recommendation && (
        <div className="mt-5 pt-5 border-t border-border flex gap-2.5">
          <Info size={16} className="text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-ink-muted leading-relaxed">{soil.recommendation}</p>
        </div>
      )}
      {soil.isMockData && (
        <p className="text-[11px] text-ink-faint mt-3">Sample values shown — connect a soil sensor or lab test for live readings.</p>
      )}
    </div>
  )
}
