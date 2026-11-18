import { MotionConfig } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { SettingsPanel } from './components/Settings'
import { Home } from './pages/Home'

// Игры грузятся отдельными чанками — главная открывается быстрее.
const CardsCategories = lazy(() => import('./pages/CardsCategories'))
const CardsCategory = lazy(() => import('./pages/CardsCategory'))
const YurtPage = lazy(() => import('./pages/YurtPage'))
const MemoryPage = lazy(() => import('./pages/MemoryPage'))

export function App() {
  return (
    // reducedMotion="user": при prefers-reduced-motion анимации трансформаций отключаются.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Suspense fallback={<div className="screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<CardsCategories />} />
            <Route path="/cards/:id" element={<CardsCategory />} />
            <Route path="/yurt" element={<YurtPage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <SettingsPanel />
      </BrowserRouter>
    </MotionConfig>
  )
}
