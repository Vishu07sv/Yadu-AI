
import { useState } from 'react'
import { Calculator, Plus, Trash2, Sprout, IndianRupee } from 'lucide-react'
import { compareFarmEconomics } from '../services/api'

const createCrop = (name = 'Rice') => ({
  name,
  yield_quintals_per_acre: 20,
  price_per_quintal: 2200,
  expenses: [
    { name: 'Seeds', cost_per_acre: 1500, upfront_fraction: 1 },
    { name: 'Fertilizer', cost_per_acre: 3000, upfront_fraction: 0.5 },
    { name: 'Labour', cost_per_acre: 4000, upfront_fraction: 0 },
    { name: 'Irrigation', cost_per_acre: 1500, upfront_fraction: 0.5 },
  ],
})

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

function Field({ label, value, onChange, type = 'number', min = 0, step = 'any' }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-green-600"
        type={type}
        min={min}
        step={step}
        value={value}
        onChange={(e) =>
          onChange(type === 'number' ? Number(e.target.value) : e.target.value)
        }
        required
      />
    </label>
  )
}

export default function FarmEconomics() {
  const [area, setArea] = useState(2)
  const [crops, setCrops] = useState([createCrop('Rice'), createCrop('Maize')])
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateCrop = (cropIndex, field, value) => {
    setCrops((previous) =>
      previous.map((crop, index) =>
        index === cropIndex ? { ...crop, [field]: value } : crop
      )
    )
    setResults(null)
  }

  const updateExpense = (cropIndex, expenseIndex, field, value) => {
    setCrops((previous) =>
      previous.map((crop, index) =>
        index !== cropIndex
          ? crop
          : {
              ...crop,
              expenses: crop.expenses.map((expense, i) =>
                i === expenseIndex ? { ...expense, [field]: value } : expense
              ),
            }
      )
    )
    setResults(null)
  }

  const addCrop = () => {
    setCrops((previous) => [...previous, createCrop('New Crop')])
    setResults(null)
  }

  const removeCrop = (index) => {
    setCrops((previous) => previous.filter((_, i) => i !== index))
    setResults(null)
  }

  const addExpense = (cropIndex) => {
    setCrops((previous) =>
      previous.map((crop, index) =>
        index === cropIndex
          ? {
              ...crop,
              expenses: [
                ...crop.expenses,
                { name: 'Other expense', cost_per_acre: 0, upfront_fraction: 0 },
              ],
            }
          : crop
      )
    )
    setResults(null)
  }

  const removeExpense = (cropIndex, expenseIndex) => {
    setCrops((previous) =>
      previous.map((crop, index) =>
        index === cropIndex
          ? {
              ...crop,
              expenses: crop.expenses.filter((_, i) => i !== expenseIndex),
            }
          : crop
      )
    )
    setResults(null)
  }

  const calculate = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)

    try {
      if (crops.length < 1) {
        throw new Error('Add at least one crop to compare.')
      }

      const names = crops.map((crop) => crop.name.trim().toLowerCase())
      if (names.some((name) => !name)) {
        throw new Error('Enter a name for every crop.')
      }
      if (new Set(names).size !== names.length) {
        throw new Error('Each crop must have a different name.')
      }

      const payload = {
        area_acres: area,
        crops: crops.map((crop) => ({
          name: crop.name.trim(),
          yield_quintals_per_acre: crop.yield_quintals_per_acre,
          price_per_quintal: crop.price_per_quintal,
          expenses: crop.expenses.map((expense) => ({
            name: expense.name.trim(),
            cost_per_acre: expense.cost_per_acre,
            upfront_fraction: expense.upfront_fraction,
          })),
        })),
      }

      const data = await compareFarmEconomics(payload)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Unable to calculate farm economics.')
    } finally {
      setLoading(false)
    }
  }

  const rows = results
    ? Array.isArray(results)
      ? results
      : results.results || results.comparisons || results.crops || []
    : []

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <Calculator size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Farm Economics
              </h1>
              <p className="text-sm text-gray-500">
                Compare crop costs, initial capital, revenue and estimated profit.
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={calculate} className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Farm details
            </h2>
            <div className="max-w-xs">
              <Field
                label="Total cultivated area (acres)"
                value={area}
                min={0.01}
                step="0.01"
                onChange={setArea}
              />
            </div>
          </section>

          {crops.map((crop, cropIndex) => (
            <section
              key={cropIndex}
              className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Sprout className="text-green-600" />
                  Crop {cropIndex + 1}
                </h2>
                {crops.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCrop(cropIndex)}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Crop name"
                  type="text"
                  value={crop.name}
                  onChange={(value) => updateCrop(cropIndex, 'name', value)}
                />
                <Field
                  label="Expected yield (quintals/acre)"
                  value={crop.yield_quintals_per_acre}
                  min={0}
                  step="0.1"
                  onChange={(value) =>
                    updateCrop(cropIndex, 'yield_quintals_per_acre', value)
                  }
                />
                <Field
                  label="Selling price (₹/quintal)"
                  value={crop.price_per_quintal}
                  min={0}
                  onChange={(value) =>
                    updateCrop(cropIndex, 'price_per_quintal', value)
                  }
                />
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-800">
                  Farming expenses (per acre)
                </h3>

                <div className="space-y-3">
                  {crop.expenses.map((expense, expenseIndex) => (
                    <div
                      key={expenseIndex}
                      className="grid items-end gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                    >
                      <Field
                        label="Expense name"
                        type="text"
                        value={expense.name}
                        onChange={(value) =>
                          updateExpense(cropIndex, expenseIndex, 'name', value)
                        }
                      />
                      <Field
                        label="Cost (₹/acre)"
                        value={expense.cost_per_acre}
                        min={0}
                        onChange={(value) =>
                          updateExpense(
                            cropIndex,
                            expenseIndex,
                            'cost_per_acre',
                            value
                          )
                        }
                      />
                      <Field
                        label="Upfront fraction (0–1)"
                        value={expense.upfront_fraction}
                        min={0}
                        max={1}
                        step="0.1"
                        onChange={(value) =>
                          updateExpense(
                            cropIndex,
                            expenseIndex,
                            'upfront_fraction',
                            Math.min(1, Math.max(0, value))
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label="Remove expense"
                        onClick={() => removeExpense(cropIndex, expenseIndex)}
                        className="mb-1 rounded-lg p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addExpense(cropIndex)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-green-600 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                >
                  <Plus size={16} /> Add expense
                </button>
              </div>
            </section>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addCrop}
              className="inline-flex items-center gap-2 rounded-xl border border-green-600 px-4 py-3 font-medium text-green-700 hover:bg-green-50"
            >
              <Plus size={18} /> Add another crop
            </button>

            <button
              type="submit"
              disabled={loading || area <= 0 || crops.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IndianRupee size={18} />
              {loading ? 'Calculating...' : 'Compare Farm Economics'}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <strong>Calculation failed:</strong> {error}
          </div>
        )}

        {results && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Comparison results
            </h2>

            {rows.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {rows.map((item, index) => (
                  <article
                    key={item.name || item.crop || index}
                    className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name || item.crop || `Crop ${index + 1}`}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['Initial capital', item.initial_capital],
                        ['Seasonal cost', item.seasonal_cost],
                        ['Expected revenue', item.revenue],
                        ['Base profit', item.base_profit ?? item.profit],
                        ['Break-even price', item.break_even_price],
                      ]
                        .filter(([, value]) => value !== undefined && value !== null)
                        .map(([label, value]) => (
                          <div key={label} className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">{label}</p>
                            <p className="mt-1 font-semibold text-gray-900">
                              {money(value)}
                            </p>
                          </div>
                        ))}
                    </div>

                    {(item.scenarios || item.profit_scenarios) && (
                      <div>
                        <h4 className="mb-2 font-semibold text-gray-800">
                          Profit scenarios
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(
                            item.scenarios || item.profit_scenarios
                          ).map(([scenario, details]) => (
                            <div
                              key={scenario}
                              className="flex justify-between gap-3 border-b border-gray-100 py-2 text-sm"
                            >
                              <span className="capitalize text-gray-600">
                                {scenario}
                              </span>
                              <span className="font-medium text-gray-900">
                                {money(
                                  typeof details === 'object'
                                    ? details.profit ?? details.net_profit ?? details
                                    : details
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                The API returned a response, but its result structure does not
                match the page's expected format. Check the response below and
                adjust the result fields to match your backend.
              </div>
            )}

            <details className="rounded-xl border border-gray-200 bg-white p-4">
              <summary className="cursor-pointer font-medium text-gray-700">
                View raw API response (for debugging)
              </summary>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-gray-700">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>

            <p className="text-sm text-gray-500">
              Estimates are based on the yield, selling price and expenses you
              entered. They are not guaranteed returns or live market quotes.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
