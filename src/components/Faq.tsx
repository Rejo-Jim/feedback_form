const FAQS = [
  { q: 'Is this really anonymous?', a: 'Yes. We never ask for your name, email, or account. Submissions are stored without any identifying information, and your tracking code is the only link to your report.' },
  { q: 'What if I lose my tracking code?', a: 'Unfortunately the code is the only way to look up a private report — that’s what keeps it anonymous. If you chose to make your report public, you can still find it on the dashboard.' },
  { q: 'Can I make my report public?', a: 'Yes. When submitting, toggle "Share on the public feed." Only the subject, message, category, and status are shown — never any identifying details, because we never collect them.' },
  { q: 'Who reviews submissions?', a: 'Reports are triaged by category and priority, then routed to the relevant review team. Urgent and high-priority reports are acknowledged first.' },
  { q: 'How long until I get a response?', a: 'Most reports are acknowledged within 24 hours. Complex issues may take longer to resolve, but you can check the status anytime with your tracking code.' },
  { q: 'What can I report?', a: 'Workplace conduct, harassment, health and safety, ethics, facilities, leadership, process issues, or any other feedback you want leadership to hear.' },
]

export function Faq() {
  return (
    <section className="border-t border-ink-200/70 bg-white">
      <div className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip bg-ink-100 text-ink-600">FAQ</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Questions, answered
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-ink-100">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-base font-semibold text-ink-900">{f.q}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-500 transition-transform duration-200 group-open:rotate-45">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
