import { useState } from 'react'
import { supabase, CATEGORIES, PRIORITIES, type Grievance } from '../lib/supabase'
import type { View } from '../App'

interface Props {
  onNavigate: (v: View) => void
}

type Phase = 'form' | 'success'

export function SubmitForm({ onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>('form')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<string>('normal')
  const [department, setDepartment] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  const valid = category && subject.trim().length >= 3 && message.trim().length >= 10

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || loading) return
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('grievances')
        .insert({
          category,
          subject: subject.trim(),
          message: message.trim(),
          priority,
          department: department.trim() || null,
          is_public: isPublic,
        })
        .select()
        .single()
      if (error) throw error
      const g = data as Grievance
      setCode(g.tracking_code)
      setPhase('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Something went wrong sending your report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (phase === 'success') {
    return (
      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-xl">
          <div className="card overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-br from-success-500 to-success-600 px-8 py-10 text-center text-white">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15 backdrop-blur">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold">Report submitted</h2>
              <p className="mt-2 text-sm text-white/85">
                Your concern has been received anonymously. Save your tracking code below.
              </p>
            </div>
            <div className="p-8">
              <p className="label text-center">Your private tracking code</p>
              <div className="flex items-center justify-center">
                <code className="rounded-xl bg-ink-900 px-6 py-4 font-mono text-2xl font-bold tracking-[0.3em] text-white">
                  {code}
                </code>
              </div>
              <p className="mt-4 text-center text-xs leading-relaxed text-ink-500">
                Keep this code safe. It is the only way to check your report's status.
                We cannot recover it for you — that’s what keeps your report anonymous.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => onNavigate('track')}
                  className="btn-primary"
                >
                  Track this report
                </button>
                <button
                  onClick={() => {
                    setPhase('form')
                    setSubject('')
                    setMessage('')
                    setCategory('')
                    setDepartment('')
                    setIsPublic(false)
                    setPriority('normal')
                  }}
                  className="btn-ghost"
                >
                  Submit another
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <span className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200">New submission</span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Submit a grievance or feedback
          </h1>
          <p className="mt-3 text-ink-500">
            Everything here is anonymous. Share as much detail as you’re comfortable with.
          </p>
        </div>

        <form onSubmit={submit} className="card p-6 sm:p-8 space-y-6">
          <div>
            <label className="label">Category *</label>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`rounded-xl px-3 py-3 text-xs font-semibold ring-1 transition-all ${
                    category === c.value
                      ? 'bg-brand-600 text-white ring-brand-600 shadow-soft'
                      : 'bg-white text-ink-600 ring-ink-200 hover:bg-ink-50 hover:ring-ink-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="subject">Subject *</label>
            <input
              id="subject"
              className="input"
              placeholder="A short summary of your concern"
              maxLength={160}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <p className="mt-1.5 text-right text-xs text-ink-400">{subject.length}/160</p>
          </div>

          <div>
            <label className="label" htmlFor="message">Details *</label>
            <textarea
              id="message"
              className="input min-h-[160px] resize-y"
              placeholder="Describe what happened, when, and any context that would help reviewers. No names are required."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="mt-1.5 text-right text-xs text-ink-400">{message.length} characters</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Priority</label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map((p) => {
                  const active = priority === p.value
                  const tone: Record<string, string> = {
                    ink: active ? 'bg-ink-700 text-white ring-ink-700' : 'text-ink-600 ring-ink-200 hover:bg-ink-50',
                    brand: active ? 'bg-brand-600 text-white ring-brand-600' : 'text-brand-700 ring-brand-200 hover:bg-brand-50',
                    warning: active ? 'bg-warning-500 text-white ring-warning-500' : 'text-warning-600 ring-warning-200 hover:bg-warning-50',
                    error: active ? 'bg-error-500 text-white ring-error-500' : 'text-error-600 ring-error-200 hover:bg-error-50',
                  }
                  return (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold ring-1 transition ${tone[p.tone]}`}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="dept">Department (optional)</label>
              <input
                id="dept"
                className="input"
                placeholder="e.g. Operations, HR, Facilities"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-ink-50 p-4 ring-1 ring-ink-200 transition hover:bg-ink-100/60">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            <span>
              <span className="block text-sm font-semibold text-ink-800">Share on the public feed</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                Your report’s subject, message, and status will appear on the public dashboard so others can see how it was handled. No identifying info is ever included.
              </span>
            </span>
          </label>

          {error && (
            <div className="rounded-xl bg-error-50 px-4 py-3 text-sm font-medium text-error-600 ring-1 ring-error-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-5">
            <p className="text-xs text-ink-400">
              By submitting, you agree this is a good-faith report.
            </p>
            <button
              type="submit"
              disabled={!valid || loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5"/><path d="M21 12a9 9 0 00-9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
                  Sending…
                </>
              ) : (
                'Submit anonymously'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
