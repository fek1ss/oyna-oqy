import { motion, useReducedMotion } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'
import { useNavigate } from 'react-router'
import { sfx } from '../audio/sfx'
import { useScreenVoice } from '../audio/useScreenVoice'
import { IconCards, IconMemory, IconYurt } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import { SettingsLock } from '../components/Settings'
import { phrases } from '../data/content'
import { useUi } from '../store/ui'

const GAMES: { to: string; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; color: string }[] = [
  { to: '/cards', label: 'cards', Icon: IconCards, color: '#BFE0FA' },
  { to: '/yurt', label: 'yurt', Icon: IconYurt, color: '#FFE2B0' },
  { to: '/memory', label: 'memory', Icon: IconMemory, color: '#E4D4F7' },
]

export function Home() {
  const nav = useNavigate()
  const unlocked = useUi((s) => s.unlocked)
  const reduce = useReducedMotion()
  const replay = useScreenVoice(phrases.greeting)

  return (
    <div className="screen relative">
      <div className="absolute top-[max(0.5rem,env(safe-area-inset-top))] left-3 z-10">
        <SettingsLock />
      </div>

      <div className="flex-1 min-h-0 flex flex-col landscape:flex-row items-center justify-center gap-4 landscape:gap-8 p-4">
        {/* Персонаж + название */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="relative">
            <Mascot size="min(38vmin, 220px)" onTap={replay} />
            {!unlocked && !reduce && (
              // Подсказка «нажми»: пульсирующий круг вокруг персонажа до первого касания.
              <motion.div
                className="absolute inset-0 rounded-full border-8 border-amber-300 pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-amber-600 drop-shadow-sm">
            oyna<span className="text-sky-500">-</span>oqy
          </h1>
        </div>

        {/* Три игры */}
        <div className="flex portrait:flex-col landscape:flex-row gap-4 w-full max-w-3xl portrait:max-w-md flex-1 min-h-0 landscape:max-h-[min(60vh,320px)] portrait:max-h-[60vh]">
          {GAMES.map(({ to, label, Icon, color }, i) => (
            <motion.button
              key={to}
              type="button"
              aria-label={label}
              className="flex-1 min-h-16 min-w-16 rounded-[2rem] grid place-items-center shadow-[0_8px_0_rgba(0,0,0,0.10)] p-2"
              style={{ background: color }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                sfx.pop()
                nav(to)
              }}
            >
              <Icon className="h-full max-h-40 w-auto aspect-square" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
