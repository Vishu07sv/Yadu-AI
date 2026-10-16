import { useMemo, useState } from 'react'
import { Search, ExternalLink, FileText, ListChecks, CalendarClock, MapPin, Landmark } from 'lucide-react'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'
import { SCHEMES, CATEGORIES, LEVELS, LAST_CHECKED } from '../data/govSchemes'

function StatusChip({ status, label }) {
  const ok = status === 'verified'
  return <span className={`chip ${ok ? 'chip-healthy' : 'chip-warning'}`}>{label}: {ok ? 'Verified' : 'Unconfirmed'}</span>
}

function SchemeCard({ s, onOpen }) {
  return (
    <article className="card p-5 flex flex-col gap-3" data-testid="scheme-card">
      <div className="flex flex-wrap gap-1.5">
        <span className="chip chip-sky">{s.level}</span>
        <span className="chip chip-soil">{s.category}</span>
        {s.raipur && <span className="chip chip-healthy"><MapPin size={12} /> Raipur</span>}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink leading-snug">{s.name}</h3>
      <p className="text-sm text-ink-muted"><span className="font-semibold text-ink">Benefits: </span>{s.benefits}</p>
      <p className="text-sm text-ink-muted line-clamp-3"><span className="font-semibold text-ink">Eligibility: </span>{s.eligibility}</p>
      <div className="flex flex-wrap gap-1.5">
        <StatusChip status={s.eligibilityStatus} label="Eligibility" />
        <StatusChip status={s.deadlineStatus} label="Deadline" />
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <button onClick={() => onOpen(s)} className="btn-primary !px-5 !py-2 text-sm">View Details</button>
        <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-4 !py-2 text-sm">
          Official site <ExternalLink size={14} />
        </a>
      </div>
    </article>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 font-semibold text-ink mb-1.5"><Icon size={16} className="text-primary" />{title}</h4>
      {children}
    </div>
  )
}

export default function GovSchemes() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [level, setLevel] = useState('All')
  const [open, setOpen] = useState(null)

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return SCHEMES.filter((s) =>
      (cat === 'All' || s.category === cat) &&
      (level === 'All' || s.level === level) &&
      (!t || [s.name, s.benefits, s.eligibility, s.category, s.level].join(' ').toLowerCase().includes(t))
    ).sort((a, b) => Number(b.raipur) - Number(a.raipur))
  }, [q, cat, level])

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Government Schemes</h1>
        <p className="flex items-center gap-1 text-sm text-ink-muted mt-1">
          <MapPin size={13} className="text-primary" /> Central &amp; Chhattisgarh schemes for farmers in Raipur
        </p>
      </div>

      <div className="rounded-xl bg-warning-light border border-warning/30 px-4 py-3 text-sm text-ink">
        Details marked <strong>Unconfirmed</strong> could not be verified on an official source. Please confirm on the official
        site or at your Raipur agriculture office before applying.
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input className="input-field !pl-10" placeholder="Search schemes, e.g. insurance, solar pump…"
            value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search schemes" />
        </div>
        <select className="input-field w-auto" value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Government level">
          <option value="All">Central + State</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
              cat === c ? 'bg-primary text-white border-primary' : 'bg-white text-ink-muted border-border hover:bg-primary-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="🔎" title="No schemes found" description="Try a different search or clear the filters."
          action={<button className="btn-secondary" onClick={() => { setQ(''); setCat('All'); setLevel('All') }}>Clear filters</button>} />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((s) => <SchemeCard key={s.id} s={s} onOpen={setOpen} />)}
        </div>
      )}

      <Modal isOpen={!!open} onClose={() => setOpen(null)} title={open?.name} maxWidth="max-w-2xl">
        {open && (
          <div className="space-y-5 text-sm text-ink-muted">
            <div className="flex flex-wrap gap-1.5">
              <span className="chip chip-sky">{open.level}</span><span className="chip chip-soil">{open.category}</span>
            </div>
            <Section icon={Landmark} title="Benefits"><p>{open.benefits}</p></Section>
            <Section icon={ListChecks} title="Eligibility">
              <p>{open.eligibility}</p><div className="mt-2"><StatusChip status={open.eligibilityStatus} label="Eligibility" /></div>
            </Section>
            <Section icon={FileText} title="Required documents">
              <ul className="list-disc pl-5 space-y-0.5">{open.documents.map((d) => <li key={d}>{d}</li>)}</ul>
            </Section>
            <Section icon={ListChecks} title="How to apply">
              <ol className="list-decimal pl-5 space-y-0.5">{open.process.map((d) => <li key={d}>{d}</li>)}</ol>
            </Section>
            <Section icon={CalendarClock} title="Deadline">
              <p>{open.deadline}</p><div className="mt-2"><StatusChip status={open.deadlineStatus} label="Deadline" /></div>
            </Section>
            <p className="text-xs text-ink-faint">Source: {open.source}. Last checked {LAST_CHECKED}.</p>
            <a href={open.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Go to official site <ExternalLink size={16} />
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}
