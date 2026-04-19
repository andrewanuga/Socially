import React, { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Edit3, Calendar, BarChart2, Sparkles, Image, Link2, Settings } from 'lucide-react'
import type { DashPanel } from '../../types'

const NAV = [
  { id:'overview'    as DashPanel, label:'Overview',    icon:<LayoutDashboard size={18}/>, section:'Main' },
  { id:'compose'     as DashPanel, label:'Compose',     icon:<Edit3 size={18}/> },
  { id:'buffer'      as DashPanel, label:'Buffer',      icon:<Calendar size={18}/> },
  { id:'analytics'   as DashPanel, label:'Analytics',   icon:<BarChart2 size={18}/> },
  { id:'ai-creator'  as DashPanel, label:'AI Creator',  icon:<Sparkles size={18}/>, section:'Create' },
  { id:'media'       as DashPanel, label:'Media',       icon:<Image size={18}/> },
  { id:'connections' as DashPanel, label:'Connections', icon:<Link2 size={18}/>,  section:'Account' },
  { id:'settings'    as DashPanel, label:'Settings',    icon:<Settings size={18}/> },
]

interface Props { active: DashPanel; onNav: (p: DashPanel) => void; onHome: () => void }

const Sidebar: React.FC<Props> = ({ active, onNav, onHome }) => {
  const [exp, setExp] = useState(false)

  return (
    <motion.aside
      onMouseEnter={() => setExp(true)}
      onMouseLeave={() => setExp(false)}
      animate={{ width: exp ? 240 : 72 }}
      transition={{ duration:.3, ease:[.16,1,.3,1] }}
      className="fixed left-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden bg-[#0e0e0e] border-r border-[rgba(245,158,11,.1)]"
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-5 mb-2">
        <div onClick={onHome}
          className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg text-black flex-shrink-0"
          style={{ background:'linear-gradient(135deg,#F59E0B,#EA580C)' }}>S</div>
        <motion.span animate={{ opacity:exp?1:0, width:exp?'auto':0 }}
          className="font-display font-black text-lg text-gold-gradient ml-3 whitespace-nowrap overflow-hidden">
          Socially
        </motion.span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(item => (
          <Fragment key={item.id}>
            {item.section && (
              <motion.div animate={{ opacity:exp?1:0 }}
                className="text-[10px] uppercase tracking-[2px] font-display font-semibold px-3 pt-4 pb-1 whitespace-nowrap text-[#665544]">
                {item.section}
              </motion.div>
            )}
            <motion.button
              onClick={() => onNav(item.id)}
              whileHover={{ background:'rgba(245,158,11,.08)' }}
              className="relative flex items-center gap-3.5 px-3 py-3 rounded-xl w-full text-left transition-all"
              style={{ background: active===item.id ? 'rgba(245,158,11,.1)' : 'transparent', color: active===item.id ? '#F59E0B' : '#a89880' }}
            >
              {active === item.id && (
                <motion.div layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-[60%] rounded-r bg-[#F59E0B]" />
              )}
              <span className="flex-shrink-0" style={{ opacity: active===item.id ? 1 : 0.6 }}>{item.icon}</span>
              <motion.span animate={{ opacity:exp?1:0, width:exp?'auto':0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</motion.span>
            </motion.button>
          </Fragment>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4">
        <motion.button whileHover={{ borderColor:'rgba(245,158,11,.4)' }}
          className="flex items-center gap-3 w-full p-2.5 rounded-xl overflow-hidden border border-[rgba(245,158,11,.12)]">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
            style={{ background:'linear-gradient(135deg,#F59E0B,#EA580C)' }}>AK</div>
          <motion.div animate={{ opacity:exp?1:0, width:exp?'auto':0 }}
            className="overflow-hidden whitespace-nowrap text-left">
            <div className="text-xs font-semibold text-[#f5f0e8]">Alex Kim</div>
            <div className="text-[11px] text-[#665544]">Pro Plan ✦</div>
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  )
}

export default Sidebar
