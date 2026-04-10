import { useState } from 'react'
import { AlertTriangle, Clock, ChevronDown, ChevronUp, Hash, ArrowRight, Bell, CheckCircle2, TrendingUp, ExternalLink } from 'lucide-react'
import { vendors, getVendorStats, daysUntil } from '../data/vendors'
import { pulseItems, weeklyDigest } from '../data/pulseItems'

function formatMoney(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

function SummaryStrip() {
  const stats = getVendorStats()
  const redItems = pulseItems.filter(p => p.urgency === 'red' && p.status === 'open')
  const amberItems = pulseItems.filter(p => p.urgency === 'amber' && p.status === 'open')
  const thisWeekRenewals = stats.upcomingRenewals.filter(r => r.daysUntil <= 7)
  const next30Renewals = stats.upcomingRenewals.filter(r => r.daysUntil <= 30)

  // Budget health - simulate Q2 budget
  const q2Budget = 950000
  const q2Actual = stats.totalMonthly * 3 * 1.06
  const budgetPct = ((q2Actual / q2Budget) * 100).toFixed(0)
  const budgetStatus = budgetPct > 110 ? 'red' : budgetPct > 100 ? 'amber' : 'green'

  return (
    <div className="summary-strip">
      <div className="summary-card">
        <div className="summary-card-label">Active Alerts</div>
        <div className={`summary-card-value ${redItems.length > 0 ? 'red' : 'green'}`}>
          {redItems.length + amberItems.length}
        </div>
        <div className="summary-card-sub">
          {redItems.length} critical, {amberItems.length} warning
        </div>
      </div>
      <div className="summary-card">
        <div className="summary-card-label">Renewals (30 days)</div>
        <div className={`summary-card-value ${next30Renewals.length > 2 ? 'amber' : ''}`}>
          {next30Renewals.length}
        </div>
        <div className="summary-card-sub">
          {formatMoney(next30Renewals.reduce((s, r) => s + r.annualSpend, 0))}/yr in renewals
        </div>
      </div>
      <div className="summary-card">
        <div className="summary-card-label">Q2 Budget Health</div>
        <div className={`summary-card-value ${budgetStatus}`}>
          {budgetPct}%
        </div>
        <div className="summary-card-sub">
          {budgetPct > 100 ? 'Over budget' : 'On track'} ({formatMoney(q2Actual)} / {formatMoney(q2Budget)})
        </div>
      </div>
      <div className="summary-card">
        <div className="summary-card-label">Compliance Status</div>
        <div className="summary-card-value green">On Track</div>
        <div className="summary-card-sub">
          Next deadline: Delaware Franchise Tax (53 days)
        </div>
      </div>
    </div>
  )
}

function PulseCard({ item, onOpenVendor }) {
  const [expanded, setExpanded] = useState(false)
  const vendor = item.vendorId ? vendors.find(v => v.id === item.vendorId) : null

  return (
    <div
      className={`pulse-card urgency-${item.urgency}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="pulse-card-header">
        <div>
          <div className="pulse-card-meta">
            <span className={`pulse-badge ${item.type}`}>{item.type.replace('-', ' ')}</span>
            <span className="pulse-card-vendor">{item.vendorName}</span>
            {item.daysUntil && (
              <span style={{ fontSize: 12, color: item.urgency === 'red' ? 'var(--red)' : 'var(--text-muted)' }}>
                <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                {item.daysUntil} days
              </span>
            )}
          </div>
          <div className="pulse-card-title">{item.title}</div>
        </div>
        {expanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </div>

      <div className="pulse-card-description">{item.description}</div>
      <div className="pulse-card-impact">
        <TrendingUp size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
        {item.impact}
      </div>

      {expanded && (
        <div className="pulse-card-expand">
          <div className="pulse-card-recommendation">
            <strong>Recommended Action: </strong>
            {item.recommendation}
          </div>

          {vendor && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <Sparkline data={vendor.spendHistory} />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                6-month spend trend | Health: {vendor.health}/100 | Owner: {item.owner}
              </div>
            </div>
          )}

          <div className="pulse-card-actions">
            {item.vendorId && (
              <button
                className="pulse-action-btn primary"
                onClick={(e) => { e.stopPropagation(); onOpenVendor(item.vendorId) }}
              >
                <ExternalLink size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Open Vendor
              </button>
            )}
            <button className="pulse-action-btn">Set Reminder</button>
            <button className="pulse-action-btn">Mark Resolved</button>
            <button className="pulse-action-btn">Snooze 7 Days</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Sparkline({ data }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data)
  return (
    <div className="sparkline">
      {data.map((val, i) => (
        <div
          key={i}
          className="sparkline-bar"
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

function WeeklyDigest() {
  return (
    <div className="weekly-digest">
      {/* Savings */}
      <div className="digest-section">
        <h3>Savings Tracker</h3>
        <div className="savings-number">{formatMoney(weeklyDigest.savingsThisQuarter)}</div>
        <div className="savings-label">Captured this quarter</div>
        <div className="savings-potential">
          {formatMoney(weeklyDigest.potentialSavings)} potential identified
        </div>
      </div>

      {/* Resolved This Week */}
      <div className="digest-section">
        <h3>
          <CheckCircle2 size={14} style={{ color: 'var(--green)', verticalAlign: 'middle' }} />
          {' '}Resolved This Week
        </h3>
        {weeklyDigest.resolvedThisWeek.map((item, i) => (
          <div key={i} className="digest-item">
            {item.title}
            <div className="resolved-by">{item.resolvedBy} - {item.date}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Next Week */}
      <div className="digest-section">
        <h3>
          <ArrowRight size={14} style={{ color: 'var(--blue)', verticalAlign: 'middle' }} />
          {' '}Coming Next Week
        </h3>
        {weeklyDigest.upcomingNextWeek.map((item, i) => (
          <div key={i} className="digest-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: item.urgency === 'red' ? 'var(--red)' : item.urgency === 'amber' ? 'var(--amber)' : 'var(--blue)'
              }}
            />
            {item.title}
          </div>
        ))}
      </div>
    </div>
  )
}

function SlackPreview() {
  return (
    <div className="slack-preview">
      <h3>
        <Hash size={14} />
        Slack Alert Preview — #ops-alerts
      </h3>
      <div className="slack-msg urgent">
        <div className="slack-msg-header">
          <span className="slack-bot-name">ImbueOps Bot</span>
          <span className="slack-bot-badge">APP</span>
          <span className="slack-timestamp">9:00 AM</span>
        </div>
        <div className="slack-msg-body">
          <strong>:rotating_light: URGENT: Gusto auto-renews in 21 days</strong><br />
          Legacy payroll system (migration 90% complete) will auto-renew at $2,800/mo on April 30.
          Complete 3 remaining employee transfers and submit cancellation by April 25.
          <br /><em>Impact: $33,600/yr</em>
        </div>
      </div>
      <div className="slack-msg warning">
        <div className="slack-msg-header">
          <span className="slack-bot-name">ImbueOps Bot</span>
          <span className="slack-bot-badge">APP</span>
          <span className="slack-timestamp">9:00 AM</span>
        </div>
        <div className="slack-msg-body">
          <strong>:warning: Zoom renewal in 22 days — consolidation opportunity</strong><br />
          Zoom Business ($6K/yr) has 40% utilization. Google Meet covers most use cases.
          Decision needed: cancel, downsize, or renew at current level.
        </div>
      </div>
      <div className="slack-msg">
        <div className="slack-msg-header">
          <span className="slack-bot-name">ImbueOps Bot</span>
          <span className="slack-bot-badge">APP</span>
          <span className="slack-timestamp">Monday 9:00 AM</span>
        </div>
        <div className="slack-msg-body">
          <strong>Weekly Ops Digest</strong><br />
          10 active items | 2 resolved this week | 3 upcoming next week<br />
          Potential savings identified: $52.4K/yr | Captured this quarter: $0
        </div>
      </div>
    </div>
  )
}

export default function OpsPulse({ onOpenVendor }) {
  return (
    <div className="view-enter">
      <SummaryStrip />
      <div className="pulse-layout">
        <div>
          <div className="pulse-queue">
            {pulseItems.map(item => (
              <PulseCard key={item.id} item={item} onOpenVendor={onOpenVendor} />
            ))}
          </div>
          <SlackPreview />
        </div>
        <WeeklyDigest />
      </div>
    </div>
  )
}
