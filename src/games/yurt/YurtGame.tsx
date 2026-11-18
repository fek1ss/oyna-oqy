import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent as RPointerEvent } from 'react'
import { useNavigate } from 'react-router'
import { speak } from '../../audio/audio'
import { sfx } from '../../audio/sfx'
import { Celebration } from '../../components/Celebration'
import { IconHome, IconReplay } from '../../components/Icons'
import { RoundButton } from '../../components/RoundButton'
import { useFitGrid } from '../../components/useFitGrid'
import { findItem, phrases, shuffle } from '../../data/content'
import { DRAW_ORDER, GROUND_Y, ORDER, PARTS, VIEWBOX, type PartId } from './parts'

const DROP_PAD = 36 // запас вокруг цели (в единицах сцены): малышам трудно попасть точно
const MOVE_THRESHOLD = 14 // пикселей; меньше — это касание, а не перетаскивание

const partVoice = (id: PartId) => findItem(id)

interface Props {
  replayRef: MutableRefObject<() => void>
}

export function YurtGame({ replayRef }: Props) {
  const nav = useNavigate()
  const svgRef = useRef<SVGSVGElement>(null)
  const [round, setRound] = useState(0)
  const [step, setStep] = useState(0) // сколько частей уже собрано
  const [errors, setErrors] = useState(0) // ошибок на текущем шаге
  const [tray, setTray] = useState<PartId[]>(() => shuffle(ORDER))
  const [done, setDone] = useState(false)
  const timers = useRef<number[]>([])
  const { ref: trayRef, fit } = useFitGrid<HTMLDivElement>(4, 12, 170)

  const next = ORDER[step] as PartId | undefined
  const placed = new Set(ORDER.slice(0, step))

  replayRef.current = () => void speak(phrases.yurtIntro)
  useEffect(() => {
    void speak(phrases.yurtIntro)
  }, [round])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /** Возвращает true, если часть встала на место. */
  const onDrop = (id: PartId, clientX: number, clientY: number, moved: boolean): boolean => {
    if (!moved) {
      // Просто коснулись — называем часть.
      const v = partVoice(id)
      if (v) void speak(v)
      return false
    }
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!svg || !ctm || !next) return false
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    const { x, y, w, h } = PARTS[next].hit
    const inside = pt.x >= x - DROP_PAD && pt.x <= x + w + DROP_PAD && pt.y >= y - DROP_PAD && pt.y <= y + h + DROP_PAD

    if (id === next && inside) {
      sfx.snap()
      const v = partVoice(id)
      if (v) void speak(v)
      setErrors(0)
      const s = step + 1
      setStep(s)
      if (s === ORDER.length) {
        timers.current.push(
          window.setTimeout(() => {
            setDone(true)
            sfx.fanfare()
            void speak(phrases.yurtDone)
          }, 900),
        )
      }
      return true
    }
    // Ошибка: часть мягко вернётся в лоток, подсветка станет заметнее.
    sfx.soft()
    setErrors((e) => e + 1)
    return false
  }

  const restart = () => {
    timers.current.forEach(clearTimeout)
    setStep(0)
    setErrors(0)
    setTray(shuffle(ORDER))
    setDone(false)
    setRound((r) => r + 1)
  }

  return (
    <>
      <div className="flex-1 min-h-0 flex portrait:flex-col landscape:flex-row gap-2 px-3 pb-3">
        {/* Сцена */}
        <div className="flex-1 min-h-0 min-w-0 grid place-items-center">
          <svg ref={svgRef} viewBox={VIEWBOX} className="w-full h-full max-h-full" preserveAspectRatio="xMidYMid meet">
            {/* солнце, трава, земля */}
            <circle cx="350" cy="50" r="26" fill="#FFD25A" />
            <ellipse cx="200" cy={GROUND_Y + 10} rx="196" ry="20" fill="#9FD67F" />
            <line x1="20" y1={GROUND_Y} x2="380" y2={GROUND_Y} stroke="#6CA24F" strokeWidth="5" strokeLinecap="round" />

            {/* пустые места */}
            {ORDER.filter((id) => !placed.has(id) && id !== next).map((id) => {
              const { Slot } = PARTS[id]
              return <Slot key={id} />
            })}

            {/* собранные части */}
            {DRAW_ORDER.filter((id) => placed.has(id)).map((id) => {
              const { Shape } = PARTS[id]
              return (
                <motion.g
                  key={`${round}-${id}`}
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                >
                  <Shape />
                </motion.g>
              )
            })}

            {/* подсветка следующего места — поверх всего */}
            {next &&
              (() => {
                const { Slot } = PARTS[next]
                return (
                  <g
                    className={errors >= 2 ? 'slot-blink' : 'slot-next'}
                    style={{ pointerEvents: 'none', filter: 'drop-shadow(0 0 6px #FFC93C)' }}
                  >
                    <Slot highlight />
                  </g>
                )
              })()}
          </svg>
        </div>

        {/* Лоток с частями */}
        <div
          ref={trayRef}
          className="shrink-0 portrait:h-[26%] portrait:w-full landscape:w-[34%] landscape:h-full rounded-[2rem] bg-amber-100/70 p-2 box-border"
        >
          {fit.size > 0 && (
            <div
              className="grid h-full content-center justify-center"
              style={{ gridTemplateColumns: `repeat(${fit.cols}, ${fit.size}px)`, gridAutoRows: fit.size, gap: 12 }}
            >
              {tray.map((id) =>
                placed.has(id) ? (
                  <div key={`${round}-${id}`} />
                ) : (
                  <TrayPiece key={`${round}-${id}`} id={id} onDrop={onDrop} />
                ),
              )}
            </div>
          )}
        </div>
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

/** Часть в лотке. Перетаскивание на Pointer Events — одинаково мышью и пальцем. */
function TrayPiece({
  id,
  onDrop,
}: {
  id: PartId
  onDrop: (id: PartId, x: number, y: number, moved: boolean) => boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const start = useRef<{ x: number; y: number; pid: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const { Shape, trayBox } = PARTS[id]

  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if (start.current) return // второй палец игнорируем
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX - x.get(), y: e.clientY - y.get(), pid: e.pointerId }
    setDragging(true)
  }
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    if (!start.current || e.pointerId !== start.current.pid) return
    x.set(e.clientX - start.current.x)
    y.set(e.clientY - start.current.y)
  }
  const up = (e: RPointerEvent<HTMLDivElement>, cancelled = false) => {
    if (!start.current || e.pointerId !== start.current.pid) return
    start.current = null
    const moved = Math.hypot(x.get(), y.get()) > MOVE_THRESHOLD
    const ok = !cancelled && onDrop(id, e.clientX, e.clientY, moved)
    if (!ok) {
      // мягко возвращаемся на место
      void animate(x, 0, { type: 'spring', stiffness: 220, damping: 20 })
      void animate(y, 0, { type: 'spring', stiffness: 220, damping: 20 })
    }
    setDragging(false)
  }

  return (
    <motion.div
      role="button"
      aria-label={id}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={(e) => up(e)}
      onPointerCancel={(e) => up(e, true)}
      className="relative rounded-[1.5rem] bg-white shadow-[0_6px_0_rgba(0,0,0,0.12)] grid place-items-center p-2 touch-none cursor-grab"
      style={{ x, y, zIndex: dragging ? 50 : 1 }}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: dragging ? 1.12 : 1, opacity: 1 }}
    >
      <svg viewBox={trayBox} className="w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
        <Shape />
      </svg>
    </motion.div>
  )
}
