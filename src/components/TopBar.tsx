import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { IconBack, IconHome } from './Icons'
import { Mascot } from './Mascot'
import { RoundButton } from './RoundButton'

interface Props {
  /** Куда ведёт кнопка «назад». По умолчанию — домой. */
  back?: string | (() => void)
  /** Повтор озвучки экрана по нажатию на талисман. */
  onMascot?: () => void
  /** Дополнительные кнопки по центру. */
  children?: ReactNode
}

export function TopBar({ back = '/', onMascot, children }: Props) {
  const nav = useNavigate()
  const isHome = back === '/'
  return (
    <div className="flex items-center justify-between gap-3 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 shrink-0">
      <RoundButton
        label={isHome ? 'home' : 'back'}
        onClick={() => (typeof back === 'function' ? back() : nav(back))}
      >
        {isHome ? <IconHome className="w-9 h-9" /> : <IconBack className="w-9 h-9" />}
      </RoundButton>
      <div className="flex items-center gap-3">{children}</div>
      <Mascot size={72} onTap={onMascot} />
    </div>
  )
}
