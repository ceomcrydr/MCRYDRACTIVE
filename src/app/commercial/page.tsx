'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import styles from './commercial.module.css'

const NAV_ITEMS = [
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '🏪', label: 'My Business', id: 'business' },
  { icon: '🛒', label: 'Products & Services', id: 'products', badge: '12' },
  { icon: '👥', label: 'Leads & Customers', id: 'leads', badge: '8' },
  { icon: '📣', label: 'Promotions', id: 'promotions' },
  { icon: '⭐', label: 'Reviews', id: 'reviews', badge: '3' },
  { icon: '📈', label: 'Analytics', id: 'analytics' },
  { icon: '🔔', label: 'Notifications', id: 'notifications', badge: '5' },
  { icon: '💬', label: 'Messages', id: 'messages', badge: '2' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

export default function CommercialDashboard() {
  const [activePanel, setActivePanel] = useState('overview')

  return (
    <div className={styles.root}>
      {/* TOP NAV */}
      <header className={styles.topnav}>
        <Link href="/" className={styles.navBrand}>
          <div className={styles.logoSq}>MC</div>
          <div className={styles.navName}>MC<span>RYDR</span></div>
        </Link>
        <div className={styles.bizPill}>
          <span>🏪</span> Business Account
        </div>
        <div className={styles.navRight}>
          <div className={styles.navIconBtn} title="Notifications">
            🔔<span className={styles.notifDot} />
          </div>
          <div className={styles.navIconBtn}>📊</div>
          <div className={styles.bizAvatar}>
            <div className={styles.bizAvatarIcon}>DM</div>
            <div>
              <div className={styles.bizAvatarName}>Dubai Moto Hub</div>
              <div className={styles.bizAvatarType}>Parts & Service</div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.bodyWrap}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarLabel}>Business</div>
            {NAV_ITEMS.slice(0, 6).map(item => (
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
            <div className={styles.sidebarLabel}>Tools</div>
            {NAV_ITEMS.slice(6, 9).map(item => (
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

          <div className={styles.bizInfoMini}>
            <div className={styles.bimName}>Dubai Moto Hub</div>
            <div className={styles.bimType}>Parts & Service · Dubai, UAE</div>
            <div className={styles.bimStatus}>
              <span className={styles.bimDot} /> Verified Business
            </div>
            <form action={signOut} style={{ marginTop: 10 }}>
              <button type="submit" className={styles.logoutBtn}>Log Out</button>
            </form>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.mainContent}>
          {activePanel === 'overview' && <OverviewPanel />}
          {activePanel === 'products' && <ProductsPanel />}
          {activePanel === 'leads' && <LeadsPanel />}
          {activePanel !== 'overview' && activePanel !== 'products' && activePanel !== 'leads' && (
            <ComingSoonPanel label={NAV_ITEMS.find(n => n.id === activePanel)?.label || activePanel} />
          )}
        </main>
      </div>
    </div>
  )
}

function OverviewPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Business Overview</h1>
        <p>Your store performance at a glance.</p>
      </div>
      <div className={styles.statRow}>
        {[
          { label: 'Profile Views', val: '1,284', sub: '+18% this week', color: styles.scValGold },
          { label: 'New Leads', val: '47', sub: '8 unread', color: styles.scValGold },
          { label: 'Active Listings', val: '38', sub: '12 products, 26 services', color: styles.scValGold },
          { label: 'Avg. Rating', val: '4.8★', sub: 'From 124 reviews', color: styles.scValGold },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.scLabel}>{s.label}</div>
            <div className={`${styles.scVal} ${s.color}`}>{s.val}</div>
            <div className={styles.scSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        <div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Recent Leads</div>
              <div className={styles.widgetMore}>View all →</div>
            </div>
            {[
              { name: 'Ahmed K.', bike: 'Ducati Panigale V4', query: 'Oil change + brake service', time: '2h ago', status: 'New' },
              { name: 'Marcus R.', bike: 'Harley Fat Boy', query: 'Custom exhaust install', time: '5h ago', status: 'Contacted' },
              { name: 'Priya K.', bike: 'Kawasaki Z900', query: 'Tire replacement (both wheels)', time: '1d ago', status: 'Quoted' },
            ].map(l => (
              <div key={l.name} className={styles.leadItem}>
                <div className={styles.leadAvatar}>{l.name.split(' ').map(n => n[0]).join('')}</div>
                <div className={styles.leadInfo}>
                  <div className={styles.leadName}>{l.name} <span className={styles.leadBike}>· {l.bike}</span></div>
                  <div className={styles.leadQuery}>{l.query}</div>
                  <div className={styles.leadTime}>{l.time}</div>
                </div>
                <span className={`${styles.leadStatus} ${l.status === 'New' ? styles.statusNew : l.status === 'Contacted' ? styles.statusContacted : styles.statusQuoted}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.widget} style={{ marginTop: 20 }}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Recent Reviews</div>
              <div className={styles.widgetMore}>See all →</div>
            </div>
            {[
              { user: 'Khalid M.', stars: 5, text: 'Best service in Dubai. Fast, professional, and honest pricing. Will be back!', time: '3d ago' },
              { user: 'Sara L.', stars: 4, text: 'Great parts selection. Staff is very knowledgeable about Ducati.', time: '5d ago' },
            ].map(r => (
              <div key={r.user} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewUser}>{r.user}</span>
                  <span className={styles.reviewStars}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  <span className={styles.reviewTime}>{r.time}</span>
                </div>
                <div className={styles.reviewText}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetTitle}>Quick Actions</div>
            </div>
            {[
              { icon: '➕', label: 'Add New Listing', desc: 'Product or service' },
              { icon: '📣', label: 'Create Promotion', desc: 'Target local riders' },
              { icon: '📩', label: 'Reply to Leads', desc: '8 awaiting response' },
              { icon: '📷', label: 'Update Photos', desc: 'Shop & inventory' },
            ].map(a => (
              <div key={a.label} className={styles.quickAction}>
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
              <div className={styles.widgetMore}>Edit →</div>
            </div>
            <div className={styles.bizProfileCard}>
              <div className={styles.bizLogo}>DM</div>
              <div className={styles.bizDetails}>
                <div className={styles.bizBizName}>Dubai Moto Hub</div>
                <div className={styles.bizBizType}>🔧 Parts & Service</div>
                <div className={styles.bizBizLoc}>📍 Al Quoz, Dubai</div>
                <div className={styles.bizBizRating}>⭐ 4.8 · 124 reviews</div>
              </div>
            </div>
            <div className={styles.profileCompleteness}>
              <div className={styles.pcLabel}>Profile completeness — 78%</div>
              <div className={styles.pcBar}><div className={styles.pcFill} style={{ width: '78%' }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductsPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Products &amp; Services</h1>
        <p>Manage your listings visible to MCRYDR riders.</p>
      </div>
      <div className={styles.productsGrid}>
        {[
          { name: 'Full Service Package', type: 'Service', price: 'AED 350', status: 'Active' },
          { name: 'Michelin Pilot Road 5 (Front)', type: 'Product', price: 'AED 420', status: 'Active' },
          { name: 'Akrapovič Slip-On Exhaust', type: 'Product', price: 'AED 2,800', status: 'Active' },
          { name: 'Chain & Sprocket Kit', type: 'Product', price: 'AED 280', status: 'Active' },
          { name: 'Custom ECU Tune', type: 'Service', price: 'AED 600', status: 'Draft' },
          { name: 'Track Day Prep Service', type: 'Service', price: 'AED 450', status: 'Active' },
        ].map(p => (
          <div key={p.name} className={styles.productCard}>
            <div className={styles.productType}>{p.type}</div>
            <div className={styles.productName}>{p.name}</div>
            <div className={styles.productPrice}>{p.price}</div>
            <div className={`${styles.productStatus} ${p.status === 'Active' ? styles.statusActive : styles.statusDraft}`}>
              {p.status}
            </div>
          </div>
        ))}
        <div className={`${styles.productCard} ${styles.addProductCard}`}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>➕</div>
          <div className={styles.productName}>Add Listing</div>
        </div>
      </div>
    </div>
  )
}

function LeadsPanel() {
  return (
    <div>
      <div className={styles.pageHdr}>
        <h1>Leads &amp; Customers</h1>
        <p>Riders who reached out to your business.</p>
      </div>
      <div className={styles.leadsTable}>
        <div className={styles.tableHeader}>
          <span>Rider</span><span>Bike</span><span>Request</span><span>Date</span><span>Status</span>
        </div>
        {[
          { name: 'Ahmed K.', bike: 'Ducati V4', req: 'Oil change', date: 'Today', status: 'New' },
          { name: 'Marcus R.', bike: 'Harley Fat Boy', req: 'Exhaust install', date: 'Yesterday', status: 'Contacted' },
          { name: 'Priya K.', bike: 'Kawasaki Z900', req: 'Tires', date: '3d ago', status: 'Quoted' },
          { name: 'James T.', bike: 'BMW GS1250', req: 'Service + tires', date: '5d ago', status: 'Closed' },
          { name: 'Layla M.', bike: 'Triumph Bonneville', req: 'Custom wrap', date: '1w ago', status: 'Contacted' },
        ].map(l => (
          <div key={l.name} className={styles.tableRow}>
            <span className={styles.leadNameCell}>{l.name}</span>
            <span className={styles.leadBikeCell}>{l.bike}</span>
            <span>{l.req}</span>
            <span className={styles.leadDateCell}>{l.date}</span>
            <span className={`${styles.leadStatus} ${
              l.status === 'New' ? styles.statusNew :
              l.status === 'Contacted' ? styles.statusContacted :
              l.status === 'Quoted' ? styles.statusQuoted : styles.statusClosed
            }`}>{l.status}</span>
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
      <p>This feature is coming soon.</p>
    </div>
  )
}
