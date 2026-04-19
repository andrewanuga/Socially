import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar  from '../components/dashboard/Topbar'
import {
  OverviewPanel, ComposePanel, BufferPanel, AnalyticsPanel,
  AICreatorPanel, MediaPanel, ConnectionsPanel, SettingsPanel,
} from '../components/dashboard/Panels'
import { Toaster } from '../components/ui'
import { useToast } from '../hooks'
import type { DashPanel } from '../types'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [panel, setPanel] = useState<DashPanel>('overview')
  const { toasts, showToast, removeToast } = useToast()

  const renderPanel = () => {
    switch (panel) {
      case 'overview':    return <OverviewPanel    onNav={p => setPanel(p)} />
      case 'compose':     return <ComposePanel     showToast={showToast} />
      case 'buffer':      return <BufferPanel      showToast={showToast} />
      case 'analytics':   return <AnalyticsPanel />
      case 'ai-creator':  return <AICreatorPanel   showToast={showToast} />
      case 'media':       return <MediaPanel       showToast={showToast} />
      case 'connections': return <ConnectionsPanel showToast={showToast} />
      case 'settings':    return <SettingsPanel    showToast={showToast} />
      default:            return null
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <Sidebar active={panel} onNav={setPanel} onHome={() => navigate('/')} />

      {/* offset by collapsed sidebar width */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 72 }}>
        <Topbar panel={panel} onHome={() => navigate('/')} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <React.Fragment key={panel}>
              {renderPanel()}
            </React.Fragment>
          </AnimatePresence>
        </main>
      </div>

      <Toaster toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default DashboardPage
