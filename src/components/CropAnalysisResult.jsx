import { AlertTriangle, CheckCircle2, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"

const riskTone = {
  "Low Risk": "chip-healthy",
  "Moderate Risk": "chip-warning",
  "High Risk": "chip-danger",
}

export default function CropAnalysisResult({ result }) {
  return (
    <div className="card overflow-hidden animate-fade-up">
      <div className="bg-gradient-to-br from-primary-50 to-white px-6 py-5 border-b border-border">
        <p className="label-eyebrow mb-1">Analysis Result</p>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-display text-2xl font-semibold text-ink">{result.crop}</h3>
          <span className={`chip ${riskTone[result.health] || "chip-warning"}`}>
            <AlertTriangle size={13} /> {result.health}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">Detected Condition</p>
            <p className="font-display text-lg font-semibold text-ink">{result.disease}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-muted">Confidence</p>
            <p className="font-mono text-lg font-semibold text-primary">{result.confidence}%</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-2">Possible Causes</h4>
          <ul className="space-y-1.5">
            {result.causes.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" /> {c}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink mb-2">Recommended Actions</h4>
          <ul className="space-y-2">
            {result.actions.map((a) => (
              <li key={a} className="flex items-start gap-2.5 text-sm text-ink">
                <CheckCircle2 size={16} className="text-healthy shrink-0 mt-0.5" /> {a}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/chat"
          className="btn-primary w-full"
        >
          <MessageCircle size={17} /> Ask Yadu AI about this result
        </Link>
      </div>
    </div>
  )
}
