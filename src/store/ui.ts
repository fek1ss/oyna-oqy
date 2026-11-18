import { create } from 'zustand'

interface UiState {
  /** Идёт озвучка — талисман «говорит». */
  speaking: boolean
  /** Было первое касание, звук разблокирован. */
  unlocked: boolean
  settingsOpen: boolean
  setSpeaking: (v: boolean) => void
  setUnlocked: (v: boolean) => void
  setSettingsOpen: (v: boolean) => void
}

export const useUi = create<UiState>()((set) => ({
  speaking: false,
  unlocked: false,
  settingsOpen: false,
  setSpeaking: (speaking) => set({ speaking }),
  setUnlocked: (unlocked) => set({ unlocked }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}))
