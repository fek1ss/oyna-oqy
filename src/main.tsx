import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App'
import { unlockAudio } from './audio/audio'
import './index.css'

// Первое касание разблокирует звук (политика автозапуска браузеров).
const unlock = () => {
  unlockAudio()
  window.removeEventListener('pointerdown', unlock, true)
  window.removeEventListener('keydown', unlock, true)
}
window.addEventListener('pointerdown', unlock, true)
window.addEventListener('keydown', unlock, true)

// Без контекстного меню на долгом нажатии и без жестового зума (iOS Safari).
window.addEventListener('contextmenu', (e) => e.preventDefault())
document.addEventListener('gesturestart', (e) => e.preventDefault())
document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false })

// Офлайн-режим: сервис-воркер обновляется сам.
registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
