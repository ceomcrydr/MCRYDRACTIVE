'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'
import styles from './signup.module.css'

const BRANDS: Record<string, string[]> = {
  'Harley-Davidson': ['Sportster','Fat Boy','Street Glide','Road King','Iron 883','Softail','Breakout','Pan America'],
  'Ducati': ['Panigale V4','Monster','Multistrada','Scrambler','Diavel','Streetfighter','SuperSport'],
  'BMW': ['R 1250 GS','S 1000 RR','F 900 R','R nineT','M 1000 RR','G 310 R','K 1600'],
  'Kawasaki': ['Ninja ZX-10R','Z900','Versys 650','Ninja 400','Z650','Vulcan','W800'],
  'Yamaha': ['MT-09','R1','R3','Tracer 9','Tenere 700','XSR900','XMAX'],
  'Honda': ['CBR1000RR','CB500F','Africa Twin','Gold Wing','Monkey','CB650R','CB300R'],
  'Suzuki': ['GSX-R1000','V-Strom','SV650','Katana','Hayabusa','GSX-S750'],
  'Triumph': ['Street Triple','Speed Triple','Tiger 900','Bonneville','Scrambler','Rocket 3'],
  'KTM': ['1290 Super Duke','790 Duke','390 Duke','Adventure 1290','RC 390'],
  'Aprilia': ['RSV4','Tuono','RS 660','Dorsoduro','Shiver'],
  'Royal Enfield': ['Classic 350','Meteor 350','Himalayan','Continental GT','Interceptor 650'],
  'Indian': ['Scout','Chieftain','Challenger','Springfield','FTR 1200'],
  'Other': ['Other Model'],
}

const COLORS = ['Black','White','Red','Orange','Blue','Green','Yellow','Grey / Silver','Brown','Burgundy / Maroon','Purple','Two-tone','Custom / Wrap']

