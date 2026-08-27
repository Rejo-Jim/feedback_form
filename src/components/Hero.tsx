import type { View } from '../App'

interface Props {
  onNavigate: (v: View) => void
}

export function Hero({ onNavigate }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-100 via-brand-50 to-transparent blur-3xl opacity-70" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-400/10 blur-3xl" />
      </div>

      <div className="container-page pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center animate-slideUp">
          <span className="chip mb-5 bg-brand-50 text-brand-700 ring-1 ring-brand-200">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulseSoft" />
            End-to-end encrypted · No login required
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-900 sm:text-6xl">
            Speak safely.
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Be heard.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            A secure, fully anonymous portal for raising grievances and sharing
            feedback. No names, no accounts, no trace — just your voice and a
            tracking code to follow what happens next.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => onNavigate('submit')} className="btn-primary w-full sm:w-auto">
              Submit a grievance
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => onNavigate('track')} className="btn-ghost w-full sm:w-auto">
              Track a submission
            </button>
          </div>
          <p className="mt-5 text-xs font-medium text-ink-400">
            You'll receive a private tracking code. Keep it safe — it's the only way to check your report.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: '100%', v: 'Anonymous' },
            { k: '0', v: 'Personal data stored' },
            { k: '24h', v: 'Avg. acknowledgement' },
            { k: '5', v: 'Status stages' },
          ].map((s) => (
            <div key={s.v} className="card p-5 text-center animate-fadeIn">
              <div className="font-display text-2xl font-bold text-brand-700">{s.k}</div>
              <div className="mt-1 text-xs font-medium text-ink-500">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
