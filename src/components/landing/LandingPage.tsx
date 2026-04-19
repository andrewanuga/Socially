import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GoldButton, GhostButton, SectionLabel } from '../ui'
import { useCounter, useParallax } from '../../hooks'
import { PLATFORMS, AI_MODELS } from '../../lib/constants'

// ── 3D Scene ──────────────────────────────────────────────────────────────────
const Scene3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let animId: number
    ;(async () => {
      try {
        const THREE = await import('three')
        const canvas = canvasRef.current!
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setSize(innerWidth, innerHeight)
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
        const scene  = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
        camera.position.z = 30

        // Particles
        const geo = new THREE.BufferGeometry()
        const N = 2000; const pos = new Float32Array(N * 3)
        for (let i = 0; i < N; i++) {
          pos[i*3]   = (Math.random()-.5)*120
          pos[i*3+1] = (Math.random()-.5)*120
          pos[i*3+2] = (Math.random()-.5)*60
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        scene.add(new THREE.Points(geo,
          new THREE.PointsMaterial({ color:0xF59E0B, size:0.25, transparent:true, opacity:0.5 })))

        // Wireframe torus
        const torus = new THREE.Mesh(
          new THREE.TorusGeometry(10, 3, 24, 60),
          new THREE.MeshBasicMaterial({ color:0xF59E0B, wireframe:true, transparent:true, opacity:0.07 }))
        torus.position.set(15, -5, 0); scene.add(torus)

        // Wireframe icosahedron
        const ico = new THREE.Mesh(
          new THREE.IcosahedronGeometry(6, 1),
          new THREE.MeshBasicMaterial({ color:0xEA580C, wireframe:true, transparent:true, opacity:0.06 }))
        ico.position.set(-18, 8, 0); scene.add(ico)

        let mx = 0, my = 0
        const onMouse = (e: MouseEvent) => {
          mx = (e.clientX/innerWidth - .5)*2
          my = (e.clientY/innerHeight - .5)*2
        }
        window.addEventListener('mousemove', onMouse)

        const pts = scene.children[0] as THREE.Points
        const tick = () => {
          animId = requestAnimationFrame(tick)
          pts.rotation.y += .001; pts.rotation.x += .0005
          torus.rotation.x += .005; torus.rotation.y += .003
          ico.rotation.y   += .004; ico.rotation.x   += .002
          camera.position.x += (mx*3  - camera.position.x) * .03
          camera.position.y += (-my*2 - camera.position.y) * .03
          camera.lookAt(scene.position)
          renderer.render(scene, camera)
        }
        tick()

        const onResize = () => {
          camera.aspect = innerWidth/innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(innerWidth, innerHeight)
        }
        window.addEventListener('resize', onResize)
        return () => { window.removeEventListener('mousemove', onMouse); window.removeEventListener('resize', onResize); renderer.dispose() }
      } catch(e) { console.warn('3D init failed', e) }
    })()
    return () => cancelAnimationFrame(animId)
  }, [])
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-70" />
}

// ── Floating Card ─────────────────────────────────────────────────────────────
const FloatCard: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children, className = '', delay = 0
}) => (
  <motion.div
    initial={{ opacity:0, scale:.7 }} animate={{ opacity:1, scale:1 }}
    transition={{ delay: 1.2+delay, duration:.8, ease:[.16,1,.3,1] }}
    className={`absolute rounded-xl px-4 py-3 pointer-events-none z-10 border border-[rgba(245,158,11,.25)] ${className}`}
    style={{ background:'rgba(14,14,14,.85)', backdropFilter:'blur(20px)' }}
  >{children}</motion.div>
)

