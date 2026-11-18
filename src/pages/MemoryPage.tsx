import { useRef, useState, type MutableRefObject } from 'react'
import { useScreenVoice } from '../audio/useScreenVoice'
import { IconStar } from '../components/Icons'
import { Picture } from '../components/Picture'
import { TileGrid } from '../components/TileGrid'
import { TopBar } from '../components/TopBar'
import { categories, phrases } from '../data/content'
import { MemoryGame } from '../games/memory/MemoryGame'

type Step = { s: 'set' } | { s: 'level'; set: string } | { s: 'game'; set: string; pairs: number }

const LEVELS = [
  { pairs: 3, stars: 1, color: '#C8EBB8' },
  { pairs: 4, stars: 2, color: '#FFE2B0' },
  { pairs: 6, stars: 3, color: '#FFCFC0' },
]

/** Один шаг на экране: набор → сложность → игра. */
export default function MemoryPage() {
  const [step, setStep] = useState<Step>({ s: 'set' })
  const replayRef = useRef<() => void>(() => {})

  const back =
    step.s === 'set' ? '/' : step.s === 'level' ? () => setStep({ s: 'set' }) : () => setStep({ s: 'level', set: step.set })

  return (
    <div className="screen">
      <TopBar back={back} onMascot={() => replayRef.current()} />
      {step.s === 'set' && <ChooseSet replayRef={replayRef} onPick={(set) => setStep({ s: 'level', set })} />}
      {step.s === 'level' && (
        <ChooseLevel replayRef={replayRef} onPick={(pairs) => setStep({ s: 'game', set: step.set, pairs })} />
      )}
      {step.s === 'game' && <MemoryGame set={step.set} pairs={step.pairs} replayRef={replayRef} />}
    </div>
  )
}

type ReplayRef = MutableRefObject<() => void>

function ChooseSet({ onPick, replayRef }: { onPick: (set: string) => void; replayRef: ReplayRef }) {
  replayRef.current = useScreenVoice([phrases.memoryIntro, phrases.memoryChooseSet])
  return (
    <TileGrid
      tiles={[
        ...categories.map((c) => ({
          key: c.id,
          color: c.color,
          content: <Picture src={c.icon} className="w-full h-full rounded-[1.25rem]" />,
          onClick: () => onPick(c.id),
        })),
        {
          key: 'mixed',
          color: '#FFC93C',
          // «Смешанный» — коллаж из иконок всех категорий
          content: (
            <div className="grid grid-cols-3 gap-1 w-full h-full content-center">
              {categories.map((c) => (
                <Picture key={c.id} src={c.icon} className="w-full aspect-square rounded-lg" />
              ))}
            </div>
          ),
          onClick: () => onPick('mixed'),
        },
      ]}
    />
  )
}

function ChooseLevel({ onPick, replayRef }: { onPick: (pairs: number) => void; replayRef: ReplayRef }) {
  replayRef.current = useScreenVoice(phrases.memoryChooseLevel)
  return (
    <TileGrid
      max={240}
      tiles={LEVELS.map((l) => ({
        key: String(l.pairs),
        label: `${l.pairs} pairs`,
        color: l.color,
        content: (
          <div className="flex flex-wrap items-center justify-center w-full">
            {Array.from({ length: l.stars }, (_, i) => (
              <IconStar key={i} className="w-[45%] h-auto" />
            ))}
          </div>
        ),
        onClick: () => onPick(l.pairs),
      }))}
    />
  )
}
