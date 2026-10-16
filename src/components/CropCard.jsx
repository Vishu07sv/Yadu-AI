import { Link } from "react-router-dom"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

const healthConfig = {
  healthy: { chip: "chip-healthy", dot: "🟢", label: "Healthy" },
  attention: { chip: "chip-warning", dot: "🟡", label: "Needs Attention" },
  critical: { chip: "chip-danger", dot: "🔴", label: "Critical" },
}

export default function CropCard({ crop }) {
  const cfg = healthConfig[crop.health]
  return (
    <div className="card p-5 flex flex-col animate-fade-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{crop.name}</h3>
          <p className="text-xs text-ink-muted">{crop.variety}</p>
        </div>
        <span className={`chip ${cfg.chip}`}>{cfg.dot} {cfg.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-1.5 text-ink-muted">
          <MapPin size={14} /> {crop.area} {crop.areaUnit}
        </div>
        <div className="flex items-center gap-1.5 text-ink-muted">
          <Calendar size={14} /> {new Date(crop.plantedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-4 bg-primary-50/60 rounded-xl px-3 py-2">
        <span className="text-ink-muted">Growth Stage</span>
        <span className="font-semibold text-primary">{crop.growthStage}</span>
      </div>

      <Link
        to={`/crops/${crop.id}`}
        className="mt-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-primary border border-primary/25 rounded-full py-2.5 hover:bg-primary-50 transition-colors"
      >
        View Details <ArrowRight size={15} />
      </Link>
    </div>
  )
}
