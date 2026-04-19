import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ToastItem, PostStatus } from '../../types'

// ── GoldButton ────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}
export const GoldButton: React.FC<BtnProps> = ({ children, className = '', size = 'md', ...rest }) => {
  const sz = { sm:'px-5 py-2 text-sm', md:'px-6 py-3 text-sm', lg:'px-8 py-4 text-base' }[size]
  return (
    <motion.button
      whileHover={!rest.disabled ? { y:-2, boxShadow:'0 12px 40px rgba(245,158,11,.35)' } : {}}
      whileTap={!rest.disabled ? { scale:0.97 } : {}}
      className={`btn-gold rounded-full font-display ${sz} ${className}`}
      {...rest}
    >{children}</motion.button>
  )
}

// ── GhostButton ───────────────────────────────────────────────────────────────
export const GhostButton: React.FC<BtnProps> = ({ children, className = '', size = 'md', ...rest }) => {
  const sz = { sm:'px-4 py-2 text-xs', md:'px-5 py-2.5 text-sm', lg:'px-8 py-4 text-base' }[size]
  return (
    <motion.button
      whileHover={{ borderColor:'rgba(245,158,11,.5)', color:'#F59E0B' }}
      whileTap={{ scale:0.97 }}
      className={`rounded-full border border-[rgba(245,158,11,.25)] text-[#a89880] font-medium bg-transparent transition-colors ${sz} ${className}`}
      {...rest}
    >{children}</motion.button>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export const Card: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({
  children, className = '', hover = false
}) => (
  <motion.div
    whileHover={hover ? { y:-2, borderColor:'rgba(245,158,11,.4)' } : {}}
    className={`rounded-2xl bg-[#141414] border border-[rgba(245,158,11,.12)] ${className}`}
  >{children}</motion.div>
)

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between px-5 py-4 border-b border-[rgba(245,158,11,.1)] ${className}`}>
    {children}
  </div>
)

export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-display font-bold text-[15px] tracking-tight text-[#f5f0e8]">{children}</span>
)

// ── StatusBadge ───────────────────────────────────────────────────────────────
export const StatusBadge: React.FC<{ status: PostStatus }> = ({ status }) => {
  const map: Record<PostStatus, [string, string]> = {
    published: ['status-published', '● Published'],
    scheduled: ['status-scheduled', '◉ Scheduled'],
    draft:     ['status-draft',     '○ Draft'],
  }
  const [cls, label] = map[status]
  return <span className={`${cls} inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full`}>{label}</span>
}

// ── MetricCard ────────────────────────────────────────────────────────────────
export const MetricCard: React.FC<{
  label: string; value: string; change: string; up: boolean; glow?: string
}> = ({ label, value, change, up, glow = '#F59E0B' }) => (
  <motion.div
    whileHover={{ y:-3, borderColor:'rgba(245,158,11,.4)' }}
    className="relative overflow-hidden rounded-2xl border border-[rgba(245,158,11,.12)] bg-[#141414] p-5"
  >
    <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-15"
      style={{ background: glow, filter:'blur(30px)' }} />
    <div className="text-xs uppercase tracking-[1.5px] text-[#665544] font-semibold mb-2">{label}</div>
    <div className="text-gold-gradient font-display font-black text-3xl leading-none mb-1.5">{value}</div>
    <div className={`text-xs flex items-center gap-1 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? '↑' : '↓'} {change}
    </div>
  </motion.div>
)

// ── MiniChart ─────────────────────────────────────────────────────────────────
export const MiniChart: React.FC<{ values: number[]; color?: string }> = ({ values, color }) => (
  <div className="h-full flex items-end gap-[3px] px-2 pb-1">
    {values.map((v, i) => (
      <motion.div
        key={i}
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ delay: i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 rounded-t-[3px] opacity-70 hover:opacity-100 transition-opacity"
        style={{ height:`${v * 100}%`, background: color ?? 'linear-gradient(180deg,#F59E0B,#EA580C)', transformOrigin:'bottom' }}
      />
    ))}
  </div>
)

// ── AIPill ────────────────────────────────────────────────────────────────────
export const AIPill: React.FC<{
  label: string; color: string; active?: boolean; onClick?: () => void
}> = ({ label, color, active, onClick }) => (
  <motion.button
    whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
      ${active
        ? 'border-[rgba(245,158,11,.6)] bg-[rgba(245,158,11,.12)] text-[#FCD34D]'
        : 'border-[rgba(245,158,11,.12)] bg-[#1a1a1a] text-[#a89880]'
      }`}
  >
    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
    {label}
  </motion.button>
)

// ── PlatToggle ────────────────────────────────────────────────────────────────
export const PlatToggle: React.FC<{
  label: string; selected: boolean; onToggle: () => void
}> = ({ label, selected, onToggle }) => (
  <motion.button
    whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}
    onClick={onToggle}
    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all
      ${selected
        ? 'border-[rgba(245,158,11,.6)] bg-[rgba(245,158,11,.12)] text-[#FCD34D]'
        : 'border-[rgba(245,158,11,.12)] bg-[#1a1a1a] text-[#a89880]'
      }`}
  >{label}</motion.button>
)

// ── ProgressBar ───────────────────────────────────────────────────────────────
export const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = '#F59E0B' }) => (
  <div className="h-1 bg-[#222] rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }} animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="h-full rounded-full"
      style={{ background: color }}
    />
  </div>
)

// ── SectionLabel ──────────────────────────────────────────────────────────────
export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-xs uppercase tracking-[2px] text-[#F59E0B] font-display font-bold mb-4">✦ {children}</div>
)

// ── Toaster ───────────────────────────────────────────────────────────────────
export const Toaster: React.FC<{ toasts: ToastItem[]; onRemove: (id: string) => void }> = ({
  toasts, onRemove
}) => (
  <div className="fixed bottom-7 right-7 z-[9999] flex flex-col gap-2.5 pointer-events-none">
    <AnimatePresence>
      {toasts.map(t => (
        <motion.div
          key={t.id}
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:40 }}
          transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
          onClick={() => onRemove(t.id)}
          className="pointer-events-auto flex items-center gap-3 bg-[#141414] rounded-xl px-4 py-3.5 text-sm text-[#f5f0e8] max-w-xs shadow-[0_20px_60px_rgba(0,0,0,.6)]"
          style={{ border:'1px solid rgba(245,158,11,.25)', borderLeft:'3px solid #F59E0B' }}
        >
          <span className="text-lg">{t.icon}</span>{t.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
)

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner: React.FC = () => (
  <div className="w-4 h-4 rounded-full animate-spin"
    style={{ border:'2px solid #F59E0B', borderTopColor:'transparent' }} />
)
