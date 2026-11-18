// Настройки для взрослых: открываются удержанием шестерёнки 3 секунды.
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { hasVoice } from '../audio/audio'
import { useSettings, type Lang } from '../store/settings'
import { useUi } from '../store/ui'
import { FlagKZ, FlagRU, IconClose, IconGear, IconMute, IconSpeaker } from './Icons'

const HOLD_MS = 3000

/** Шестерёнка с «замком для взрослых»: держать 3 секунды, по кругу бежит индикатор. */
export function SettingsLock() {
  const open = useUi((s) => s.setSettingsOpen)
  const [holding, setHolding] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const start = () => {
    setHolding(true)
    timer.current = window.setTimeout(() => {
      setHolding(false)
      open(true)
    }, HOLD_MS)
  }
  const cancel = () => {
    setHolding(false)
    window.clearTimeout(timer.current)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      aria-label="settings (hold 3 seconds)"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      className="relative grid place-items-center w-16 h-16 rounded-full text-slate-400 bg-white/60 touch-none"
    >
      <IconGear className="w-8 h-8" />
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90 pointer-events-none">
        <motion.circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="#F2A541"
          strokeWidth="5"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: holding ? 1 : 0, opacity: holding ? 1 : 0 }}
          transition={{ duration: holding ? HOLD_MS / 1000 : 0.2, ease: 'linear' }}
        />
      </svg>
    </button>
  )
}

const LANGS: { id: Lang; name: string; Flag: typeof FlagKZ }[] = [
  { id: 'kk', name: 'Қазақша', Flag: FlagKZ },
  { id: 'ru', name: 'Русский', Flag: FlagRU },
]

/** Панель настроек поверх любого экрана. */
export function SettingsPanel() {
  const isOpen = useUi((s) => s.settingsOpen)
  const close = () => useUi.getState().setSettingsOpen(false)
  const { lang, sound, setLang, setSound } = useSettings()
  const [voices, setVoices] = useState<Record<Lang, boolean> | null>(null)

  useEffect(() => {
    if (!isOpen) return
    void Promise.all([hasVoice('kk'), hasVoice('ru')]).then(([kk, ru]) => setVoices({ kk, ru }))
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-md rounded-[2rem] bg-white p-6 pt-20 shadow-2xl flex flex-col gap-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="close"
              onClick={close}
              className="absolute top-3 right-3 grid place-items-center w-16 h-16 rounded-full bg-slate-100 text-slate-600"
            >
              <IconClose className="w-8 h-8" />
            </button>

            <div className="grid grid-cols-2 gap-3">
              {LANGS.map(({ id, name, Flag }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLang(id)}
                  className={`flex flex-col items-center gap-2 rounded-3xl p-4 min-h-16 border-4 transition-colors ${
                    lang === id ? 'border-amber-400 bg-amber-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <Flag className="w-16 h-auto" />
                  <span className="text-lg font-semibold text-slate-700">{name}</span>
                  {voices && !voices[id] && (
                    <span className="text-xs text-slate-400 text-center leading-tight">
                      {id === 'kk' ? 'Жүйеде дауыс жоқ — аудиофайлдар керек' : 'Нет системного голоса — нужны аудиофайлы'}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSound(!sound)}
              className={`flex items-center justify-center gap-3 rounded-3xl p-4 min-h-16 border-4 ${
                sound ? 'border-green-400 bg-green-50 text-green-700' : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              {sound ? <IconSpeaker className="w-10 h-10" /> : <IconMute className="w-10 h-10" />}
              <span className="text-lg font-semibold">{sound ? 'Дыбыс / Звук: ON' : 'Дыбыс / Звук: OFF'}</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
