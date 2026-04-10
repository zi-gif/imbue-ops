import { useState, useMemo } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'
import { vendors, CATEGORIES, getHealthTier, daysUntil } from '../data/vendors'

function formatMoney(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  if (n === 0) return 'Free'
  return `$${n}`
}

function formatMoneyShort(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
  if (n === 0) return 'Free'
  return `$${n}`
}

function getUtilizationColor(pct) {
  if (pct === null || pct === undefined) return 'var(--gray-400)'
  if (pct >= 80) return 'var(--green)'
  if (pct >= 60) return 'var(--blue)'
  if (pct >= 40) return 'var(--amber)'
  return 'var(--red)'
}

function VendorTile({ vendor, onClick }) {
  const tier = getHealthTier(vendor.health)
  const tierClass = vendor.health >= 80 ? 'optimized' : vendor.health >= 60 ? 'healthy' : vendor.health >= 40 ? 'attention' : 'critical'
  const days = vendor.renewalDate ? daysUntil(vendor.renewalDate) : null
  const renewalClass = days !== null ? (days <= 14 ? 'urgent' : days <= 30 ? 'soon' : 'ok') : null

  return (
    <div className="vendor-tile" onClick={() => onClick(vendor.id)}>
      <div className="vendor-tile-header">
        <div className="vendor-tile-name">{vendor.name}</div>
        <span className={`health-badge ${tierClass}`}>{vendor.health}</span>
      </div>

      <div className="vendor-tile-stats">
        <div className="vendor-tile-stat">
          <span className="vendor-tile-stat-label">Annual Spend</span>
          <span className="vendor-tile-stat-value">{formatMoney(vendor.annualSpend)}</span>
        </div>
        <div className="vendor-tile-stat">
          <span className="vendor-tile-stat-label">Monthly</span>
          <span className="vendor-tile-stat-value">{formatMoneyShort(vendor.monthlySpend)}</span>
        </div>
        {vendor.seats.total && (
          <div className="vendor-tile-stat">
            <span className="vendor-tile-stat-label">Seats</span>
            <span className="vendor-tile-stat-value">{vendor.seats.used}/{vendor.seats.total}</span>
          </div>
        )}
        {vendor.utilization !== null && (
          <div className="vendor-tile-stat">
            <span className="vendor-tile-stat-label">Utilization</span>
            <span className="vendor-tile-stat-value" style={{ color: getUtilizationColor(vendor.utilization) }}>
              {vendor.utilization}%
            </span>
          </div>
        )}
      </div>

      {vendor.utilization !== null && (
        <div className="utilization-bar">
          <div
            className="utilization-fill"
            style={{
              width: `${vendor.utilization}%`,
              background: getUtilizationColor(vendor.utilization)
            }}
          />
        </div>
      )}

      <div className="vendor-tile-footer">
        <span className="vendor-tile-owner">{vendor.owner.split(' ')[0]}</span>
        {renewalClass && (
          <span className={`renewal-countdown ${renewalClass}`}>
            {days}d to renewal
          </span>
        )}
      </div>
    </div>
  )
}

export default function VendorMap({ onOpenVendor }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [healthFilter, setHealthFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('category')

  const filtered = useMemo(() => {
    let list = [...vendors]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.tags.some(t => t.includes(q)) ||
        v.owner.toLowerCase().includes(q)
      )
    }

    if (categoryFilter !== 'ALL') {
      list = list.filter(v => v.category === categoryFilter)
    }

    if (healthFilter !== 'ALL') {
      if (healthFilter === 'CRITICAL') list = list.filter(v => v.health < 40)
      else if (healthFilter === 'ATTENTION') list = list.filter(v => v.health >= 40 && v.health < 60)
      else if (healthFilter === 'HEALTHY') list = list.filter(v => v.health >= 60 && v.health < 80)
      else if (healthFilter === 'OPTIMIZED') list = list.filter(v => v.health >= 80)
    }

    if (sortBy === 'spend') list.sort((a, b) => b.annualSpend - a.annualSpend)
    else if (sortBy === 'health') list.sort((a, b) => a.health - b.health)
    else if (sortBy === 'renewal') {
      list.sort((a, b) => {
        const da = a.renewalDate ? daysUntil(a.renewalDate) : 9999
        const db = b.renewalDate ? daysUntil(b.renewalDate) : 9999
        return da - db
      })
    }

    return list
  }, [search, categoryFilter, healthFilter, sortBy])

  // Group by category if sorting by category
  const grouped = useMemo(() => {
    if (sortBy !== 'category') return { ALL: filtered }
    const groups = {}
    for (const v of filtered) {
      if (!groups[v.category]) groups[v.category] = []
      groups[v.category].push(v)
    }
    return groups
  }, [filtered, sortBy])

  const totalShown = filtered.length
  const totalSpendShown = filtered.reduce((s, v) => s + v.annualSpend, 0)

  return (
    <div className="vendor-map view-enter">
      <div className="vendor-map-header">
        <div>
          <h2>Vendor Map</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {totalShown} vendors | {formatMoney(totalSpendShown)}/yr total spend
          </p>
        </div>
        <div className="filter-bar">
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '6px 12px 6px 30px',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                width: 200,
                background: 'var(--white)',
              }}
            />
          </div>

          <select className="sort-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="ALL">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>

          <select className="sort-select" value={healthFilter} onChange={e => setHealthFilter(e.target.value)}>
            <option value="ALL">All Health</option>
            <option value="CRITICAL">Critical (&lt;40)</option>
            <option value="ATTENTION">Attention (40-59)</option>
            <option value="HEALTHY">Healthy (60-79)</option>
            <option value="OPTIMIZED">Optimized (80+)</option>
          </select>

          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="category">Sort: Category</option>
            <option value="spend">Sort: Spend (High to Low)</option>
            <option value="health">Sort: Health (Low to High)</option>
            <option value="renewal">Sort: Renewal (Soonest)</option>
          </select>
        </div>
      </div>

      {Object.entries(grouped).map(([cat, vendorList]) => (
        <div key={cat} className="category-group">
          {cat !== 'ALL' && CATEGORIES[cat] && (
            <div className="category-group-header">
              <div className="category-dot" style={{ background: CATEGORIES[cat].color }} />
              <h3>{CATEGORIES[cat].label}</h3>
              <span>
                {vendorList.length} vendors | {formatMoney(vendorList.reduce((s, v) => s + v.annualSpend, 0))}/yr
              </span>
            </div>
          )}
          <div className="vendor-grid">
            {vendorList.map(vendor => (
              <VendorTile key={vendor.id} vendor={vendor} onClick={onOpenVendor} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
