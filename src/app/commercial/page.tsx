'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import { saveBusinessProfile, createListing, createPromotion, updateProfile } from '@/app/actions/data'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import styles from './commercial.module.css'

/* ── Types ──────────────────────────────────────────────────── */
interface BizUser      { id: string; name: string; initials: string; email: string }
interface GarageProfile { id?: string; name: string; type: string; location: string; phone: string; description: string }
interface Listing      { id: string; name: string; category: string | null; price: number | null; description: string | null; condition: string | null; listing_type: string; image_url: string | null; created_at: string }
interface Promotion    { id: string; title: string; description: string | null; discount_type: string | null; discount_value: number | null; valid_until: string | null; status: string }

/* ── Constants ───────────────────────────────────────────────── */
const BIZ_TYPES = [
  'Garage & Workshop', 'Motorcycle Dealership', 'Accessories & Gear',
  'Parts & Spares', 'Custom & Tuning', 'Detailing & Wraps', 'Rental & Tours', 'Other',
]
const COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
  'Jordan', 'Lebanon', 'Egypt', 'United Kingdom', 'United States', 'Other',
]
const PRODUCT_CATS = ['Parts', 'Tires & Wheels', 'Exhausts', 'Gear & Apparel', 'Electronics', 'Oils & Fluids', 'Custom', 'Other']
const SERVICE_CATS = ['Oil Change', 'Tire Change', 'Full Service', 'Engine Work', 'Custom Tuning', 'Detailing', 'Bodywork', 'Other']

const NAV_SECTIONS = [
  {
    label: 'BUSINESS',
    items: [
      { icon: '📊', label: 'Overview',           id: 'overview' },
      { icon: '🏪', label: 'My Business',         id: 'business' },
      { icon: '🛒', label: 'Products & Services', id: 'products' },
    ],
  },
  {
    label: 'CUSTOMERS',
    items: [
      { icon: '👥', label: 'Leads & Customers', id: 'leads'      },
      { icon: '📣', label: 'Promotions',        id: 'promotions' },
      { icon: '⭐', label: 'Reviews',           id: 'reviews'    },
      { icon: '💬', label: 'Messages',          id: 'messages'   },
    ],
  },
]

