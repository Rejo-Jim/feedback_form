import { useEffect, useState } from 'react'
import { supabase, STATUS_META, CATEGORIES, type Grievance } from '../lib/supabase'
import type { View } from '../App'

interface Props {
  onNavigate: (v: View) => void
}

interface Stats {
  total: number
  publicCount: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  acknowledgedRate: number
}

export function Dashboard({ onNavigate }: Props) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [feed, setFeed] = useState<Grievance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    (async () => {
      try {
        const [{ data: pub, error: e1 }, { data: all, error: e2 }] = await Promise.all([
          supabase.from('grievances').select('*').eq('is_public', true).order('created_at', { ascending: false }).limit(60),
          supabase.from('grievances').select('status,category,is_public'),
        ])
        if (e1 || e2) throw e1 || e2
        const rows = (all ?? []) as Pick<Grievance, 'status' | 'category' | 'is_public'>[]
        const byStatus: Record<string, number> = {}
        const byCategory: Record<string, number> = {}
        let publicCount = 0
        let acked = 0
        for (const r of rows) {
          byStatus[r.status] = (byStatus[r.status] || 0) + 1
          byCategory[r.category] = (byCategory[r.category] || 0) + 1
          if (r.is_public) publicCount++
          if (r.status !== 'submitted') acked++
        }
        setStats({
          total: rows.length,
          publicCount,
          byStatus,
          byCategory,
          acknowledgedRate: rows.length ? Math.round((acked / rows.length) * 100) : 0,
        })
        setFeed((pub ?? []) as Grievance[])
      } catch {
        setError('We couldn’t load the dashboard. Please try again shortly.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = filter === 'all' ? feed : feed.filter((g) => g.category === filter)

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mb-8">
        <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200">Transparency</span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Public dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-ink-500">
          A live, anonymized view of community feedback and how it’s being handled.
          Only reports submitters chose to share publicly appear here.
        </p>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulseSoft bg-ink-100/50" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-600 ring-1 ring-error-200">
          {error}
        </div>
      )}

      {stats && !loading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total reports" value={stats.total} hint="All submissions" tone="ink" />
            <StatCard label="Acknowledged" value={`${stats.acknowledgedRate}%`} hint="Beyond 'submitted'" tone="brand" />
            <StatCard label="Resolved" value={stats.byStatus.resolved || 0} hint="Marked resolved" tone="success" />
            <StatCard label="Public reports" value={stats.publicCount} hint="Shared on this feed" tone="ink" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-1">
              <h3 className="text-sm font-bold text-ink-900">By status</h3>
              <div className="mt-4 space-y-3">
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const count = stats.byStatus[key] || 0
                  const pct = stats.total ? (count / stats.total) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-ink-600">{meta.label}</span>
                        <span className="font-bold text-ink-800">{count}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            meta.tone === 'success' ? 'bg-success-500' :
                            meta.tone === 'warning' ? 'bg-warning-500' :
                            meta.tone === 'brand' ? 'bg-brand-500' :
                            'bg-ink-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card p-6 lg:col-span-2">
              <h3 className="text-sm font-bold text-ink-900">By category</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CATEGORIES.map((c) => {
                  const count = stats.byCategory[c.value] || 0
                  return (
                    <div key={c.value} className="rounded-xl bg-ink-50 p-3 text-center ring-1 ring-ink-100">
                      <div className="font-display text-xl font-bold text-ink-900">{count}</div>
                      <div className="mt-0.5 text-[10px] font-medium leading-tight text-ink-500">{c.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-xl font-bold text-ink-900">Public reports</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${filter === 'all' ? 'bg-ink-900 text-white ring-ink-900' : 'bg-white text-ink-600 ring-ink-200 hover:bg-ink-50'}`}
                >
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setFilter(c.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${filter === c.value ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink-600 ring-ink-200 hover:bg-ink-50'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
                <p className="text-sm text-ink-500">
                  {feed.length === 0
                    ? 'No public reports yet. Be the first to share one.'
                    : 'No public reports in this category yet.'}
                </p>
                <button onClick={() => onNavigate('submit')} className="btn-primary mt-4">
                  Submit a report
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((g) => {
                  const meta = STATUS_META[g.status]
                  const cat = CATEGORIES.find((c) => c.value === g.category)
                  return (
                    <article key={g.id} className="card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="chip bg-ink-100 text-ink-600">{cat?.label ?? g.category}</span>
                        <span className={`chip ${
                          meta.tone === 'success' ? 'bg-success-500/10 text-success-600' :
                          meta.tone === 'warning' ? 'bg-warning-500/10 text-warning-600' :
                          meta.tone === 'brand' ? 'bg-brand-50 text-brand-700' :
                          'bg-ink-100 text-ink-600'
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {meta.label}
                        </span>
                      </div>
                      <h4 className="mt-3 text-base font-bold text-ink-900">{g.subject}</h4>
                      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-500">{g.message}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                        <span className="capitalize">{g.priority} priority</span>
                        <span>{new Date(g.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                      {g.response && (
                        <div className="mt-3 rounded-lg bg-brand-50 px-3 py-2 ring-1 ring-brand-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">Response</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-700">{g.response}</p>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

function StatCard({ label, value, hint, tone }: { label: string; value: string | number; hint: string; tone: string }) {
  const accent: Record<string, string> = {
    ink: 'text-ink-900',
    brand: 'text-brand-700',
    success: 'text-success-600',
  }
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
      <p className={`mt-1 font-display text-3xl font-bold ${accent[tone]}`}>{value}</p>
      <p className="mt-1 text-xs text-ink-400">{hint}</p>
    </div>
  )
}
