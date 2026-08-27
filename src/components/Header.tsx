import type { View } from '../App'

interface Props {
  view: View
  onNavigate: (v: View) => void
}

const NAV: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'submit', label: 'Submit' },
  { id: 'track', label: 'Track' },
  { id: 'dashboard', label: 'Dashboard' },
]

export function Header({ view, onNavigate }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 5 7 9v7c0 5.5 3.8 9.4 9 11 5.2-1.6 9-5.5 9-11V9l-9-4z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M12 16l2.6 2.6L20 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            VoiceBox
          </span>
          <span className="hidden rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500 sm:inline">
            Anonymous
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => onNavigate(n.id)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                view === n.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              }`}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => onNavigate('submit')}
            className="btn-primary ml-2 hidden sm:inline-flex"
          >
            Report now
          </button>
        </nav>
      </div>
    </header>
  )
}
