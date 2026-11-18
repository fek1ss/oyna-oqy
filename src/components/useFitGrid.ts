import { useLayoutEffect, useRef, useState } from 'react'

export interface Fit {
  cols: number
  rows: number
  size: number
}

/** Подбирает число колонок так, чтобы n квадратов максимального размера влезли в контейнер. */
export function fitGrid(n: number, W: number, H: number, gap: number, max = Infinity): Fit {
  let best: Fit = { cols: 1, rows: n, size: 0 }
  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols)
    const w = (W - gap * (cols - 1)) / cols
    const h = (H - gap * (rows - 1)) / rows
    const size = Math.floor(Math.min(w, h, max))
    if (size > best.size) best = { cols, rows, size }
  }
  return best
}

/** Измеряет контейнер и возвращает раскладку сетки (работает при поворотах экрана). */
export function useFitGrid<T extends HTMLElement>(n: number, gap = 16, max = Infinity) {
  const ref = useRef<T>(null)
  const [fit, setFit] = useState<Fit>({ cols: 1, rows: n, size: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const cs = getComputedStyle(el)
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      setFit(fitGrid(n, w, h, gap, max))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [n, gap, max])
  return { ref, fit }
}
