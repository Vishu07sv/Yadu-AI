import { Droplets, Wind, CloudRain, MapPin } from "lucide-react"
import { weatherIconFor } from "../utils/weather"

export default function WeatherCard({ weather, detailed = false }) {
  const Icon = weatherIconFor(weather.condition)
  return (
    <div className="card p-5 sm:p-6 bg-gradient-to-br from-sky-light/70 to-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="flex items-center gap-1 text-xs text-ink-muted">
            <MapPin size={12} className="text-sky" /> {weather.location}
          </p>
          <div className="flex items-end gap-2 mt-2">
            <span className="font-display text-4xl sm:text-5xl font-semibold text-ink">{weather.temperature}°C</span>
          </div>
          <p className="text-sm text-ink-muted mt-1">{weather.condition} · Feels like {weather.feelsLike}°C</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-sky-light flex items-center justify-center shrink-0">
          <Icon size={32} className="text-sky" strokeWidth={1.75} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
        <div className="flex flex-col items-center text-center">
          <Droplets size={17} className="text-sky mb-1" />
          <span className="text-sm font-semibold text-ink">{weather.humidity}%</span>
          <span className="text-[11px] text-ink-muted">Humidity</span>
        </div>
        <div className="flex flex-col items-center text-center border-x border-border">
          <Wind size={17} className="text-sky mb-1" />
          <span className="text-sm font-semibold text-ink">{weather.windSpeed} km/h</span>
          <span className="text-[11px] text-ink-muted">Wind</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <CloudRain size={17} className="text-sky mb-1" />
          <span className="text-sm font-semibold text-ink">{weather.rainProbability}%</span>
          <span className="text-[11px] text-ink-muted">Rain</span>
        </div>
      </div>

      {detailed && weather.farmImpact && (
        <div className="mt-5 pt-5 border-t border-border">
          <p className="label-eyebrow mb-1.5">Farm Impact</p>
          <p className="text-sm text-ink-muted leading-relaxed">{weather.farmImpact}</p>
        </div>
      )}
    </div>
  )
}