// ── Landing ───────────────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const mouse    = useParallax()
  const { scrollYProgress } = useScroll()
  const heroY   = useTransform(scrollYProgress, [0,.3], [0,-80])
  const heroOpa = useTransform(scrollYProgress, [0,.25], [1,0])

  const c1 = useCounter(4200000, 2000, 1500)
  const c2 = useCounter(12000,   2000, 1700)
  const c3 = useCounter(9,       1500, 1900)
  const [activeAI, setActiveAI] = useState(0)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#080808]">
      <Scene3D />

      {/* Parallax orbs */}
      <div className="fixed w-[600px] h-[600px] -top-24 -right-24 z-0 opacity-15 orb pointer-events-none"
        style={{ background:'radial-gradient(circle,#F59E0B,transparent)', transform:`translate(${mouse.x*40}px,${mouse.y*30}px)`, transition:'transform 1s ease-out' }} />
      <div className="fixed w-[400px] h-[400px] bottom-24 -left-12 z-0 opacity-10 orb pointer-events-none"
        style={{ background:'radial-gradient(circle,#EA580C,transparent)', transform:`translate(${mouse.x*-30}px,${mouse.y*-20}px)`, transition:'transform 1.2s ease-out' }} />

      {/* NAV */}
      <motion.nav initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5"
        style={{ backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(245,158,11,.08)', background:'rgba(8,8,8,.6)' }}>
        <div className="font-display font-black text-xl text-gold-gradient">✦ Socially</div>
        <div className="flex items-center gap-8">
          {['Features','Platforms','AI Models','Pricing'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`}
              className="text-sm font-medium text-[#a89880] hover:text-[#F59E0B] transition-colors">{l}</a>
          ))}
        </div>
        <GoldButton size="sm" onClick={() => navigate('/dashboard')}>Launch App →</GoldButton>
      </motion.nav>

      {/* HERO */}
      <motion.section style={{ y:heroY, opacity:heroOpa }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20">

        <FloatCard className="left-[5%] top-[25%] animate-float" delay={0}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background:'rgba(225,48,108,.2)', color:'#E1306C' }}>ig</div>
            <div><div className="text-sm font-semibold">+2,847 followers</div><div className="text-xs text-[#665544]">Last 7 days</div></div>
          </div>
        </FloatCard>
        <FloatCard className="right-[5%] top-[32%] animate-float-b" delay={.2}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background:'rgba(29,161,242,.2)', color:'#1DA1F2' }}>𝕏</div>
            <div><div className="text-sm font-semibold">48.3K impressions</div><div className="text-xs text-[#665544]">Top post today</div></div>
          </div>
        </FloatCard>
        <FloatCard className="left-[8%] bottom-[28%] animate-float-c" delay={.4}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="text-sm font-semibold">AI generating post...</span>
          </div>
        </FloatCard>

        {/* Badge */}
        <motion.div initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:.1, duration:.8, ease:[.16,1,.3,1] }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-display font-semibold uppercase tracking-[1px] mb-8"
          style={{ background:'rgba(245,158,11,.12)', border:'1px solid rgba(245,158,11,.3)', color:'#FCD34D' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse-dot" />
          Now with Multi-AI support — GPT, Claude, Gemini
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity:0, y:60 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:.3, duration:1.2, ease:[.16,1,.3,1] }}
          className="font-display font-black leading-[.92] tracking-[-4px] mb-7"
          style={{ fontSize:'clamp(52px,9vw,100px)' }}>
          Command<br />
          <span className="text-gold-gradient">Every Feed.</span><br />
          <span className="text-outline">One Platform.</span>
        </motion.h1>

        <motion.p initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:.6, duration:1, ease:[.16,1,.3,1] }}
          className="text-lg text-[#a89880] max-w-[560px] mb-12 leading-relaxed font-light">
          The AI-powered social media command center for creators and brands. Schedule, create, and analyze across all platforms from one stunning workspace.
        </motion.p>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:.9, duration:.8 }}
          className="flex gap-4 items-center justify-center flex-wrap mb-20">
          <GoldButton size="lg" onClick={() => navigate('/dashboard')}>Start Free Trial →</GoldButton>
          <GhostButton size="lg">Watch Demo ▶</GhostButton>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.1, duration:.8 }}
          className="flex gap-16 items-center pt-10 border-t border-[rgba(245,158,11,.12)]">
          {[
            { num: c1 >= 1000000 ? (c1/1000000).toFixed(1)+'M+' : c1.toLocaleString(), label:'Posts Scheduled' },
            { num: c2 >= 1000    ? (c2/1000).toFixed(0)+'K+'    : c2,                   label:'Brands Managed' },
            { num: c3,                                                                    label:'Platforms' },
            { num: '99.9%',                                                               label:'Uptime' },
          ].map((s,i) => (
            <div key={i} className="text-center">
              <div className="font-display font-black text-4xl text-gold-gradient">{s.num}</div>
              <div className="text-xs uppercase tracking-[1px] text-[#665544] mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 py-28 px-16 bg-gradient-to-b from-transparent via-[#0e0e0e] to-[#0e0e0e]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Features</SectionLabel>
          <h2 className="font-display font-black text-5xl tracking-tight mb-5 leading-none">
            Everything you need to<br /><span className="text-gold-gradient">dominate social.</span>
          </h2>
          <p className="text-[#a89880] text-base max-w-md mb-14 leading-relaxed">
            From AI-powered content creation to deep analytics and cross-platform scheduling.
          </p>
          <motion.div initial="hidden" whileInView="show" viewport={{ once:true, margin:'-80px' }}
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:.08 } } }}
            className="grid grid-cols-3 rounded-3xl overflow-hidden border border-[rgba(245,158,11,.12)]">
            {[
              { icon:'🤖', title:'Multi-AI Content Engine',  desc:'Generate captions, threads, scripts using GPT-4, Claude, or Gemini — whichever fits your voice.' },
              { icon:'🗓️', title:'Smart Buffer Scheduling',  desc:'Visual drag-and-drop calendar with AI-optimized posting times for maximum engagement.' },
              { icon:'📊', title:'Unified Analytics',        desc:'Deep insights across all platforms. Track reach, engagement, conversions, and growth trends.' },
              { icon:'🎬', title:'Media Studio',             desc:'Upload, crop, resize, and optimize photos and videos for each platform\'s requirements.' },
              { icon:'⚡', title:'Cross-Platform Posting',   desc:'Write once, publish everywhere. Auto-adapts content format for every platform.' },
              { icon:'🔔', title:'Smart Inbox',              desc:'Unified comments, DMs, and mentions across all platforms in one feed.' },
            ].map((f,i) => (
              <motion.div key={i}
                variants={{ hidden:{ opacity:0, y:20 }, show:{ opacity:1, y:0 } }}
                whileHover={{ background:'#141414' }}
                className="bg-[#0e0e0e] p-10 transition-colors"
                style={{
                  borderRight:  i % 3 !== 2 ? '1px solid rgba(245,158,11,.08)' : 'none',
                  borderBottom: i < 3       ? '1px solid rgba(245,158,11,.08)' : 'none',
                }}>
                <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,.1)] flex items-center justify-center text-2xl mb-5">{f.icon}</div>
                <div className="font-display font-bold text-lg mb-2.5 text-[#f5f0e8]">{f.title}</div>
                <div className="text-sm text-[#a89880] leading-relaxed">{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section id="platforms" className="relative z-10 py-24 px-16 bg-[#0e0e0e] text-center">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>Integrations</SectionLabel>
          <h2 className="font-display font-black text-5xl tracking-tight mb-12 leading-none">
            Connect <span className="text-gold-gradient">every</span> platform
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PLATFORMS.map(p => (
              <motion.div key={p.id}
                whileHover={{ y:-3, borderColor:'rgba(245,158,11,.5)', background:'rgba(245,158,11,.06)' }}
                className="flex items-center gap-2.5 bg-[#141414] border border-[rgba(245,158,11,.2)] rounded-full px-5 py-3 text-sm font-medium transition-all">
                <span>{p.icon}</span>{p.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI MODELS */}
      <section id="ai-models" className="relative z-10 py-24 px-16 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>AI Models</SectionLabel>
          <h2 className="font-display font-black text-5xl tracking-tight mb-4 leading-none">
            Choose your <span className="text-gold-gradient">AI co-pilot</span>
          </h2>
          <p className="text-[#a89880] text-base max-w-md mb-12 leading-relaxed">Switch between models anytime. Each brings unique strengths.</p>
          <div className="grid grid-cols-5 gap-4">
            {AI_MODELS.map((ai, i) => (
              <motion.div key={ai.id}
                whileHover={{ y:-6, borderColor:'rgba(245,158,11,.5)' }}
                onClick={() => setActiveAI(i)}
                className="relative rounded-2xl p-6 text-center transition-all"
                style={{
                  background: activeAI===i ? 'rgba(245,158,11,.04)' : '#141414',
                  border: `1px solid ${activeAI===i ? 'rgba(245,158,11,.5)' : 'rgba(245,158,11,.12)'}`,
                  cursor:'pointer',
                }}>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center font-display font-black text-2xl"
                  style={{ background:`${ai.color}20`, color:ai.color }}>{ai.badge}</div>
                <div className="font-display font-bold text-[15px] mb-2">{ai.name}</div>
                <div className="text-xs text-[#a89880] leading-relaxed">{ai.desc}</div>
                {activeAI === i && <div className="mt-3 text-xs font-display font-semibold text-[#F59E0B]">✦ Active</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative z-10 py-24 px-16 bg-[#0e0e0e] text-center">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="font-display font-black text-5xl tracking-tight mb-4 leading-none">
            Simple, transparent <span className="text-gold-gradient">pricing</span>
          </h2>
          <p className="text-[#a89880] mb-14">Start free, scale as you grow. No surprises.</p>
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { tier:'Starter', price:'0',  period:'forever free', featured:false,
                feats:['3 social accounts','30 posts/month','Basic analytics','1 AI model','7-day buffer'] },
              { tier:'Pro',     price:'29', period:'per month',    featured:true,
                feats:['Unlimited accounts','Unlimited posts','Advanced analytics','All AI models','90-day buffer','Priority support','Team collaboration'] },
              { tier:'Agency',  price:'99', period:'per month',    featured:false,
                feats:['50 client workspaces','White-label reports','Custom AI fine-tuning','API access','Dedicated CSM','SLA guarantee','SSO + permissions'] },
            ].map(p => (
              <motion.div key={p.tier} whileHover={{ y:-4 }}
                className="relative rounded-3xl p-9 text-left overflow-hidden"
                style={{ background: p.featured ? 'linear-gradient(135deg,#141414,rgba(245,158,11,.04))' : '#141414', border:`1px solid ${p.featured ? '#F59E0B' : 'rgba(245,158,11,.15)'}` }}>
                {p.featured && <>
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:'linear-gradient(90deg,#EA580C,#F59E0B,#EA580C)' }} />
                  <span className="absolute top-4 right-4 text-black text-[10px] font-display font-black px-3 py-1 rounded-full uppercase tracking-wide"
                    style={{ background:'linear-gradient(135deg,#F59E0B,#EA580C)' }}>Most Popular</span>
                </>}
                <div className="text-xs uppercase tracking-[2px] font-display font-bold mb-3 text-[#F59E0B]">{p.tier}</div>
                <div className="font-display font-black text-5xl leading-none mb-1">
                  <sup className="text-xl align-top mt-2.5 text-[#a89880]">$</sup>{p.price}
                </div>
                <div className="text-sm text-[#a89880] mb-6">{p.period}</div>
                <ul className="space-y-2.5 mb-8">
                  {p.feats.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-[#a89880] pb-2.5 border-b border-[rgba(245,158,11,.06)]">
                      <span className="text-[10px] text-[#F59E0B]">✦</span>{f}
                    </li>
                  ))}
                </ul>
                {p.featured
                  ? <GoldButton className="w-full" onClick={() => navigate('/dashboard')}>Start Pro Trial →</GoldButton>
                  : <GhostButton className="w-full text-center" onClick={() => navigate('/dashboard')}>
                      {p.tier === 'Starter' ? 'Get Started Free' : 'Contact Sales'}
                    </GhostButton>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 flex items-center justify-between px-16 py-12 border-t border-[rgba(245,158,11,.1)]">
        <div className="font-display font-black text-xl text-gold-gradient">✦ Socially</div>
        <div className="text-sm text-[#665544]">© 2025 Socially Inc. Built for creators.</div>
        <div className="flex gap-6">
          {['Privacy','Terms','Twitter'].map(l => (
            <a key={l} href="#" className="text-sm text-[#665544] hover:text-[#F59E0B] transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
