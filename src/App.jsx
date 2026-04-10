import { useState } from 'react'
import { Map, DollarSign, Calendar } from 'lucide-react'
import VendorMap from './components/VendorMap'
import VendorDetail from './components/VendorDetail'
import SpendCenter from './components/SpendCenter'
import ComplianceCalendar from './components/ComplianceCalendar'

const VIEWS = [
  { id: 'map', label: 'Vendor Map', icon: Map },
  { id: 'spend', label: 'Spend', icon: DollarSign },
  { id: 'compliance', label: 'Compliance', icon: Calendar },
]

export default function App() {
  const [view, setView] = useState('map')
  const [selectedVendor, setSelectedVendor] = useState(null)

  const apiKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANTHROPIC_API_KEY || ''

  const openVendor = (vendorId) => setSelectedVendor(vendorId)
  const closeVendor = () => setSelectedVendor(null)

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="header-logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#c96442" strokeWidth="2.5" fill="none"/>
              <circle cx="16" cy="16" r="5" fill="#c96442"/>
            </svg>
            <h1>ImbueOps</h1>
            <span>by Zi</span>
          </div>
          <nav className="header-nav">
            {VIEWS.map(v => (
              <button
                key={v.id}
                className={view === v.id ? 'active' : ''}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="view-enter" key={view}>
          {view === 'map' && <VendorMap onOpenVendor={openVendor} />}
          {view === 'spend' && <SpendCenter onOpenVendor={openVendor} />}
          {view === 'compliance' && <ComplianceCalendar />}
        </div>
      </main>

      {selectedVendor && (
        <VendorDetail vendorId={selectedVendor} onClose={closeVendor} apiKey={apiKey} />
      )}
    </div>
  )
}
