
import { useMemo, useState } from 'react'
import { Droplets, Sprout, Calculator, CloudRain } from 'lucide-react'

const cropWaterNeeds = {
  Rice: 6,
  Wheat: 4,
  Maize: 5,
  Soybean: 4.5,
  Cotton: 5.5,
}

const soilFactors = {
  Sandy: 1.2,
  Loamy: 1,
  Clay: 0.85,
}

const irrigationEfficiency = {
  Flood: 0.5,
  Furrow: 0.65,
  Sprinkler: 0.75,
  Drip: 0.9,
}

const stageFactors = {
  Establishment: 0.8,
  Vegetative: 1,
  Flowering: 1.2,
  Maturity: 0.7,
}

export default function SmartIrrigationPlanner() {
  const [crop, setCrop] = useState('Rice')
  const [soil, setSoil] = useState('Loamy')
  const [area, setArea] = useState('1')
  const [method, setMethod] = useState('Drip')
  const [rainfall, setRainfall] = useState('0')
  const [growthStage, setGrowthStage] = useState('Vegetative')

  const estimate = useMemo(() => {
    const areaHa = Number(area)
    const rainMm = Number(rainfall)

    if (
      !Number.isFinite(areaHa) ||
      !Number.isFinite(rainMm) ||
      areaHa <= 0 ||
      rainMm < 0
    ) {
      return null
    }

    const cropDemand = cropWaterNeeds[crop] * stageFactors[growthStage]
    const netDepth = Math.max(
      0,
      cropDemand * soilFactors[soil] - rainMm
    )
    const grossDepth = netDepth / irrigationEfficiency[method]
    const litres = grossDepth * areaHa * 10000

    return {
      depthMm: grossDepth,
      litres,
      cubicMetres: litres / 1000,
    }
  }, [crop, soil, area, method, rainfall, growthStage])

  const field = 'w-full rounded-lg border border-gray-300 bg-white p-3'

  return (
    <section className="space-y-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <Droplets size={26} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Smart Irrigation Planner
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Estimate water requirements for your field.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-medium">Crop</span>
          <select className={field} value={crop} onChange={e => setCrop(e.target.value)}>
            {Object.keys(cropWaterNeeds).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Soil type</span>
          <select className={field} value={soil} onChange={e => setSoil(e.target.value)}>
            {Object.keys(soilFactors).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Field area (hectares)</span>
          <input className={field} type="number" min="0.01" step="0.01"
            value={area} onChange={e => setArea(e.target.value)} />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Irrigation method</span>
          <select className={field} value={method} onChange={e => setMethod(e.target.value)}>
            {Object.keys(irrigationEfficiency).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Growth stage</span>
          <select className={field} value={growthStage} onChange={e => setGrowthStage(e.target.value)}>
            {Object.keys(stageFactors).map(name => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Effective rainfall (mm)</span>
          <input className={field} type="number" min="0" step="0.1"
            value={rainfall} onChange={e => setRainfall(e.target.value)} />
        </label>
      </div>

      {estimate ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <Droplets className="mb-2 text-blue-700" />
            <p className="text-sm text-blue-800">Estimated water volume</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {Math.round(estimate.litres).toLocaleString('en-IN')} L
            </p>
          </div>

          <div className="rounded-xl bg-green-50 p-4">
            <Calculator className="mb-2 text-green-700" />
            <p className="text-sm text-green-800">Water depth</p>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {estimate.depthMm.toFixed(1)} mm
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <Sprout className="mb-2 text-amber-700" />
            <p className="text-sm text-amber-800">Water volume</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">
              {estimate.cubicMetres.toFixed(2)} m³
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-red-600">
          Enter a positive field area and non-negative rainfall.
        </p>
      )}

      <div className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
        <CloudRain size={20} className="mt-0.5 shrink-0" />
        <p>
          Preliminary estimates only. The crop water values and soil factors
          are illustrative assumptions, not validated agricultural
          recommendations. Actual requirements depend on local weather,
          crop variety, soil moisture and field conditions.
        </p>
      </div>
    </section>
  )
}
