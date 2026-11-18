import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { sfx } from '../audio/sfx'
import { useFitGrid } from './useFitGrid'

export interface Tile {
  key: string
  color: string
  content: ReactNode
  onClick: () => void
  label?: string
}

/** Сетка крупных квадратных плиток, которая сама подстраивается под экран и ориентацию. */
export function TileGrid({ tiles, max = 260 }: { tiles: Tile[]; max?: number }) {
  const gap = 16
  const { ref, fit } = useFitGrid<HTMLDivElement>(tiles.length, gap, max)
  return (
    <div ref={ref} className="flex-1 min-h-0 w-full p-4 pt-0 box-border">
      {fit.size > 0 && (
        <div
          className="grid h-full content-center justify-center"
          style={{ gridTemplateColumns: `repeat(${fit.cols}, ${fit.size}px)`, gridAutoRows: fit.size, gap }}
        >
          {tiles.map((t, i) => (
            <motion.button
              key={t.key}
              type="button"
              aria-label={t.label ?? t.key}
              className="rounded-[1.75rem] p-[6%] grid place-items-center shadow-[0_6px_0_rgba(0,0,0,0.12)] overflow-hidden"
              style={{ background: t.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                sfx.pop()
                t.onClick()
              }}
            >
              {t.content}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}
