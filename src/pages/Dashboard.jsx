import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CloudSun, Mountain, Sprout, LineChart, Droplets, ArrowRight } from 'lucide-react'
import StatCard from '../components/StatCard'
import WeatherCard from '../components/WeatherCard'
import SoilCard from '../components/SoilCard'
import CropCard from '../components/CropCard'
import MarketPriceCard from '../components/MarketPriceCard'
import { CardSkeleton } from '../components/LoadingAnimation'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'
import { getWeather, getSoilData, getCrops, getMarketPrices } from '../services/api'

export default function Dashboard() {
  const [weather, setWeather] = useState(null)
  const [soil, setSoil] = useState(null)
  const [crops, setCrops] = useState(null)
  const [market, setMarket] = useState(null)
  const [error, setError] = useState(false)

  async function loadAll() {
    setError(false)
    try {
      const [w, s, c, m] = await Promise.all([getWeather(), getSoilData(), getCrops(), getMarketPrices()])
      setWeather(w)
      setSoil(s)
      setCrops(c)
      setMarket(m)
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  if (error) {
    return <ErrorState message="We couldn't load your dashboard. Please try again." onRetry={loadAll} />
  }

  const avgHealth = crops?.length
    ? Math.round(crops.reduce((sum, c) => sum + c.healthScore, 0) / crops.length)
    : null
  const riceMarket = market?.find((m) => m.crop === 'Rice')

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Your Farm Today */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">Your Farm Today</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {weather ? (
            <StatCard icon={CloudSun} iconTone="sky" label="Weather" value={`${weather.temperature}°C`} sub={`${weather.condition} · ${weather.humidity}% humidity`} />
          ) : <CardSkeleton lines={2} />}
          {soil ? (
            <StatCard icon={Mountain} iconTone="soil" label="Soil" value="Good condition" sub={`pH ${soil.ph}`} />
          ) : <CardSkeleton lines={2} />}
          {avgHealth !== null ? (
            <StatCard icon={Sprout} iconTone="healthy" label="Crop Health" value={`${avgHealth}% Healthy`} sub={`${crops.length} crops tracked`} />
          ) : <CardSkeleton lines={2} />}
          {riceMarket ? (
            <StatCard icon={LineChart} iconTone="warning" label="Market" value={`₹${riceMarket.price.toLocaleString('en-IN')}`} sub={`Rice / ${riceMarket.unit}`} />
          ) : <CardSkeleton lines={2} />}
          {soil ? (
            <StatCard icon={Droplets} iconTone="primary" label="Irrigation" value="Water soon" sub={`Moisture ${soil.moisture}%`} />
          ) : <CardSkeleton lines={2} />}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {weather ? <WeatherCard weather={weather} /> : <CardSkeleton lines={4} />}
        {soil ? <SoilCard soil={soil} /> : <CardSkeleton lines={4} />}
      </div>

      {/* My Crops preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">My Crops</h2>
          <Link to="/crops" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {crops === null ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} lines={4} />)}
          </div>
        ) : crops.length === 0 ? (
          <EmptyState
            icon="🌱"
            title="No crops added yet."
            description="Add your first crop to start receiving personalized insights."
            action={<Link to="/crops" className="btn-primary">+ Add Crop</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.slice(0, 3).map((c) => <CropCard key={c.id} crop={c} />)}
          </div>
        )}
      </section>

      {/* Market snapshot */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">Market Prices</h2>
          <Link to="/market" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {market === null ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} lines={2} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {market.slice(0, 3).map((m) => <MarketPriceCard key={m.id} item={m} />)}
          </div>
        )}
      </section>
    </div>
  )
}
