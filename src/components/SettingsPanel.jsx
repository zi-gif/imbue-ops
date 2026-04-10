import { useState } from 'react'
import { X, Key } from 'lucide-react'

export default function SettingsPanel({ apiKey, onSave, onClose }) {
  const [key, setKey] = useState(apiKey)

  const handleSave = () => {
    onSave(key)
    onClose()
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2>Settings</h2>
          <button className="detail-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-field">
          <label>
            <Key size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Anthropic API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..."
          />
          <div className="hint">
            Enter your Anthropic API key to enable Claude-powered vendor intelligence.
            Without a key, pre-written analysis templates are shown.
          </div>
        </div>

        <div style={{
          background: 'var(--blue-faint)',
          padding: 16,
          borderRadius: 'var(--radius-sm)',
          marginBottom: 24,
          fontSize: 13,
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          <strong style={{ color: 'var(--blue)' }}>Claude Integration</strong><br />
          When connected, Claude powers:<br />
          - Vendor relationship assessments<br />
          - Renewal negotiation briefs<br />
          - Alternative vendor recommendations<br />
          - Spend narrative generation for board reports
        </div>

        <div className="settings-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
