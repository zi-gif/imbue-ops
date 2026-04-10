import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Download } from 'lucide-react'
import { vendors, CATEGORIES, getVendorStats, MONTHS } from '../data/vendors'

function formatMoney(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  if (n === 0) return 'Free'
  return `$${n}`
}

const COLORS = ['#c96442', '#d4784f', '#8b6f5e', '#059669', '#d97706', '#b45a3a', '#a0826d']

export default function SpendCenter({ onOpenVendor }) {
  const stats = getVendorStats()

  // Category pie data
  const categoryData = Object.entries(stats.byCategory)
    .map(([key, val]) => ({
      name: CATEGORIES[key]?.label || key,
      value: val.spend,
      count: val.count,
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

  // Top vendors
  const topVendors = [...vendors]
    .sort((a, b) => b.annualSpend - a.annualSpend)
    .filter(v => v.annualSpend > 0)
    .slice(0, 10)

  // Monthly trend (aggregate across all vendors)
  const monthlyTrend = MONTHS.map((month, i) => ({
    month,
    spend: vendors.reduce((sum, v) => sum + (v.spendHistory[i] || 0), 0),
  }))

  // Budget vs actual by category
  const budgetData = [
    { category: 'Infrastructure', budget: 290000, actual: 274200 },
    { category: 'Productivity', budget: 55000, actual: 52350 },
    { category: 'Engineering', budget: 130000, actual: 136200 },
    { category: 'Finance & Legal', budget: 280000, actual: 276600 },
    { category: 'Security', budget: 30000, actual: 29400 },
    { category: 'HR', budget: 155000, actual: 150000 },
    { category: 'Design', budget: 15000, actual: 13200 },
  ]

  return (
    <div className="spend-center view-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>Spend Command Center</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Q2 2026 | {stats.vendorCount} vendors | {stats.headcount} employees
          </p>
        </div>
        <div className="export-bar">
          <button className="btn">
            <Download size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Export PDF
          </button>
          <button className="btn">
            <Download size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Top-level metrics */}
      <div className="summary-strip">
        <div className="summary-card">
          <div className="summary-card-label">Total Annual Spend</div>
          <div className="summary-card-value">{formatMoney(stats.totalAnnual)}</div>
          <div className="summary-card-sub">Across {stats.vendorCount} vendors</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">Monthly Run Rate</div>
          <div className="summary-card-value">{formatMoney(stats.totalMonthly)}</div>
          <div className="summary-card-sub">Current month</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">Cost per Employee</div>
          <div className="summary-card-value">{formatMoney(stats.costPerEmployee)}</div>
          <div className="summary-card-sub">Annual, {stats.headcount} employees</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">Infrastructure %</div>
          <div className="summary-card-value">
            {((stats.byCategory.INFRASTRUCTURE?.spend || 0) / stats.totalAnnual * 100).toFixed(0)}%
          </div>
          <div className="summary-card-sub">of total vendor spend</div>
        </div>
      </div>

      <div className="spend-grid">
        {/* Monthly Trend */}
        <div className="spend-panel">
          <h3>Monthly Spend Trend</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={v => `$${(v/1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Total Spend']}
                  contentStyle={{ fontSize: 13, borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="spend" stroke="#c96442" strokeWidth={2} dot={{ fill: '#c96442', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="spend-panel">
          <h3>Spend by Category</h3>
          <div style={{ height: 240, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatMoney(value), '']}
                  contentStyle={{ fontSize: 13, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, fontSize: 13 }}>
              {categoryData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span style={{ fontWeight: 600 }}>{formatMoney(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="spend-panel">
          <h3>Q2 Budget vs. Actual</h3>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={v => `$${(v/1000).toFixed(0)}K`}
                />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ fontSize: 13, borderRadius: 8 }}
                />
                <Bar dataKey="budget" fill="#e9ecef" radius={[0, 4, 4, 0]} name="Budget" />
                <Bar dataKey="actual" fill="#c96442" radius={[0, 4, 4, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="spend-panel">
          <h3>Top 10 Vendors by Spend</h3>
          {topVendors.map((v, i) => (
            <div
              key={v.id}
              className="top-vendor-row"
              style={{ cursor: 'pointer' }}
              onClick={() => onOpenVendor(v.id)}
            >
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 24 }}>{i + 1}.</span>
              <span className="top-vendor-name" style={{ flex: 1 }}>{v.name}</span>
              <span className="top-vendor-spend">{formatMoney(v.annualSpend)}</span>
              <span className="top-vendor-pct">
                {(v.annualSpend / stats.totalAnnual * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
