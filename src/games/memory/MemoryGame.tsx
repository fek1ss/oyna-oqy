import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import { useNavigate } from 'react-router'
import { speak } from '../../audio/audio'
import { sfx } from '../../audio/sfx'
import { Celebration } from '../../components/Celebration'
import { IconHome, IconReplay } from '../../components/Icons'
import { Picture } from '../../components/Picture'
import { RoundButton } from '../../components/RoundButton'
import { useFitGrid } from '../../components/useFitGrid'
import { allItems, getCategory, phrases, shuffle, type Item } from '../../data/content'

interface Card {
  uid: number
  item: Item
}

function makeDeck(set: string, pairs: number): Card[] {
  const cat = getCategory(set)
  let pool = shuffle(cat ? cat.items : allItems())
  // В категории может быть меньше предметов, чем пар (например, 3 инструмента) — добираем из остальных.
  if (pool.length < pairs) {
    const ids = new Set(pool.map((i) => i.id))
    pool = [...pool, ...shuffle(allItems().filter((i) => !ids.has(i.id)))]
  }
  const chosen = pool.slice(0, pairs)
  return shuffle([...chosen, ...chosen]).map((item, uid) => ({ uid, item }))
}

interface Props {
  set: string
  pairs: number
  replayRef: MutableRefObject<() => void>
}

/** Карточки рубашкой вверх. Без таймера и без проигрыша. */
export function MemoryGame({ set, pairs, replayRef }: Props) {
  const nav = useNavigate()
  const [round, setRound] = useState(0)
  const [deck, setDeck] = useState(() => makeDeck(set, pairs))
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [done, setDone] = useState(false)
  const lock = useRef(false)
  const timers = useRef<number[]>([])
  const { ref, fit } = useFitGrid<HTMLDivElement>(pairs * 2, 12, 220)
  const backColor = getCategory(set)?.color ?? '#FFB547'

  replayRef.current = () => void speak(phrases.memoryIntro)

  useEffect(() => {
    void speak(phrases.memoryIntro)
  }, [round])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  const restart = () => {
    timers.current.forEach(clearTimeout)
    lock.current = false
    setDeck(makeDeck(set, pairs))
    setOpen([])
    setMatched(new Set())
    setDone(false)
    setRound((r) => r + 1)
  }

  const flip = (idx: number) => {
    const card = deck[idx]
    if (lock.current || open.includes(idx) || matched.has(card.item.id)) return
    sfx.flip()
    void speak(card.item)
    const next = [...open, idx]
    setOpen(next)
    if (next.length < 2) return

    const [a, b] = next.map((i) => deck[i])
    if (a.item.id === b.item.id) {
      const m = new Set(matched).add(a.item.id)
      later(() => sfx.success(), 250)
      setMatched(m)
      setOpen([])
      if (m.size === pairs) {
        later(() => {
          setDone(true)
          sfx.fanfare()
          void speak(phrases.memoryDone)
        }, 900)
      }
    } else {
      // Не совпало: через секунду обе карточки переворачиваются обратно.
      lock.current = true
      later(() => {
        setOpen([])
        lock.current = false
      }, 1000)
    }
  }

  return (
    <>
    <div ref={ref} className="flex-1 min-h-0 w-full p-3 pt-0 box-border" style={{ perspective: 1000 }}>
      {fit.size > 0 && (
        <div
          className="grid h-full content-center justify-center"
          style={{ gridTemplateColumns: `repeat(${fit.cols}, ${fit.size}px)`, gridAutoRows: fit.size, gap: 12 }}
        >
          {deck.map((card, idx) => {
            const faceUp = open.includes(idx) || matched.has(card.item.id)
            return (
              <motion.button
                key={`${round}-${card.uid}`}
                type="button"
                aria-label={faceUp ? card.item.label.ru : 'card'}
                onClick={() => flip(idx)}
                className="relative"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ rotateY: 0, scale: 0.6, opacity: 0 }}
                animate={{ rotateY: faceUp ? 180 : 0, scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Рубашка */}
                <div
                  className="absolute inset-0 rounded-[1.5rem] grid place-items-center shadow-[0_6px_0_rgba(0,0,0,0.12)]"
                  style={{ background: backColor, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 opacity-80" aria-hidden>
                    <path
                      d="M50 80 V52 C50 30 22 22 16 40 C12 54 26 62 34 54 M50 52 C50 30 78 22 84 40 C88 54 74 62 66 54"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {/* Лицо */}
                <div
                  className="absolute inset-0 rounded-[1.5rem] bg-white p-1.5 shadow-[0_6px_0_rgba(0,0,0,0.12)]"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    outline: matched.has(card.item.id) ? '5px solid #6CBF4B' : undefined,
                  }}
                >
                  <Picture src={card.item.image} className="w-full h-full rounded-[1.1rem]" />
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>

      {done && (
        <Celebration>
          <RoundButton label="again" onClick={restart} size={96} color="#6CBF4B" className="text-white">
            <IconReplay className="w-12 h-12" />
          </RoundButton>
          <RoundButton label="home" onClick={() => nav('/')} size={96} color="#4FA3E0" className="text-white">
            <IconHome className="w-12 h-12" />
          </RoundButton>
        </Celebration>
      )}
    </>
  )
}
