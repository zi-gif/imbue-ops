import { Calendar, Clock, CheckCircle2, AlertTriangle, User } from 'lucide-react'
import { complianceItems, COMPLIANCE_CATEGORIES } from '../data/complianceItems'
import { daysUntil } from '../data/vendors'

function getDaysUntil(dateStr) {
  return daysUntil(dateStr)
}

export default function ComplianceCalendar() {
  const overdue = complianceItems.filter(item => {
    if (item.status === 'complete') return false
    const days = getDaysUntil(item.deadline)
    return days < 0
  })

  const inProgress = complianceItems.filter(item => item.status === 'in-progress')

  const upcoming = complianceItems.filter(item => {
    if (item.status !== 'upcoming') return false
    const days = getDaysUntil(item.deadline)
    return days >= 0
  }).sort((a, b) => getDaysUntil(a.deadline) - getDaysUntil(b.deadline))

  const complete = complianceItems.filter(item => item.status === 'complete')

  const columns = [
    { key: 'overdue', label: 'Overdue', items: overdue, className: 'overdue' },
    { key: 'in-progress', label: 'In Progress', items: inProgress, className: 'in-progress' },
    { key: 'upcoming', label: 'Upcoming', items: upcoming, className: 'upcoming' },
    { key: 'complete', label: 'Complete', items: complete, className: 'complete' },
  ]

  return (
    <div className="compliance-calendar view-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>Compliance Calendar</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {complianceItems.length} items tracked | {complete.length} complete | {upcoming.length} upcoming | {overdue.length} overdue
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="summary-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="summary-card">
          <div className="summary-card-label">Next Deadline</div>
          <div className="summary-card-value">
            {upcoming.length > 0 ? `${getDaysUntil(upcoming[0].deadline)} days` : 'None'}
          </div>
          <div className="summary-card-sub">
            {upcoming.length > 0 ? upcoming[0].title : 'All clear'}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">In Progress</div>
          <div className="summary-card-value amber">{inProgress.length}</div>
          <div className="summary-card-sub">Items being actively worked</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-label">Completion Rate</div>
          <div className="summary-card-value green">
            {Math.round((complete.length / complianceItems.length) * 100)}%
          </div>
          <div className="summary-card-sub">{complete.length} of {complianceItems.length} items complete</div>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="compliance-columns">
        {columns.map(col => (
          <div key={col.key} className="compliance-column">
            <div className={`compliance-column-header ${col.className}`}>
              {col.label} ({col.items.length})
            </div>
            {col.items.map(item => {
              const days = getDaysUntil(item.deadline)
              const catInfo = COMPLIANCE_CATEGORIES[item.category]
              return (
                <div key={item.id} className="compliance-card">
                  <span
                    className="compliance-category-badge"
                    style={{ background: `${catInfo.color}20`, color: catInfo.color }}
                  >
                    {catInfo.label}
                  </span>
                  <div className="compliance-card-title">{item.title}</div>
                  <div className="compliance-card-deadline">
                    <Calendar size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {item.deadline}
                    {item.status !== 'complete' && days !== null && (
                      <span style={{
                        marginLeft: 6, fontWeight: 600,
                        color: days < 0 ? 'var(--red)' : days <= 30 ? 'var(--amber)' : 'var(--text-muted)'
                      }}>
                        ({days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`})
                      </span>
                    )}
                  </div>
                  <div className="compliance-card-owner">
                    <User size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {item.owner}
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
                      {item.notes}
                    </div>
                  )}
                </div>
              )
            })}
            {col.items.length === 0 && (
              <div style={{ padding: 16, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                {col.key === 'overdue' ? 'No overdue items' : 'None'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
