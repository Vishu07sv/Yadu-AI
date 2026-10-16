// Signature element: a "growth ring" arc gauge, styled after the concentric
// rings you would see in a cut stem or tree trunk — used everywhere a
// health percentage is shown (crop health, soil health) so the same motif
// reads consistently across the app.

const toneMap = {
  healthy: { stroke: "#2F9E52", label: "Healthy" },
  attention: { stroke: "#E8A33D", label: "Needs Attention" },
  critical: { stroke: "#D2503A", label: "Critical" },
}

function toneFromScore(score) {
  if (score >= 75) return "healthy"
  if (score >= 50) return "attention"
  return "critical"
}

export default function HealthScore({ score, size = 96, strokeWidth = 9, label, showLabel = true }) {
  const tone = toneFromScore(score)
  const { stroke, label: toneLabel } = toneMap[tone]
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative growth-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EEF6F0"
            strokeWidth={strokeWidth}
          />
          {/* faint inner ring ticks, evoking growth rings */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth - 3}
            fill="none"
            stroke="#EEF6F0"
            strokeWidth={2}
            strokeDasharray="1 7"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              "--arc-full": circumference,
              "--arc-offset": offset,
              transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)",
            }}
            className="animate-grow-arc"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-semibold text-ink leading-none">{score}%</span>
        </div>
      </div>
      {showLabel && (
        <span className={`mt-2 chip chip-${tone === "attention" ? "warning" : tone === "critical" ? "danger" : "healthy"}`}>
          {label || toneLabel}
        </span>
      )}
    </div>
  )
}

export { toneFromScore }
