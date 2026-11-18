import { useNavigate } from 'react-router'
import { useScreenVoice } from '../audio/useScreenVoice'
import { Picture } from '../components/Picture'
import { TileGrid } from '../components/TileGrid'
import { TopBar } from '../components/TopBar'
import { categories, phrases } from '../data/content'

export default function CardsCategories() {
  const nav = useNavigate()
  const replay = useScreenVoice(phrases.cardsMenu)

  return (
    <div className="screen">
      <TopBar back="/" onMascot={replay} />
      <TileGrid
        tiles={categories.map((c) => ({
          key: c.id,
          color: c.color,
          content: <Picture src={c.icon} className="w-full h-full rounded-[1.25rem]" />,
          onClick: () => nav(`/cards/${c.id}`),
        }))}
      />
    </div>
  )
}
