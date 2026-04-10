import { useState } from 'react'
import { X, AlertTriangle, CheckCircle, Clock, DollarSign, Users, FileText, Brain, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { vendors, CATEGORIES, getHealthTier, daysUntil, MONTHS } from '../data/vendors'

function formatMoney(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
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

const TABS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'contract', label: 'Contract', icon: FileText },
  { id: 'spend', label: 'Spend', icon: DollarSign },
  { id: 'utilization', label: 'Utilization', icon: Users },
  { id: 'intelligence', label: 'Intelligence', icon: Brain },
]

function OverviewTab({ vendor }) {
  const tier = getHealthTier(vendor.health)
  const chartData = vendor.spendHistory.map((val, i) => ({
    month: MONTHS[i],
    spend: val,
  }))

  return (
    <div>
      <div className="detail-section">
        <h4>Summary</h4>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {vendor.story}
        </p>
      </div>

      <div className="detail-section">
        <h4>6-Month Spend Trend</h4>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`}
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, 'Spend']}
                contentStyle={{ fontSize: 13, borderRadius: 8 }}
              />
              <Bar dataKey="spend" fill="#c96442" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="detail-section">
        <h4>Key Risks</h4>
        {vendor.risks.map((risk, i) => (
          <div key={i} className="risk-item">
            <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {risk}
          </div>
        ))}
      </div>

      <div className="detail-section">
        <h4>Tags</h4>
        <div>
          {vendor.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ContractTab({ vendor }) {
  const days = vendor.renewalDate ? daysUntil(vendor.renewalDate) : null

  return (
    <div>
      <div className="detail-section">
        <h4>Contract Details</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Renewal Date</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {vendor.renewalDate || 'Ongoing (no fixed term)'}
              {days !== null && (
                <span style={{
                  marginLeft: 8, fontSize: 12, fontWeight: 600,
                  color: days <= 30 ? 'var(--red)' : 'var(--text-muted)'
                }}>
                  ({days} days)
                </span>
              )}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Auto-Renew</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: vendor.autoRenew ? 'var(--amber)' : 'var(--green)' }}>
              {vendor.autoRenew ? 'YES - Auto-renews' : 'No - Manual renewal'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Termination Notice</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{vendor.terminationNotice}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Vendor Contact</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{vendor.vendorContact}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h4>Contract Highlights</h4>
        {vendor.contractHighlights.map((item, i) => (
          <div key={i} className="highlight-item">
            <CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {item}
          </div>
        ))}
      </div>

      {vendor.autoRenew && days !== null && days <= 60 && (
        <div className="detail-section">
          <div className="risk-item" style={{ background: 'var(--amber-light)', borderLeftColor: 'var(--amber)' }}>
            <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            <strong>Auto-renewal warning:</strong> This contract auto-renews in {days} days.
            Review terms and decide whether to renew, renegotiate, or cancel before the deadline.
          </div>
        </div>
      )}
    </div>
  )
}

function SpendTab({ vendor }) {
  const chartData = vendor.spendHistory.map((val, i) => ({
    month: MONTHS[i],
    spend: val,
  }))

  const trend = vendor.spendHistory.length >= 2
    ? ((vendor.spendHistory[vendor.spendHistory.length - 1] - vendor.spendHistory[0]) / vendor.spendHistory[0] * 100).toFixed(1)
    : 0

  return (
    <div>
      <div className="detail-section">
        <h4>Spend Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Annual Spend</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{formatMoney(vendor.annualSpend)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly Average</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{formatMoney(vendor.monthlySpend)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>6-Month Trend</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: trend > 5 ? 'var(--red)' : trend < -5 ? 'var(--green)' : 'var(--text)' }}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h4>Monthly Spend History</h4>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`}
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, 'Spend']}
                contentStyle={{ fontSize: 13, borderRadius: 8 }}
              />
              <Bar dataKey="spend" fill="#c96442" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function UtilizationTab({ vendor }) {
  const hasSeats = vendor.seats.total !== null
  const hasUtil = vendor.utilization !== null

  return (
    <div>
      {hasSeats && (
        <div className="detail-section">
          <h4>Seat Utilization</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{vendor.seats.used}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>of {vendor.seats.total} seats used</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                height: 24, background: 'var(--gray-200)', borderRadius: 12, overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%', borderRadius: 12,
                  width: `${(vendor.seats.used / vendor.seats.total) * 100}%`,
                  background: getUtilizationColor((vendor.seats.used / vendor.seats.total) * 100),
                  transition: 'width 0.5s ease-out',
                }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                {Math.round((vendor.seats.used / vendor.seats.total) * 100)}% seat utilization
                {vendor.seats.total - vendor.seats.used > 0 && (
                  <span> | {vendor.seats.total - vendor.seats.used} unused seats</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {hasUtil && (
        <div className="detail-section">
          <h4>Feature / Capacity Utilization</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: getUtilizationColor(vendor.utilization) }}>
                {vendor.utilization}%
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>utilization</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                height: 24, background: 'var(--gray-200)', borderRadius: 12, overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%', borderRadius: 12,
                  width: `${vendor.utilization}%`,
                  background: getUtilizationColor(vendor.utilization),
                  transition: 'width 0.5s ease-out',
                }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasSeats && !hasUtil && (
        <div className="empty-state">
          <p>No utilization data available for this vendor.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>
            This is typical for service-based vendors (legal, consulting) where usage is measured in hours, not seats.
          </p>
        </div>
      )}
    </div>
  )
}

function IntelligenceTab({ vendor, apiKey }) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analysisType, setAnalysisType] = useState('summary')

  const generateAnalysis = async (type) => {
    setAnalysisType(type)
    if (!apiKey) {
      setAnalysis(getFallbackAnalysis(vendor, type))
      return
    }

    setLoading(true)
    try {
      const prompts = {
        summary: `Analyze this vendor relationship for a ~35-person AI startup. Vendor: ${vendor.name}. Category: ${CATEGORIES[vendor.category]?.label}. Annual spend: $${vendor.annualSpend}. Health score: ${vendor.health}/100. Utilization: ${vendor.utilization || 'N/A'}%. Story: ${vendor.story}. Risks: ${vendor.risks.join('; ')}. Give a concise 3-4 sentence assessment of this vendor relationship and top recommendation.`,
        renewal: `Prepare a renewal negotiation brief for ${vendor.name}. Current annual spend: $${vendor.annualSpend}. Contract highlights: ${vendor.contractHighlights.join('; ')}. Known risks: ${vendor.risks.join('; ')}. Auto-renew: ${vendor.autoRenew}. The company is a ~35-person AI startup with $232M raised. Generate 3-4 specific negotiation talking points and a recommended ask.`,
        alternatives: `Suggest 2-3 alternatives to ${vendor.name} for a ~35-person AI startup. Current use: ${vendor.story}. Current spend: $${vendor.annualSpend}/yr. What should they evaluate, and what are the tradeoffs? Keep it concise and practical.`,
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompts[type] }],
        }),
      })

      const data = await response.json()
      if (data.content && data.content[0]) {
        setAnalysis(data.content[0].text)
      } else {
        setAnalysis('Unable to generate analysis. Please check your API key.')
      }
    } catch (err) {
      setAnalysis(getFallbackAnalysis(vendor, type))
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="detail-section">
        <h4>Claude-Powered Intelligence</h4>
        {!apiKey && (
          <div style={{
            fontSize: 13, color: 'var(--amber)', background: 'var(--amber-light)',
            padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: 16
          }}>
            No API key set. Showing pre-written analysis. Connect your Anthropic API key in Settings for live AI-powered insights.
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button className={`btn ${analysisType === 'summary' ? 'btn-primary' : ''}`} onClick={() => generateAnalysis('summary')}>
            Vendor Assessment
          </button>
          <button className={`btn ${analysisType === 'renewal' ? 'btn-primary' : ''}`} onClick={() => generateAnalysis('renewal')}>
            Renewal Prep
          </button>
          <button className={`btn ${analysisType === 'alternatives' ? 'btn-primary' : ''}`} onClick={() => generateAnalysis('alternatives')}>
            Alternatives
          </button>
        </div>

        {loading && (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div className="claude-indicator" style={{ justifyContent: 'center' }}>
              <span className="claude-dot" />
              Analyzing with Claude...
            </div>
          </div>
        )}

        {analysis && !loading && (
          <div style={{
            fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
            background: 'var(--blue-faint)', padding: 16, borderRadius: 'var(--radius-sm)',
            whiteSpace: 'pre-wrap',
          }}>
            <div className="claude-indicator" style={{ marginBottom: 8 }}>
              <span className="claude-dot" />
              {apiKey ? 'Claude Analysis' : 'Pre-written Analysis (connect API for live)'}
            </div>
            {analysis}
          </div>
        )}

        {!analysis && !loading && (
          <div className="empty-state">
            <Brain size={32} color="var(--text-muted)" />
            <p style={{ marginTop: 8 }}>Select an analysis type above to get Claude-powered intelligence on this vendor.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function getFallbackAnalysis(vendor, type) {
  const fallbacks = {
    summary: {
      dell: `Dell Technologies is Imbue's most strategic infrastructure vendor, providing the GPU compute backbone for all model training. The relationship is healthy (85/100) with dedicated support, but the concentration risk is notable; a single vendor dependency for 10,000 H100 GPUs means any service disruption has outsized impact. Recommendation: maintain the relationship closely, negotiate extended warranty terms at the next review, and document a contingency plan for GPU supply diversification as the market evolves.`,
      aws: `AWS cloud spend is growing at 12% QoQ, outpacing headcount growth and budget assumptions. The most pressing issue is reserved instance utilization at 68%, representing ~$22K/mo in wasted spend. The EDP commit renews June 30, creating a natural negotiation window. Recommendation: conduct an immediate RI right-sizing audit, renegotiate the EDP commit to reflect actual usage patterns, and explore savings plans as an alternative to reserved instances.`,
      zoom: `Zoom is the strongest consolidation candidate in the vendor portfolio. With only 8 of 20 seats active (40% utilization) and Google Meet bundled at no additional cost via Workspace, the $6,000/yr spend delivers minimal incremental value. Recommendation: survey the 8 active users to identify any Zoom-specific dependencies (webinars, advanced recording), and if none are critical, cancel before the May 1 auto-renewal.`,
      gusto: `Gusto is a legacy vendor requiring urgent action. The migration to Rippling is 90% complete, but the auto-renewal on April 30 would restart billing at $2,800/mo for a service that is effectively decommissioned. This is the single highest-priority item in the vendor portfolio right now. Recommendation: fast-track the final 3 employee transfers to Rippling, submit written cancellation to Gusto no later than April 25, and confirm cancellation receipt.`,
      pilot: `Pilot's bookkeeping service has a concerning quality trend: monthly closes running 5 business days late for 3 consecutive months. For a company preparing board materials and investor updates on a regular cadence, this delay cascades into downstream reporting. The annual spend of $36K is reasonable for the service, but reliability is non-negotiable. Recommendation: document the pattern, set a formal SLA expectation in writing, and begin evaluating Bench and Kruze Consulting as backup options.`,
      datadog: `DataDog is the second most expensive SaaS tool ($60K/yr) after cloud infrastructure, with utilization estimated at 55%. The engineering team questions whether all modules (APM, Logs, Infrastructure) are necessary at the Enterprise tier. Recommendation: conduct a module-by-module usage audit before the August renewal, evaluate whether a lighter observability stack (Grafana + Prometheus for some workloads) could reduce cost, and negotiate volume discounts if retaining.`,
    },
    renewal: {
      default: `Renewal Negotiation Brief for ${vendor.name}:\n\n1. Leverage your position: As a well-funded AI startup ($232M raised), you're a growing account. Use planned headcount growth as a negotiation lever for volume discounts.\n\n2. Benchmark pricing: Research competitor pricing and mention specific alternatives during the negotiation. Even if you prefer to stay, having alternatives strengthens your position.\n\n3. Push for annual commitment discount: Offer to commit to an annual plan in exchange for 15-20% discount off list price.\n\n4. Address auto-renewal: Request removal of auto-renewal clauses or at minimum, 60-day advance notification before any auto-renewal takes effect.`,
    },
    alternatives: {
      default: `Alternatives to evaluate for ${vendor.name}:\n\n1. Research what comparable companies (35-50 person AI startups) use for this function. YC companies are a good benchmark.\n\n2. Consider open-source alternatives that your engineering team could self-host, weighing the maintenance cost against licensing fees.\n\n3. Evaluate whether this function could be consolidated into an existing vendor's platform (e.g., many HRIS platforms, cloud providers, and productivity suites have overlapping features with point solutions).`,
    },
  }

  if (type === 'summary') {
    return fallbacks.summary[vendor.id] || `${vendor.name} has a health score of ${vendor.health}/100 with annual spend of ${formatMoney(vendor.annualSpend)}. ${vendor.story} Key risks to monitor: ${vendor.risks.join('; ')}.`
  }
  return fallbacks[type]?.default || `Analysis for ${vendor.name} would appear here with a connected Claude API key.`
}

export default function VendorDetail({ vendorId, onClose, apiKey }) {
  const vendor = vendors.find(v => v.id === vendorId)
  const [activeTab, setActiveTab] = useState('overview')

  if (!vendor) return null

  const tier = getHealthTier(vendor.health)
  const tierClass = vendor.health >= 80 ? 'optimized' : vendor.health >= 60 ? 'healthy' : vendor.health >= 40 ? 'attention' : 'critical'
  const days = vendor.renewalDate ? daysUntil(vendor.renewalDate) : null
  const category = CATEGORIES[vendor.category]

  return (
    <>
      <div className="vendor-detail-overlay" onClick={onClose} />
      <div className="vendor-detail-panel">
        <div className="detail-header">
          <div className="detail-header-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className={`health-badge ${tierClass}`}>{vendor.health}</span>
                <span style={{ fontSize: 12, color: category?.color, fontWeight: 600 }}>
                  {category?.label}
                </span>
              </div>
              <div className="detail-title">{vendor.name}</div>
              <div className="detail-subtitle">
                Owner: {vendor.owner} ({vendor.ownerRole})
              </div>
            </div>
            <button className="detail-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="detail-quick-stats">
            <div className="detail-stat">
              <div className="detail-stat-value">{formatMoney(vendor.annualSpend)}</div>
              <div className="detail-stat-label">Annual</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value">{formatMoney(vendor.monthlySpend)}</div>
              <div className="detail-stat-label">Monthly</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value" style={{ color: getUtilizationColor(vendor.utilization) }}>
                {vendor.utilization !== null ? `${vendor.utilization}%` : 'N/A'}
              </div>
              <div className="detail-stat-label">Utilization</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value" style={{ color: days !== null && days <= 30 ? 'var(--red)' : 'var(--text)' }}>
                {days !== null ? `${days}d` : 'N/A'}
              </div>
              <div className="detail-stat-label">To Renewal</div>
            </div>
          </div>
        </div>

        <div className="detail-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`detail-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="detail-content">
          {activeTab === 'overview' && <OverviewTab vendor={vendor} />}
          {activeTab === 'contract' && <ContractTab vendor={vendor} />}
          {activeTab === 'spend' && <SpendTab vendor={vendor} />}
          {activeTab === 'utilization' && <UtilizationTab vendor={vendor} />}
          {activeTab === 'intelligence' && <IntelligenceTab vendor={vendor} apiKey={apiKey} />}
        </div>
      </div>
    </>
  )
}
