import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { sfx } from '../audio/sfx'

interface Props {
  onClick: () => void
  children: ReactNode
  label: string
  color?: string
  size?: number
  className?: string
}

/** Круглая кнопка-иконка. Не меньше 64 px. `label` — только для скринридеров. */
export function RoundButton({ onClick, children, label, color = '#FFFFFF', size = 72, className = '' }: Props) {
  const s = Math.max(64, size)
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      onClick={() => {
        sfx.pop()
        onClick()
      }}
      className={`shrink-0 grid place-items-center rounded-full shadow-[0_6px_0_rgba(0,0,0,0.12)] text-slate-700 ${className}`}
      style={{ width: s, height: s, background: color }}
    >
      {children}
    </motion.button>
  )
}
