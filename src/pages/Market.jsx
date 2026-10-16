import { useEffect, useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import MarketPriceCard from '../components/MarketPriceCard'
import ChartCard from '../components/ChartCard'
import { CardSkeleton } from '../components/LoadingAnimation'
import ErrorState from '../components/ErrorState'
import { getMarketPrices } from '../services/api'
import { useFarmer } from '../context/FarmerContext'

export default function Market() {
  const [prices, setPrices] = useState(null)
  const [error, setError] = useState(false)
  const [cropFilter, setCropFilter] = useState('All')
  const [marketFilter, setMarketFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const { farmer } = useFarmer()

  async function load() {
    setError(false)
    try {
      const data = await getMarketPrices()
      setPrices(data)
      setSelected(data[0])
    } catch {
      setError(true)
    }
  }

  useEffect(() => { load() }, [])

  const markets = useMemo(() => ['All', ...new Set((prices || []).map((p) => p.market))], [prices])
  const filtered = useMemo(() => {
    if (!prices) return []
    return prices.filter(
      (p) => (cropFilter === 'All' || p.crop === cropFilter) && (marketFilter === 'All' || p.market === marketFilter)
    )
  }, [prices, cropFilter, marketFilter])

  const chartData = selected?.trend.map((v, i) => ({ point: `Day ${i + 1}`, price: v })) || []

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Crop Market Prices</h1>
          <p className="flex items-center gap-1 text-sm text-ink-muted mt-1">
            <MapPin size={13} className="text-primary" /> {farmer?.location || 'Raipur, Chhattisgarh'}
          </p>
        </div>
      </div>

      {error ? (
        <ErrorState message="We couldn't load market prices. Please try again." onRetry={load} />
      ) : prices === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} lines={2} />)}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <select className="input-field w-auto" value={cropFilter} onChange={(e) => setCropFilter(e.target.value)}>
              <option value="All">All Crops</option>
              {[...new Set(prices.map((p) => p.crop))].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="input-field w-auto" value={marketFilter} onChange={(e) => setMarketFilter(e.target.value)}>
              {markets.map((m) => <option key={m} value={m}>{m === 'All' ? 'All Markets' : m}</option>)}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <MarketPriceCard key={item.id} item={item} onSelect={setSelected} selected={selected?.id === item.id} />
            ))}
          </div>

          {selected && (
            <ChartCard title={`${selected.crop} Price Trend`} subtitle={`${selected.market} · per ${selected.unit}`}>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E1D3" vertical={false} />
                  <XAxis dataKey="point" tick={{ fontSize: 12, fill: '#6C7062' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6C7062' }} axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Price']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #E7E1D3', fontSize: 13 }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#1F5F3D" strokeWidth={2.5} dot={{ r: 4, fill: '#1F5F3D' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </>
      )}
    </div>
  )
}
