import { useState } from 'react'
import { supabase, STATUS_META, CATEGORIES, type Grievance } from '../lib/supabase'
import type { View } from '../App'

interface Props {
  onNavigate: (v: View) => void
  tracked: Grievance | null
  setTracked: (g: Grievance | null) => void
}

export function TrackLookup({ onNavigate, tracked, setTracked }: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function lookup(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || loading) return
    setLoading(true)
    setError(null)
    setTracked(null)
    try {
      const { data, error } = await supabase.rpc('track_grievance', { p_code: code.trim().toUpperCase() })
      if (error) throw error
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError('No report found with that code. Check the code and try again.')
        return
      }
      const g = (Array.isArray(data) ? data[0] : data) as Grievance
      setTracked(g)
    } catch {
      setError('We couldn’t look up that code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cat = CATEGORIES.find((c) => c.value === tracked?.category)
  const status = tracked ? STATUS_META[tracked.status] : null

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200">Track</span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Track your submission
          </h1>
          <p className="mt-3 text-ink-500">
            Enter the tracking code you received when you submitted your report.
          </p>
        </div>

        <form onSubmit={lookup} className="card p-6 sm:p-8">
          <label className="label" htmlFor="code">Tracking code</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="code"
              className="input font-mono uppercase tracking-widest"
              placeholder="e.g. XQ7K2M9P4T"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
            <button type="submit" disabled={!code.trim() || loading} className="btn-primary shrink-0">
              {loading ? 'Checking…' : 'Check status'}
            </button>
          </div>
          {error && (
            <div className="mt-4 rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-600 ring-1 ring-error-200">
              {error}
            </div>
          )}
        </form>

        {tracked && status && (
          <div className="mt-8 card overflow-hidden animate-slideUp">
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  {cat?.label ?? tracked.category}
                </p>
                <h2 className="mt-1 text-lg font-bold text-ink-900">{tracked.subject}</h2>
              </div>
              <span className={`chip ${
                status.tone === 'success' ? 'bg-success-500/10 text-success-600' :
                status.tone === 'warning' ? 'bg-warning-500/10 text-warning-600' :
                status.tone === 'brand' ? 'bg-brand-50 text-brand-700' :
                'bg-ink-100 text-ink-600'
              }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {status.label}
              </span>
            </div>

            <div className="px-6 py-6">
              <div className="mb-6 flex items-center justify-between">
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const done = meta.step <= status.step
                  const current = meta.step === status.step
                  return (
                    <div key={key} className="flex flex-1 flex-col items-center text-center">
                      <div className="flex w-full items-center">
                        <div className={`h-1 flex-1 rounded-full ${meta.step === 1 ? 'bg-transparent' : done ? 'bg-brand-500' : 'bg-ink-200'}`} />
                        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold transition-all ${
                          current ? 'bg-brand-600 text-white ring-4 ring-brand-100 scale-110' :
                          done ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-400'
                        }`}>
                          {done && !current ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          ) : meta.step}
                        </div>
                        <div className={`h-1 flex-1 rounded-full ${meta.step === 5 ? 'bg-transparent' : done && meta.step < status.step ? 'bg-brand-500' : 'bg-ink-200'}`} />
                      </div>
                      <span className={`mt-2 text-[10px] font-semibold ${current ? 'text-brand-700' : done ? 'text-ink-700' : 'text-ink-400'}`}>
                        {meta.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-ink-50 p-4 ring-1 ring-ink-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Priority</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-ink-800">{tracked.priority}</p>
                </div>
                <div className="rounded-xl bg-ink-50 p-4 ring-1 ring-ink-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Submitted</p>
                  <p className="mt-1 text-sm font-semibold text-ink-800">
                    {new Date(tracked.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-ink-50 p-4 ring-1 ring-ink-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Your message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{tracked.message}</p>
              </div>

              {tracked.response && (
                <div className="mt-4 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Official response</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-800">{tracked.response}</p>
                  {tracked.responded_at && (
                    <p className="mt-2 text-xs text-ink-400">
                      Responded {new Date(tracked.responded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!tracked && !error && (
          <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
            <p className="text-sm text-ink-500">
              Lost your code? We can’t recover it — that’s what keeps your report anonymous.
              You can still browse the <button onClick={() => onNavigate('dashboard')} className="font-semibold text-brand-600 hover:underline">public dashboard</button>.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
