import { useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { IconCards, IconSearch } from '../components/Icons'
import { RoundButton } from '../components/RoundButton'
import { TopBar } from '../components/TopBar'
import { getCategory } from '../data/content'
import { CardViewer } from '../games/cards/CardViewer'
import { FindMode } from '../games/cards/FindMode'

export default function CardsCategory() {
  const { id } = useParams()
  const category = getCategory(id)
  const [mode, setMode] = useState<'view' | 'find'>('view')
  // Игры регистрируют сюда функцию повтора — талисман её вызывает.
  const replayRef = useRef<() => void>(() => {})

  if (!category) return <Navigate to="/cards" replace />

  return (
    <div className="screen" style={{ background: `${category.color}22` }}>
      <TopBar back="/cards" onMascot={() => replayRef.current()}>
        <RoundButton
          label={mode === 'view' ? 'find mode' : 'view mode'}
          color={category.color}
          onClick={() => setMode(mode === 'view' ? 'find' : 'view')}
          className="text-white"
        >
          {mode === 'view' ? <IconSearch className="w-9 h-9" /> : <IconCards className="w-12 h-12" />}
        </RoundButton>
      </TopBar>
      {mode === 'view' ? (
        <CardViewer key={category.id} category={category} replayRef={replayRef} />
      ) : (
        <FindMode key={category.id} category={category} replayRef={replayRef} />
      )}
    </div>
  )
}
