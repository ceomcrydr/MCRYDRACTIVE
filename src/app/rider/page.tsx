'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import { createMarketplaceListing, createEvent, joinEvent, leaveEvent, createRide, createPost, followUser, unfollowUser, createTeam, followTeam, unfollowTeam, requestJoinTeam, cancelJoinRequest, updateProfile, addBike, removeBike, updateBike } from '@/app/actions/data'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import styles from './rider.module.css'

interface RiderUser {
  name:     string
  initials: string
  bike:     string
}

const SIDEBAR = [
  {
    section: 'RIDER',
    items: [
      { icon: '🏠', label: 'Home',     id: 'home' },
      { icon: '🏍️', label: 'My Rides', id: 'rides' },
      { icon: '🗺️', label: 'Live Map', id: 'map' },
    ],
  },
  {
    section: 'DISCOVER',
    items: [
      { icon: '🔧', label: 'Garages',     id: 'garages' },
      { icon: '🛒', label: 'Accessories', id: 'accessories' },
      { icon: '🏪', label: 'Marketplace', id: 'marketplace' },
      { icon: '📅', label: 'Events',       id: 'events' },
    ],
  },
  {
    section: 'COMMUNITY',
    items: [
      { icon: '📱', label: 'Social Feed',  id: 'feed' },
      { icon: '🏁', label: 'Create Team',  id: 'createteam' },
      { icon: '👥', label: 'Teams',        id: 'teams' },
      { icon: '👤', label: 'My Profile',   id: 'profile' },
    ],
  },
]

