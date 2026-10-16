import { TrendingUp, TrendingDown, MapPin } from "lucide-react"

export default function MarketPriceCard({ item, onSelect, selected }) {
  const change = ((item.price - item.previousPrice) / item.previousPrice) * 100
  const isUp = change >= 0

  return (
    <button
      onClick={() => onSelect?.(item)}
      className={`card p-4 sm:p-5 text-left w-full transition-all animate-fade-up ${
        selected ? "ring-2 ring-primary" : "hover:shadow-lift"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-display font-semibold text-ink">{item.crop}</h4>
          <p className="text-xs text-ink-muted">{item.variety}</p>
        </div>
        <span className={`chip ${isUp ? "chip-healthy" : "chip-danger"}`}>
          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isUp ? "+" : ""}{change.toFixed(1)}%
        </span>
      </div>
      <p className="font-mono text-xl font-semibold text-ink mt-3">
        ₹{item.price.toLocaleString("en-IN")}
        <span className="text-sm font-sans font-normal text-ink-muted">/{item.unit}</span>
      </p>
      <p className="flex items-center gap-1 text-xs text-ink-muted mt-2">
        <MapPin size={12} /> {item.market}
      </p>
    </button>
  )
}
