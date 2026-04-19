import { useState, useCallback, useEffect, useRef } from 'react'
import type { ToastItem } from '../types'

// ── useToast ──────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, icon = '✦') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, message, icon }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id))
  }, [])

  return { toasts, showToast, removeToast }
}

// ── useCursor ─────────────────────────────────────────────────────────────────
export function useCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef  = useRef<HTMLDivElement>(null)
  const mx = useRef(0); const my = useRef(0)
  const tx = useRef(0); const ty = useRef(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX; my.current = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top  = e.clientY + 'px'
      }
    }
    const tick = () => {
      tx.current += (mx.current - tx.current) * 0.12
      ty.current += (my.current - ty.current) * 0.12
      if (trailRef.current) {
        trailRef.current.style.left = tx.current + 'px'
        trailRef.current.style.top  = ty.current + 'px'
      }
      raf.current = requestAnimationFrame(tick)
    }
    document.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(tick)

    const onEnter = () => { cursorRef.current?.classList.add('hov'); trailRef.current?.classList.add('hov') }
    const onLeave = () => { cursorRef.current?.classList.remove('hov'); trailRef.current?.classList.remove('hov') }
    const bind = () => document.querySelectorAll('a,button,[role=button]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    bind()
    const obs = new MutationObserver(bind)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current); obs.disconnect() }
  }, [])

  return { cursorRef, trailRef }
}

// ── useAI ─────────────────────────────────────────────────────────────────────
export function useAI() {
  const [loading, setLoading] = useState(false)
  const [output,  setOutput]  = useState('')

  const generate = useCallback(async (prompt: string) => {
    setLoading(true); setOutput('')
    try {
      const res  = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      const text: string = data?.content?.[0]?.text ?? 'Generation failed.'
      let i = 0
      const iv = setInterval(() => {
        if (i >= text.length) { clearInterval(iv); setLoading(false); return }
        setOutput(text.slice(0, ++i))
      }, 12)
    } catch {
      setOutput('Generation failed. Please try again.')
      setLoading(false)
    }
  }, [])

  return { loading, output, generate, setOutput }
}

// ── useParallax ───────────────────────────────────────────────────────────────
export function useParallax() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const h = (e: MouseEvent) => setMouse({
      x: (e.clientX / window.innerWidth  - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    })
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])
  return mouse
}

// ── useCounter ────────────────────────────────────────────────────────────────
export function useCounter(end: number, duration = 2000, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      const steps = 60; let cur = 0
      const iv = setInterval(() => {
        cur += end / steps
        if (cur >= end) { setVal(end); clearInterval(iv) }
        else setVal(Math.floor(cur))
      }, duration / steps)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [end, duration, delay])
  return val
}
