// Озвучка: 1) аудиофайл через Howler; 2) если файла нет — speechSynthesis (kk-KZ / ru-RU);
// 3) если подходящего голоса нет — тишина. Наружу исключения не бросаются.
import { Howl, Howler } from 'howler'
import type { Speakable } from '../data/content'
import { useSettings, type Lang } from '../store/settings'
import { useUi } from '../store/ui'
import { getAudioContext } from './sfx'

const howls = new Map<string, Howl>()
const failed = new Set<string>()
let currentHowl: Howl | null = null
let token = 0
let pending: Speakable[] | null = null

// ---------- Аудиофайлы (лениво, по первому запросу) ----------

function loadHowl(src: string | undefined): Promise<Howl | null> {
  if (!src || failed.has(src)) return Promise.resolve(null)
  const cached = howls.get(src)
  if (cached?.state() === 'loaded') return Promise.resolve(cached)
  return new Promise((resolve) => {
    const h = cached ?? new Howl({ src: [src], preload: true })
    howls.set(src, h)
    let done = false
    const finish = (ok: boolean) => {
      if (done) return
      done = true
      if (!ok) {
        failed.add(src)
        howls.delete(src)
        try {
          h.unload()
        } catch {
          /* ignore */
        }
      }
      resolve(ok ? h : null)
    }
    h.once('load', () => finish(true))
    h.once('loaderror', () => finish(false))
    setTimeout(() => finish(h.state() === 'loaded'), 5000)
  })
}

function playHowl(h: Howl, my: number): Promise<void> {
  return new Promise((resolve) => {
    if (my !== token) return resolve()
    currentHowl = h
    const id = h.play()
    const end = () => resolve()
    h.once('end', end, id)
    h.once('stop', end, id)
    h.once('playerror', end, id)
    setTimeout(end, 15000)
  })
}

// ---------- Синтез речи ----------

const synth: SpeechSynthesis | null =
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null

function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  if (!synth) return Promise.resolve([])
  const v = synth.getVoices()
  if (v.length) return Promise.resolve(v)
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(synth.getVoices()), 1200)
    synth.addEventListener(
      'voiceschanged',
      () => {
        clearTimeout(t)
        resolve(synth.getVoices())
      },
      { once: true },
    )
  })
}

const BCP: Record<Lang, string> = { kk: 'kk-KZ', ru: 'ru-RU' }

/** Есть ли в системе голос для языка (для подсказки в настройках). */
export async function hasVoice(lang: Lang): Promise<boolean> {
  const voices = await voicesReady()
  return voices.some((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang))
}

async function speakTTS(text: string | undefined, lang: Lang, my: number): Promise<void> {
  if (!synth || !text) return
  const voices = await voicesReady()
  if (my !== token) return
  const voice = voices.find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang))
  // Список голосов известен, а нужного языка нет — молчим (не читаем чужим акцентом).
  if (voices.length && !voice) return
  return new Promise((resolve) => {
    try {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = BCP[lang]
      if (voice) u.voice = voice
      u.rate = 0.9
      u.pitch = 1.1
      const done = () => resolve()
      u.onend = done
      u.onerror = done
      synth.speak(u)
      setTimeout(done, 8000)
    } catch {
      resolve()
    }
  })
}

// ---------- Публичный API ----------

/** Остановить текущую озвучку. */
export function stopSpeech() {
  token++
  pending = null
  try {
    currentHowl?.stop()
  } catch {
    /* ignore */
  }
  currentHowl = null
  try {
    synth?.cancel()
  } catch {
    /* ignore */
  }
  useUi.getState().setSpeaking(false)
}

/**
 * Произнести одну или несколько фраз подряд на выбранном языке.
 * До первого касания экрана фраза откладывается и звучит сразу после него.
 */
export async function speak(what: Speakable | Speakable[]): Promise<void> {
  const list = Array.isArray(what) ? what : [what]
  stopSpeech()
  const { sound, lang } = useSettings.getState()
  if (!sound || !list.length) return
  if (!useUi.getState().unlocked) {
    pending = list
    return
  }
  const my = token
  useUi.getState().setSpeaking(true)
  try {
    // Chrome иногда «теряет» фразу сразу после cancel() — даём ему вдохнуть.
    await new Promise((r) => setTimeout(r, 60))
    for (const s of list) {
      if (my !== token) return
      const h = await loadHowl(s.audio?.[lang])
      if (my !== token) return
      if (h) await playHowl(h, my)
      else await speakTTS(s.label?.[lang], lang, my)
    }
  } catch {
    /* озвучка не должна ломать игру */
  } finally {
    if (my === token) useUi.getState().setSpeaking(false)
  }
}

/** Вызывается на первое касание: снимает браузерную блокировку автозвука. */
export function unlockAudio() {
  if (useUi.getState().unlocked) return
  try {
    void getAudioContext()?.resume()
  } catch {
    /* ignore */
  }
  try {
    void (Howler.ctx as AudioContext | undefined)?.resume()
  } catch {
    /* ignore */
  }
  try {
    // iOS: первый вызов синтеза должен случиться внутри жеста пользователя.
    if (synth) {
      const u = new SpeechSynthesisUtterance(' ')
      u.volume = 0
      synth.speak(u)
    }
  } catch {
    /* ignore */
  }
  useUi.getState().setUnlocked(true)
  const p = pending
  pending = null
  if (p) void speak(p)
}

// При выключении звука — сразу замолкаем.
useSettings.subscribe((s, prev) => {
  if (prev.sound && !s.sound) stopSpeech()
})