export default function RiderDashboard() {
  const [activePanel, setActivePanel] = useState('home')
  const [rider, setRider] = useState<RiderUser>({ name: 'Rider', initials: 'MC', bike: '...' })

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    async function loadRider() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: profile }, { data: bikes }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('bikes').select('brand, model').eq('user_id', user.id).limit(1),
      ])

      const name     = profile?.full_name || user.email?.split('@')[0] || 'Rider'
      const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
      const bike     = bikes?.[0] ? `${bikes[0].brand} ${bikes[0].model}` : 'Add your bike'

      setRider({ name, initials, bike })
    }
    loadRider()
  }, [])

  const allItems = SIDEBAR.flatMap(s => s.items)
  const activeLabel = allItems.find(i => i.id === activePanel)?.label || activePanel

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
        <div className={styles.navSearch}>
          <span className={styles.searchIcon}>🔍</span>
          <input placeholder="Search riders, bikes, events, shops..." />
        </div>
        <div className={styles.navRight}>
          <div className={styles.navIconBtn} title="Notifications">
            🔔<span className={styles.notifDot} />
          </div>
          <div className={styles.navIconBtn} title="Location">📍</div>
          <div className={styles.navAvatar} title="Profile">{rider.initials}</div>
        </div>
      </header>

      <div className={styles.bodyWrap}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {SIDEBAR.map(group => (
              <div key={group.section} className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>{group.section}</div>
                {group.items.map(item => (
                  <div
                    key={item.id}
                    className={`${styles.navItem} ${activePanel === item.id ? styles.active : ''}`}
                    onClick={() => setActivePanel(item.id)}
                  >
                    <span className={styles.niIcon}>{item.icon}</span>
                    <span className={styles.niLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </nav>

          {/* Mini profile */}
          <div className={styles.sidebarProfile}>
            <div className={styles.spAvatar}>{rider.initials}</div>
            <div className={styles.spInfo}>
              <div className={styles.spName}>{rider.name}</div>
              <div className={styles.spBike}>🏍️ {rider.bike}</div>
            </div>
            <form action={signOut} style={{ marginLeft: 'auto' }}>
              <button type="submit" className={styles.spLogout} title="Log out">⚙️</button>
            </form>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          {activePanel === 'home'        && <HomePanel riderName={rider.name} />}
          {activePanel === 'rides'       && <RidesPanel />}
          {activePanel === 'map'         && <MapPanel />}
          {activePanel === 'garages'     && <GaragesPanel />}
          {activePanel === 'accessories' && <AccessoriesPanel />}
          {activePanel === 'marketplace' && <MarketplacePanel />}
          {activePanel === 'events'      && <EventsPanel />}
          {activePanel === 'feed'        && <FeedPanel />}
          {activePanel === 'createteam' && <CreateTeamPanel />}
          {activePanel === 'teams'      && <TeamsPanel />}
          {activePanel === 'profile'    && <ProfilePanel />}
          {!['home','rides','map','garages','accessories','marketplace','events','feed','createteam','teams','profile'].includes(activePanel) && (
            <ComingSoonPanel label={activeLabel} />
          )}
        </main>
      </div>
    </div>
  )
}

/* ─── HOME PANEL ─── */
function HomePanel({ riderName }: { riderName: string }) {
  const firstName = riderName.split(' ')[0]
  const [garages, setGarages] = useState<{ id: string; name: string; type: string; location: string; rating: number }[]>([])
  const [events,  setEvents]  = useState<{ id: string; title: string; date: string; location: string; event_attendees: { user_id: string }[] }[]>([])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    Promise.all([
      supabase.from('garages').select('*').order('created_at', { ascending: false }).limit(3),
      supabase.from('events').select('*, event_attendees(user_id)').eq('status','upcoming').order('date', { ascending: true }).limit(3),
    ]).then(([{ data: g }, { data: e }]) => {
      setGarages(g || [])
      setEvents((e as typeof events) || [])
    })
  }, [])

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Rider Dashboard</h1>
        <p>Welcome back, {firstName} — here&apos;s what&apos;s happening in your community.</p>
      </div>

      {/* Stats — will show real counts once ride tracking is added */}
      <div className={styles.statRow}>
        {[
          { label: 'Total Rides',     val: '0', sub: 'Start logging rides' },
          { label: 'Distance Ridden', val: '0', sub: 'km lifetime'         },
          { label: 'Hours on Road',   val: '0', sub: 'all-time'            },
          { label: 'Events Joined',   val: '0', sub: 'Join your first event'},
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.scLabel}>{s.label}</div>
            <div className={styles.scVal}>{s.val}</div>
            <div className={styles.scSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        {/* LEFT — Map preview */}
        <div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Live Map</div>
              <div className={styles.widgetMore}>Full map →</div>
            </div>
            <div className={styles.mapBox}>
              <div className={styles.mapGrid} />
              <div className={styles.mapRoute} />
              <div className={styles.mapPin} style={{ top: '35%', left: '40%' }}>📍</div>
              <div className={styles.mapPin} style={{ top: '55%', left: '62%' }}>🏍️</div>
              <div className={styles.mapLabel}>Dubai, UAE — Live rider map</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Garages & Events from DB */}
        <div>
          {/* Garages */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Registered Garages</div>
              <div className={styles.widgetMore}>Browse all →</div>
            </div>
            {garages.length === 0 ? (
              <div className={styles.widgetEmpty}>No garages registered yet</div>
            ) : garages.map(s => (
              <div key={s.id} className={styles.shopItem}>
                <div className={styles.shopIconWrap}>🔧</div>
                <div className={styles.shopInfo}>
                  <div className={styles.shopName}>{s.name}</div>
                  <div className={styles.shopMeta}>{s.type}{s.location ? ` · ${s.location}` : ''}</div>
                </div>
                {s.rating > 0 && <div className={styles.shopRating}>⭐ {s.rating}</div>}
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className={styles.widget} style={{ marginTop: 20 }}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Upcoming Events</div>
              <div className={styles.widgetMore}>See all →</div>
            </div>
            {events.length === 0 ? (
              <div className={styles.widgetEmpty}>No upcoming events yet</div>
            ) : events.map(e => {
              const d = new Date(e.date)
              return (
                <div key={e.id} className={styles.eventItem}>
                  <div className={styles.eventDateBlock}>
                    <div className={styles.eventDay}>{d.getDate()}</div>
                    <div className={styles.eventMonth}>{d.toLocaleString('en',{month:'short'}).toUpperCase()}</div>
                  </div>
                  <div className={styles.eventInfo}>
                    <div className={styles.eventName}>{e.title}</div>
                    {e.location && <div className={styles.eventMeta}>📍 {e.location}</div>}
                  </div>
                  <div className={styles.eventCount}>{e.event_attendees?.length || 0}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── RIDES PANEL ─── */
function RidesPanel() {
  const [rides, setRides]           = useState<{ id: string; name: string; date: string; visibility: string; status: string; gathering_point_name: string; destination_name: string }[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState('')
  const [stops, setStops]           = useState<string[]>([''])
  const [visibility, setVisibility] = useState<'public'|'private'>('public')

  async function load() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('rides').select('*').eq('creator_id', user.id).order('created_at', { ascending: false })
    setRides(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function addStop() { setStops(p => [...p, '']) }
  function removeStop(i: number) { setStops(p => p.filter((_, idx) => idx !== i)) }
  function updateStop(i: number, val: string) { setStops(p => p.map((s, idx) => idx === i ? val : s)) }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSubmitting(true); setFormError('')
    const fd = new FormData(e.currentTarget)
    fd.append('visibility', visibility)
    fd.append('stops', JSON.stringify(stops))
    const result = await createRide(fd)
    if (result?.error) { setFormError(result.error); setSubmitting(false); return }
    setShowForm(false); setSubmitting(false); setStops(['']); setVisibility('public')
    setLoading(true); load()
  }

  return (
    <div>
      <div className={styles.pageHdrRow}>
        <div>
          <h1 className={styles.pageHdrTitle}>My Rides</h1>
          <p className={styles.pageHdrSub}>Your created rides and history.</p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ Create Ride</button>
      </div>

      {/* CREATE RIDE MODAL */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Create New Ride</div>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>
            {formError && <div className={styles.formError}>{formError}</div>}
            <form onSubmit={handleCreate} className={styles.createForm}>

              {/* Ride Name */}
              <div className={styles.formField}>
                <label>Ride Name <span className={styles.optLabel}>(optional)</span></label>
                <input name="name" placeholder="e.g. Friday Night Cruise" />
              </div>

              {/* Gathering Point */}
              <div className={styles.formGroupLabel}>📍 Gathering Point</div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Location Name</label>
                  <input name="gathering_point_name" placeholder="e.g. Dubai Marina Gate 1" />
                </div>
                <div className={styles.formField}>
                  <label>Google Maps Link</label>
                  <input name="gathering_point_link" placeholder="https://maps.google.com/..." />
                </div>
              </div>

              {/* Stops */}
              <div className={styles.formGroupLabel}>🛑 Stops</div>
              {stops.map((stop, i) => (
                <div key={i} className={styles.stopRow}>
                  <input
                    value={stop}
                    onChange={e => updateStop(i, e.target.value)}
                    placeholder={`Stop ${i + 1} name`}
                    className={styles.stopInput}
                  />
                  {stops.length > 1 && (
                    <button type="button" className={styles.stopRemove} onClick={() => removeStop(i)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className={styles.addStopBtn} onClick={addStop}>+ Add Stop</button>

              {/* Final Destination */}
              <div className={styles.formGroupLabel}>🏁 Final Destination</div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Location Name</label>
                  <input name="destination_name" placeholder="e.g. Hatta Dam" />
                </div>
                <div className={styles.formField}>
                  <label>Google Maps Link</label>
                  <input name="destination_link" placeholder="https://maps.google.com/..." />
                </div>
              </div>

              {/* Date & Time */}
              <div className={styles.formField}>
                <label>Ride Date &amp; Time</label>
                <input name="date" type="datetime-local" />
              </div>

              {/* Visibility Toggle */}
              <div className={styles.formField}>
                <label>Visibility</label>
                <div className={styles.visToggle}>
                  <button type="button" className={`${styles.visBtn} ${visibility === 'public' ? styles.visBtnActive : ''}`} onClick={() => setVisibility('public')}>
                    🌍 Public <span className={styles.visBtnHint}>Visible to all riders, added to Events</span>
                  </button>
                  <button type="button" className={`${styles.visBtn} ${visibility === 'private' ? styles.visBtnActivePrivate : ''}`} onClick={() => setVisibility('private')}>
                    🔒 Private <span className={styles.visBtnHint}>Only visible to you</span>
                  </button>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Ride →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div className={styles.loadingMsg}>Loading rides...</div>}

      {!loading && rides.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏍️</div>
          <h3>No Rides Yet</h3>
          <p>Create your first ride — plan the route, set a meeting point, and invite the community.</p>
          <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ Create Ride</button>
        </div>
      )}

      {!loading && rides.length > 0 && (
        <div className={styles.ridesGrid}>
          {rides.map(r => (
            <div key={r.id} className={styles.rideCard}>
              <div className={styles.rideCardBadge}>{r.visibility === 'private' ? '🔒 Private' : '🌍 Public'}</div>
              <div className={styles.rideCardName}>{r.name || 'Unnamed Ride'}</div>
              {r.date && <div className={styles.rideCardDate}>📅 {new Date(r.date).toLocaleString('en-GB',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>}
              {r.gathering_point_name && <div className={styles.rideCardMeta}>📍 From: {r.gathering_point_name}</div>}
              {r.destination_name     && <div className={styles.rideCardMeta}>🏁 To: {r.destination_name}</div>}
              <div className={styles.rideStatusBadge}>{r.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── MAP PANEL ─── */
function MapPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Live Map</h1>
        <p>See active riders and plan your route in real time.</p>
      </div>
      <div className={styles.mapFull}>
        <div className={styles.mapGrid} />
        <div className={styles.mapRoute} />
        <div className={styles.mapPin} style={{ top: '30%', left: '35%' }}>📍</div>
        <div className={styles.mapPin} style={{ top: '50%', left: '55%' }}>🏍️</div>
        <div className={styles.mapPin} style={{ top: '40%', left: '70%' }}>🏍️</div>
        <div className={styles.mapPin} style={{ top: '65%', left: '45%' }}>🏍️</div>
        <div className={styles.mapOverlay}>
          <div className={styles.mapStat}>🟢 14 riders active</div>
          <div className={styles.mapStat}>📍 Dubai, UAE</div>
        </div>
      </div>
    </div>
  )
}

/* ─── GARAGES PANEL ─── */
function GaragesPanel() {
  const [garages, setGarages] = useState<{ id: string; name: string; type: string; location: string; phone: string; rating: number; review_count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.from('garages').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setGarages(data || []); setLoading(false) })
  }, [])

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Garages &amp; Shops</h1>
        <p>Browse registered motorcycle garages and shops on MCRYDR.</p>
      </div>

      {loading && <div className={styles.loadingMsg}>Loading garages...</div>}

      {!loading && garages.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔧</div>
          <h3>No Garages Yet</h3>
          <p>Garages and shops will appear here once businesses register on MCRYDR.</p>
        </div>
      )}

      {!loading && garages.length > 0 && (
        <div className={styles.shopsGrid}>
          {garages.map(s => (
            <div key={s.id} className={styles.shopCard}>
              <div className={styles.shopCardIcon}>🔧</div>
              <div className={styles.shopCardName}>{s.name}</div>
              <div className={styles.shopCardType}>{s.type}</div>
              <div className={styles.shopCardMeta}>
                {s.location && <>📍 {s.location}</>}
                {s.rating > 0 && <> · ⭐ {s.rating} ({s.review_count})</>}
              </div>
              {s.phone && <div className={styles.shopCardMeta}>📞 {s.phone}</div>}
              <button className={styles.shopCardBtn}>View Shop</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── ACCESSORIES PANEL ─── */
function AccessoriesPanel() {
  const [products, setProducts] = useState<{ id: string; name: string; category: string; price: number; currency: string; condition: string; description: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Accessories</h1>
        <p>Gear, helmets, parts and more from registered MCRYDR suppliers.</p>
      </div>

      {loading && <div className={styles.loadingMsg}>Loading accessories...</div>}

      {!loading && products.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛒</div>
          <h3>No Products Listed Yet</h3>
          <p>Products from shops and suppliers will appear here once businesses list them.</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className={styles.accessGrid}>
          {products.map(a => (
            <div key={a.id} className={styles.accessCard}>
              <div className={styles.accessImgBox}>🛒</div>
              {a.condition === 'New' && <div className={styles.accessBadge}>New</div>}
              <div className={styles.accessCat}>{a.category}</div>
              <div className={styles.accessName}>{a.name}</div>
              <div className={styles.accessPrice}>{a.currency} {a.price?.toLocaleString()}</div>
              {a.description && <div className={styles.accessDesc}>{a.description}</div>}
              <button className={styles.accessBtn}>Contact Seller</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── MARKETPLACE PANEL ─── */
const BIKE_BRANDS = ['Harley-Davidson','Ducati','BMW','Kawasaki','Yamaha','Honda','Suzuki','Triumph','KTM','Aprilia','Royal Enfield','Indian','Other']

function MarketplacePanel() {
  const [listings, setListings]       = useState<{ id: string; brand: string; model: string; year: number; price: number; currency: string; location: string; mileage: number; color: string; description: string; profiles: { full_name: string } }[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [formError, setFormError]     = useState('')

  async function load() {
    const supabase = createSupabaseBrowserClient()
    const { data } = await supabase
      .from('marketplace')
      .select('*, profiles(full_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    setListings((data as typeof listings) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true); setFormError('')
    const fd = new FormData(e.currentTarget)
    const result = await createMarketplaceListing(fd)
    if (result?.error) { setFormError(result.error); setSubmitting(false); return }
    setShowForm(false); setSubmitting(false)
    setLoading(true); load()
  }

  return (
    <div>
      <div className={styles.pageHdrRow}>
        <div>
          <h1 className={styles.pageHdrTitle}>Marketplace</h1>
          <p className={styles.pageHdrSub}>Buy and sell motorcycles within the MCRYDR community.</p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ List Your Bike</button>
      </div>

      {/* CREATE FORM MODAL */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>List Your Bike for Sale</div>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>
            {formError && <div className={styles.formError}>{formError}</div>}
            <form onSubmit={handleCreate} className={styles.createForm}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Brand *</label>
                  <select name="brand" required>
                    <option value="">Select brand...</option>
                    {BIKE_BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Model *</label>
                  <input name="model" placeholder="e.g. Panigale V4" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Year</label>
                  <input name="year" type="number" placeholder="2022" min="1970" max="2026" />
                </div>
                <div className={styles.formField}>
                  <label>Price (AED) *</label>
                  <input name="price" type="number" placeholder="85000" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Mileage (km)</label>
                  <input name="mileage" type="number" placeholder="12000" />
                </div>
                <div className={styles.formField}>
                  <label>Color</label>
                  <input name="color" placeholder="e.g. Red" />
                </div>
              </div>
              <div className={styles.formField}>
                <label>Location *</label>
                <input name="location" placeholder="e.g. Dubai Marina" required />
              </div>
              <div className={styles.formField}>
                <label>Description</label>
                <textarea name="description" placeholder="Describe the condition, history, modifications..." rows={3} />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                  {submitting ? 'Listing...' : 'Post Listing →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div className={styles.loadingMsg}>Loading listings...</div>}

      {!loading && listings.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏍️</div>
          <h3>No Listings Yet</h3>
          <p>Be the first to list a bike for sale in the MCRYDR community.</p>
          <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ List Your Bike</button>
        </div>
      )}

      {!loading && listings.length > 0 && (
        <div className={styles.mktGrid}>
          {listings.map(b => (
            <div key={b.id} className={styles.mktCard}>
              <div className={styles.mktImgBox}>🏍️</div>
              <div className={styles.mktTag}>For Sale</div>
              <div className={styles.mktName}>{b.brand} {b.model}</div>
              {b.year && <div className={styles.mktYear}>{b.year}</div>}
              <div className={styles.mktDetails}>
                {b.location && <>📍 {b.location}</>}
                {b.mileage  && <> · {b.mileage.toLocaleString()} km</>}
              </div>
              <div className={styles.mktPrice}>{b.currency} {b.price?.toLocaleString()}</div>
              {b.description && <div className={styles.mktDesc}>{b.description}</div>}
              <div className={styles.mktSeller}>👤 {b.profiles?.full_name || 'MCRYDR Rider'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── EVENTS PANEL ─── */
const EVENT_TYPES = ['Group Ride','Track Day','Meetup','Off-Road','Adventure','Custom']

function EventsPanel() {
  const [events, setEvents]           = useState<{ id: string; title: string; type: string; date: string; location: string; description: string; max_riders: number; attendee_count: number; joined: boolean }[]>([])
  const [loading, setLoading]         = useState(true)
  const [userId, setUserId]           = useState<string | null>(null)
  const [showForm, setShowForm]       = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [formError, setFormError]     = useState('')

  async function load() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user?.id || null)

    const { data: evts } = await supabase
      .from('events')
      .select('*, event_attendees(user_id)')
      .eq('status', 'upcoming')
      .order('date', { ascending: true })

    const mapped = (evts || []).map((e: { id: string; title: string; type: string; date: string; location: string; description: string; max_riders: number; event_attendees: { user_id: string }[] }) => ({
      ...e,
      attendee_count: e.event_attendees?.length || 0,
      joined: e.event_attendees?.some((a: { user_id: string }) => a.user_id === user?.id) || false,
    }))
    setEvents(mapped)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true); setFormError('')
    const fd = new FormData(e.currentTarget)
    const result = await createEvent(fd)
    if (result?.error) { setFormError(result.error); setSubmitting(false); return }
    setShowForm(false); setSubmitting(false)
    setLoading(true); load()
  }

  async function handleJoin(eventId: string, joined: boolean) {
    if (joined) {
      await leaveEvent(eventId)
    } else {
      await joinEvent(eventId)
    }
    load()
  }

  return (
    <div>
      <div className={styles.pageHdrRow}>
        <div>
          <h1 className={styles.pageHdrTitle}>Events</h1>
          <p className={styles.pageHdrSub}>Rides, meetups, track days and more near you.</p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ Create Event</button>
      </div>

      {/* CREATE FORM MODAL */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Create New Event</div>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>
            {formError && <div className={styles.formError}>{formError}</div>}
            <form onSubmit={handleCreate} className={styles.createForm}>
              <div className={styles.formField}>
                <label>Event Title *</label>
                <input name="title" placeholder="e.g. Friday Evening Ride" required />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Type *</label>
                  <select name="type" required>
                    <option value="">Select type...</option>
                    {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Max Riders</label>
                  <input name="max_riders" type="number" placeholder="50" min="1" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Date &amp; Time *</label>
                  <input name="date" type="datetime-local" required />
                </div>
                <div className={styles.formField}>
                  <label>Location *</label>
                  <input name="location" placeholder="e.g. Dubai Marina" required />
                </div>
              </div>
              <div className={styles.formField}>
                <label>Description</label>
                <textarea name="description" placeholder="Tell riders about this event..." rows={3} />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Event →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div className={styles.loadingMsg}>Loading events...</div>}

      {!loading && events.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h3>No Events Yet</h3>
          <p>Be the first to create a ride or meetup in your area.</p>
          <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ Create Event</button>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className={styles.eventsGrid}>
          {events.map(e => (
            <div key={e.id} className={styles.eventCard}>
              <div className={styles.eventTypeBadge}>{e.type}</div>
              <div className={styles.eventCardName}>{e.title}</div>
              {e.date && <div className={styles.eventCardMeta}>📅 {new Date(e.date).toLocaleString('en-GB', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</div>}
              {e.location && <div className={styles.eventCardMeta}>📍 {e.location}</div>}
              {e.description && <div className={styles.eventCardDesc}>{e.description}</div>}
              <div className={styles.eventCardFooter}>
                <span>{e.attendee_count} {e.attendee_count === 1 ? 'rider' : 'riders'} going</span>
                <button
                  className={`${styles.joinBtn} ${e.joined ? styles.joinedBtn : ''}`}
                  onClick={() => handleJoin(e.id, e.joined)}
                >
                  {e.joined ? '✓ Joined' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── FEED PANEL ─── */
type FeedTab = 'all' | 'posts' | 'reels' | 'ride_reports' | 'teams'
type FeedSection = 'feed' | 'follow'

function FeedPanel() {
  const [section, setSection]       = useState<FeedSection>('feed')
  const [tab, setTab]               = useState<FeedTab>('all')
  const [posts, setPosts]           = useState<{ id: string; content: string; post_type: string; media_url: string; likes_count: number; created_at: string; profiles: { full_name: string } | null; post_likes: { user_id: string }[] }[]>([])
  const [users, setUsers]           = useState<{ id: string; full_name: string; role: string }[]>([])
  const [myId, setMyId]             = useState<string | null>(null)
  const [following, setFollowing]   = useState<string[]>([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [postType, setPostType]     = useState<'post'|'reel'|'ride_report'>('post')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState('')

  async function loadFeed() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    setMyId(user?.id || null)

    let query = supabase.from('posts').select('*, profiles(full_name), post_likes(user_id)').order('created_at', { ascending: false })
    if (tab !== 'all') query = query.eq('post_type', tab)

    const [{ data: p }, { data: f }] = await Promise.all([
      query,
      user ? supabase.from('follows').select('following_id').eq('follower_id', user.id) : Promise.resolve({ data: [] }),
    ])
    setPosts((p as typeof posts) || [])
    setFollowing((f || []).map((r: { following_id: string }) => r.following_id))
    setLoading(false)
  }

  async function loadUsers() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('profiles').select('id, full_name, role').neq('id', user?.id || '')
    setUsers(data || [])
  }

  useEffect(() => { if (section === 'feed') loadFeed(); else loadUsers() }, [section, tab])

  async function handlePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSubmitting(true); setFormError('')
    const fd = new FormData(e.currentTarget)
    fd.append('post_type', postType)
    const result = await createPost(fd)
    if (result?.error) { setFormError(result.error); setSubmitting(false); return }
    setShowForm(false); setSubmitting(false)
    setLoading(true); loadFeed()
  }

  async function handleFollow(userId: string, isFollowing: boolean) {
    if (isFollowing) { await unfollowUser(userId); setFollowing(p => p.filter(id => id !== userId)) }
    else             { await followUser(userId);   setFollowing(p => [...p, userId]) }
  }

  const TABS: { id: FeedTab; label: string }[] = [
    { id: 'all',          label: 'ALL'          },
    { id: 'posts',        label: 'POSTS'        },
    { id: 'reels',        label: 'REELS'        },
    { id: 'ride_reports', label: 'RIDE REPORTS' },
    { id: 'teams',        label: 'TEAMS ONLY'   },
  ]

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHdrRow}>
        <div>
          <h1 className={styles.pageHdrTitle}>Social Feed</h1>
          <p className={styles.pageHdrSub}>Posts and reels from riders and teams you follow.</p>
        </div>
        <div className={styles.feedHeaderBtns}>
          <button className={`${styles.feedNavBtn} ${section === 'follow' ? styles.feedNavActive : ''}`} onClick={() => setSection(section === 'follow' ? 'feed' : 'follow')}>
            👥 Follow
          </button>
          <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ Add Post</button>
        </div>
      </div>

      {/* Filter Tabs */}
      {section === 'feed' && (
        <div className={styles.feedTabs}>
          {TABS.map(t => (
            <button key={t.id} className={`${styles.feedTab} ${tab === t.id ? styles.feedTabActive : ''}`} onClick={() => { setTab(t.id); setLoading(true) }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* ADD POST MODAL */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Add Post</div>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>✕</button>
            </div>
            {formError && <div className={styles.formError}>{formError}</div>}
            <form onSubmit={handlePost} className={styles.createForm}>
              {/* Post type */}
              <div className={styles.formField}>
                <label>Post Type</label>
                <div className={styles.postTypeTabs}>
                  {(['post','reel','ride_report'] as const).map(t => (
                    <button key={t} type="button" className={`${styles.postTypeBtn} ${postType === t ? styles.postTypeBtnActive : ''}`} onClick={() => setPostType(t)}>
                      {t === 'post' ? '📝 Post' : t === 'reel' ? '🎬 Reel' : '🏍️ Ride Report'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Media */}
              <div className={styles.formField}>
                <label>Photo / Video <span className={styles.optLabel}>(optional — paste URL)</span></label>
                <input name="media_url" placeholder="https://..." />
              </div>
              {/* Caption */}
              <div className={styles.formField}>
                <label>Caption *</label>
                <textarea name="content" placeholder="Share your ride, thoughts, or story..." rows={4} required />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOLLOW SECTION */}
      {section === 'follow' && (
        <div>
          <h3 className={styles.followTitle}>All Registered Riders</h3>
          {users.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <h3>No Other Riders Yet</h3>
              <p>Other riders will appear here once they join MCRYDR.</p>
            </div>
          ) : (
            <div className={styles.followGrid}>
              {users.map(u => {
                const initials = (u.full_name || 'R').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                const isFollowing = following.includes(u.id)
                return (
                  <div key={u.id} className={styles.followCard}>
                    <div className={styles.followAvatar}>{initials}</div>
                    <div className={styles.followInfo}>
                      <div className={styles.followName}>{u.full_name || 'Rider'}</div>
                      <div className={styles.followRole}>{u.role === 'commercial' ? '🏪 Business' : '🏍️ Rider'}</div>
                    </div>
                    <button
                      className={`${styles.followBtn} ${isFollowing ? styles.followingBtn : ''}`}
                      onClick={() => handleFollow(u.id, isFollowing)}
                    >
                      {isFollowing ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* FEED SECTION */}
      {section === 'feed' && (
        <>
          {loading && <div className={styles.loadingMsg}>Loading feed...</div>}
          {!loading && posts.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📱</div>
              <h3>No Posts Yet</h3>
              <p>Be the first to post — share a ride, photo, or update with the community.</p>
              <button className={styles.createBtn} onClick={() => setShowForm(true)}>+ Add Post</button>
            </div>
          )}
          {!loading && posts.length > 0 && (
            <div className={styles.feedList}>
              {posts.map(p => {
                const liked = p.post_likes?.some(l => l.user_id === myId)
                const initials = (p.profiles?.full_name || 'R').split(' ').map((n:string) => n[0]).join('').slice(0,2).toUpperCase()
                const timeAgo = (date: string) => {
                  const diff = Date.now() - new Date(date).getTime()
                  const mins = Math.floor(diff/60000)
                  if (mins < 60) return `${mins}m ago`
                  const hrs = Math.floor(mins/60)
                  if (hrs < 24) return `${hrs}h ago`
                  return `${Math.floor(hrs/24)}d ago`
                }
                return (
                  <div key={p.id} className={styles.feedCard}>
                    <div className={styles.feedCardTop}>
                      <div className={styles.feedAvatar}>{initials}</div>
                      <div className={styles.feedMeta}>
                        <div className={styles.feedUser}>{p.profiles?.full_name || 'Rider'}</div>
                        <div className={styles.feedTime}>{timeAgo(p.created_at)} · <span className={styles.feedTypeTag}>{p.post_type}</span></div>
                      </div>
                    </div>
                    {p.media_url && (
                      <div className={styles.feedMedia}>
                        <img src={p.media_url} alt="post media" className={styles.feedImg} onError={e => (e.currentTarget.style.display='none')} />
                      </div>
                    )}
                    {p.content && <div className={styles.feedText}>{p.content}</div>}
                    <div className={styles.feedActions}>
                      <span className={liked ? styles.likedAction : ''}>❤️ {(p.post_likes?.length || 0)}</span>
                      <span>💬 Comment</span>
                      <span>🔁 Share</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ─── TEAMS PANEL ─── */
interface TeamRow {
  id: string; name: string; location: string; about: string; logo_url: string
  team_members:      { user_id: string; role: string }[]
  team_follows:      { user_id: string }[]
  team_join_requests:{ user_id: string; status: string }[]
}

function TeamsPanel() {
  const [teams, setTeams]   = useState<TeamRow[]>([])
  const [myId, setMyId]     = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    setMyId(user?.id || null)

    const { data } = await supabase
      .from('teams')
      .select('*, team_members(user_id, role), team_follows(user_id), team_join_requests(user_id, status)')
      .order('created_at', { ascending: false })

    setTeams((data as TeamRow[]) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleFollow(teamId: string, isFollowing: boolean) {
    if (isFollowing) await unfollowTeam(teamId)
    else             await followTeam(teamId)
    load()
  }

  async function handleJoin(teamId: string, requestStatus: string | null) {
    if (requestStatus === 'pending') await cancelJoinRequest(teamId)
    else                             await requestJoinTeam(teamId)
    load()
  }

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Teams</h1>
        <p>Discover motorcycle teams — follow for updates or request to join.</p>
      </div>

      {loading && <div className={styles.loadingMsg}>Loading teams...</div>}

      {!loading && teams.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏁</div>
          <h3>No Teams Yet</h3>
          <p>Be the first to create a team and unite riders around you.</p>
        </div>
      )}

      {!loading && teams.length > 0 && (
        <div className={styles.teamsGrid}>
          {teams.map(team => {
            const memberCount   = team.team_members?.length || 0
            const followCount   = team.team_follows?.length || 0
            const isMember      = team.team_members?.some(m => m.user_id === myId)
            const isLeader      = team.team_members?.some(m => m.user_id === myId && m.role === 'leader')
            const isFollowing   = team.team_follows?.some(f => f.user_id === myId)
            const myRequest     = team.team_join_requests?.find(r => r.user_id === myId)
            const requestStatus = myRequest?.status || null

            return (
              <div key={team.id} className={styles.teamCard}>
                {/* Team logo */}
                <div className={styles.teamCardLogo}>
                  {team.logo_url
                    ? <img src={team.logo_url} alt={team.name} className={styles.teamCardLogoImg} />
                    : <span>🏁</span>}
                </div>

                {/* Info */}
                <div className={styles.teamCardBody}>
                  <div className={styles.teamCardName}>{team.name}</div>
                  {team.location && <div className={styles.teamCardMeta}>📍 {team.location}</div>}
                  {team.about    && <div className={styles.teamCardAbout}>{team.about}</div>}

                  <div className={styles.teamCardStats}>
                    <span>👥 {memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
                    <span>·</span>
                    <span>❤️ {followCount} {followCount === 1 ? 'follower' : 'followers'}</span>
                    {isLeader && <span className={styles.leaderTag}>👑 Leader</span>}
                    {isMember && !isLeader && <span className={styles.memberTag}>✓ Member</span>}
                  </div>

                  {/* Actions — only show if not a member */}
                  {!isMember && (
                    <div className={styles.teamCardActions}>
                      {/* Follow toggle */}
                      <button
                        className={`${styles.teamFollowBtn} ${isFollowing ? styles.teamFollowingBtn : ''}`}
                        onClick={() => handleFollow(team.id, isFollowing)}
                      >
                        {isFollowing ? '✓ Following' : '+ Follow'}
                      </button>

                      {/* Join request */}
                      <button
                        className={`${styles.teamJoinBtn} ${requestStatus === 'pending' ? styles.teamJoinPendingBtn : requestStatus === 'approved' ? styles.teamJoinApprovedBtn : ''}`}
                        onClick={() => handleJoin(team.id, requestStatus)}
                        disabled={requestStatus === 'approved'}
                      >
                        {requestStatus === 'pending'  ? '⏳ Request Sent'
                         : requestStatus === 'approved' ? '✓ Approved'
                         : '🏁 Request to Join'}
                      </button>
                    </div>
                  )}

                  {/* Already a member message */}
                  {isMember && (
                    <div className={styles.teamMemberMsg}>
                      You&apos;re{isLeader ? ' the leader' : ' a member'} of this team
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── CREATE TEAM PANEL ─── */
function CreateTeamPanel() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)
  const [allUsers, setAllUsers]     = useState<{ id: string; full_name: string }[]>([])
  const [members, setMembers]       = useState<string[]>([])
  const [searchQ, setSearchQ]       = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('id, full_name').neq('id', user.id)
        .then(({ data }) => setAllUsers(data || []))
    })
  }, [])

  function toggleMember(id: string) {
    setMembers(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSubmitting(true); setError('')
    const fd = new FormData(e.currentTarget)
    fd.append('members', JSON.stringify(members))
    const result = await createTeam(fd)
    if (result?.error) { setError(result.error); setSubmitting(false); return }
    setSuccess(true); setSubmitting(false)
  }

  if (success) return (
    <div className={styles.emptyState} style={{ marginTop: 40 }}>
      <div className={styles.emptyIcon}>🏁</div>
      <h3>Team Created!</h3>
      <p>Your team is live. Invite riders to join and start riding together.</p>
    </div>
  )

  const filtered = allUsers.filter(u => u.full_name?.toLowerCase().includes(searchQ.toLowerCase()))

  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Create Team</h1>
        <p>Build your motorcycle team and unite riders around you.</p>
      </div>
      {error && <div className={styles.formError} style={{ marginBottom: 20 }}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.teamForm}>
        {/* Team Photo Placeholder */}
        <div className={styles.teamLogoUpload}>
          <div className={styles.teamLogoPlaceholder}>🏁</div>
          <div className={styles.teamLogoHint}>Team Photo — coming soon</div>
        </div>

        <div className={styles.formField}>
          <label>Team Name *</label>
          <input name="name" placeholder="e.g. Kings Rider MC" required />
        </div>
        <div className={styles.formField}>
          <label>Location</label>
          <input name="location" placeholder="e.g. Dubai, UAE" />
        </div>
        <div className={styles.formField}>
          <label>About Us</label>
          <textarea name="about" placeholder="Tell riders about your team — your style, values, and what you ride..." rows={4} />
        </div>

        {/* Add Members */}
        <div className={styles.formField}>
          <label>Add Members <span className={styles.optLabel}>(you are automatically the leader)</span></label>
          <input
            placeholder="Search riders by name..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className={styles.memberSearch}
          />
          {members.length > 0 && (
            <div className={styles.selectedMembers}>
              {members.map(id => {
                const u = allUsers.find(u => u.id === id)
                return (
                  <div key={id} className={styles.selectedMember}>
                    {u?.full_name} <button type="button" onClick={() => toggleMember(id)}>✕</button>
                  </div>
                )
              })}
            </div>
          )}
          {searchQ && (
            <div className={styles.memberDropdown}>
              {filtered.length === 0 ? (
                <div className={styles.memberDropdownEmpty}>No riders found</div>
              ) : filtered.map(u => (
                <div key={u.id} className={`${styles.memberDropdownItem} ${members.includes(u.id) ? styles.memberSelected : ''}`} onClick={() => toggleMember(u.id)}>
                  <div className={styles.memberItemAvatar}>{(u.full_name||'R').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>
                  <div>{u.full_name}</div>
                  {members.includes(u.id) && <div className={styles.memberCheck}>✓</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className={styles.btnSubmit} disabled={submitting} style={{ width: '100%', padding: '14px' }}>
          {submitting ? 'Creating Team...' : 'Create Team →'}
        </button>
      </form>
    </div>
  )
}

/* ─── PROFILE PANEL ─── */
const COUNTRIES = ['United Arab Emirates','Saudi Arabia','Kuwait','Qatar','Bahrain','Oman','Jordan','Lebanon','Egypt','United Kingdom','United States','Other']
const BIKE_COLORS = ['Black','White','Red','Orange','Blue','Green','Yellow','Grey / Silver','Brown','Burgundy / Maroon','Purple','Two-tone','Custom / Wrap']

interface ProfileData {
  id: string; full_name: string; phone: string; country: string
  role: string; created_at: string; email: string
}
interface BikeData {
  id: string; brand: string; model: string; year: number; color: string; nickname: string
}
interface TeamMembership {
  role: string; teams: { id: string; name: string; location: string; team_members: { user_id: string }[] }
}

function ProfilePanel() {
  const [profile, setProfile]       = useState<ProfileData | null>(null)
  const [bikes, setBikes]           = useState<BikeData[]>([])
  const [teams, setTeams]           = useState<TeamMembership[]>([])
  const [loading, setLoading]       = useState(true)
  const [editMode, setEditMode]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [saveMsg, setSaveMsg]       = useState('')
  const [showAddBike, setShowAddBike] = useState(false)
  const [addingBike, setAddingBike] = useState(false)
  const [editingBikeId, setEditingBikeId] = useState<string | null>(null)
  const [bikeError, setBikeError]   = useState('')

  // Local edit state
  const [eName, setEName]       = useState('')
  const [ePhone, setEPhone]     = useState('')
  const [eCountry, setECountry] = useState('')

  // Add bike local state
  const [newBrand, setNewBrand]     = useState('')
  const [newModel, setNewModel]     = useState('')
  const [newYear, setNewYear]       = useState('')
  const [newColor, setNewColor]     = useState('')
  const [newNick, setNewNick]       = useState('')

  async function load() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [{ data: prof }, { data: b }, { data: t }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('bikes').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
      supabase.from('team_members').select('role, teams(id, name, location, team_members(user_id))').eq('user_id', user.id),
    ])

    const p = prof as ProfileData
    setProfile({ ...p, email: user.email || '' })
    setBikes((b as BikeData[]) || [])
    setTeams((t as unknown as TeamMembership[]) || [])
    setEName(p?.full_name || '')
    setEPhone(p?.phone || '')
    setECountry(p?.country || '')
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSaveProfile() {
    setSaving(true); setSaveMsg('')
    const fd = new FormData()
    fd.append('full_name', eName)
    fd.append('phone', ePhone)
    fd.append('country', eCountry)
    const result = await updateProfile(fd)
    setSaving(false)
    if (result?.error) { setSaveMsg(result.error); return }
    setSaveMsg('✓ Saved')
    setEditMode(false)
    load()
    setTimeout(() => setSaveMsg(''), 3000)
  }

  async function handleAddBike() {
    if (!newBrand || !newModel) { setBikeError('Brand and model are required.'); return }
    setAddingBike(true); setBikeError('')
    const fd = new FormData()
    fd.append('brand', newBrand); fd.append('model', newModel)
    fd.append('year', newYear);   fd.append('color', newColor)
    fd.append('nickname', newNick)
    const result = await addBike(fd)
    setAddingBike(false)
    if (result?.error) { setBikeError(result.error); return }
    setShowAddBike(false); setNewBrand(''); setNewModel(''); setNewYear(''); setNewColor(''); setNewNick('')
    load()
  }

  async function handleRemoveBike(id: string) {
    await removeBike(id); load()
  }

  async function handleUpdateBike(e: React.FormEvent<HTMLFormElement>, bikeId: string) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await updateBike(bikeId, fd)
    setEditingBikeId(null); load()
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'MC'

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : ''

  if (loading) return <div className={styles.loadingMsg}>Loading profile...</div>

  return (
    <div className={styles.profileWrap}>

      {/* ── PROFILE HEADER ── */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>{initials}</div>
        <div className={styles.profileHeaderInfo}>
          <div className={styles.profileName}>{profile?.full_name || 'Rider'}</div>
          <div className={styles.profileMeta}>
            {profile?.email && <span>✉️ {profile.email}</span>}
            {memberSince    && <span>📅 Member since {memberSince}</span>}
          </div>
          <div className={styles.profileBadge}>
            {profile?.role === 'commercial' ? '🏪 Business' : '🏍️ MC Rider'}
          </div>
        </div>
        <button className={styles.editProfileBtn} onClick={() => setEditMode(e => !e)}>
          {editMode ? 'Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      {/* ── EDIT PROFILE FORM ── */}
      {editMode && (
        <div className={styles.profileSection}>
          <div className={styles.profileSectionTitle}>Edit Profile</div>
          <div className={styles.profileEditGrid}>
            <div className={styles.formField}>
              <label>Full Name</label>
              <input value={eName} onChange={e => setEName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className={styles.formField}>
              <label>Phone Number</label>
              <input value={ePhone} onChange={e => setEPhone(e.target.value)} placeholder="+971 50 000 0000" />
            </div>
            <div className={styles.formField}>
              <label>Country</label>
              <select value={eCountry} onChange={e => setECountry(e.target.value)}>
                <option value="">Select country...</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.profileEditActions}>
            {saveMsg && <span className={styles.saveMsg}>{saveMsg}</span>}
            <button className={styles.btnSubmit} onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ── MY BIKES ── */}
      <div className={styles.profileSection}>
        <div className={styles.profileSectionHeader}>
          <div className={styles.profileSectionTitle}>🏍️ My Bikes</div>
          <button className={styles.sectionAddBtn} onClick={() => setShowAddBike(s => !s)}>
            {showAddBike ? 'Cancel' : '+ Add Bike'}
          </button>
        </div>

        {/* Add Bike Form */}
        {showAddBike && (
          <div className={styles.addBikeForm}>
            {bikeError && <div className={styles.formError}>{bikeError}</div>}
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Brand *</label>
                <select value={newBrand} onChange={e => { setNewBrand(e.target.value); setNewModel('') }}>
                  <option value="">Select brand...</option>
                  {BIKE_BRANDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className={styles.formField}>
                <label>Model *</label>
                <input value={newModel} onChange={e => setNewModel(e.target.value)} placeholder="e.g. Fat Boy" />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Year</label>
                <input type="number" value={newYear} onChange={e => setNewYear(e.target.value)} placeholder="2022" min="1970" max="2026" />
              </div>
              <div className={styles.formField}>
                <label>Color</label>
                <select value={newColor} onChange={e => setNewColor(e.target.value)}>
                  <option value="">Select color...</option>
                  {BIKE_COLORS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.formField}>
              <label>Nickname <span className={styles.optLabel}>(optional)</span></label>
              <input value={newNick} onChange={e => setNewNick(e.target.value)} placeholder='e.g. "The Beast"' />
            </div>
            <button className={styles.btnSubmit} onClick={handleAddBike} disabled={addingBike}>
              {addingBike ? 'Adding...' : 'Add Bike →'}
            </button>
          </div>
        )}

        {/* Bikes list */}
        {bikes.length === 0 && !showAddBike && (
          <div className={styles.profileEmpty}>No bikes added yet. Click &quot;+ Add Bike&quot; to get started.</div>
        )}
        <div className={styles.bikesGrid}>
          {bikes.map(bike => (
            <div key={bike.id} className={styles.bikeCardProfile}>
              {editingBikeId === bike.id ? (
                /* Inline edit form */
                <form onSubmit={e => handleUpdateBike(e, bike.id)}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Brand</label>
                      <select name="brand" defaultValue={bike.brand}>
                        {BIKE_BRANDS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className={styles.formField}>
                      <label>Model</label>
                      <input name="model" defaultValue={bike.model} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label>Year</label>
                      <input name="year" type="number" defaultValue={bike.year} />
                    </div>
                    <div className={styles.formField}>
                      <label>Color</label>
                      <select name="color" defaultValue={bike.color || ''}>
                        <option value="">—</option>
                        {BIKE_COLORS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.formField}>
                    <label>Nickname</label>
                    <input name="nickname" defaultValue={bike.nickname || ''} />
                  </div>
                  <div className={styles.bikeEditActions}>
                    <button type="button" className={styles.btnCancel} onClick={() => setEditingBikeId(null)}>Cancel</button>
                    <button type="submit" className={styles.btnSubmit}>Save</button>
                  </div>
                </form>
              ) : (
                /* Bike card display */
                <>
                  <div className={styles.bikeCardEmoji}>🏍️</div>
                  <div className={styles.bikeCardInfo}>
                    <div className={styles.bikeCardName}>{bike.brand} {bike.model}</div>
                    <div className={styles.bikeCardMeta}>
                      {bike.year  && <span>{bike.year}</span>}
                      {bike.color && <span> · {bike.color}</span>}
                      {bike.nickname && <span> · &quot;{bike.nickname}&quot;</span>}
                    </div>
                  </div>
                  <div className={styles.bikeCardBtns}>
                    <button className={styles.bikeEditBtn} onClick={() => setEditingBikeId(bike.id)}>✏️</button>
                    <button className={styles.bikeRemoveBtn} onClick={() => handleRemoveBike(bike.id)}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MY TEAMS ── */}
      <div className={styles.profileSection}>
        <div className={styles.profileSectionTitle}>🏁 My Teams</div>
        {teams.length === 0 ? (
          <div className={styles.profileEmpty}>You&apos;re not a member of any team yet. Browse Teams to find your crew.</div>
        ) : (
          <div className={styles.profileTeamsList}>
            {teams.map((t, i) => {
              const memberCount = t.teams?.team_members?.length || 0
              return (
                <div key={i} className={styles.profileTeamRow}>
                  <div className={styles.profileTeamIcon}>🏁</div>
                  <div className={styles.profileTeamInfo}>
                    <div className={styles.profileTeamName}>{t.teams?.name}</div>
                    <div className={styles.profileTeamMeta}>
                      {t.teams?.location && <span>📍 {t.teams.location} · </span>}
                      <span>👥 {memberCount} members</span>
                    </div>
                  </div>
                  <div className={`${styles.profileTeamRole} ${t.role === 'leader' ? styles.profileLeaderRole : ''}`}>
                    {t.role === 'leader' ? '👑 Leader' : '✓ Member'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

/* ─── COMING SOON ─── */
function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className={styles.comingSoon}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
      <h2>{label}</h2>
      <p>This feature is coming soon. We&apos;re building it right now.</p>
    </div>
  )
}
