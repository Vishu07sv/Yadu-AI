import { useState } from 'react'
import {
  predictCrop,
  getWeatherByLocation,
} from '../services/api'

const initialValues = {
  N: '',
  P: '',
  K: '',
  temperature: '',
  humidity: '',
  ph: '',
  rainfall: '',
}

const fields = [
  { name: 'N', label: 'Nitrogen (N)', hint: 'Soil nitrogen level' },
  { name: 'P', label: 'Phosphorus (P)', hint: 'Soil phosphorus level' },
  { name: 'K', label: 'Potassium (K)', hint: 'Soil potassium level' },
  { name: 'temperature', label: 'Temperature (°C)', hint: 'Fetched from weather API' },
  { name: 'humidity', label: 'Humidity (%)', hint: 'Fetched from weather API' },
  { name: 'ph', label: 'Soil pH', hint: 'Soil acidity or alkalinity' },
  { name: 'rainfall', label: 'Rainfall (mm)', hint: 'Enter the rainfall value used for crop analysis' },
]

const waterSources = [
  'Rainfall / monsoon',
  'Well / borewell',
  'Canal',
  'Pond / reservoir',
  'River / community irrigation',
  'Other',
]

export default function CropRecommendation() {
  const [values, setValues] = useState(initialValues)
  const [village, setVillage] = useState('')
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState('')
  const [weatherLoading, setWeatherLoading] = useState(false)

  const [waterSourcesSelected, setWaterSourcesSelected] = useState([])
  const [waterAvailability, setWaterAvailability] = useState('moderate')
  const [irrigation, setIrrigation] = useState('occasional')

  const [result, setResult] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [waterAdvice, setWaterAdvice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  function handleWaterSourceChange(source) {
    setWaterSourcesSelected((previous) =>
      previous.includes(source)
        ? previous.filter((item) => item !== source)
        : [...previous, source]
    )
  }

  async function handleGetWeather(event) {
    event.preventDefault()
    setWeather(null)
    setWeatherError('')

    if (!village.trim()) {
      setWeatherError('Please enter a village or town name.')
      return
    }

    setWeatherLoading(true)

    try {
      const data = await getWeatherByLocation(village.trim())
      setWeather(data)
      setValues((previous) => ({
        ...previous,
        temperature: data.weather.temperature_c ?? previous.temperature,
        humidity: data.weather.humidity_percent ?? previous.humidity,
      }))
    } catch (err) {
      setWeatherError(err.message || 'Could not fetch weather.')
      console.error(err)
    } finally {
      setWeatherLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setResult('')
    setRecommendations([])
    setWaterAdvice('')
    setError('')
   

    if (waterSourcesSelected.length === 0) {
      setError('Please select at least one water source.')
      return
    }

    setLoading(true)

    try {
      // The existing Random Forest still predicts from its seven trained inputs.
      const data = await predictCrop(values)
      setResult(data.recommended_crop)
      setRecommendations(data.recommendations || [])

      // Initial guidance based on the farmer's stated water availability.
      // This does not claim to be a trained water-suitability model.
      if (waterAvailability === 'low' || irrigation === 'rainfall-only') {
        setWaterAdvice(
          'Water is limited or depends on rainfall. Check drought tolerance and local suitability before planting. Consider suitable millets or pulses where recommended by local agricultural guidance.'
        )
      } else if (
        waterAvailability === 'high' &&
        irrigation === 'regular'
      ) {
        setWaterAdvice(
          'You report reliable water and regular irrigation. Crops with higher water requirements may be options, but confirm soil suitability, seasonal conditions, water quantity, and local recommendations first.'
        )
      } else {
        setWaterAdvice(
          'Your water availability is moderate or depends on occasional irrigation. Compare the recommended crop’s water needs with expected seasonal rainfall and your reliable irrigation supply before planting.'
        )
      }
    } catch (err) {
      setError(err.message || 'Could not get a crop recommendation.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-3xl font-bold">AI Crop Recommendation</h1>

      <p className="mb-6 text-gray-600">
        Combine local weather, soil measurements, and your available
        water resources to support crop planning with YADU AI.
      </p>

      <section className="mb-6 rounded-xl border p-6">
        <h2 className="mb-3 text-xl font-semibold">Village Weather</h2>

        <form onSubmit={handleGetWeather} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={village}
            onChange={(event) => setVillage(event.target.value)}
            placeholder="Enter village or town, e.g. Raipur"
            required
            className="min-w-0 flex-1 rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={weatherLoading}
            className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {weatherLoading ? 'Fetching...' : 'Get Weather'}
          </button>
        </form>

        {weatherError && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-red-700">
            {weatherError}
          </p>
        )}

        {weather && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-900">
              {weather.location.village}, {weather.location.district},{' '}
              {weather.location.state}
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-3">
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-xl font-bold">
                  {weather.weather.temperature_c ?? 'N/A'} °C
                </p>
              </div>

              <div className="rounded-lg bg-white p-3">
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-xl font-bold">
                  {weather.weather.humidity_percent ?? 'N/A'}%
                </p>
              </div>

              <div className="rounded-lg bg-white p-3">
                <p className="text-sm text-gray-600">Current precipitation</p>
                <p className="text-xl font-bold">
                  {weather.weather.current_precipitation_mm ?? 'N/A'} mm
                </p>
              </div>
            </div>

            <h4 className="mt-4 font-semibold">7-day rainfall forecast</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(weather.weather.forecast_dates || []).map((date, index) => (
                <div key={date} className="rounded-lg bg-white p-3">
                  <p className="text-sm text-gray-600">{date}</p>
                  <p className="font-semibold">
                    {weather.weather.forecast_rainfall_mm?.[index] ?? 'N/A'} mm
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Weather source: {weather.source}. The 7-day forecast is not
              a seasonal rainfall prediction and is not automatically
              substituted for the model rainfall input.
            </p>
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 rounded-xl border p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-xl font-semibold">Soil and Crop Model Inputs</h2>
          <p className="mt-1 text-sm text-gray-600">
            Temperature and humidity fill automatically after weather lookup.
            Enter soil measurements and the rainfall value separately.
          </p>
        </div>

        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block font-medium">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type="number"
              step="any"
              required
              value={values[field.name]}
              onChange={handleChange}
              placeholder={field.hint}
              className="w-full rounded-lg border p-3"
            />
          </div>
        ))}

        <div className="sm:col-span-2 border-t pt-5">
          <h2 className="text-xl font-semibold">Water Availability & Irrigation</h2>
          <p className="mt-1 text-sm text-gray-600">
            Tell us which water sources are available for this field.
          </p>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-3 font-medium">Available water sources</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {waterSources.map((source) => (
              <label key={source} className="flex items-center gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  checked={waterSourcesSelected.includes(source)}
                  onChange={() => handleWaterSourceChange(source)}
                  className="h-4 w-4"
                />
                <span>{source}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="waterAvailability" className="mb-1 block font-medium">
            Overall water availability
          </label>
          <select
            id="waterAvailability"
            value={waterAvailability}
            onChange={(event) => setWaterAvailability(event.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="low">Low — limited water</option>
            <option value="moderate">Moderate — some irrigation available</option>
            <option value="high">High — reliable supply throughout the season</option>
          </select>
        </div>

        <div>
          <label htmlFor="irrigation" className="mb-1 block font-medium">
            Irrigation availability
          </label>
          <select
            id="irrigation"
            value={irrigation}
            onChange={(event) => setIrrigation(event.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="rainfall-only">Rainfall only</option>
            <option value="occasional">Occasional irrigation</option>
            <option value="regular">Regular irrigation as needed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-green-700 p-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60 sm:col-span-2"
        >
          {loading ? 'Analyzing...' : 'Recommend Crop'}
        </button>
      </form>

      
{result && (
  <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-5">
    <h2 className="text-xl font-bold text-green-800">
      Top Crop Recommendations
    </h2>

    <div className="mt-5 space-y-4">
      {recommendations.map((item, index) => (
        <div key={item.crop} className="rounded-lg border bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold capitalize">
              {index + 1}. {item.crop}
            </span>
            <span className="font-bold text-green-800">
              {Number(item.percentage).toFixed(2)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-600"
              style={{
                width: `${Math.min(100, Math.max(0, Number(item.percentage) || 0))}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>

    <p className="mt-4 text-xs text-gray-600">
      Percentages are model-predicted probabilities, not guaranteed
      chances of crop success.
    </p>

    {waterAdvice && (
      <div className="mt-4 rounded-lg border bg-white p-4">
        <h3 className="font-semibold">Water suitability guidance</h3>
        <p className="mt-1 text-gray-700">{waterAdvice}</p>
      </div>
    )}
  </div>
)}


      {error && (
        <p className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      )}
    </div>
  )
}
