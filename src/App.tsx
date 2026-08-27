import { useEffect, useState } from 'react'
import type { Grievance } from './lib/supabase'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrustBar } from './components/TrustBar'
import { HowItWorks } from './components/HowItWorks'
import { SubmitForm } from './components/SubmitForm'
import { TrackLookup } from './components/TrackLookup'
import { Dashboard } from './components/Dashboard'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'

export type View = 'home' | 'submit' | 'track' | 'dashboard'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [tracked, setTracked] = useState<Grievance | null>(null)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as View
    if (['home', 'submit', 'track', 'dashboard'].includes(hash)) setView(hash)
    const onHash = () => {
      const h = window.location.hash.replace('#', '') as View
      if (['home', 'submit', 'track', 'dashboard'].includes(h)) setView(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (v: View) => {
    setView(v)
    window.location.hash = v === 'home' ? '' : v
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Header view={view} onNavigate={go} />
      <main>
        {view === 'home' && (
          <>
            <Hero onNavigate={go} />
            <TrustBar />
            <HowItWorks onNavigate={go} />
            <Faq />
          </>
        )}
        {view === 'submit' && <SubmitForm onNavigate={go} />}
        {view === 'track' && (
          <TrackLookup
            onNavigate={go}
            tracked={tracked}
            setTracked={setTracked}
          />
        )}
        {view === 'dashboard' && <Dashboard onNavigate={go} />}
      </main>
      <Footer onNavigate={go} />
    </div>
  )
}
