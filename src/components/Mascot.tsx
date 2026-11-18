// Оригинальный талисман-проводник «Күнекей»: круглое солнышко в тақия.
// Рот двигается, пока идёт озвучка. Нажатие повторяет фразу экрана.
import { motion, useReducedMotion } from 'framer-motion'
import { useUi } from '../store/ui'
import { sfx } from '../audio/sfx'

interface Props {
  size?: number | string
  onTap?: () => void
  className?: string
}

export function Mascot({ size = 72, onTap, className = '' }: Props) {
  const speaking = useUi((s) => s.speaking)
  const reduce = useReducedMotion()

  return (
    <motion.button
      type="button"
      aria-label="mascot"
      onClick={() => {
        sfx.pop()
        onTap?.()
      }}
      whileTap={{ scale: 0.9 }}
      className={`shrink-0 rounded-full touch-manipulation ${className}`}
      style={{ width: size, height: size, minWidth: 64, minHeight: 64 }}
    >
      <motion.svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* лучики */}
        <g stroke="#FFB547" strokeWidth="7" strokeLinecap="round">
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2
            return (
              <line
                key={i}
                x1={60 + Math.cos(a) * 50}
                y1={66 + Math.sin(a) * 50}
                x2={60 + Math.cos(a) * 58}
                y2={66 + Math.sin(a) * 58}
              />
            )
          })}
        </g>
        {/* тело */}
        <circle cx="60" cy="66" r="42" fill="#FFD25A" stroke="#E79A1E" strokeWidth="4" />
        {/* тақия */}
        <path d="M30 46 Q32 14 60 14 Q88 14 90 46 Z" fill="#D9483B" stroke="#8E241B" strokeWidth="3" />
        <path d="M30 46 H90" stroke="#8E241B" strokeWidth="5" strokeLinecap="round" />
        <g fill="#FFD25A">
          <circle cx="60" cy="28" r="5" />
          <circle cx="44" cy="36" r="3.5" />
          <circle cx="76" cy="36" r="3.5" />
        </g>
        {/* глаза с морганием */}
        <motion.g
          style={{ originY: '64px' }}
          animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1] }}
          transition={{ duration: 4, times: [0, 0.92, 0.96, 1], repeat: Infinity }}
        >
          <ellipse cx="46" cy="64" rx="6" ry="8" fill="#3A2A1A" />
          <ellipse cx="74" cy="64" rx="6" ry="8" fill="#3A2A1A" />
          <circle cx="48" cy="61" r="2.2" fill="#fff" />
          <circle cx="76" cy="61" r="2.2" fill="#fff" />
        </motion.g>
        {/* щёчки */}
        <circle cx="36" cy="78" r="6" fill="#FF8C7A" opacity=".7" />
        <circle cx="84" cy="78" r="6" fill="#FF8C7A" opacity=".7" />
        {/* рот */}
        {speaking ? (
          <motion.ellipse
            cx="60"
            cy="86"
            rx="9"
            fill="#8E241B"
            initial={{ ry: 3 }}
            animate={{ ry: [3, 8, 4, 7, 3] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
        ) : (
          <path d="M48 82 Q60 94 72 82" stroke="#8E241B" strokeWidth="4" fill="none" strokeLinecap="round" />
        )}
      </motion.svg>
    </motion.button>
  )
}
