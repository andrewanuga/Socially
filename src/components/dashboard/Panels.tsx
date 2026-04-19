import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card, CardHeader, CardTitle, MetricCard, StatusBadge, MiniChart,
  AIPill, PlatToggle, GoldButton, GhostButton, ProgressBar, SectionLabel, Spinner, Toaster,
} from '../ui'
import { useAI } from '../../hooks'
import { PLATFORMS, AI_MODELS, COMPOSE_PLATFORMS, CONTENT_TYPES, TONE_OPTIONS, PROMPT_TEMPLATES } from '../../lib/constants'
import type { AIModel, DashPanel, PostStatus } from '../../types'

// ── Shared animation variants ─────────────────────────────────────────────────
const pV = {
  hidden: { opacity:0, y:16 },
  show:   { opacity:1, y:0, transition:{ duration:.45, ease:[.16,1,.3,1] } },
  exit:   { opacity:0, y:-8, transition:{ duration:.2 } },
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
export const OverviewPanel: React.FC<{ onNav: (p: DashPanel) => void }> = ({ onNav }) => {
  const chart = [.4,.55,.35,.7,.6,.85,.72,.9,.68,.8,.95,.88,.76,1]
  const queue = [
    { time:'Today 3:00 PM',    pl:'𝕏',  c:'#1DA1F2', text:'Thread on productivity hacks' },
    { time:'Today 6:30 PM',    pl:'📸', c:'#E1306C', text:'Product photo carousel' },
    { time:'Tomorrow 9:00 AM', pl:'in', c:'#0077B5', text:'Q4 results announcement' },
  ]
  const posts: Array<{ text:string; plat:string; pc:string; reach:string; status:PostStatus }> = [
    { text:'✨ New product launch is LIVE!',        plat:'ig', pc:'#E1306C', reach:'12.4K', status:'published' },
    { text:'🧵 10 lessons I learned building...',   plat:'𝕏', pc:'#1DA1F2', reach:'8.7K',  status:'published' },
    { text:'How we grew 500% in Q4',                plat:'in', pc:'#0077B5', reach:'—',     status:'scheduled' },
    { text:'Behind the scenes of our rebrand',      plat:'ig', pc:'#E1306C', reach:'—',     status:'draft' },
  ]
  return (
    <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Reach"     value="284.7K" change="12.4% this week"  up glow="#F59E0B" />
        <MetricCard label="Engagements"     value="18.3K"  change="8.2% this week"   up glow="#EA580C" />
        <MetricCard label="Posts Scheduled" value="47"     change="3 new today"      up glow="#10B981" />
        <MetricCard label="New Followers"   value="+1,204" change="2.1% vs last week" up={false} glow="#3B82F6" />
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns:'1fr 360px' }}>
        <div className="flex flex-col gap-5">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
              <div className="flex gap-0.5 bg-[#1a1a1a] rounded-full p-1">
                {['7D','30D','90D'].map((t,i) => (
                  <button key={t} className="px-3 py-1 rounded-full text-xs font-display font-semibold transition-all"
                    style={{ background:i===0?'linear-gradient(135deg,#F59E0B,#EA580C)':'transparent', color:i===0?'#000':'#a89880' }}>{t}</button>
                ))}
              </div>
            </CardHeader>
            <div className="p-5">
              <div className="h-48 bg-[#1a1a1a] rounded-xl overflow-hidden"><MiniChart values={chart} /></div>
              <div className="flex gap-5 mt-3">
                {[{l:'Instagram',c:'#E1306C'},{l:'Twitter/X',c:'#1DA1F2'},{l:'LinkedIn',c:'#0077B5'}].map(p => (
                  <div key={p.l} className="flex items-center gap-1.5 text-xs text-[#a89880]">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background:p.c }} />{p.l}
                  </div>
                ))}
              </div>
            </div>
          </Card>
          {/* Posts table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <button onClick={() => onNav('compose')} className="text-sm font-semibold text-[#F59E0B]">+ New Post</button>
            </CardHeader>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-[rgba(245,158,11,.1)]">
                {['Content','Platform','Reach','Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-[1px] text-[#665544] font-semibold">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {posts.map((r,i) => (
                  <motion.tr key={i} whileHover={{ background:'rgba(245,158,11,.02)' }}
                    className="border-b border-[rgba(245,158,11,.06)] last:border-0">
                    <td className="px-5 py-3 max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-[#f5f0e8]">{r.text}</td>
                    <td className="px-5 py-3">
                      <span className="w-6 h-6 rounded-md inline-flex items-center justify-center text-xs font-bold"
                        style={{ background:`${r.pc}20`, color:r.pc }}>{r.plat}</span>
                    </td>
                    <td className="px-5 py-3 text-[#a89880]">{r.reach}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        <div className="flex flex-col gap-5">
          {/* Platform health */}
          <Card>
            <CardHeader><CardTitle>Platform Health</CardTitle></CardHeader>
            <div className="p-5 flex flex-col gap-4">
              {[{n:'Instagram',p:94,c:'#E1306C'},{n:'Twitter/X',p:78,c:'#1DA1F2'},{n:'LinkedIn',p:65,c:'#0077B5'}].map(p => (
                <div key={p.n}>
                  <div className="flex justify-between text-sm mb-1.5"><span>{p.n}</span><span className="text-[#a89880]">{p.p}%</span></div>
                  <ProgressBar value={p.p} color={p.c} />
                </div>
              ))}
            </div>
          </Card>
          {/* Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Queue</CardTitle>
              <button onClick={() => onNav('buffer')} className="text-xs font-semibold text-[#F59E0B]">View Calendar</button>
            </CardHeader>
            <div className="p-4 flex flex-col gap-2.5">
              {queue.map((q,i) => (
                <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background:`${q.c}20`, color:q.c }}>{q.pl}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#f5f0e8] truncate">{q.text}</div>
                    <div className="text-[11px] text-[#665544]">{q.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSE
// ─────────────────────────────────────────────────────────────────────────────
export const ComposePanel: React.FC<{ showToast: (m:string) => void }> = ({ showToast }) => {
  const [content,  setContent]   = useState('')
  const [selPlats, setSelPlats]  = useState<string[]>(['twitter'])
  const [aiModel,  setAIModel]   = useState<AIModel>('gpt4o')
  const [topic,    setTopic]     = useState('')
  const [ctype,    setCtype]     = useState(CONTENT_TYPES[0])
  const [media,    setMedia]     = useState<string[]>([])
  const [dragging, setDragging]  = useState(false)
  const { loading, output, generate } = useAI()

  useEffect(() => { if (output) setContent(output) }, [output])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(f => setMedia(p => [...p, URL.createObjectURL(f)]))
    showToast(`${files.length} file(s) added`)
  }, [showToast])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(f => setMedia(p => [...p, URL.createObjectURL(f)]))
    showToast(`${e.target.files?.length ?? 0} file(s) added`)
  }

  return (
    <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
      <div className="grid gap-5" style={{ gridTemplateColumns:'1fr 340px' }}>
        <div>
          {/* Editor box */}
          <div className="rounded-2xl p-6 mb-4 bg-[#141414] border border-[rgba(245,158,11,.2)]">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {['B','I','#','@','😊','🔗','🖼','🎬'].map(t => (
                <motion.button key={t}
                  whileHover={{ borderColor:'rgba(245,158,11,.5)', background:'rgba(245,158,11,.08)' }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-[#a89880] bg-[#1a1a1a] border border-[rgba(245,158,11,.12)] transition-all">
                  {t}
                </motion.button>
              ))}
              <div className="flex-1" />
              <span className={`text-xs ${content.length > 260 ? 'text-red-400' : content.length > 200 ? 'text-[#F59E0B]' : 'text-[#665544]'}`}>
                {content.length} / 280
              </span>
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind? Or let AI generate content for you..."
              className="w-full bg-[#1a1a1a] border border-[rgba(245,158,11,.12)] text-[#f5f0e8] rounded-xl p-4 text-[15px] resize-none min-h-[140px] outline-none transition-colors placeholder:text-[#665544] focus:border-[#F59E0B] font-body"
            />
            <div className="flex items-center justify-between mt-4 gap-3 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                {COMPOSE_PLATFORMS.map(p => (
                  <PlatToggle key={p.id}
                    label={`${p.icon} ${p.name.split('/')[0]}`}
                    selected={selPlats.includes(p.id)}
                    onToggle={() => setSelPlats(prev =>
                      prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2.5">
                <GhostButton size="sm" onClick={() => showToast('Scheduler coming soon!')}>⏱ Schedule</GhostButton>
                <GoldButton  size="sm" onClick={() => {
                  if (!content) { showToast('Write something first!'); return }
                  setContent(''); showToast('Post published! ✦')
                }}>Publish Now ✦</GoldButton>
              </div>
            </div>
          </div>
          {/* Drop zone */}
          <div onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)} onDrop={handleDrop}
            onClick={() => document.getElementById('composeFile')?.click()}
            className="rounded-2xl p-10 text-center transition-all"
            style={{ border:`2px dashed ${dragging?'#F59E0B':'rgba(245,158,11,.25)'}`, background:dragging?'rgba(245,158,11,.04)':'transparent', cursor:'pointer' }}>
            <input id="composeFile" type="file" className="hidden" multiple accept="image/*,video/*" onChange={handleFile} />
            <div className="text-4xl mb-3">📁</div>
            <div className="text-[#a89880] mb-1.5">Drop photos &amp; videos here</div>
            <div className="text-xs text-[#665544]">JPG, PNG, GIF, MP4, MOV · Max 50MB</div>
          </div>
          {media.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-3">
              {media.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[rgba(245,158,11,.3)]">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setMedia(p => p.filter((_,j) => j !== i))}
                    className="absolute top-1 right-1 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center text-[9px] text-white">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* AI sidebar */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>AI Assistant</CardTitle></CardHeader>
            <div className="p-4">
              <div className="flex gap-2 mb-4 flex-wrap">
                {AI_MODELS.slice(0, 3).map(ai => (
                  <AIPill key={ai.id} label={ai.name} color={ai.color} active={aiModel===ai.id} onClick={() => setAIModel(ai.id as AIModel)} />
                ))}
              </div>
              <select value={ctype} onChange={e => setCtype(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[rgba(245,158,11,.2)] text-[#f5f0e8] rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:border-[#F59E0B]">
                {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <input value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="Topic or product..."
                className="w-full bg-[#1a1a1a] border border-[rgba(245,158,11,.2)] text-[#f5f0e8] rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:border-[#F59E0B] placeholder:text-[#665544]" />
              <GoldButton className="w-full" size="sm" disabled={loading}
                onClick={() => { if (!topic) { showToast('Enter a topic first'); return }; generate(`You are a social media expert. Write a ${ctype} about: "${topic}". Make it engaging, include relevant hashtags, use emojis. Be concise and impactful.`) }}>
                {loading ? '⏳ Generating...' : '✨ Generate Content'}
              </GoldButton>
              <div className="mt-3 bg-[#1a1a1a] border border-[rgba(245,158,11,.12)] rounded-xl p-4 text-xs leading-relaxed min-h-[100px] relative"
                style={{ color: output ? '#f5f0e8' : '#665544', fontStyle: output ? 'normal' : 'italic' }}>
                {output ? <>{output}<span className="typing-cursor" /></> : 'AI content will appear here...'}
                {loading && !output && <div className="absolute inset-0 flex items-center justify-center"><Spinner /></div>}
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Best Time to Post</CardTitle></CardHeader>
            <div className="p-4 flex flex-col gap-2.5">
              {[{d:'Today',t:'3:00 PM — 5:00 PM',s:'★★★★★'},{d:'Tomorrow',t:'9:00 AM — 11:00 AM',s:'★★★★'},{d:'Thursday',t:'12:00 PM — 2:00 PM',s:'★★★★'}].map(x => (
                <div key={x.d} className="bg-[#1a1a1a] rounded-xl p-3">
                  <div className="text-[11px] text-[#665544]">{x.d}</div>
                  <div className="text-sm font-display font-semibold text-[#F59E0B]">{x.t}</div>
                  <div className="text-[11px] text-[#a89880]">{x.s}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BUFFER
// ─────────────────────────────────────────────────────────────────────────────
export const BufferPanel: React.FC<{ showToast: (m:string) => void }> = ({ showToast }) => {
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const dates = [14,15,16,17,18,19,20]
  const slots: Array<Array<{c:string;pl:string}>> = [
    [{c:'#E1306C',pl:'📸'},{c:'#1DA1F2',pl:'𝕏'}],
    [{c:'#0077B5',pl:'in'}],
    [{c:'#E1306C',pl:'📸'},{c:'#1877F2',pl:'f'},{c:'#1DA1F2',pl:'𝕏'}],
    [{c:'#1DA1F2',pl:'𝕏'},{c:'#0077B5',pl:'in'}],
    [{c:'#E1306C',pl:'📸'}],
    [],
    [{c:'#1DA1F2',pl:'𝕏'}],
  ]
  const queue: Array<{ text:string; plats:string[]; time:string; status:PostStatus }> = [
    { text:'🔥 Big announcement coming soon...',   plats:['𝕏','📸'], time:'Apr 17, 3:00 PM',  status:'scheduled' },
    { text:'Behind the scenes of our photoshoot', plats:['📸'],     time:'Apr 17, 6:30 PM',  status:'scheduled' },
    { text:'5 things I wish I knew as a founder', plats:['in','f'], time:'Apr 18, 9:00 AM',  status:'scheduled' },
    { text:'Q1 growth recap — numbers inside',    plats:['in'],     time:'Apr 18, 12:00 PM', status:'draft' },
    { text:'Our team is growing! We are hiring',  plats:['𝕏','in'], time:'Apr 19, 10:00 AM', status:'draft' },
  ]
  return (
    <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl">Content Buffer</h2>
          <p className="text-sm text-[#a89880] mt-1">Your scheduled posts this week</p>
        </div>
        <div className="flex gap-2.5">
          <GhostButton size="sm">← Prev</GhostButton>
          <GoldButton  size="sm">This Week</GoldButton>
          <GhostButton size="sm">Next →</GhostButton>
        </div>
      </div>
      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2.5 mb-6">
        {days.map((d,i) => {
          const today = i === 3
          return (
            <div key={d} className="rounded-xl p-3 min-h-[140px] bg-[#141414]"
              style={{ border:`1px solid ${today?'rgba(245,158,11,.5)':'rgba(245,158,11,.1)'}` }}>
              <div className="text-[11px] font-display font-bold uppercase tracking-wide mb-1" style={{ color:today?'#F59E0B':'#665544' }}>{d}</div>
              <div className="text-lg font-display font-black mb-2" style={{ color:today?'#F59E0B':'#a89880' }}>Apr {dates[i]}</div>
              {slots[i]?.map((sl,j) => (
                <div key={j} className="bg-[#1a1a1a] rounded-lg px-2 py-1.5 mb-1.5 text-[10px]" style={{ borderLeft:`2px solid ${sl.c}` }}>
                  {sl.pl} <span className="text-[#a89880]">Scheduled</span>
                </div>
              ))}
              {!slots[i]?.length && <div className="text-[11px] text-[#665544] text-center py-2">Empty</div>}
              <button onClick={() => showToast('New slot added!')}
                className="w-full bg-transparent rounded-lg py-1 text-[10px] text-[#665544] mt-1 transition-colors hover:text-[#F59E0B]"
                style={{ border:'1px dashed rgba(245,158,11,.2)' }}>+ Add</button>
            </div>
          )
        })}
      </div>
      {/* Queue table */}
      <Card>
        <CardHeader><CardTitle>Queue — Next 5 Posts</CardTitle></CardHeader>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[rgba(245,158,11,.1)]">
            {['Post Preview','Platforms','Scheduled Time','Status','Action'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-[1px] text-[#665544] font-semibold">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {queue.map((r,i) => (
              <motion.tr key={i} whileHover={{ background:'rgba(245,158,11,.02)' }}
                className="border-b border-[rgba(245,158,11,.06)] last:border-0">
                <td className="px-5 py-3 max-w-[200px] truncate text-[#f5f0e8]">{r.text}</td>
                <td className="px-5 py-3 text-lg">{r.plats.join(' ')}</td>
                <td className="px-5 py-3 text-xs text-[#a89880]">{r.time}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-3"><button onClick={() => showToast('Post edited')} className="text-xs font-semibold text-[#F59E0B]">Edit</button></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────
export const AnalyticsPanel: React.FC = () => (
  <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
    <div className="grid grid-cols-4 gap-4 mb-6">
      <MetricCard label="Total Impressions"   value="1.24M" change="18.7%" up glow="#F59E0B" />
      <MetricCard label="Avg Engagement Rate" value="4.8%"  change="0.6%"  up glow="#EA580C" />
      <MetricCard label="Link Clicks"         value="23.4K" change="11.2%" up glow="#10B981" />
      <MetricCard label="Profile Visits"      value="87.1K" change="3.4%"  up={false} glow="#3B82F6" />
    </div>
    <div className="grid grid-cols-2 gap-5">
      {[
        { title:'Instagram Growth', value:'48.2K', trend:'+12.3%', color:'#E1306C', data:[.3,.45,.4,.6,.55,.7,.65,.8] },
        { title:'Twitter/X Growth', value:'31.7K', trend:'+8.1%',  color:'#1DA1F2', data:[.2,.35,.3,.45,.4,.55,.5,.65] },
      ].map(p => (
        <Card key={p.title}>
          <CardHeader>
            <CardTitle>{p.title}</CardTitle>
            <span className="text-sm text-emerald-400">{p.trend}</span>
          </CardHeader>
          <div className="p-5">
            <div className="font-display font-black text-5xl mb-1" style={{ color:p.color }}>{p.value}</div>
            <div className="text-xs text-[#665544] mb-4">followers</div>
            <div className="h-28 bg-[#1a1a1a] rounded-xl overflow-hidden">
              <MiniChart values={p.data} color={`linear-gradient(180deg,${p.color},${p.color}80)`} />
            </div>
          </div>
        </Card>
      ))}
      <Card>
        <CardHeader><CardTitle>Top Performing Content</CardTitle></CardHeader>
        <div className="p-5 flex flex-col gap-3">
          {[{t:'Product launch reveal',e:'4.2K',pl:'📸'},{t:'Thread: 10 founder lessons',e:'3.8K',pl:'𝕏'},{t:'Q4 growth milestone',e:'2.9K',pl:'in'}].map((c,i) => (
            <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
              <span className="text-xl">{c.pl}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-[#f5f0e8]">{c.t}</div>
                <div className="text-xs text-[#665544]">{c.e} engagements</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader><CardTitle>Audience Demographics</CardTitle></CardHeader>
        <div className="p-5 flex flex-col gap-3">
          {[{l:'18–24',p:32,c:'#F59E0B'},{l:'25–34',p:41,c:'#EA580C'},{l:'35–44',p:18,c:'#10B981'},{l:'45+',p:9,c:'#3B82F6'}].map(d => (
            <div key={d.l}>
              <div className="flex justify-between text-sm mb-1.5"><span>{d.l}</span><span className="text-[#a89880]">{d.p}%</span></div>
              <ProgressBar value={d.p * 2} color={d.c} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </motion.div>
)

// ─────────────────────────────────────────────────────────────────────────────
// AI CREATOR
// ─────────────────────────────────────────────────────────────────────────────
export const AICreatorPanel: React.FC<{ showToast: (m:string) => void }> = ({ showToast }) => {
  const [model, setModel] = useState<AIModel>('gpt4o')
  const [ctype, setCtype] = useState(CONTENT_TYPES[0])
  const [tone,  setTone]  = useState(TONE_OPTIONS[0])
  const [topic, setTopic] = useState('')
  const { loading, output, generate } = useAI()

  return (
    <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
      <div className="grid gap-5" style={{ gridTemplateColumns:'1fr 340px' }}>
        <div>
          <div className="rounded-2xl p-6 mb-5 bg-[#141414] border border-[rgba(245,158,11,.2)]">
            <h3 className="font-display font-bold text-lg mb-1">AI Content Studio</h3>
            <p className="text-sm text-[#a89880] mb-5">Choose your model and generate platform-perfect content</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {AI_MODELS.map(ai => (
                <AIPill key={ai.id} label={ai.name} color={ai.color} active={model===ai.id} onClick={() => setModel(ai.id as AIModel)} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <select value={ctype} onChange={e => setCtype(e.target.value)}
                className="bg-[#1a1a1a] border border-[rgba(245,158,11,.2)] text-[#f5f0e8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#F59E0B]">
                {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="bg-[#1a1a1a] border border-[rgba(245,158,11,.2)] text-[#f5f0e8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#F59E0B]">
                {TONE_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <textarea value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="Describe what you want to create... (e.g. 'Write a viral Twitter thread about productivity hacks for founders')"
              className="w-full bg-[#1a1a1a] border border-[rgba(245,158,11,.2)] text-[#f5f0e8] rounded-xl px-4 py-3 text-sm resize-none h-24 outline-none mb-3 focus:border-[#F59E0B] placeholder:text-[#665544] font-body"
            />
            <div className="flex gap-3">
              <GoldButton className="flex-1" disabled={loading}
                onClick={() => { if (!topic) { showToast('Describe your content first'); return }; generate(`You are an elite social media copywriter using ${AI_MODELS.find(m2=>m2.id===model)?.name}. Create compelling ${ctype} content in a ${tone} tone for: "${topic}". Format with line breaks, emojis, hashtags. Make it stand out.`) }}>
                {loading ? '⏳ Generating...' : '✨ Generate with AI'}
              </GoldButton>
              <GhostButton size="md"
                onClick={() => { if (!topic) { showToast('Describe content first'); return }; generate(`Create 3 different ${ctype} variants for: "${topic}". Label them **Variant A** (${tone}), **Variant B** (Casual), **Variant C** (Viral). Each concise and punchy.`); showToast('Generating 3 variants... ✦') }}>
                ⚡ 3 Variants
              </GhostButton>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Generated Output</CardTitle>
              <button onClick={() => { navigator.clipboard.writeText(output).catch(() => {}); showToast('Copied! ✦') }}
                className="text-xs font-semibold text-[#F59E0B]">Copy →</button>
            </CardHeader>
            <div className="p-5 text-sm leading-relaxed min-h-[180px] whitespace-pre-wrap"
              style={{ color: output ? '#a89880' : '#665544', fontStyle: output ? 'normal' : 'italic' }}>
              {output ? <>{output}<span className="typing-cursor" /></> : 'Your AI-generated content will appear here. Choose a model and topic above to get started.'}
              {loading && !output && <div className="flex items-center gap-2.5"><Spinner /><span className="text-[#665544]">Generating...</span></div>}
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader><CardTitle>Recent Generations</CardTitle></CardHeader>
            <div className="p-4 flex flex-col gap-2.5">
              {['Instagram caption for product launch','Twitter thread about AI trends','LinkedIn post about team growth'].map((t,i) => (
                <motion.div key={i} whileHover={{ background:'rgba(245,158,11,.06)' }}
                  onClick={() => { setTopic(t); showToast('Topic loaded!') }}
                  className="bg-[#1a1a1a] rounded-xl p-3 transition-colors" style={{ cursor:'pointer' }}>
                  <div className="text-xs text-[#a89880] leading-relaxed">{t}</div>
                  <div className="text-[10px] text-[#665544] mt-1">Claude · 2 min ago</div>
                </motion.div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Prompt Templates</CardTitle></CardHeader>
            <div className="p-4 flex flex-col gap-2">
              {PROMPT_TEMPLATES.map(t => (
                <motion.button key={t} whileHover={{ borderColor:'rgba(245,158,11,.5)', color:'#F59E0B' }}
                  onClick={() => setTopic(`Write a post about: ${t}`)}
                  className="text-left text-xs px-3 py-2.5 bg-[#1a1a1a] rounded-xl border border-[rgba(245,158,11,.12)] text-[#a89880] transition-colors">
                  {t}
                </motion.button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────────────────────────────────────
export const MediaPanel: React.FC<{ showToast: (m:string) => void }> = ({ showToast }) => {
  const [uploads, setUploads] = useState<string[]>([])
  const [tab, setTab]         = useState(0)
  const COLORS = ['#E1306C','#1DA1F2','#F59E0B','#10B981','#8B5CF6','#EF4444','#0077B5','#F97316']
  return (
    <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl">Media Library</h2>
          <p className="text-sm text-[#a89880] mt-1">Manage your photos and videos</p>
        </div>
        <GoldButton size="sm" onClick={() => document.getElementById('mediaLib')?.click()}>+ Upload Media</GoldButton>
        <input id="mediaLib" type="file" className="hidden" multiple accept="image/*,video/*"
          onChange={e => { Array.from(e.target.files ?? []).forEach(f => setUploads(p => [...p, URL.createObjectURL(f)])); showToast(`${e.target.files?.length ?? 0} file(s) uploaded`) }} />
      </div>
      <div className="flex gap-0.5 bg-[#1a1a1a] rounded-full p-1 max-w-fit mb-6">
        {['All Media','Images','Videos','Used'].map((t,i) => (
          <button key={t} onClick={() => setTab(i)}
            className="px-4 py-2 rounded-full text-xs font-display font-semibold transition-all"
            style={{ background:tab===i?'linear-gradient(135deg,#F59E0B,#EA580C)':'transparent', color:tab===i?'#000':'#a89880' }}>{t}</button>
        ))}
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))' }}>
        {Array.from({length:12}).map((_,i) => (
          <motion.div key={i} whileHover={{ scale:1.03 }}
            className="aspect-square rounded-xl flex items-center justify-center text-3xl relative overflow-hidden"
            style={{ background:`${COLORS[i%COLORS.length]}15`, border:`1px solid ${COLORS[i%COLORS.length]}30`, cursor:'pointer' }}>
            {i%3===0?'🎬':'🖼'}
            <div className="absolute bottom-2 left-2 right-2 text-[10px] text-[#a89880] truncate">
              media_{i+1}.{i%3===0?'mp4':'jpg'}
            </div>
          </motion.div>
        ))}
        {uploads.map((url,i) => (
          <div key={`up-${i}`} className="aspect-square rounded-xl overflow-hidden border border-[rgba(245,158,11,.3)]">
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const ConnectionsPanel: React.FC<{ showToast: (m:string) => void }> = ({ showToast }) => {
  const [conn, setConn] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PLATFORMS.map(p => [p.id, p.connected]))
  )
  return (
    <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
      <div className="mb-7">
        <h2 className="font-display font-bold text-xl">Connected Platforms</h2>
        <p className="text-sm text-[#a89880] mt-1">Manage your social media account connections</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {PLATFORMS.map(p => (
          <motion.div key={p.id} whileHover={{ y:-2, borderColor:'rgba(245,158,11,.4)' }}
            className="relative bg-[#141414] rounded-2xl p-6 overflow-hidden border border-[rgba(245,158,11,.12)]">
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full"
              style={{ background:conn[p.id]?'#10B981':'#665544', boxShadow:conn[p.id]?'0 0 8px #10B981':'none' }} />
            <div className="text-4xl mb-3">{p.icon}</div>
            <div className="font-display font-bold text-base mb-1.5">{p.name}</div>
            <div className="text-xs text-[#a89880] mb-4">
              {conn[p.id] ? `Connected · ${p.followers ?? '—'} followers` : 'Not connected'}
            </div>
            <motion.button
              whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
              onClick={() => { setConn(prev => ({...prev,[p.id]:!prev[p.id]})); showToast(conn[p.id]?`${p.name} disconnected`:`${p.name} connected! ✓`) }}
              className="w-full py-2.5 rounded-full text-sm font-display font-semibold border transition-all"
              style={{ border:`1px solid ${conn[p.id]?'rgba(245,158,11,.5)':'rgba(245,158,11,.2)'}`, color:conn[p.id]?'#F59E0B':'#a89880', background:conn[p.id]?'rgba(245,158,11,.08)':'transparent' }}>
              {conn[p.id] ? '✓ Connected' : 'Connect Account'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
export const SettingsPanel: React.FC<{ showToast: (m:string) => void }> = ({ showToast }) => {
  const [tab, setTab] = useState('profile')
  const tabs = [
    { id:'profile', label:'👤 Profile' },
    { id:'ai',      label:'🤖 AI Settings' },
    { id:'notifs',  label:'🔔 Notifications' },
    { id:'billing', label:'💳 Billing' },
    { id:'team',    label:'👥 Team' },
  ]
  const inputCls = "w-full bg-[#1a1a1a] border border-[rgba(245,158,11,.2)] text-[#f5f0e8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#F59E0B]"

  return (
    <motion.div variants={pV} initial="hidden" animate="show" className="p-7 max-w-[1400px]">
      <h2 className="font-display font-bold text-xl mb-6">Settings</h2>
      <div className="grid gap-6" style={{ gridTemplateColumns:'220px 1fr' }}>
        <div className="flex flex-col gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all"
              style={{ background:tab===t.id?'rgba(245,158,11,.1)':'transparent', color:tab===t.id?'#F59E0B':'#a89880' }}>
              {t.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:.25 }}>
            {tab === 'profile' && (
              <Card>
                <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-black"
                      style={{ background:'linear-gradient(135deg,#F59E0B,#EA580C)' }}>AK</div>
                    <GhostButton size="sm">Change Photo</GhostButton>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['First Name','Alex'],['Last Name','Kim']].map(([l,v]) => (
                      <div key={l}><label className="text-xs text-[#665544] block mb-1.5">{l}</label><input defaultValue={v} className={inputCls} /></div>
                    ))}
                  </div>
                  {[['Email','alex@company.com'],['Brand / Company','Acme Studios']].map(([l,v]) => (
                    <div key={l}><label className="text-xs text-[#665544] block mb-1.5">{l}</label><input defaultValue={v} className={inputCls} /></div>
                  ))}
                  <GoldButton size="sm" className="w-fit" onClick={() => showToast('Profile saved! ✦')}>Save Changes</GoldButton>
                </div>
              </Card>
            )}
            {tab === 'ai' && (
              <Card>
                <CardHeader><CardTitle>AI Model Settings</CardTitle></CardHeader>
                <div className="p-6 flex flex-col gap-4">
                  {([['Default AI Model', AI_MODELS.map(m => m.name)], ['Default Tone', TONE_OPTIONS]] as [string, string[]][]).map(([l, opts]) => (
                    <div key={l}><label className="text-xs text-[#665544] block mb-1.5">{l}</label>
                      <select className={inputCls}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>
                  ))}
                  <div><label className="text-xs text-[#665544] block mb-1.5">Brand Voice</label>
                    <textarea placeholder="Describe your brand voice and style..." className={`${inputCls} resize-none`} style={{ minHeight:80 }} /></div>
                  <GoldButton size="sm" className="w-fit" onClick={() => showToast('AI settings saved! ✦')}>Save</GoldButton>
                </div>
              </Card>
            )}
            {tab === 'notifs' && (
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <div className="p-6 flex flex-col">
                  {['Post published','Scheduled post reminder','New follower milestone','Engagement spike','Weekly report','AI generation complete'].map(n => (
                    <div key={n} className="flex justify-between items-center py-3.5 border-b border-[rgba(245,158,11,.08)] last:border-0">
                      <span className="text-sm">{n}</span>
                      <input type="checkbox" defaultChecked style={{ accentColor:'#F59E0B', width:16, height:16 }} />
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {tab === 'billing' && (
              <Card>
                <CardHeader><CardTitle>Billing &amp; Plan</CardTitle></CardHeader>
                <div className="p-6">
                  <div className="rounded-2xl p-5 mb-5 bg-[rgba(245,158,11,.08)] border border-[rgba(245,158,11,.35)]">
                    <div className="text-[11px] uppercase tracking-[1px] font-display font-bold mb-1 text-[#F59E0B]">Current Plan</div>
                    <div className="font-display font-black text-3xl text-[#FCD34D]">Pro Plan</div>
                    <div className="text-sm text-[#a89880] mt-1">$29/month · Renews May 17, 2025</div>
                  </div>
                  <GhostButton size="md">Manage Billing →</GhostButton>
                </div>
              </Card>
            )}
            {tab === 'team' && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <GoldButton size="sm" onClick={() => showToast('Invite sent! ✦')}>+ Invite</GoldButton>
                </CardHeader>
                <div className="p-6 flex flex-col">
                  {(['Alex Kim (You)','Sarah Chen','Marcus Rodriguez'] as const).map((m, i) => (
                    <div key={m} className="flex items-center gap-3 py-4 border-b border-[rgba(245,158,11,.08)] last:border-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-black"
                        style={{ background:'linear-gradient(135deg,#F59E0B,#EA580C)' }}>
                        {m.split(' ').slice(0,2).map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{m}</div>
                        <div className="text-xs text-[#665544]">{(['Owner','Editor','Viewer'] as const)[i]}</div>
                      </div>
                      {i > 0 && <button onClick={() => showToast('Member removed')} className="text-xs font-semibold text-red-400">Remove</button>}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