interface Bike { brand: string; model: string; year: string; color: string; nickname: string }

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [accountNum, setAccountNum] = useState('')
  const [fullName, setFullName] = useState('')

  // Step 1 fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  // Step 2 bikes
  const [bikes, setBikes] = useState<Bike[]>([{ brand: '', model: '', year: '', color: '', nickname: '' }])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1969 }, (_, i) => String(currentYear - i))

  function goStep2() {
    if (!firstName || !lastName || !email) { setError('Please fill in your name and email.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPw) { setError('Passwords do not match.'); return }
    setError('')
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateBike(idx: number, field: keyof Bike, val: string) {
    setBikes(prev => prev.map((b, i) => i === idx ? { ...b, [field]: val, ...(field === 'brand' ? { model: '' } : {}) } : b))
  }

  function addBike() { setBikes(prev => [...prev, { brand: '', model: '', year: '', color: '', nickname: '' }]) }
  function removeBike(idx: number) { setBikes(prev => prev.filter((_, i) => i !== idx)) }

  async function createAccount() {
    setLoading(true)
    setError('')
    const fd = new FormData()
    fd.append('first_name', firstName)
    fd.append('last_name', lastName)
    fd.append('email', email)
    fd.append('password', password)
    fd.append('phone', phone)
    fd.append('country', country)
    fd.append('role', 'rider')
    fd.append('bikes', JSON.stringify(bikes))

    const result = await signUp(fd)
    if (result?.error) { setError(result.error); setLoading(false); return }

    const num = '#' + String(10482 + Math.floor(Math.random() * 50) + 1).padStart(5, '0')
    setAccountNum(num)
    setFullName(`${firstName} ${lastName}`)
    setSuccess(true)
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.logoSq}>MC</div>
          <div className={styles.navWordmark}>MC<span>RYDR</span></div>
        </Link>
        <Link href="/" className={styles.navBack}>← Back to Login</Link>
      </nav>

      <main className={styles.main}>
        {!success && (
          <div className={styles.stepsBar}>
            <div className={`${styles.step} ${step >= 1 ? (step > 1 ? styles.done : styles.active) : ''}`}>
              <div className={styles.stepDot}>{step > 1 ? '✓' : '1'}</div>
              <div className={styles.stepLabel}>Account</div>
            </div>
            <div className={`${styles.stepLine} ${step > 1 ? styles.lineDone : ''}`} />
            <div className={`${styles.step} ${step >= 2 ? (success ? styles.done : styles.active) : ''}`}>
              <div className={styles.stepDot}>{success ? '✓' : '2'}</div>
              <div className={styles.stepLabel}>Your Bikes</div>
            </div>
            <div className={`${styles.stepLine} ${success ? styles.lineDone : ''}`} />
            <div className={`${styles.step} ${success ? styles.done : ''}`}>
              <div className={styles.stepDot}>{success ? '✓' : '3'}</div>
              <div className={styles.stepLabel}>Done</div>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div className={styles.formCard}>
              <h2>Create Your Account</h2>
              <p className={styles.sub}>Join the MCRYDR community — it&apos;s free for riders.</p>
              {error && <div className={styles.errorMsg}>{error}</div>}
              <div className={styles.fieldRow}>
                <div className={styles.field}><label>First Name</label><input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ahmed" /></div>
                <div className={styles.field}><label>Last Name</label><input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Al Khalil" /></div>
              </div>
              <div className={styles.field}><label>Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              <div className={styles.field}><label>Phone Number</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+971 50 000 0000" /></div>
              <div className={styles.field}>
                <label>Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="">Select your country</option>
                  {['United Arab Emirates','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman','Jordan','Lebanon','Egypt','United Kingdom','United States','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" /></div>
                <div className={styles.field}><label>Confirm Password</label><input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat password" /></div>
              </div>
            </div>
            <button className={styles.btnNext} onClick={goStep2}>Continue — Add Your Bikes →</button>
            <Link href="/" className={styles.btnBackLink}>Already have an account? Log in</Link>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && !success && (
          <div>
            <div className={styles.formCard}>
              <h2>Your Motorcycles</h2>
              <p className={styles.sub}>Add the bikes in your garage. You can always add more later.</p>
              {error && <div className={styles.errorMsg}>{error}</div>}

              {bikes.map((bike, idx) => (
                <div key={idx} className={styles.bikeEntry}>
                  <div className={styles.bikeEntryHeader}>
                    <div className={styles.bikeEntryTitle}>🏍️ Bike {idx + 1}</div>
                    {bikes.length > 1 && <button className={styles.bikeRemove} onClick={() => removeBike(idx)}>✕</button>}
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Brand</label>
                      <select value={bike.brand} onChange={e => updateBike(idx, 'brand', e.target.value)}>
                        <option value="">Select brand...</option>
                        {Object.keys(BRANDS).map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label>Model</label>
                      <select value={bike.model} onChange={e => updateBike(idx, 'model', e.target.value)} disabled={!bike.brand}>
                        <option value="">{bike.brand ? 'Select model...' : 'Select brand first...'}</option>
                        {(BRANDS[bike.brand] || []).map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Production Year</label>
                      <select value={bike.year} onChange={e => updateBike(idx, 'year', e.target.value)}>
                        <option value="">Select year...</option>
                        {years.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label>Color <span className={styles.optional}>(optional)</span></label>
                      <select value={bike.color} onChange={e => updateBike(idx, 'color', e.target.value)}>
                        <option value="">Select color...</option>
                        {COLORS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Nickname <span className={styles.optional}>(optional)</span></label>
                    <input value={bike.nickname} onChange={e => updateBike(idx, 'nickname', e.target.value)} placeholder="e.g. Thunder, Black Pearl, The Beast" />
                  </div>
                </div>
              ))}

              <button className={styles.addBikeBtn} onClick={addBike}>+ Add Another Bike</button>
            </div>
            <button className={styles.btnNext} onClick={createAccount} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create My Account →'}
            </button>
            <button className={styles.btnBackLink} onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              ← Back to Account Details
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className={styles.successScreen}>
            <div className={styles.successIcon}>🏍️</div>
            <div className={styles.successTitle}>You&apos;re In!</div>
            <div className={styles.accountBadge}>
              <div className={styles.accountNum}>{accountNum}</div>
              <div className={styles.accountName}>{fullName}</div>
            </div>
            <p className={styles.successSub}>
              Your MCRYDR account is ready. Your unique rider number is yours forever — the lower the number, the earlier you joined.
            </p>
            <Link href="/rider" className={styles.btnEnter}>Enter MCRYDR →</Link>
          </div>
        )}
      </main>
    </>
  )
}
