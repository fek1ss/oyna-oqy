import { useRef } from 'react'
import { TopBar } from '../components/TopBar'
import { YurtGame } from '../games/yurt/YurtGame'

export default function YurtPage() {
  const replayRef = useRef<() => void>(() => {})
  return (
    <div className="screen bg-gradient-to-b from-sky-100 to-[var(--bg)]">
      <TopBar back="/" onMascot={() => replayRef.current()} />
      <YurtGame replayRef={replayRef} />
    </div>
  )
}
