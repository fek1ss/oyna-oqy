import { motion, useAnimationControls } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'
import { speak } from '../../audio/audio'
import { sfx } from '../../audio/sfx'
import { IconSpeaker } from '../../components/Icons'
import { Picture } from '../../components/Picture'
import { RoundButton } from '../../components/RoundButton'
import { useFitGrid } from '../../components/useFitGrid'
import { allItems, phrases, randomPraise, shuffle, type Category, type Item } from '../../data/content'

interface Props {
  category: Category
  replayRef: MutableRefObject<() => void>
}

interface Round {
  target: Item
  options: Item[]
}

function makeRound(category: Category, prev?: Item): Round {
  const pool = category.items.filter((i) => i.id !== prev?.id)
  const target = pool[Math.floor(Math.random() * pool.length)]
  let others = shuffle(category.items.filter((i) => i.id !== target.id)).slice(0, 2)
  // Если в категории мало предметов — добираем из других.
  if (others.length < 2) {
    const extra = shuffle(allItems().filter((i) => i.id !== target.id && !others.includes(i)))
    others = [...others, ...extra].slice(0, 2)
  }
  return { target, options: shuffle([target, ...others]) }
}

/** «Найди»: голос называет слово, ребёнок выбирает одну из трёх картинок. */
export function FindMode({ category, replayRef }: Props) {
  const [round, setRound] = useState<Round>(() => makeRound(category))
  const [solved, setSolved] = useState(false)
  const { ref, fit } = useFitGrid<HTMLDivElement>(3, 16, 300)

  const prompt = useCallback(() => void speak([phrases.find, round.target]), [round])
  replayRef.current = prompt

  useEffect(() => {
    setSolved(false)
    prompt()
  }, [prompt])

  const onCorrect = () => {
    setSolved(true)
    sfx.success()
    void speak([round.target, randomPraise()])
    window.setTimeout(() => setRound((r) => makeRound(category, r.target)), 1800)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center gap-2 pb-4">
      <RoundButton label="repeat" onClick={prompt} color={category.color} className="text-white">
        <IconSpeaker className="w-10 h-10" />
      </RoundButton>
      <div ref={ref} className="flex-1 min-h-0 w-full px-4">
        {fit.size > 0 && (
          <div
            className="grid h-full content-center justify-center"
            style={{ gridTemplateColumns: `repeat(${fit.cols}, ${fit.size}px)`, gridAutoRows: fit.size, gap: 16 }}
          >
            {round.options.map((item) => (
              <Option
                key={`${round.target.id}-${item.id}`}
                item={item}
                color={category.color}
                correct={item.id === round.target.id}
                solved={solved}
                onCorrect={onCorrect}
                onWrong={() => {
                  sfx.soft()
                  void speak(round.target) // мягкая подсказка: ещё раз называем слово
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Option({
  item,
  color,
  correct,
  solved,
  onCorrect,
  onWrong,
}: {
  item: Item
  color: string
  correct: boolean
  solved: boolean
  onCorrect: () => void
  onWrong: () => void
}) {
  const controls = useAnimationControls()
  const busy = useRef(false)

  useEffect(() => {
    void controls.start({ opacity: 1, scale: 1 })
  }, [controls])

  const onTap = async () => {
    if (solved || busy.current) return
    busy.current = true
    if (correct) {
      onCorrect()
      await controls.start({ scale: [1, 1.15, 1.05], rotate: [0, -4, 4, 0], transition: { duration: 0.6 } })
    } else {
      onWrong()
      // Картинка слегка трясётся — без слова «неправильно».
      await controls.start({ x: [0, -12, 12, -8, 8, 0], transition: { duration: 0.45 } })
    }
    busy.current = false
  }

  return (
    <motion.button
      type="button"
      aria-label={item.label.ru}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={controls}
      whileTap={{ scale: 0.94 }}
      onClick={onTap}
      className="rounded-[2rem] bg-white p-2 shadow-[0_8px_0_rgba(0,0,0,0.10)] transition-[border-color,opacity] duration-300"
      style={{
        border: `6px solid ${solved && correct ? '#6CBF4B' : color}`,
        opacity: solved && !correct ? 0.35 : 1,
      }}
    >
      <Picture src={item.image} className="w-full h-full rounded-[1.4rem]" />
    </motion.button>
  )
}
