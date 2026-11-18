import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Lang = 'kk' | 'ru'

interface SettingsState {
  lang: Lang
  sound: boolean
  setLang: (lang: Lang) => void
  setSound: (sound: boolean) => void
}

/** Настройки для взрослых. Хранятся в localStorage. По умолчанию — казахский и звук включён. */
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      lang: 'kk',
      sound: true,
      setLang: (lang) => set({ lang }),
      setSound: (sound) => set({ sound }),
    }),
    { name: 'oyna-oqy-settings', version: 1 },
  ),
)
