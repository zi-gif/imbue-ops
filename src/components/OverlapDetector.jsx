import { AlertTriangle, ArrowRight, DollarSign } from 'lucide-react'

const overlaps = [
  {
    id: 'video',
    function: 'Video Conferencing',
    tools: [
      { name: 'Zoom', spend: '$6,000/yr', utilization: '40%', seats: '8/20 active', vendorId: 'zoom' },
      { name: 'Google Meet', spend: 'Included in Workspace', utilization: '~95%', seats: 'All employees', vendorId: 'google-workspace' },
    ],
    recommendation: 'Consolidate to Google Meet. Zoom usage is low (40% utilization, 8 of 20 seats active) and Google Meet is already universally adopted via Workspace. Survey the 8 active Zoom users to confirm no critical dependencies (webinars, advanced recording), then cancel Zoom before the May 1 auto-renewal.',
    potentialSavings: 6000,
    confidence: 'High',
  },
  {
    id: 'async-video',
    function: 'Async Video Messaging',
    tools: [
      { name: 'Loom', spend: '$4,800/yr', utilization: '33%', seats: '4/12 active', vendorId: 'loom' },
      { name: 'Slack Clips', spend: 'Included in Slack', utilization: 'Available to all', seats: 'All employees', vendorId: 'slack' },
    ],
    recommendation: 'Evaluate whether the 4 active Loom users have needs that Slack Clips cannot serve. Slack Clips supports video messages up to 5 minutes with transcription. If Loom-specific features (longer videos, custom branding, analytics) are not needed, cancel Loom. If some need persists, downsize from 12 to 4 seats ($1,600/yr).',
    potentialSavings: 4800,
    confidence: 'Medium',
  },
  {
    id: 'project-mgmt',
    function: 'Project Management',
    tools: [
      { name: 'Linear', spend: '$8,400/yr', utilization: '90%', seats: '18/20 active', vendorId: 'linear' },
      { name: 'Notion (boards)', spend: 'Part of $15,000/yr', utilization: '91%', seats: '32/35 active', vendorId: 'notion' },
    ],
    recommendation: 'Keep both. This is complementary usage, not true overlap. Linear is used by engineering for issue tracking and sprint management; Notion boards are used by non-engineering teams for project coordination and docs. Consolidating would force one team onto a tool not designed for their workflow. Monitor to ensure usage patterns remain distinct.',
    potentialSavings: 0,
    confidence: 'High',
  },
  {
    id: 'monitoring',
    function: 'Infrastructure Monitoring',
    tools: [
      { name: 'DataDog', spend: '$60,000/yr', utilization: '55%', seats: 'Full stack', vendorId: 'datadog' },
      { name: 'AWS CloudWatch', spend: 'Included in AWS', utilization: 'Basic metrics', seats: 'Auto-configured', vendorId: 'aws' },
    ],
    recommendation: 'Right-size DataDog. At 55% utilization and $60K/yr, the team may be paying for modules they do not fully use. Evaluate which DataDog modules (APM, Logs, Infrastructure, Synthetics) are actively used. CloudWatch can handle basic infrastructure metrics; DataDog adds value for APM tracing and cross-service observability. Consider dropping underused modules for $15-20K/yr savings.',
    potentialSavings: 18000,
    confidence: 'Medium',
  },
  {
    id: 'website',
    function: 'Website Hosting & CMS',
    tools: [
      { name: 'Framer', spend: '$3,600/yr', utilization: '67%', seats: '2/3 editors', vendorId: 'framer' },
      { name: 'Vercel', spend: '$14,400/yr', utilization: '80%', seats: '8/10 seats', vendorId: 'vercel' },
    ],
    recommendation: 'Evaluate migration of marketing site from Framer to Vercel/Next.js. This is already under discussion. Framer provides a no-code CMS experience that the design team values, but engineering prefers the flexibility of Next.js. If the migration happens, save $3,600/yr on Framer. Decision should factor in design team productivity, not just cost.',
    potentialSavings: 3600,
    confidence: 'Low',
  },
]

function getConfidenceColor(confidence) {
  if (confidence === 'High') return 'var(--green)'
  if (confidence === 'Medium') return 'var(--amber)'
  return 'var(--text-muted)'
}

export default function OverlapDetector({ onOpenVendor }) {
  const totalPotentialSavings = overlaps.reduce((sum, o) => sum + o.potentialSavings, 0)
  const actionableOverlaps = overlaps.filter(o => o.potentialSavings > 0)

  return (
    <div className="overlap-detector view-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>Tooling Overlap Detector</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {overlaps.length} functional overlaps identified | {actionableOverlaps.length} actionable
          </p>
        </div>
        <div style={{
          background: 'var(--green-light)', color: '#047857',
          padding: '8px 16px', borderRadius: 'var(--radius-md)',
          fontWeight: 600, fontSize: 15
        }}>
          <DollarSign size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {`$${(totalPotentialSavings / 1000).toFixed(1)}K/yr`} potential savings
        </div>
      </div>

      {overlaps.map(overlap => (
        <div key={overlap.id} className="overlap-card" style={{
          borderLeftColor: overlap.potentialSavings > 0 ? 'var(--amber)' : 'var(--green)',
        }}>
          <div className="overlap-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="overlap-function">{overlap.function}</span>
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: getConfidenceColor(overlap.confidence),
              }}>
                {overlap.confidence} confidence
              </span>
            </div>
            {overlap.potentialSavings > 0 ? (
              <span className="overlap-savings">
                Save ${(overlap.potentialSavings / 1000).toFixed(1)}K/yr
              </span>
            ) : (
              <span style={{
                fontSize: 13, fontWeight: 600, color: 'var(--green)',
                background: 'var(--green-light)', padding: '4px 12px', borderRadius: 'var(--radius-sm)'
              }}>
                Keep Both
              </span>
            )}
          </div>

          <div className="overlap-tools">
            {overlap.tools.map((tool, i) => (
              <div
                key={i}
                className="overlap-tool"
                style={{ cursor: tool.vendorId ? 'pointer' : 'default' }}
                onClick={() => tool.vendorId && onOpenVendor(tool.vendorId)}
              >
                <div className="overlap-tool-name">{tool.name}</div>
                <div className="overlap-tool-detail">Spend: {tool.spend}</div>
                <div className="overlap-tool-detail">Utilization: {tool.utilization}</div>
                <div className="overlap-tool-detail">Seats: {tool.seats}</div>
              </div>
            ))}
          </div>

          <div className="overlap-recommendation">
            <strong style={{ color: 'var(--blue)' }}>Recommendation: </strong>
            {overlap.recommendation}
          </div>
        </div>
      ))}
    </div>
  )
}
