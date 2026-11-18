import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { speak } from '../../audio/audio'
import { sfx } from '../../audio/sfx'
import { IconBack, IconNext } from '../../components/Icons'
import { Picture } from '../../components/Picture'
import { RoundButton } from '../../components/RoundButton'
import { useFitGrid } from '../../components/useFitGrid'
import type { Category } from '../../data/content'

interface Props {
  category: Category
  replayRef: MutableRefObject<() => void>
}

const SWIPE = 70

/** Одна большая карточка: стрелки, свайп, голос при появлении и касании. */
export function CardViewer({ category, replayRef }: Props) {
  const items = category.items
  const [[index, dir], setState] = useState<[number, number]>([0, 0])
  const moved = useRef(false)
  const item = items[index]
  const { ref, fit } = useFitGrid<HTMLDivElement>(1, 0, 640)

  useEffect(() => {
    // При открытии категории — её название и первый предмет; дальше — только предмет.
    void speak(moved.current ? item : [category, item])
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  replayRef.current = () => void speak(item)

  const go = (d: number) => {
    sfx.flip()
    moved.current = true
    setState(([i]) => [(i + d + items.length) % items.length, d])
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE || info.velocity.x < -500) go(1)
    else if (info.offset.x > SWIPE || info.velocity.x > 500) go(-1)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3 pb-4">
      {/* Горизонтально: стрелки по бокам. Вертикально: карточка во всю ширину, стрелки под ней. */}
      <div className="flex-1 min-h-0 w-full px-3 landscape:flex landscape:items-center landscape:justify-center landscape:gap-6 portrait:grid portrait:grid-cols-2 portrait:grid-rows-[minmax(0,1fr)_auto] portrait:gap-x-10 portrait:gap-y-4">
        <RoundButton
          label="previous"
          onClick={() => go(-1)}
          size={80}
          className="portrait:row-start-2 portrait:col-start-1 portrait:justify-self-end"
        >
          <IconBack className="w-10 h-10" />
        </RoundButton>

        <div
          ref={ref}
          className="relative h-full w-full flex-1 min-w-0 min-h-0 grid place-items-center overflow-visible portrait:col-span-2 portrait:row-start-1"
        >
          {fit.size > 0 && <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.button
              key={item.id}
              type="button"
              aria-label={item.label.ru}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d * 300, opacity: 0, rotate: d * 8 }),
                center: { x: 0, opacity: 1, rotate: 0 },
                exit: (d: number) => ({ x: d * -300, opacity: 0, rotate: d * -8 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={onDragEnd}
              whileTap={{ scale: 0.97 }}
              onTap={() => void speak(item)}
              className="rounded-[2.5rem] bg-white p-3 shadow-[0_10px_0_rgba(0,0,0,0.10)] touch-pan-y"
              style={{ width: fit.size, height: fit.size, border: `8px solid ${category.color}` }}
            >
              <Picture src={item.image} className="w-full h-full rounded-[1.75rem]" />
            </motion.button>
          </AnimatePresence>}
        </div>

        <RoundButton
          label="next"
          onClick={() => go(1)}
          size={80}
          className="portrait:row-start-2 portrait:col-start-2 portrait:justify-self-start"
        >
          <IconNext className="w-10 h-10" />
        </RoundButton>
      </div>

      {/* Точки — сколько карточек и где мы */}
      <div className="flex gap-2 shrink-0" aria-hidden>
        {items.map((it, i) => (
          <span
            key={it.id}
            className="w-3 h-3 rounded-full transition-all"
            style={{ background: i === index ? category.color : '#00000022', transform: i === index ? 'scale(1.4)' : undefined }}
          />
        ))}
      </div>
    </div>
  )
}
