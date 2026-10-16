
import { useMemo, useState } from 'react'
import SmartIrrigationPlanner from '../components/SmartIrrigationPlanner'
import {
  CalendarDays,
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  Scissors,
  CheckCircle2,
  Circle,
} from 'lucide-react'

const cropPlans = {
  Rice: [
    { day: 0, title: 'Sowing / transplanting', type: 'Sowing' },
    { day: 7, title: 'Check germination and plant establishment', type: 'Monitoring' },
    { day: 15, title: 'Inspect weeds and water conditions', type: 'Weed control' },
    { day: 25, title: 'Assess nutrient requirements', type: 'Fertilizer' },
    { day: 45, title: 'Monitor crop growth and pests', type: 'Pest monitoring' },
    { day: 65, title: 'Check flowering development', type: 'Growth stage' },
    { day: 90, title: 'Inspect grain development', type: 'Monitoring' },
    { day: 120, title: 'Assess crop maturity before harvest', type: 'Harvest' },
  ],
  Wheat: [
    { day: 0, title: 'Sowing', type: 'Sowing' },
    { day: 7, title: 'Check germination and plant stand', type: 'Monitoring' },
    { day: 20, title: 'Inspect weeds and crop growth', type: 'Weed control' },
    { day: 25, title: 'Assess early nutrient requirements', type: 'Fertilizer' },
    { day: 45, title: 'Monitor tillering and crop health', type: 'Monitoring' },
    { day: 65, title: 'Inspect stem elongation', type: 'Growth stage' },
    { day: 85, title: 'Monitor flowering and grain formation', type: 'Monitoring' },
    { day: 120, title: 'Assess grain maturity before harvest', type: 'Harvest' },
  ],
  Maize: [
    { day: 0, title: 'Sowing', type: 'Sowing' },
    { day: 7, title: 'Check germination', type: 'Monitoring' },
    { day: 20, title: 'Inspect weeds and early growth', type: 'Weed control' },
    { day: 30, title: 'Assess nutrient requirements', type: 'Fertilizer' },
    { day: 50, title: 'Monitor pests and crop development', type: 'Pest monitoring' },
    { day: 65, title: 'Inspect tasseling and silking', type: 'Growth stage' },
    { day: 85, title: 'Check cob and grain development', type: 'Monitoring' },
    { day: 110, title: 'Assess maturity before harvest', type: 'Harvest' },
  ],
  Soybean: [
    { day: 0, title: 'Sowing', type: 'Sowing' },
    { day: 7, title: 'Check emergence', type: 'Monitoring' },
    { day: 20, title: 'Inspect weeds and plant growth', type: 'Weed control' },
    { day: 30, title: 'Monitor crop health and nodulation', type: 'Monitoring' },
    { day: 45, title: 'Inspect flowering and pests', type: 'Pest monitoring' },
    { day: 65, title: 'Monitor pod formation', type: 'Growth stage' },
    { day: 90, title: 'Check pod filling and maturity', type: 'Monitoring' },
    { day: 105, title: 'Assess readiness for harvest', type: 'Harvest' },
  ],
  Cotton: [
    { day: 0, title: 'Sowing', type: 'Sowing' },
    { day: 10, title: 'Check emergence and plant stand', type: 'Monitoring' },
    { day: 25, title: 'Inspect weeds and early growth', type: 'Weed control' },
    { day: 40, title: 'Assess nutrient requirements', type: 'Fertilizer' },
    { day: 60, title: 'Monitor pests and flowering', type: 'Pest monitoring' },
    { day: 90, title: 'Inspect boll development', type: 'Growth stage' },
    { day: 120, title: 'Monitor boll opening', type: 'Monitoring' },
    { day: 160, title: 'Assess picking readiness', type: 'Harvest' },
  ],
}

const typeIcons = {
  Sowing: Sprout,
  Monitoring: Circle,
  'Weed control': Scissors,
  Fertilizer: FlaskConical,
  'Pest monitoring': Bug,
  'Growth stage': Sprout,
  Harvest: CheckCircle2,
}

const today = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function CropCalendar() {
  const [crop, setCrop] = useState('Rice')
  const [sowingDate, setSowingDate] = useState(today())
  const [location, setLocation] = useState('')
  const [completed, setCompleted] = useState([])
  const [filter, setFilter] = useState('All')

  const activities = useMemo(
    () =>
      (cropPlans[crop] || []).map((activity, index) => ({
        ...activity,
        id: `${crop}-${index}`,
        date: addDays(sowingDate, activity.day),
      })),
    [crop, sowingDate]
  )

  const filteredActivities = activities.filter((activity) => {
    if (filter === 'Completed') return completed.includes(activity.id)
    if (filter === 'Pending') return !completed.includes(activity.id)
    return true
  })

  const doneCount = activities.filter((item) =>
    completed.includes(item.id)
  ).length

  const progress = Math.round((doneCount / activities.length) * 100)

  const changeCrop = (value) => {
    setCrop(value)
    setCompleted([])
  }

  const changeSowingDate = (value) => {
    setSowingDate(value)
    setCompleted([])
  }

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-4 md:p-8">
      <header className="flex items-start gap-3">
        <div className="rounded-xl bg-green-100 p-3 text-green-700">
          <CalendarDays size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Crop Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Plan crop activities and track your farming schedule.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Plan your crop season
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-600">
              Select crop
            </span>
            <select
              value={crop}
              onChange={(e) => changeCrop(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-3"
            >
              {Object.keys(cropPlans).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-600">
              Sowing date
            </span>
            <input
              type="date"
              required
              value={sowingDate}
              onChange={(e) => changeSowingDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-600">
              Village / district (optional)
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Durg, Chhattisgarh"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Activity dates are approximate planning estimates. Actual timing
          depends on variety, region, weather and farming practices.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Planned activities</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {activities.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-1 text-3xl font-bold text-green-700">
            {doneCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Progress</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{progress}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Season timeline
            </h2>
            <p className="text-sm text-gray-500">
              {crop} · {location.trim() || 'Location not specified'}
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white p-2 text-sm"
            aria-label="Filter activities"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="space-y-0">
          {filteredActivities.map((activity, index) => {
            const Icon = typeIcons[activity.type] || Circle
            const isDone = completed.includes(activity.id)

            return (
              <div key={activity.id} className="flex gap-4">
                <div className="flex w-5 flex-col items-center">
                  <div
                    className={`z-10 rounded-full p-1 ${
                      isDone
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {isDone
                      ? <CheckCircle2 size={18} />
                      : <Icon size={18} />}
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div className="min-h-12 w-px flex-1 bg-gray-200" />
                  )}
                </div>

                <div className="mb-4 flex-1 rounded-xl border border-gray-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        {activity.type} · Day {activity.day}
                      </p>
                      <h3
                        className={`mt-1 font-semibold ${
                          isDone ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {activity.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {activity.date}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCompleted((previous) =>
                          isDone
                            ? previous.filter((id) => id !== activity.id)
                            : [...previous, activity.id]
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        isDone
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {isDone ? 'Mark pending' : 'Mark completed'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredActivities.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              No activities match this filter.
            </p>
          )}
        </div>
      </section>
        
       <SmartIrrigationPlanner />

<p className="flex items-start gap-2 text-xs text-gray-500">
  <Droplets size={16} className="mt-0.5 shrink-0" />
  Irrigation and fertilizer decisions should be adjusted for rainfall,
  soil conditions and local agricultural recommendations. This initial
  calendar is a planning prototype, not an automated agronomy advisory.
</p>
      
    </div>
  )
}
