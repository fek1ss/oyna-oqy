import { useCallback, useEffect, useRef } from 'react'
import type { Speakable } from '../data/content'
import { speak, stopSpeech } from './audio'

/**
 * Озвучить экран при открытии. Возвращает функцию повтора (для талисмана).
 * Когда меняется `key`, фраза звучит снова.
 */
export function useScreenVoice(what: Speakable | Speakable[] | null, key: unknown = null) {
  const ref = useRef(what)
  ref.current = what
  useEffect(() => {
    if (ref.current) void speak(ref.current)
  }, [key])
  useEffect(() => () => stopSpeech(), [])
  return useCallback(() => {
    if (ref.current) void speak(ref.current)
  }, [])
}
