import type { View } from '../App'

interface Props {
  onNavigate: (v: View) => void
}

export function Footer({ onNavigate }: Props) {
  return (
    <footer className="border-t border-ink-200/70 bg-ink-950 text-ink-300">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M16 5 7 9v7c0 5.5 3.8 9.4 9 11 5.2-1.6 9-5.5 9-11V9l-9-4z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M12 16l2.6 2.6L20 13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold text-white">VoiceBox</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              A secure, anonymous grievance and feedback portal. Built so every
              voice can be heard — safely, and without fear of retaliation.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Portal</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('submit')} className="text-ink-400 transition hover:text-white">Submit a report</button></li>
              <li><button onClick={() => onNavigate('track')} className="text-ink-400 transition hover:text-white">Track a report</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="text-ink-400 transition hover:text-white">Public dashboard</button></li>
              <li><button onClick={() => onNavigate('home')} className="text-ink-400 transition hover:text-white">How it works</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Your privacy</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
              <li>No accounts, no email</li>
              <li>No IP logging on reports</li>
              <li>Tracking code is your only key</li>
              <li>Public sharing is opt-in</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} VoiceBox. Built for safe, anonymous feedback.</p>
          <p>Speak safely. Be heard.</p>
        </div>
      </div>
    </footer>
  )
}
