import React from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, Home } from 'lucide-react'
import type { DashPanel } from '../../types'

const TITLES: Record<DashPanel, string> = {
  overview:     'Overview',
  compose:      'Compose',
  buffer:       'Buffer',
  analytics:    'Analytics',
  'ai-creator': 'AI Creator',
  media:        'Media Library',
  connections:  'Connections',
  settings:     'Settings',
}

interface Props { panel: DashPanel; onHome: () => void }

const Topbar: React.FC<Props> = ({ panel, onHome }) => (
  <div className="h-16 flex items-center justify-between px-7 sticky top-0 z-40 bg-[#0e0e0e] border-b border-[rgba(245,158,11,.1)]">
    <div className="flex items-center gap-4">
      <motion.div key={panel} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
        className="font-display font-bold text-lg tracking-tight">
        {TITLES[panel]}
      </motion.div>
      <div className="text-sm text-[#665544]">Dashboard / {TITLES[panel]}</div>
    </div>
    <div className="flex items-center gap-3">
      {([
        { icon:<Search size={15}/>,  key:'search' },
        { icon:<Bell size={15}/>,    key:'bell', dot:true },
        { icon:<Home size={15}/>,    key:'home',  fn:onHome },
      ] as const).map(b => (
        <motion.button key={b.key}
          whileHover={{ borderColor:'rgba(245,158,11,.5)', background:'rgba(245,158,11,.08)' }}
          onClick={'fn' in b ? b.fn : undefined}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#a89880] transition-colors bg-[#1a1a1a] border border-[rgba(245,158,11,.12)]">
          {b.icon}
          {'dot' in b && b.dot && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#F59E0B] border border-[#0e0e0e]" />
          )}
        </motion.button>
      ))}
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
        style={{ background:'linear-gradient(135deg,#F59E0B,#EA580C)' }}>AK</div>
    </div>
  </div>
)

export default Topbar
