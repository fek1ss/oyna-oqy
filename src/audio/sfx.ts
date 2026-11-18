// Короткие звуковые эффекты синтезируются через WebAudio — файлы не нужны.
import { useSettings } from '../store/settings'

let ctx: AudioContext | null = null

export function getAudioContext(): AudioContext | null {
  if (ctx) return ctx
  try {
    const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
    const AC = w.AudioContext || w.webkitAudioContext
    if (AC) ctx = new AC()
  } catch {
    ctx = null
  }
  return ctx
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.18) {
  const c = getAudioContext()
  if (!c || !useSettings.getState().sound) return
  try {
    const t = c.currentTime + start
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.connect(g).connect(c.destination)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  } catch {
    /* звук не обязателен */
  }
}

export const sfx = {
  /** Нажатие на кнопку. */
  pop: () => tone(660, 0, 0.09, 'triangle', 0.12),
  /** Переворот карточки. */
  flip: () => {
    tone(420, 0, 0.07, 'triangle', 0.1)
    tone(560, 0.05, 0.07, 'triangle', 0.08)
  },
  /** Верно. */
  success: () => {
    tone(659, 0, 0.14)
    tone(784, 0.1, 0.14)
    tone(1047, 0.2, 0.25)
  },
  /** Мягкий звук «не то» — без негатива. */
  soft: () => tone(300, 0, 0.18, 'sine', 0.1),
  /** Праздник. */
  fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22, 'triangle', 0.15)),
  /** Часть юрты встала на место. */
  snap: () => {
    tone(220, 0, 0.08, 'square', 0.06)
    tone(880, 0.06, 0.18)
  },
}
