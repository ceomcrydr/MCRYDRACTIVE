'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import styles from './rider.module.css'

const NAV_ITEMS = [
  { icon: '🏠', label: 'Dashboard', id: 'dashboard' },
  { icon: '🏍️', label: 'My Garage', id: 'garage', badge: '2' },
  { icon: '📍', label: 'Rides & Events', id: 'events', badge: '3' },
  { icon: '👥', label: 'Community', id: 'community' },
  { icon: '🔔', label: 'Notifications', id: 'notifications', badge: '5' },
  { icon: '🛒', label: 'Marketplace', id: 'marketplace' },
  { icon: '🔧', label: 'Find a Shop', id: 'shops' },
  { icon: '💬', label: 'Messages', id: 'messages', badge: '2' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

export default function RiderDashboard() {
  const [activePanel, setActivePanel] = useState('dashboard')

  return (
    <div className={styles.root}>
      {/* TOP NAV */}
      <header className={styles.topnav}>
        <Link href="/" className={styles.navBrand}>
          <div className={styles.logoSq}>MC</div>
          <div className={styles.navName}>MC<span>RYDR</span></div>
        </Link>
        <div className={styles.navSearch}>
          <span className={styles.searchIcon}>🔍</span>
          <input placeholder="Search riders, bikes, events, shops..." />
        </div>
        <div className={styles.navRight}>
          <div className={styles.navIconBtn} title="Notifications">
            🔔<span className={styles.notifDot} />
          </div>
          <div className={styles.navIconBtn}>📍</div>
          <div className={styles.navAvatar} title="Profile">AK</div>
        </div>
      </header>

      <div className={styles.bodyWrap}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>Main</div>
            {NAV_ITEMS.slice(0, 5).map(item => (
              <div
                key={item.id}
                className={`${styles.navItem} ${activePanel === item.id ? styles.active : ''}`}
                onClick={() => setActivePanel(item.id)}
              >
                <span className={styles.niIcon}>{item.icon}</span>
                {item.label}
                {item.badge && <span className={styles.niBadge}>{item.badge}</span>}
              </div>
            ))}
          </div>
          <div className={styles.sidebarDivider} />
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>Explore</div>
            {NAV_ITEMS.slice(5, 8).map(item => (
              <div
                key={item.id}
                className={`${styles.navItem} ${activePanel === item.id ? styles.active : ''}`}
                onClick={() => setActivePanel(item.id)}
              >
                <span className={styles.niIcon}>{item.icon}</span>
                {item.label}
                {item.badge && <span className={styles.niBadge}>{item.badge}</span>}
              </div>
            ))}
          </div>
          <div className={styles.sidebarDivider} />
          <div
            className={`${styles.navItem} ${activePanel === 'settings' ? styles.active : ''}`}
            onClick={() => setActivePanel('settings')}
          >
            <span className={styles.niIcon}>⚙️</span> Settings
          </div>

          {/* Rider profile mini */}
          <div className={styles.sidebarProfile}>
            <div className={styles.spAvatar}>AK</div>
            <div>
              <div className={styles.spName}>Ahmed K.</div>
              <div className={styles.spBike}>Ducati Panigale V4</div>
            </div>
            <form action={signOut} className={styles.spEdit}>
              <button type="submit" title="Log out" className={styles.spEdit}>↩</button>
            </form>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          {activePanel === 'dashboard' && <DashboardPanel />}
          {activePanel === 'garage' && <GaragePanel />}
          {activePanel === 'events' && <EventsPanel />}
          {activePanel !== 'dashboard' && activePanel !== 'garage' && activePanel !== 'events' && (
            <ComingSoonPanel label={NAV_ITEMS.find(n => n.id === activePanel)?.label || activePanel} />
          )}
        </main>
      </div>
    </div>
  )
}

function DashboardPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Rider Dashboard</h1>
        <p>Welcome back — here&apos;s what&apos;s happening in your community.</p>
      </div>
      <div className={styles.statRow}>
        {[
          { label: 'Rides This Month', val: '8', sub: '+3 from last month' },
          { label: 'Community Connections', val: '142', sub: '12 new this week' },
          { label: 'Events Joined', val: '5', sub: '2 upcoming' },
          { label: 'Garage Bikes', val: '2', sub: 'All verified' },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.scLabel}>{s.label}</div>
            <div className={styles.scVal}>{s.val}</div>
            <div className={styles.scSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Upcoming Events Near You</div>
              <div className={styles.widgetMore}>View all →</div>
            </div>
            {[
              { name: 'Friday Evening Ride', date: 'Fri Jun 6 · 6:00 PM', loc: 'Dubai Marina', count: 24 },
              { name: 'Desert Off-Road Session', date: 'Sat Jun 7 · 7:00 AM', loc: 'Al Qudra', count: 18 },
              { name: 'Monthly Meetup — JBR', date: 'Sun Jun 8 · 5:00 PM', loc: 'JBR Walk', count: 67 },
            ].map(e => (
              <div key={e.name} className={styles.eventItem}>
                <div className={styles.eventDot} />
                <div className={styles.eventInfo}>
                  <div className={styles.eventName}>{e.name}</div>
                  <div className={styles.eventMeta}>{e.date} · {e.loc}</div>
                </div>
                <div className={styles.eventCount}>{e.count} riders</div>
              </div>
            ))}
          </div>

          <div className={styles.widget} style={{ marginTop: 20 }}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Community Feed</div>
              <div className={styles.widgetMore}>See more →</div>
            </div>
            {[
              { user: 'Marcus R.', avatar: 'MR', time: '2h ago', text: 'Just got back from the Al Ain mountain run — absolutely incredible roads. Who&apos;s in for next weekend?', likes: 34 },
              { user: 'Priya K.', avatar: 'PK', time: '5h ago', text: 'New Ducati Streetfighter V4 just arrived at the garage 🔥 First impressions: absolutely insane.', likes: 89 },
            ].map(p => (
              <div key={p.user} className={styles.feedPost}>
                <div className={styles.feedAvatar}>{p.avatar}</div>
                <div className={styles.feedBody}>
                  <div className={styles.feedUser}>{p.user} <span>{p.time}</span></div>
                  <div className={styles.feedText}>{p.text}</div>
                  <div className={styles.feedActions}>
                    <span>❤️ {p.likes}</span>
                    <span>💬 Reply</span>
                    <span>🔁 Share</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>My Garage</div>
              <div className={styles.widgetMore}>Manage →</div>
            </div>
            {[
              { name: 'Ducati Panigale V4', year: '2022', color: 'Red', nick: 'The Beast' },
              { name: 'Honda Africa Twin', year: '2020', color: 'Black', nick: 'Wanderer' },
            ].map(b => (
              <div key={b.name} className={styles.bikeCard}>
                <div className={styles.bikeName}>{b.name}</div>
                <div className={styles.bikeMeta}>{b.year} · {b.color} · &ldquo;{b.nick}&rdquo;</div>
              </div>
            ))}
            <button className={styles.addBikeBtn}>+ Add Bike</button>
          </div>

          <div className={styles.widget} style={{ marginTop: 20 }}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Nearby Shops</div>
              <div className={styles.widgetMore}>Map view →</div>
            </div>
            {[
              { name: 'Dubai Moto Hub', type: 'Parts & Service', dist: '1.2 km', rating: '4.8' },
              { name: 'Speed Culture Garage', type: 'Custom Builds', dist: '3.4 km', rating: '4.9' },
              { name: 'Al Quoz Tire Center', type: 'Tires & Rims', dist: '4.1 km', rating: '4.6' },
            ].map(s => (
              <div key={s.name} className={styles.shopItem}>
                <div className={styles.shopIcon}>🔧</div>
                <div className={styles.shopInfo}>
                  <div className={styles.shopName}>{s.name}</div>
                  <div className={styles.shopMeta}>{s.type} · {s.dist}</div>
                </div>
                <div className={styles.shopRating}>⭐ {s.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GaragePanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>My Garage</h1>
        <p>Your bikes, your identity.</p>
      </div>
      <div className={styles.garageGrid}>
        {[
          { name: 'Ducati Panigale V4', year: '2022', color: 'Red', nick: 'The Beast', emoji: '🏍️' },
          { name: 'Honda Africa Twin', year: '2020', color: 'Black', nick: 'Wanderer', emoji: '🏕️' },
        ].map(b => (
          <div key={b.name} className={styles.garageCard}>
            <div className={styles.garageEmoji}>{b.emoji}</div>
            <div className={styles.garageName}>{b.name}</div>
            <div className={styles.garageMeta}>{b.year} · {b.color}</div>
            <div className={styles.garageNick}>&ldquo;{b.nick}&rdquo;</div>
            <button className={styles.garageEditBtn}>Edit Details</button>
          </div>
        ))}
        <div className={`${styles.garageCard} ${styles.addBikeCard}`}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>➕</div>
          <div className={styles.garageName}>Add a Bike</div>
          <div className={styles.garageMeta}>Expand your garage</div>
        </div>
      </div>
    </div>
  )
}

function EventsPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Rides &amp; Events</h1>
        <p>Find group rides, track days, and meetups near you.</p>
      </div>
      <div className={styles.eventsGrid}>
        {[
          { name: 'Friday Evening Ride', date: 'Fri Jun 6 · 6:00 PM', loc: 'Dubai Marina', count: 24, type: 'Group Ride' },
          { name: 'Desert Off-Road Session', date: 'Sat Jun 7 · 7:00 AM', loc: 'Al Qudra', count: 18, type: 'Off-Road' },
          { name: 'Monthly Meetup — JBR', date: 'Sun Jun 8 · 5:00 PM', loc: 'JBR Walk', count: 67, type: 'Meetup' },
          { name: 'Yas Marina Track Day', date: 'Sat Jun 14 · 8:00 AM', loc: 'Abu Dhabi', count: 32, type: 'Track Day' },
          { name: 'Al Ain Heritage Ride', date: 'Fri Jun 20 · 5:00 AM', loc: 'Al Ain', count: 45, type: 'Group Ride' },
          { name: 'Hatta Mountain Trail', date: 'Sat Jun 21 · 6:00 AM', loc: 'Hatta', count: 28, type: 'Adventure' },
        ].map(e => (
          <div key={e.name} className={styles.eventCard}>
            <div className={styles.eventTypeBadge}>{e.type}</div>
            <div className={styles.eventCardName}>{e.name}</div>
            <div className={styles.eventCardMeta}>📅 {e.date}</div>
            <div className={styles.eventCardMeta}>📍 {e.loc}</div>
            <div className={styles.eventCardFooter}>
              <span>{e.count} riders going</span>
              <button className={styles.joinBtn}>Join</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ComingSoonPanel({ label }: { label: string }) {
  return (
    <div className={styles.comingSoon}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
      <h2>{label}</h2>
      <p>This feature is coming soon. We&apos;re building it right now.</p>
    </div>
  )
}
