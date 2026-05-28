'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/app/actions/auth'
import styles from './page.module.css'

export default function LoginPage() {
  const [platform, setPlatform] = useState<'rider' | 'commercial' | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    fd.append('role', platform || 'rider')
    const result = await signIn(fd)
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <>
      {/* Beta banner */}
      <BetaBanner />

      {/* Nav */}
      <nav className={styles.nav}>
        <a href="/" className={styles.navLogo}>
          <LogoSvg />
          <div>
            <div className={styles.navWordmark}>MC<span>RYDR</span></div>
            <div className={styles.navTagline}>Motorcycle Community</div>
          </div>
        </a>
        <div className={styles.navRight}>
          New here? <Link href="/signup">Create account</Link>
        </div>
      </nav>

      {/* BG gradient */}
      <div className={styles.bgGradient} />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Choose Your Platform</h1>
          <p>Select the account type that fits you, then log in below.</p>
        </div>

        {/* Platform cards */}
        <div className={styles.platformWrapper}>
          <div
            className={`${styles.platformCard} ${styles.rider} ${platform === 'rider' ? styles.selected : ''}`}
            onClick={() => setPlatform('rider')}
          >
            <div className={styles.pcCheck}>✓</div>
            <div className={styles.pcTop}>
              <div className={`${styles.pcIconWrap} ${styles.riderIcon}`}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M6 26C6 20 10 16 18 14M18 14C22 13 26 14 28 18M18 14L16 8H22L24 14" stroke="#f85c00" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="10" cy="26" r="4" stroke="#f85c00" strokeWidth="2"/>
                  <circle cx="26" cy="26" r="4" stroke="#f85c00" strokeWidth="2"/>
                </svg>
              </div>
              <span className={`${styles.pcBadge} ${styles.riderBadge}`}>Free to Join</span>
            </div>
            <div className={`${styles.pcTitle} ${styles.riderTitle}`}>Rider Platform</div>
            <div className={styles.pcDesc}>For motorcycle enthusiasts, commuters, and passionate riders.</div>
            <ul className={styles.pcFeatures}>
              <li>Garage & bike profiles</li>
              <li>Ride events & meetups</li>
              <li>Community feed & groups</li>
              <li>Deals from local shops</li>
            </ul>
          </div>

          <div
            className={`${styles.platformCard} ${styles.commercial} ${platform === 'commercial' ? styles.selected : ''}`}
            onClick={() => setPlatform('commercial')}
          >
            <div className={`${styles.pcCheck} ${styles.pcCheckGold}`}>✓</div>
            <div className={styles.pcTop}>
              <div className={`${styles.pcIconWrap} ${styles.commercialIcon}`}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="6" y="14" width="24" height="16" rx="2" stroke="#f5a623" strokeWidth="2"/>
                  <path d="M12 14V10C12 7.8 13.8 6 16 6H20C22.2 6 24 7.8 24 10V14" stroke="#f5a623" strokeWidth="2"/>
                  <path d="M6 20H30" stroke="#f5a623" strokeWidth="1.5" opacity="0.5"/>
                  <circle cx="18" cy="20" r="2" fill="#f5a623"/>
                </svg>
              </div>
              <span className={`${styles.pcBadge} ${styles.commercialBadge}`}>For Business</span>
            </div>
            <div className={`${styles.pcTitle} ${styles.commercialTitle}`}>Commercial Platform</div>
            <div className={styles.pcDesc}>For shops, dealerships, brands, and service providers.</div>
            <ul className={styles.pcFeatures}>
              <li>Business profile & storefront</li>
              <li>Inventory & services listing</li>
              <li>Lead management & CRM</li>
              <li>Targeted rider ads</li>
            </ul>
          </div>
        </div>

        {/* Login box */}
        <div className={`${styles.loginBox} ${platform === 'rider' ? styles.riderActive : platform === 'commercial' ? styles.commercialActive : ''}`}>
          <h2>{platform === 'commercial' ? 'Business Login' : 'Rider Login'}</h2>
          <p className={styles.sub}>
            {platform === 'commercial'
              ? 'Access your business dashboard and tools.'
              : platform === 'rider'
              ? 'Welcome back — the road awaits.'
              : 'Select a platform above to get started.'}
          </p>

          <form onSubmit={handleLogin}>
            <div className={styles.field}>
              <label>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" required />
            </div>
            <div className={styles.forgot}><a href="#">Forgot password?</a></div>
            {error && <div className={styles.errorMsg}>{error}</div>}
            <button
              type="submit"
              disabled={loading || !platform}
              className={`${styles.btnLogin} ${platform === 'commercial' ? styles.commercialBtn : styles.riderBtn}`}
            >
              {loading ? 'Signing In...' : platform === 'commercial' ? 'Enter Business Dashboard →' : 'Enter MCRYDR →'}
            </button>
          </form>

          <div className={styles.divider}>or continue with</div>
          <button className={styles.btnGoogle}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.805.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/><path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className={styles.signupLink}>
            Don&apos;t have an account? <Link href="/signup">Sign up free →</Link>
          </div>
        </div>

        {/* Social links */}
        <div className={styles.socialRow}>
          {[
            { label: 'X', cls: styles.xBtn, svg: <path d="M17.5 3h-3.5l-4 5.5L6 3H2l5.5 7.5L2 18h3.5l4.5-6 4 6H18l-5.5-7.5L17.5 3z" fill="currentColor"/> },
            { label: 'IG', cls: styles.igBtn, svg: <><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="17" cy="7" r="1" fill="currentColor"/></> },
            { label: 'TT', cls: styles.ttBtn, svg: <path d="M19 3v4c-1.5 0-3-.5-4-2v8c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V3h8z" fill="currentColor"/> },
            { label: 'FB', cls: styles.fbBtn, svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.5" fill="none"/> },
          ].map(({ label, cls, svg }) => (
            <a key={label} href="#" className={`${styles.socialBtn} ${cls}`} aria-label={label}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{svg}</svg>
            </a>
          ))}
        </div>

        {/* About section */}
        <div className={styles.aboutSection}>
          <div className={styles.aboutHeader}>
            <div>
              <div className={styles.aboutLabel}>Our Story</div>
              <div className={styles.aboutTitle}>Built by Riders. For Riders.</div>
            </div>
          </div>
          <div className={styles.aboutBody}>
            <div className={styles.ceoPhotoWrap}>
              <div className={styles.ceoPhotoPlaceholder}>👤</div>
              <div className={styles.ceoName}>Abdulqader Al Toubeh</div>
              <div className={styles.ceoRole}>Founder & CEO</div>
            </div>
            <div className={styles.storyText}>
              <p>MCRYDR was born from a simple frustration: as a rider, I couldn&apos;t find a single place that brought together everything that matters to the motorcycle community.</p>
              <p>Whether you&apos;re a daily commuter, weekend warrior, or you run a shop — <strong>MCRYDR is your home</strong>. We&apos;re building the platform we always wanted but never had.</p>
              <div className={styles.storyHighlight}>
                &ldquo;The best rides aren&apos;t just about the road — they&apos;re about the people you meet along the way.&rdquo;
              </div>
              <p>From finding the best local mechanic to connecting with riders in your city, MCRYDR puts it all in one place. And we&apos;re just getting started.</p>
            </div>
          </div>
        </div>

      </main>

      <footer className={styles.footer}>
        <p className={styles.footerCopy}>© 2026 MCRYDR. All rights reserved. Built by riders, for riders.</p>
      </footer>
    </>
  )
}

function BetaBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className={styles.betaBanner}>
      🏍️ &nbsp;MCRYDR is in Beta — Your feedback shapes everything &nbsp;·&nbsp;
      <a href="#waitlist">Join the Waitlist ↓</a>
      <button onClick={() => setVisible(false)}>✕</button>
    </div>
  )
}

function LogoSvg() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="#f85c00"/>
      <path d="M8 28V14L14 22.5L20 14L26 22.5L32 14V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="8" y="30.5" width="13" height="2.5" rx="1.25" fill="white" opacity="0.85"/>
    </svg>
  )
}
