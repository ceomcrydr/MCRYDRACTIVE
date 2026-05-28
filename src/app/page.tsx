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
      <BetaBanner />

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

      <div className={styles.bgGradient} />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1>Choose Your Platform</h1>
          <p>Select the account type that fits you, then log in below.</p>
        </div>

        {/* Platform cards */}
        <div className={styles.platformWrapper}>
          {/* RIDER CARD */}
          <div
            className={`${styles.platformCard} ${styles.rider} ${platform === 'rider' ? styles.selected : ''}`}
            onClick={() => setPlatform('rider')}
          >
            <div className={styles.pcCheck}>✓</div>
            <div className={styles.pcTop}>
              <div className={`${styles.pcIconWrap} ${styles.riderIcon}`}>
                <svg width="36" height="36" viewBox="0 0 100 60" fill="none">
                  <ellipse cx="22" cy="50" rx="14" ry="10" stroke="#f85c00" strokeWidth="4" fill="none"/>
                  <ellipse cx="78" cy="50" rx="14" ry="10" stroke="#f85c00" strokeWidth="4" fill="none"/>
                  <path d="M36 50 L50 50 L58 30 L70 30 L78 50" stroke="#f85c00" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  <path d="M22 40 L36 30 L50 30" stroke="#f85c00" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  <path d="M54 20 L62 10 L72 14" stroke="#f85c00" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <circle cx="60" cy="8" r="6" stroke="#f85c00" strokeWidth="3" fill="none"/>
                </svg>
              </div>
              <span className={`${styles.pcBadge} ${styles.riderBadge}`}>Free</span>
            </div>
            <div className={`${styles.pcTitle} ${styles.riderTitle}`}>MC Rider</div>
            <div className={styles.pcDesc}>For every motorcycle rider in the world. Ride, connect, explore.</div>
            <ul className={styles.pcFeatures}>
              <li>Voice ride rooms &amp; group rides</li>
              <li>Live GPS rider tracking</li>
              <li>Browse shops &amp; garages</li>
              <li>Buy &amp; sell motorcycles</li>
              <li>Events &amp; team pages</li>
              <li>Social feed — posts &amp; reels</li>
            </ul>
          </div>

          {/* COMMERCIAL CARD */}
          <div
            className={`${styles.platformCard} ${styles.commercial} ${platform === 'commercial' ? styles.selected : ''}`}
            onClick={() => setPlatform('commercial')}
          >
            <div className={`${styles.pcCheck} ${styles.pcCheckGold}`}>✓</div>
            <div className={styles.pcTop}>
              <div className={`${styles.pcIconWrap} ${styles.commercialIcon}`}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="#f5a623" strokeWidth="2"/>
                  <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#f5a623" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className={`${styles.pcBadge} ${styles.commercialBadge}`}>Business</span>
            </div>
            <div className={`${styles.pcTitle} ${styles.commercialTitle}`}>Commercial</div>
            <div className={styles.pcDesc}>For shops, garages, and event companies. Reach thousands of riders.</div>
            <ul className={styles.pcFeatures}>
              <li>Product &amp; service listings</li>
              <li>Promoted offers &amp; ads</li>
              <li>Customer reviews dashboard</li>
              <li>Event creation &amp; promotion</li>
              <li>Business analytics</li>
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
            No account? <Link href="/signup">Sign up free →</Link>
          </div>
        </div>

        {/* Social links */}
        <div className={styles.socialRow}>
          <div className={styles.socialLabel}>Follow Us · @MC.RYDR</div>
          <div className={styles.socialIcons}>
            {[
              { label: 'X',         href: 'https://x.com/MCRYDRapp',                                                          cls: styles.xBtn,  svg: <path d="M17.5 3h-3.5l-4 5.5L6 3H2l5.5 7.5L2 18h3.5l4.5-6 4 6H18l-5.5-7.5L17.5 3z" fill="currentColor"/> },
              { label: 'Instagram', href: 'https://www.instagram.com/mc.rydr?igsh=bjhldTMxd2dodjJm',                          cls: styles.igBtn, svg: <><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/><circle cx="17" cy="7" r="1" fill="currentColor"/></> },
              { label: 'TikTok',    href: 'https://www.tiktok.com/@mc.rydr?_r=1&_t=ZS-96T7RcYPGWy',                          cls: styles.ttBtn, svg: <path d="M19 3v4c-1.5 0-3-.5-4-2v8c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V3h8z" fill="currentColor"/> },
              { label: 'Facebook',  href: 'https://www.facebook.com/share/18bhbeog7R/',                                       cls: styles.fbBtn, svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.5" fill="none"/> },
              { label: 'Snapchat',  href: 'https://www.snapchat.com/add/mc.rydr?share_id=YGg9gN8VVl0&locale=en-GB',           cls: styles.scBtn, svg: <path d="M12 2C9 2 7 4 7 7v1H5l1 3c-1 .5-2 1-2 2s2 1 2 2c0 .5-1 2-4 2.5.5 1 2 1.5 4 1.5.5 1 1.5 1.5 3 1.5.5.5 1 .5 3 .5s2.5 0 3-.5c1.5 0 2.5-.5 3-1.5 2-.5 3.5-1 4-1.5-3-.5-4-2-4-2.5 0-1 2-1.5 2-2s-1-1.5-2-2l1-3h-2V7c0-3-2-5-5-5z" fill="currentColor"/> },
            ].map(({ label, href, cls, svg }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`${styles.socialBtn} ${cls}`} aria-label={label}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{svg}</svg>
              </a>
            ))}
          </div>
        </div>

        {/* About — link card to full page */}
        <Link href="/about" className={styles.aboutCard}>
          <div className={styles.aboutCardLeft}>
            <div className={styles.aboutCardIcon}>🏍️</div>
            <div>
              <div className={styles.aboutCardLabel}>About MCRYDR</div>
              <div className={styles.aboutCardTitle}>The Story Behind MCRYDR</div>
              <div className={styles.aboutCardSub}>From a Harley Fat Boy dream to a global motorcycle community</div>
            </div>
          </div>
          <div className={styles.aboutCardArrow}>→</div>
        </Link>

      </main>

      <footer className={styles.footer}>
        <p className={styles.footerCopy}>© 2026 MCRYDR · Ride. Connect. Discover. · Built for Riders, by Riders.</p>
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
