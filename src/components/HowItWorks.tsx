import type { View } from '../App'

interface Props {
  onNavigate: (v: View) => void
}

const STEPS = [
  { n: '01', title: 'Share your concern', text: 'Pick a category, set a priority, and write as much or as little as you want. Nothing identifies you.' },
  { n: '02', title: 'Get your tracking code', text: 'You receive a unique code instantly. Save it — it’s the only way to check your report later.' },
  { n: '03', title: 'We acknowledge & review', text: 'Every report is triaged by category and priority, then routed for review.' },
  { n: '04', title: 'Track the outcome', text: 'Use your code to see status changes and any official response. Choose to make it public to help others.' },
]

export function HowItWorks({ onNavigate }: Props) {
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip bg-ink-100 text-ink-600">How it works</span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Four steps, zero friction
        </h2>
        <p className="mt-4 text-ink-500">
          From concern to resolution, the process is designed to protect you at every stage.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className="card relative p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift animate-fadeIn"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="font-display text-4xl font-extrabold text-ink-100">{s.n}</span>
            <h3 className="mt-2 text-base font-bold text-ink-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button onClick={() => onNavigate('submit')} className="btn-primary">
          Start a submission
        </button>
        <button onClick={() => onNavigate('dashboard')} className="btn-ghost">
          View the public dashboard
        </button>
      </div>
    </section>
  )
}
