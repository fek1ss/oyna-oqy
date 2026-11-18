import { motion, useReducedMotion } from 'framer-motion'
import { useMemo, type ReactNode } from 'react'
import { IconStar } from './Icons'

const COLORS = ['#EF6F4B', '#F2A541', '#6CBF4B', '#4FA3E0', '#9B6BD6', '#E0559A', '#FFC93C']

/** Праздничный экран поверх игры: конфетти, звёзды и кнопки-иконки. */
export function Celebration({ children }: { children?: ReactNode }) {
  const reduce = useReducedMotion()
  const pieces = useMemo(
    () =>
      Array.from({ length: reduce ? 0 : 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.8,
        rot: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
        size: 10 + Math.random() * 12,
        round: Math.random() > 0.5,
      })),
    [reduce],
  )

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-white/70 backdrop-blur-[2px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? '50%' : 3,
          }}
          initial={{ y: -40, rotate: 0 }}
          animate={{ y: '110vh', rotate: p.rot }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <div className="flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 + i * 0.15, stiffness: 260, damping: 12 }}
          >
            <IconStar className={i === 1 ? 'w-32 h-32' : 'w-24 h-24'} />
          </motion.div>
        ))}
      </div>
      <div className="relative flex gap-6">{children}</div>
    </motion.div>
  )
}
