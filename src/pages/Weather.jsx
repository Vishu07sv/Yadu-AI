import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { CloudSun } from 'lucide-react'
import WeatherCard from '../components/WeatherCard'
import ForecastCard from '../components/ForecastCard'
import ChartCard from '../components/ChartCard'
import { FullscreenLoader } from '../components/LoadingAnimation'
import ErrorState from '../components/ErrorState'
import { weatherIconFor } from '../utils/weather'
import { getWeather } from '../services/api'

export default function Weather() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  async function load() {
    setError(false)
    setWeather(null)
    try {
      setWeather(await getWeather())
    } catch {
      setError(true)
    }
  }

  useEffect(() => { load() }, [])

  if (error) return <ErrorState message="We couldn't load the weather information. Please try again." onRetry={load} />
  if (!weather) return <FullscreenLoader message="Fetching your local weather…" />

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Weather</h1>
        <p className="text-sm text-ink-muted mt-1">Local conditions for your farm, updated through the day.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WeatherCard weather={weather} detailed />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Hourly Forecast">
            <div className="flex justify-between overflow-x-auto no-scrollbar gap-2">
              {weather.hourly.map((h) => {
                const Icon = weatherIconFor(h.condition)
                return (
                  <div key={h.time} className="flex flex-col items-center gap-2 shrink-0 px-2">
                    <span className="text-xs text-ink-muted">{h.time}</span>
                    <Icon size={20} className="text-sky" strokeWidth={1.75} />
                    <span className="text-sm font-semibold text-ink">{h.temp}°</span>
                  </div>
                )
              })}
            </div>
          </ChartCard>

          <ChartCard title="Temperature Trend" subtitle="High / low for the next 5 days">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weather.forecast} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3E7CA6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3E7CA6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E1D3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6C7062' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6C7062' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D3', fontSize: 13 }} />
                <Area type="monotone" dataKey="high" stroke="#3E7CA6" strokeWidth={2.5} fill="url(#tempGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <ForecastCard forecast={weather.forecast} />

      <ChartCard title="Farm Impact" action={<CloudSun size={20} className="text-sky" />}>
        <p className="text-sm text-ink-muted leading-relaxed">{weather.farmImpact}</p>
      </ChartCard>
    </div>
  )
}
