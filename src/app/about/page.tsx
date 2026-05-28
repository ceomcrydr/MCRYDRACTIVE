import Link from 'next/link'
import styles from './about.module.css'

export default function AboutPage() {
  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.logoSq}>
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
              <path d="M8 28V14L14 22.5L20 14L26 22.5L32 14V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div className={styles.navWordmark}>MC<span>RYDR</span></div>
          <div className={styles.navTagline}>Motorcycle Community</div>
        </Link>
        <Link href="/" className={styles.navBack}>← Back to MCRYDR</Link>
      </nav>

      <main className={styles.main}>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroLabel}>The Story Behind MCRYDR</div>
          <h1 className={styles.heroTitle}>
            From a Dream<br />
            <span className={styles.heroOrange}>To a Community</span>
          </h1>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statVal}>1</div>
            <div className={styles.statLabel}>Visionary Founder</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={`${styles.statVal} ${styles.statValOrange}`}>UAE</div>
            <div className={styles.statLabel}>Based &amp; Built Here</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statVal}>∞</div>
            <div className={styles.statLabel}>Riders. United</div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.contentGrid}>
          {/* LEFT — founder photo */}
          <div className={styles.founderCol}>
            <div className={styles.founderPhotoWrap}>
              <div className={styles.founderPhotoPlaceholder}>
                <span>AQ</span>
              </div>
            </div>
            <div className={styles.founderName}>Abdul Qader Altoubeh</div>
            <div className={styles.founderTitle}>CEO &amp; Founder: MCRYDR</div>
            <div className={styles.founderSocials}>
              <a href="#" className={styles.fSocial} aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="17" cy="7" r="1" fill="currentColor"/></svg>
              </a>
              <a href="#" className={styles.fSocial} aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3v4c-1.5 0-3-.5-4-2v8c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6v4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V3h8z"/></svg>
              </a>
              <a href="#" className={styles.fSocial} aria-label="X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h-3.5l-4 5.5L6 3H2l5.5 7.5L2 18h3.5l4.5-6 4 6H18l-5.5-7.5L17.5 3z"/></svg>
              </a>
            </div>
          </div>

          {/* RIGHT — story */}
          <div className={styles.storyCol}>
            <h2 className={styles.storyHeading}>From Dentist to Rider: When Passion Becomes a Mission</h2>
            <p>Some dreams don&apos;t fade with time... they grow stronger.</p>
            <p>Since I was a child, motorcycles were never just machines to me. They were freedom, adventure, and a life I could imagine myself living. But like many people, I grew up hearing the same words again and again: <em>&ldquo;It&apos;s too dangerous.&rdquo;</em></p>
            <p>My family objected, and fear stood between me and what I truly wanted. For years, I kept that dream inside me. Until one day... I decided to stop waiting.</p>

            <blockquote className={styles.quote}>
              &ldquo;That moment came when I bought my very first motorcycle — my most loved ride of all time: the Harley-Davidson Fat Boy 2008. The first time I rode it, I didn&apos;t just feel the road beneath me... I felt something even bigger: I felt alive.&rdquo;
            </blockquote>

            <p>From that day, motorcycles became more than a passion. They became my escape, my motivation, and my purpose. I dreamed of riding every brand, exploring every model, and traveling the world on two wheels — discovering places, meeting people, and living stories worth remembering.</p>

            <div className={styles.divider} />

            <p>My professional background is dentistry, but my career journey took me into sales and business development in the dental industry. And while I was building my career, my heart was still on the road.</p>
            <p>But instead of letting life control my passion... <strong>I decided to build something that would serve it.</strong></p>
            <p>That&apos;s when the idea was born: to create one platform where the entire motorcycle community can come together. An app built not only for riders — but for every brand, every garage, every supplier, every company, and every passionate soul who believes motorcycles are not just a hobby... but a lifestyle.</p>

            <blockquote className={styles.quote}>
              &ldquo;My dream is to make this app known worldwide and to unite motorcyclists and motorcycle businesses across the globe — inside one powerful community.&rdquo;
            </blockquote>

            <div className={styles.divider} />

            <h3 className={styles.subHeading}>A Personal Thank You</h3>
            <p>Behind every dream, there is someone who believes in you before the world does. My deepest gratitude goes to my soulmate and love — my wife — for supporting me, standing beside me, and giving me the strength to turn this dream into reality.</p>
            <p>I also want to thank my team and my first riding family, the <strong>Kings Rider Motorcycle Team</strong>, for being part of this journey and for believing in the vision from the beginning. And special thanks to <strong>Timeless Garage</strong>, for providing my first motorcycle in perfect condition and helping me experience the true meaning of this passion.</p>

            <div className={styles.divider} />

            <h3 className={styles.subHeading}>My Promise</h3>
            <p>This is not just an app. This is a mission. I promise to build a platform that truly serves riders and motorcycle businesses, offering real value, real solutions, and real opportunities.</p>

            <blockquote className={styles.quote}>
              &ldquo;Because this journey isn&apos;t only about me... It&apos;s about every rider who ever dreamed of freedom. And this is only the beginning.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaBox}>
          <h3 className={styles.ctaTitle}>Join the Community</h3>
          <p className={styles.ctaSub}>Be part of the MCRYDR journey from day one. Sign up free and help us build the ultimate motorcycle platform.</p>
          <Link href="/signup" className={styles.ctaBtn}>Create Rider Account →</Link>
        </div>

      </main>

      <footer className={styles.footer}>
        <p>© 2026 MCRYDR · Ride. Connect. Discover. · Built for Riders, by Riders.</p>
      </footer>
    </>
  )
}
