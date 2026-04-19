import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage   from './components/landing/LandingPage'
import DashboardPage from './pages/DashboardPage'
import { useCursor } from './hooks'

// Custom cursor rendered at root level so it overlays everything
const CursorLayer: React.FC = () => {
  const { cursorRef, trailRef } = useCursor()
  return (
    <>
      <div id="socially-cursor" ref={cursorRef} />
      <div id="socially-trail"  ref={trailRef}  />
    </>
  )
}

const App: React.FC = () => {
  // Ensure dark class is always on <html>
  useEffect(() => { document.documentElement.classList.add('dark') }, [])

  return (
    <BrowserRouter>
      <CursorLayer />
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