/* ── Dashboard Root ──────────────────────────────────────────── */
export default function CommercialDashboard() {
  const [activePanel, setActivePanel] = useState('overview')
  const [biz, setBiz] = useState<BizUser>({ id: '', name: 'Business', initials: 'BZ', email: '' })

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      const name     = profile?.full_name || user.email?.split('@')[0] || 'Business'
      const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
      setBiz({ id: user.id, name, initials, email: user.email || '' })
    }
    load()
  }, [])

  return (
    <div className={styles.root}>
      {/* TOP NAV */}
      <header className={styles.topnav}>
        <Link href="/" className={styles.navBrand}>
          <div className={styles.logoSq}>
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <path d="M8 28V14L14 22.5L20 14L26 22.5L32 14V28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div>
            <div className={styles.navName}>MC<span>RYDR</span></div>
            <div className={styles.navTagline}>Motorcycle Community</div>
          </div>
        </Link>
        <div className={styles.bizPill}><span>🏪</span> Business Account</div>
        <div className={styles.navRight}>
          <div className={styles.bizAvatar}>
            <div className={styles.bizAvatarIcon}>{biz.initials}</div>
            <div>
              <div className={styles.bizAvatarName}>{biz.name}</div>
              <div className={styles.bizAvatarType}>Business Account</div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.bodyWrap}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          {NAV_SECTIONS.map((sec, si) => (
            <div key={sec.label}>
              {si > 0 && <div className={styles.sidebarDivider} />}
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>{sec.label}</div>
                {sec.items.map(item => (
                  <div
                    key={item.id}
                    className={`${styles.navItem} ${activePanel === item.id ? styles.active : ''}`}
                    onClick={() => setActivePanel(item.id)}
                  >
                    <span className={styles.niIcon}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.sidebarDivider} />
          <div
            className={`${styles.navItem} ${activePanel === 'settings' ? styles.active : ''}`}
            onClick={() => setActivePanel('settings')}
          >
            <span className={styles.niIcon}>⚙️</span> Settings
          </div>

          <div className={styles.bizInfoMini}>
            <div className={styles.bimName}>{biz.name}</div>
            <div className={styles.bimType}>{biz.email}</div>
            <div className={styles.bimStatus}><span className={styles.bimDot} /> Verified Business</div>
            <form action={signOut} style={{ marginTop: 10 }}>
              <button type="submit" className={styles.logoutBtn}>Log Out</button>
            </form>
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.mainContent}>
          {activePanel === 'overview'   && <OverviewPanel   userId={biz.id} onNavigate={setActivePanel} />}
          {activePanel === 'business'   && <BusinessPanel   userId={biz.id} />}
          {activePanel === 'products'   && <ProductsPanel   userId={biz.id} />}
          {activePanel === 'leads'      && <LeadsPanel />}
          {activePanel === 'promotions' && <PromotionsPanel userId={biz.id} />}
          {activePanel === 'reviews'    && <ReviewsPanel    userId={biz.id} />}
          {activePanel === 'messages'   && <MessagesPanel />}
          {activePanel === 'settings'   && <SettingsPanel userId={biz.id} userEmail={biz.email} />}
        </main>
      </div>
    </div>
  )
}

/* ── OVERVIEW ────────────────────────────────────────────────── */
function OverviewPanel({ userId, onNavigate }: { userId: string; onNavigate: (id: string) => void }) {
  const [stats, setStats]       = useState({ listings: 0, reviews: 0, rating: 0 })
  const [garage, setGarage]     = useState<GarageProfile | null>(null)
  const [completeness, setComp] = useState(0)

  useEffect(() => {
    if (!userId) return
    const supabase = createSupabaseBrowserClient()
    async function load() {
      const [{ count: listings }, { data: g }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', userId),
        supabase.from('garages').select('name,type,location,phone,description').eq('owner_id', userId).maybeSingle(),
      ])

      let reviews = 0, rating = 0
      try {
        const { data: rv } = await supabase.from('reviews').select('rating').eq('seller_id', userId)
        reviews = rv?.length || 0
        rating  = reviews ? rv!.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews : 0
      } catch { /* table may not exist yet */ }

      const fields = [g?.name, g?.type, g?.location, g?.phone, g?.description]
      setComp(Math.round(fields.filter(Boolean).length / fields.length * 100))
      setStats({ listings: listings || 0, reviews, rating })
      setGarage(g as GarageProfile | null)
    }
    load()
  }, [userId])

  const bizInitials = garage?.name
    ? garage.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Business Overview</h1>
        <p>Your store performance at a glance.</p>
      </div>

      <div className={styles.statRow}>
        {[
          { label: 'Profile Views',   val: '—',                       sub: 'Tracking coming soon' },
          { label: 'Total Leads',     val: '0',                       sub: 'No leads yet' },
          { label: 'Active Listings', val: String(stats.listings),    sub: stats.listings === 0 ? 'Add your first listing' : 'Products & services' },
          { label: 'Avg. Rating',     val: stats.rating ? `${stats.rating.toFixed(1)}★` : '—', sub: stats.reviews === 0 ? 'No reviews yet' : `From ${stats.reviews} review${stats.reviews !== 1 ? 's' : ''}` },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.scLabel}>{s.label}</div>
            <div className={`${styles.scVal} ${styles.scValGold}`}>{s.val}</div>
            <div className={styles.scSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Recent Leads</div>
              <div className={styles.widgetMore} onClick={() => onNavigate('leads')}>View all →</div>
            </div>
            <div className={styles.emptyWidget}>
              <span>👥</span>
              <p>No leads yet. Once riders reach out, they&apos;ll appear here.</p>
            </div>
          </div>

          <div className={styles.widget} style={{ marginTop: 20 }}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Recent Reviews</div>
              <div className={styles.widgetMore} onClick={() => onNavigate('reviews')}>See all →</div>
            </div>
            <div className={styles.emptyWidget}>
              <span>⭐</span>
              <p>No reviews yet. Deliver great service and reviews will follow.</p>
            </div>
          </div>
        </div>

        <div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Quick Actions</div>
            </div>
            {[
              { icon: '➕', label: 'Add New Listing',  desc: 'Product or service',  id: 'products'   },
              { icon: '📣', label: 'Create Promotion', desc: 'Target local riders', id: 'promotions' },
              { icon: '💬', label: 'Check Messages',   desc: 'Rider requests',      id: 'messages'   },
              { icon: '🏪', label: 'Update Business',  desc: 'Profile & details',   id: 'business'   },
            ].map(a => (
              <div key={a.label} className={styles.quickAction} onClick={() => onNavigate(a.id)}>
                <span className={styles.qaIcon}>{a.icon}</span>
                <div className={styles.qaInfo}>
                  <div className={styles.qaLabel}>{a.label}</div>
                  <div className={styles.qaDesc}>{a.desc}</div>
                </div>
                <span className={styles.qaArrow}>→</span>
              </div>
            ))}
          </div>

          <div className={styles.widget} style={{ marginTop: 20 }}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Business Profile</div>
              <div className={styles.widgetMore} onClick={() => onNavigate('business')}>Edit →</div>
            </div>
            {garage?.name ? (
              <>
                <div className={styles.bizProfileCard}>
                  <div className={styles.bizLogo}>{bizInitials}</div>
                  <div className={styles.bizDetails}>
                    <div className={styles.bizBizName}>{garage.name}</div>
                    {garage.type     && <div className={styles.bizBizType}>🔧 {garage.type}</div>}
                    {garage.location && <div className={styles.bizBizLoc}>📍 {garage.location}</div>}
                    <div className={styles.bizBizRating}>
                      ⭐ {stats.rating ? stats.rating.toFixed(1) : '—'} · {stats.reviews} review{stats.reviews !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className={styles.profileCompleteness}>
                  <div className={styles.pcLabel}>Profile completeness — {completeness}%</div>
                  <div className={styles.pcBar}><div className={styles.pcFill} style={{ width: `${completeness}%` }} /></div>
                </div>
              </>
            ) : (
              <div className={styles.emptyWidget}>
                <span>🏪</span>
                <p>Set up your business profile to attract riders.</p>
                <button className={styles.emptyWidgetBtn} onClick={() => onNavigate('business')}>Set Up Now →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── MY BUSINESS ─────────────────────────────────────────────── */
function BusinessPanel({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<GarageProfile>({ name: '', type: '', location: '', phone: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveMsgOk, setSaveMsgOk] = useState(true)

  async function load() {
    if (!userId) return
    const supabase = createSupabaseBrowserClient()
    const { data } = await supabase.from('garages').select('*').eq('owner_id', userId).maybeSingle()
    if (data) setProfile(data as GarageProfile)
    setLoading(false)
  }

  useEffect(() => { load() }, [userId])

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true); setSaveMsg('')
    const fd = new FormData(e.currentTarget)
    const result = await saveBusinessProfile(fd)
    setSaving(false)
    if (result?.error) {
      setSaveMsgOk(false)
      setSaveMsg(`Error: ${result.error}`)
      return
    }
    setSaveMsgOk(true)
    setSaveMsg('✓ Business profile saved successfully')
    load()
    setTimeout(() => setSaveMsg(''), 4000)
  }

  const previewInitials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  if (loading) return <div className={styles.loadingMsg}>Loading business profile...</div>

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>My Business</h1>
        <p>Your public profile visible to all MCRYDR riders.</p>
      </div>

      <div className={styles.bizPanelGrid}>
        {/* ── Form ── */}
        <form onSubmit={handleSave} className={styles.bizFormCard}>

          <div className={styles.bizFormSection}>
            <div className={styles.bizFormSectionTitle}>Business Identity</div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Business Name *</label>
                <input name="name" defaultValue={profile.name} placeholder="e.g. Dubai Moto Hub" required />
              </div>
              <div className={styles.formField}>
                <label>Business Type *</label>
                <select name="type" defaultValue={profile.type} required>
                  <option value="">Select type...</option>
                  {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.bizFormSection}>
            <div className={styles.bizFormSectionTitle}>Contact &amp; Location</div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Location / Address</label>
                <input name="location" defaultValue={profile.location} placeholder="e.g. Al Quoz Industrial, Dubai" />
              </div>
              <div className={styles.formField}>
                <label>Phone Number</label>
                <input name="phone" defaultValue={profile.phone} placeholder="+971 4 000 0000" />
              </div>
            </div>
          </div>

          <div className={styles.bizFormSection}>
            <div className={styles.bizFormSectionTitle}>About Your Business</div>
            <div className={styles.formField}>
              <label>Description</label>
              <textarea
                name="description"
                defaultValue={profile.description}
                rows={6}
                placeholder="Tell riders what makes your business special — services you offer, bike brands you specialise in, years of experience, working hours, certifications..."
              />
            </div>
          </div>

          <div className={styles.bizFormActions}>
            {saveMsg && (
              <span className={`${styles.bizSaveMsg} ${saveMsgOk ? styles.bizSaveMsgOk : styles.bizSaveMsgErr}`}>
                {saveMsg}
              </span>
            )}
            <button type="submit" className={styles.bizSaveBtn} disabled={saving}>
              {saving ? 'Saving...' : profile.name ? '✓ Update Business Profile' : 'Create Business Profile →'}
            </button>
          </div>
        </form>

        {/* ── Right: Preview + Tips ── */}
        <div className={styles.bizPanelRight}>
          <div className={styles.bizPreviewCard}>
            <div className={styles.bizPreviewLabel}>👁 Rider View Preview</div>
            <div className={styles.bizPreviewHdr}>
              <div className={styles.bizPreviewLogo}>{previewInitials}</div>
              <div>
                <div className={styles.bizPreviewName}>{profile.name || 'Your Business Name'}</div>
                <div className={styles.bizPreviewType}>{profile.type || 'Business Type'}</div>
              </div>
            </div>
            {(profile.location || profile.phone) && (
              <div className={styles.bizPreviewDetails}>
                {profile.location && <div className={styles.bizPreviewMeta}>📍 {profile.location}</div>}
                {profile.phone    && <div className={styles.bizPreviewMeta}>📞 {profile.phone}</div>}
              </div>
            )}
            {profile.description ? (
              <div className={styles.bizPreviewDesc}>
                {profile.description.slice(0, 160)}{profile.description.length > 160 ? '...' : ''}
              </div>
            ) : (
              <div className={styles.bizPreviewPlaceholder}>Your business description will appear here.</div>
            )}
          </div>

          <div className={styles.bizTipsCard}>
            <div className={styles.bizTipsTitle}>💡 Profile Tips</div>
            <ul className={styles.bizTipsList}>
              <li>Mention which bike brands &amp; models you specialise in</li>
              <li>List your main services clearly</li>
              <li>Include your working hours</li>
              <li>Add products &amp; services to boost your visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── PRODUCTS & SERVICES ─────────────────────────────────────── */
function ProductsPanel({ userId }: { userId: string }) {
  const [listings, setListings]   = useState<Listing[]>([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')
  const [listType, setListType]   = useState<'product' | 'service'>('product')

  async function load() {
    const supabase = createSupabaseBrowserClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })
    setListings((data as Listing[]) || [])
    setLoading(false)
  }

  useEffect(() => { if (userId) load() }, [userId])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true); setFormError('')
    const fd = new FormData(e.currentTarget)
    fd.set('listing_type', listType)
    const result = await createListing(fd)
    setSaving(false)
    if (result?.error) { setFormError(result.error); return }
    setShowModal(false)
    setListType('product')
    load()
  }

  const cats = listType === 'product' ? PRODUCT_CATS : SERVICE_CATS

  return (
    <div>
      <div className={styles.pageHdrRow}>
        <div>
          <h1 className={styles.pageHdrTitle}>Products &amp; Services</h1>
          <p className={styles.pageHdrSub}>All listings visible to MCRYDR riders.</p>
        </div>
        <button className={styles.bizActionBtn} onClick={() => setShowModal(true)}>+ Add Listing</button>
      </div>

      {loading ? (
        <div className={styles.loadingMsg}>Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🛒</div>
          <h3>No listings yet</h3>
          <p>Add your first product or service to start attracting riders on MCRYDR.</p>
          <button className={styles.bizActionBtn} onClick={() => setShowModal(true)}>+ Add Your First Listing</button>
        </div>
      ) : (
        <div className={styles.listingsGrid}>
          {listings.map(l => (
            <div key={l.id} className={styles.listingCard}>
              <div className={styles.listingImgBox}>
                {l.image_url
                  ? <img src={l.image_url} alt={l.name} className={styles.listingImg} />
                  : <span>{l.listing_type === 'service' ? '🔧' : '📦'}</span>}
              </div>
              <div className={`${styles.listingBadge} ${l.listing_type === 'service' ? styles.listingBadgeSvc : styles.listingBadgeProd}`}>
                {l.listing_type === 'service' ? 'Service' : 'Product'}
              </div>
              <div className={styles.listingName}>{l.name}</div>
              {l.category    && <div className={styles.listingCat}>{l.category}</div>}
              {l.price !== null && <div className={styles.listingPrice}>AED {l.price.toLocaleString()}</div>}
              {l.description && <div className={styles.listingDesc}>{l.description.slice(0, 80)}{l.description.length > 80 ? '...' : ''}</div>}
              {l.condition   && <div className={styles.listingCond}>{l.condition}</div>}
            </div>
          ))}
          <div className={`${styles.listingCard} ${styles.addListingCard}`} onClick={() => setShowModal(true)}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>➕</div>
            <div className={styles.listingName}>Add Listing</div>
          </div>
        </div>
      )}

      {/* ── Add Listing Modal ── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Add New Listing</div>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>
            {formError && <div className={styles.formError}>{formError}</div>}
            <form onSubmit={handleCreate} className={styles.createForm}>
              <div className={styles.formField}>
                <label>Type</label>
                <div className={styles.typeToggle}>
                  <button type="button" className={`${styles.typeBtn} ${listType === 'product' ? styles.typeBtnActive : ''}`} onClick={() => setListType('product')}>📦 Product</button>
                  <button type="button" className={`${styles.typeBtn} ${listType === 'service' ? styles.typeBtnActive : ''}`} onClick={() => setListType('service')}>🔧 Service</button>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Name *</label>
                  <input name="name" required placeholder={listType === 'service' ? 'e.g. Full Service Package' : 'e.g. Michelin Pilot Road 5'} />
                </div>
                <div className={styles.formField}>
                  <label>Category</label>
                  <select name="category">
                    <option value="">Select...</option>
                    {cats.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Price (AED)</label>
                  <input name="price" type="number" min="0" step="0.01" placeholder="350" />
                </div>
                {listType === 'product' && (
                  <div className={styles.formField}>
                    <label>Condition</label>
                    <select name="condition">
                      <option value="">Select...</option>
                      <option>New</option>
                      <option>Used</option>
                      <option>Refurbished</option>
                    </select>
                  </div>
                )}
              </div>
              <div className={styles.formField}>
                <label>Image URL <span className={styles.optLabel}>(optional — paste a direct link)</span></label>
                <input name="image_url" type="url" placeholder="https://..." />
              </div>
              <div className={styles.formField}>
                <label>Description</label>
                <textarea name="description" rows={3} placeholder="Describe your listing clearly..." />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={styles.btnSubmit} disabled={saving}>{saving ? 'Adding...' : 'Add Listing →'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── LEADS & CUSTOMERS ───────────────────────────────────────── */
function LeadsPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Leads &amp; Customers</h1>
        <p>Riders who have reached out to your business.</p>
      </div>
      <div className={styles.leadsTable}>
        <div className={styles.tableHeader}>
          <span>Rider</span><span>Bike</span><span>Request</span><span>Date</span><span>Status</span>
        </div>
        <div className={styles.tableEmpty}>
          <span>👥</span>
          <p>No leads yet. Once riders contact your business, they&apos;ll appear here.</p>
        </div>
      </div>
    </div>
  )
}

/* ── PROMOTIONS ──────────────────────────────────────────────── */
function PromotionsPanel({ userId }: { userId: string }) {
  const [promos, setPromos]       = useState<Promotion[]>([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')

  async function load() {
    const supabase = createSupabaseBrowserClient()
    try {
      const { data } = await supabase
        .from('promotions')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })
      setPromos((data as Promotion[]) || [])
    } catch { /* table may not exist yet */ }
    setLoading(false)
  }

  useEffect(() => { if (userId) load() }, [userId])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true); setFormError('')
    const fd = new FormData(e.currentTarget)
    const result = await createPromotion(fd)
    setSaving(false)
    if (result?.error) { setFormError(result.error); return }
    setShowModal(false)
    load()
  }

  return (
    <div>
      <div className={styles.pageHdrRow}>
        <div>
          <h1 className={styles.pageHdrTitle}>Promotions</h1>
          <p className={styles.pageHdrSub}>Create offers and discounts visible to MCRYDR riders.</p>
        </div>
        <button className={styles.bizActionBtn} onClick={() => setShowModal(true)}>+ Create Promotion</button>
      </div>

      {loading ? (
        <div className={styles.loadingMsg}>Loading promotions...</div>
      ) : promos.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📣</div>
          <h3>No active promotions</h3>
          <p>Create a promotion to attract riders and boost your visibility on MCRYDR.</p>
          <button className={styles.bizActionBtn} onClick={() => setShowModal(true)}>+ Create First Promotion</button>
        </div>
      ) : (
        <div className={styles.promoGrid}>
          {promos.map(p => (
            <div key={p.id} className={styles.promoCard}>
              {p.discount_value !== null && (
                <div className={styles.promoBadge}>
                  {p.discount_type === 'percentage' ? `${p.discount_value}% OFF` : `AED ${p.discount_value} OFF`}
                </div>
              )}
              <div className={styles.promoTitle}>{p.title}</div>
              {p.description && <div className={styles.promoDesc}>{p.description}</div>}
              {p.valid_until && (
                <div className={styles.promoValidity}>
                  Valid until: {new Date(p.valid_until).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
              <div className={`${styles.promoStatus} ${p.status === 'active' ? styles.statusActive : styles.statusDraft}`}>
                {p.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Promotion Modal ── */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Create Promotion</div>
              <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            </div>
            {formError && <div className={styles.formError}>{formError}</div>}
            <form onSubmit={handleCreate} className={styles.createForm}>
              <div className={styles.formField}>
                <label>Promotion Title *</label>
                <input name="title" required placeholder="e.g. Weekend Service Special — 20% Off" />
              </div>
              <div className={styles.formField}>
                <label>Description</label>
                <textarea name="description" rows={3} placeholder="What does this promotion include? Any conditions?" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Discount Type</label>
                  <select name="discount_type">
                    <option value="">None</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (AED)</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Value</label>
                  <input name="discount_value" type="number" min="0" placeholder="e.g. 20" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Valid From</label>
                  <input name="valid_from" type="date" />
                </div>
                <div className={styles.formField}>
                  <label>Valid Until</label>
                  <input name="valid_until" type="date" />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={styles.btnSubmit} disabled={saving}>{saving ? 'Creating...' : 'Create Promotion →'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── REVIEWS ─────────────────────────────────────────────────── */
function ReviewsPanel({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    const supabase = createSupabaseBrowserClient()
    async function load() {
      try {
        const { data } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, reviewer:reviewer_id(full_name), product:product_id(name)')
          .eq('seller_id', userId)
          .order('created_at', { ascending: false })
        setReviews(data || [])
      } catch { /* table may not exist yet */ }
      setLoading(false)
    }
    load()
  }, [userId])

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Reviews</h1>
        <p>What riders are saying about your business.</p>
      </div>

      {loading ? (
        <div className={styles.loadingMsg}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>⭐</div>
          <h3>No reviews yet</h3>
          <p>Once riders leave reviews on your products and services, they&apos;ll appear here automatically.</p>
        </div>
      ) : (
        <>
          <div className={styles.reviewSummaryBar}>
            <div className={styles.reviewBigScore}>{avg.toFixed(1)}</div>
            <div>
              <div className={styles.reviewBigStars}>
                {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
              </div>
              <div className={styles.reviewBigCount}>
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className={styles.reviewsList}>
            {reviews.map(r => (
              <div key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewCardHdr}>
                  <div className={styles.reviewCardAvatar}>
                    {(r.reviewer as any)?.full_name?.[0] || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.reviewCardName}>{(r.reviewer as any)?.full_name || 'Anonymous'}</div>
                    <div className={styles.reviewCardDate}>
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className={styles.reviewCardStars}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
                {(r.product as any)?.name && (
                  <div className={styles.reviewCardProduct}>📦 Re: {(r.product as any).name}</div>
                )}
                {r.comment && <div className={styles.reviewCardComment}>&quot;{r.comment}&quot;</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── MESSAGES ────────────────────────────────────────────────── */
function MessagesPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Messages</h1>
        <p>Direct inquiries and service requests from riders.</p>
      </div>
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>💬</div>
        <h3>No messages yet</h3>
        <p>When riders send you service requests or inquiries, they&apos;ll appear here in real time.</p>
      </div>
    </div>
  )
}

/* ── SETTINGS ────────────────────────────────────────────────── */
function SettingsPanel({ userId, userEmail }: { userId: string; userEmail: string }) {
  // ── Account profile state ──
  const [accName,    setAccName]    = useState('')
  const [accPhone,   setAccPhone]   = useState('')
  const [accCountry, setAccCountry] = useState('')
  const [accSaving,  setAccSaving]  = useState(false)
  const [accMsg,     setAccMsg]     = useState('')
  const [accMsgOk,   setAccMsgOk]   = useState(true)

  // ── Business details state ──
  const [biz,        setBiz]        = useState<GarageProfile>({ name: '', type: '', location: '', phone: '', description: '' })
  const [bizSaving,  setBizSaving]  = useState(false)
  const [bizMsg,     setBizMsg]     = useState('')
  const [bizMsgOk,   setBizMsgOk]   = useState(true)

  const [loading, setLoading] = useState(true)

  async function load() {
    if (!userId) return
    const supabase = createSupabaseBrowserClient()
    const [{ data: prof }, { data: garage }] = await Promise.all([
      supabase.from('profiles').select('full_name, phone, country').eq('id', userId).single(),
      supabase.from('garages').select('*').eq('owner_id', userId).maybeSingle(),
    ])
    setAccName(prof?.full_name   || '')
    setAccPhone(prof?.phone      || '')
    setAccCountry(prof?.country  || '')
    if (garage) setBiz(garage as GarageProfile)
    setLoading(false)
  }

  useEffect(() => { load() }, [userId])

  async function handleSaveAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAccSaving(true); setAccMsg('')
    const fd = new FormData(e.currentTarget)
    const result = await updateProfile(fd)
    setAccSaving(false)
    if (result?.error) { setAccMsgOk(false); setAccMsg(`Error: ${result.error}`); return }
    setAccMsgOk(true); setAccMsg('✓ Account updated')
    load()
    setTimeout(() => setAccMsg(''), 3500)
  }

  async function handleSaveBusiness(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBizSaving(true); setBizMsg('')
    const fd = new FormData(e.currentTarget)
    const result = await saveBusinessProfile(fd)
    setBizSaving(false)
    if (result?.error) { setBizMsgOk(false); setBizMsg(`Error: ${result.error}`); return }
    setBizMsgOk(true); setBizMsg('✓ Business profile updated')
    load()
    setTimeout(() => setBizMsg(''), 3500)
  }

  if (loading) return <div className={styles.loadingMsg}>Loading settings...</div>

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Settings</h1>
        <p>Manage your account and business information.</p>
      </div>

      {/* ── Account Profile ── */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsCardHdr}>
          <div className={styles.settingsCardIcon}>👤</div>
          <div>
            <div className={styles.settingsCardTitle}>Account Profile</div>
            <div className={styles.settingsCardSub}>Your personal details linked to this account</div>
          </div>
        </div>
        <form onSubmit={handleSaveAccount}>
          <div className={styles.settingsEmailRow}>
            <div className={styles.formField} style={{ flex: 1 }}>
              <label>Email Address</label>
              <input value={userEmail} disabled className={styles.inputDisabled} />
            </div>
            <div className={styles.emailNote}>Email cannot be changed here</div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Full Name</label>
              <input
                name="full_name"
                value={accName}
                onChange={e => setAccName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className={styles.formField}>
              <label>Phone Number</label>
              <input
                name="phone"
                value={accPhone}
                onChange={e => setAccPhone(e.target.value)}
                placeholder="+971 50 000 0000"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Country</label>
              <select name="country" value={accCountry} onChange={e => setAccCountry(e.target.value)}>
                <option value="">Select country...</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.settingsSaveRow}>
            {accMsg && <span className={`${styles.settingsMsg} ${accMsgOk ? styles.settingsMsgOk : styles.settingsMsgErr}`}>{accMsg}</span>}
            <button type="submit" className={styles.bizSaveBtn} disabled={accSaving}>
              {accSaving ? 'Saving...' : 'Save Account'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Business Details ── */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsCardHdr}>
          <div className={styles.settingsCardIcon}>🏪</div>
          <div>
            <div className={styles.settingsCardTitle}>Business Details</div>
            <div className={styles.settingsCardSub}>Public profile seen by all MCRYDR riders</div>
          </div>
        </div>
        <form onSubmit={handleSaveBusiness}>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Business Name *</label>
              <input
                name="name"
                value={biz.name}
                onChange={e => setBiz(b => ({ ...b, name: e.target.value }))}
                placeholder="e.g. Dubai Moto Hub"
                required
              />
            </div>
            <div className={styles.formField}>
              <label>Business Type *</label>
              <select
                name="type"
                value={biz.type}
                onChange={e => setBiz(b => ({ ...b, type: e.target.value }))}
                required
              >
                <option value="">Select type...</option>
                {BIZ_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Location / Address</label>
              <input
                name="location"
                value={biz.location}
                onChange={e => setBiz(b => ({ ...b, location: e.target.value }))}
                placeholder="e.g. Al Quoz Industrial, Dubai"
              />
            </div>
            <div className={styles.formField}>
              <label>Phone Number</label>
              <input
                name="phone"
                value={biz.phone}
                onChange={e => setBiz(b => ({ ...b, phone: e.target.value }))}
                placeholder="+971 4 000 0000"
              />
            </div>
          </div>
          <div className={styles.formField}>
            <label>Description</label>
            <textarea
              name="description"
              value={biz.description}
              onChange={e => setBiz(b => ({ ...b, description: e.target.value }))}
              rows={5}
              placeholder="Tell riders what makes your business special — services, specializations, working hours, brands you carry..."
            />
          </div>
          <div className={styles.settingsSaveRow}>
            {bizMsg && <span className={`${styles.settingsMsg} ${bizMsgOk ? styles.settingsMsgOk : styles.settingsMsgErr}`}>{bizMsg}</span>}
            <button type="submit" className={styles.bizSaveBtn} disabled={bizSaving}>
              {bizSaving ? 'Saving...' : biz.name ? '✓ Update Business' : 'Create Business Profile →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── COMING SOON ─────────────────────────────────────────────── */
function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className={styles.comingSoon}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
      <h2>{label}</h2>
      <p>This feature is coming soon.</p>
    </div>
  )
}
