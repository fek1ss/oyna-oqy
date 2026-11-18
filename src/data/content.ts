import raw from './content.json'
import type { Lang } from '../store/settings'

export type LangMap = Record<Lang, string>

/** Всё, что можно произнести: путь к аудио + текст для синтеза речи. */
export interface Speakable {
  audio: LangMap
  label: LangMap
}

export interface Item extends Speakable {
  id: string
  image: string
}

export interface Category extends Speakable {
  id: string
  icon: string
  color: string
  items: Item[]
}

export type PhraseId =
  | 'greeting' | 'cardsMenu' | 'find' | 'yurtIntro' | 'yurtDone'
  | 'memoryChooseSet' | 'memoryChooseLevel' | 'memoryIntro' | 'memoryDone'
  | 'praise1' | 'praise2' | 'praise3' | 'mixed'

interface Content {
  phrases: Record<PhraseId, Speakable>
  categories: Category[]
}

export const content = raw as Content
export const categories = content.categories
export const phrases = content.phrases

export const getCategory = (id: string | undefined) => categories.find((c) => c.id === id)
export const allItems = () => categories.flatMap((c) => c.items)
export const findItem = (id: string) => allItems().find((i) => i.id === id)

export const randomPraise = (): Speakable =>
  phrases[(['praise1', 'praise2', 'praise3'] as const)[Math.floor(Math.random() * 3)]]

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
