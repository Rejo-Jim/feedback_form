const ITEMS = [
  { icon: 'shield', title: 'Truly anonymous', text: 'No account, email, or IP is ever linked to your report.' },
  { icon: 'lock', title: 'Encrypted in transit', text: 'Every submission is sent over a secure, encrypted connection.' },
  { icon: 'key', title: 'You hold the key', text: 'A private tracking code lets only you check your report.' },
  { icon: 'eye', title: 'Transparent outcomes', text: 'Public reports show how issues were handled, end to end.' },
]

const ICONS: Record<string, JSX.Element> = {
  shield: <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" /></>,
  key: <><circle cx="8" cy="15" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M10.5 12.5L20 3M17 6l2 2M14 9l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></>,
}

export function TrustBar() {
  return (
    <section className="border-y border-ink-200/70 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it) => (
            <div key={it.title} className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{ICONS[it.icon]}</svg>
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink-900">{it.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
