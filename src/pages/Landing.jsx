import { Link } from 'react-router-dom'
import {
  CloudSun, Mountain, Stethoscope, LineChart, MessageCircle, Sparkles,
  ArrowRight, Sprout, MapPin, Droplets, Wind,
} from 'lucide-react'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import HealthScore from '../components/HealthScore'

const features = [
  {
    icon: CloudSun,
    tone: 'sky',
    title: 'Weather Intelligence',
    desc: 'Get local weather information for your farm, updated through the day.',
  },
  {
    icon: Mountain,
    tone: 'soil',
    title: 'Soil Insights',
    desc: 'Understand your soil conditions and nutrient information at a glance.',
  },
  {
    icon: Stethoscope,
    tone: 'healthy',
    title: 'Crop Health',
    desc: 'Upload a crop photo and get AI-powered health analysis in seconds.',
  },
  {
    icon: LineChart,
    tone: 'warning',
    title: 'Market Prices',
    desc: 'Track crop and mandi prices so you know when to sell.',
  },
  {
    icon: MessageCircle,
    tone: 'primary',
    title: 'AI Farming Assistant',
    desc: 'Ask farming questions in plain language and get personalized answers.',
  },
  {
    icon: Sparkles,
    tone: 'sky',
    title: 'Smart Recommendations',
    desc: 'Get useful farming recommendations based on your own farm data.',
  },
]

const steps = [
  { n: '01', title: 'Add your farm', desc: 'Tell us your location, farm area and main crop.' },
  { n: '02', title: 'Get local data', desc: 'Weather, soil and market prices tuned to your area.' },
  { n: '03', title: 'Monitor your crops', desc: 'Track health scores and catch issues early.' },
  { n: '04', title: 'Ask Yadu AI', desc: 'Get plain-language answers whenever you need them.' },
]

const toneClasses = {
  primary: 'bg-primary-50 text-primary',
  sky: 'bg-sky-light text-sky',
  soil: 'bg-soil-light text-soil',
  healthy: 'bg-healthy-light text-healthy',
  warning: 'bg-warning-light text-warning',
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/70 to-bg -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="label-eyebrow">🌾 Yadu AI</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold text-ink mt-4">
              Smart Farming.<br />
              <span className="text-primary">Better Decisions.</span>
            </h1>
            <p className="text-ink-muted text-base sm:text-lg mt-5 max-w-md">
              Your AI-powered farming assistant that helps you understand your crops, weather, soil and market conditions.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/register" className="btn-primary">
                Get Started <ArrowRight size={17} />
              </Link>
              <a href="#features" className="btn-secondary">Explore Features</a>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-ink-muted">
              <div className="flex items-center gap-1.5"><Sprout size={16} className="text-primary" /> Built for Indian farms</div>
              <div className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> Location-aware</div>
            </div>
          </div>

          {/* Product-derived hero visual: a live preview of "Your Farm Today" */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="field-divider absolute -top-4 left-6 right-6 rounded-full" aria-hidden="true" />
            <div className="card p-5 sm:p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="label-eyebrow">Your Farm Today</p>
                  <p className="flex items-center gap-1 text-sm text-ink-muted mt-1">
                    <MapPin size={13} className="text-primary" /> Raipur, Chhattisgarh
                  </p>
                </div>
                <HealthScore score={82} size={56} strokeWidth={6} showLabel={false} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-sky-light p-3">
                  <CloudSun size={18} className="text-sky mb-1.5" />
                  <p className="text-sm font-semibold text-ink">29°C · Cloudy</p>
                  <p className="text-xs text-ink-muted flex items-center gap-1 mt-0.5"><Droplets size={11} /> 72% humidity</p>
                </div>
                <div className="rounded-xl bg-soil-light p-3">
                  <Mountain size={18} className="text-soil mb-1.5" />
                  <p className="text-sm font-semibold text-ink">Good soil</p>
                  <p className="text-xs text-ink-muted mt-0.5">pH 6.7</p>
                </div>
                <div className="rounded-xl bg-warning-light p-3">
                  <Wind size={18} className="text-warning mb-1.5" />
                  <p className="text-sm font-semibold text-ink">Irrigation</p>
                  <p className="text-xs text-ink-muted mt-0.5">Water needed soon</p>
                </div>
                <div className="rounded-xl bg-primary-50 p-3">
                  <LineChart size={18} className="text-primary mb-1.5" />
                  <p className="text-sm font-semibold text-ink">Rice ₹2,450</p>
                  <p className="text-xs text-ink-muted mt-0.5">per quintal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="max-w-xl mb-12">
          <span className="label-eyebrow">What you get</span>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-3">
            Everything your farm needs, in one place
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, tone, title, desc }) => (
            <div key={title} className="card p-6 hover:shadow-lift transition-shadow">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${toneClasses[tone]}`}>
                <Icon size={20} strokeWidth={2.25} />
              </div>
              <h3 className="font-display font-semibold text-ink">{title}</h3>
              <p className="text-sm text-ink-muted mt-1.5 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-primary-50/50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <span className="label-eyebrow">The process</span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-3">How Yadu AI works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <span className="font-mono text-sm text-primary/50">{s.n}</span>
                <h3 className="font-display font-semibold text-ink mt-2">{s.title}</h3>
                <p className="text-sm text-ink-muted mt-1.5">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-2 -right-3 w-6 h-px bg-primary/20" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        <div className="rounded-3xl bg-primary text-white px-6 sm:px-16 py-14 sm:py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" aria-hidden="true" />
          <h2 className="font-display text-2xl sm:text-3xl font-semibold relative">
            Start farming smarter with Yadu AI.
          </h2>
          <p className="text-white/80 mt-3 max-w-md mx-auto relative">
            Free to try. No equipment needed — just your phone and your fields.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary font-semibold rounded-full px-7 py-3.5 mt-7 hover:bg-white/90 transition-colors relative">
            Get Started <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
