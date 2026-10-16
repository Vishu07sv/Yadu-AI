import { weatherIconFor } from "../utils/weather"

export default function ForecastCard({ forecast }) {
  return (
    <div className="card p-5 sm:p-6">
      <h3 className="font-display text-base font-semibold mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {forecast.map((d) => {
          const Icon = weatherIconFor(d.condition)
          return (
            <div key={d.day} className="flex flex-col items-center text-center py-2 px-1 rounded-xl hover:bg-primary-50/60 transition-colors">
              <span className="text-xs font-medium text-ink-muted">{d.day}</span>
              <Icon size={22} className="text-sky my-2" strokeWidth={1.75} />
              <span className="text-sm font-semibold text-ink">{d.high}°</span>
              <span className="text-xs text-ink-faint">{d.low}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
