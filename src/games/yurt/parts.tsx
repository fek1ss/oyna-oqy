// Части юрты в общей системе координат сцены 400×320.
import { useId, type ReactElement } from 'react'

export type PartId = 'kerege' | 'uyq' | 'shanyrak' | 'tuyrlyq'

/** Порядок сборки. */
export const ORDER: PartId[] = ['kerege', 'uyq', 'shanyrak', 'tuyrlyq']

export const VIEWBOX = '0 0 400 320'

const WOOD = '#C07E35'
const WOOD_D = '#7A4A17'
const FELT = '#F4ECDC'
const RED = '#D9483B'
const GOLD = '#F5C242'

interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface PartDef {
  id: PartId
  /** Область, куда нужно положить часть (координаты сцены). */
  hit: Box
  /** Как показывать часть в лотке (обрезка сцены). */
  trayBox: string
  /** Пустое место (силуэт) на сцене. */
  Slot: (p: { className?: string; highlight?: boolean }) => ReactElement
  /** Сама часть. */
  Shape: () => ReactElement
}

const WALL_X = [66, 334]
const WALL_TOP = 198
const GROUND = 292
const RING = { cx: 200, cy: 98, rx: 40, ry: 13 }

function Kerege() {
  const id = useId()
  const lines = []
  for (let x = WALL_X[0] - 90; x <= WALL_X[1]; x += 24) {
    lines.push(<line key={`a${x}`} x1={x} y1={GROUND} x2={x + 94} y2={WALL_TOP} />)
    lines.push(<line key={`b${x}`} x1={x + 94} y1={GROUND} x2={x} y2={WALL_TOP} />)
  }
  return (
    <g>
      <clipPath id={id}>
        <rect x={WALL_X[0]} y={WALL_TOP} width={WALL_X[1] - WALL_X[0]} height={GROUND - WALL_TOP} />
      </clipPath>
      <g clipPath={`url(#${id})`} stroke={WOOD} strokeWidth="6" strokeLinecap="round">
        {lines}
      </g>
      <rect
        x={WALL_X[0]}
        y={WALL_TOP}
        width={WALL_X[1] - WALL_X[0]}
        height={GROUND - WALL_TOP}
        rx="4"
        fill="none"
        stroke={WOOD_D}
        strokeWidth="6"
      />
      {/* дверной проём */}
      <rect x="180" y="226" width="40" height={GROUND - 226} fill="#E9C38E" stroke={WOOD_D} strokeWidth="5" />
    </g>
  )
}

function Uyq() {
  const poles = []
  const n = 11
  for (let i = 0; i < n; i++) {
    const x0 = WALL_X[0] + ((WALL_X[1] - WALL_X[0]) * i) / (n - 1)
    const x1 = RING.cx + ((x0 - RING.cx) * RING.rx) / ((WALL_X[1] - WALL_X[0]) / 2)
    const y1 = RING.cy + 4
    const mx = (x0 + x1) / 2
    const my = (WALL_TOP + y1) / 2 - 10
    poles.push(<path key={i} d={`M${x0} ${WALL_TOP + 8} L${x0} ${WALL_TOP} Q${mx} ${my} ${x1} ${y1}`} />)
  }
  return (
    <g stroke={WOOD} strokeWidth="6" strokeLinecap="round" fill="none">
      {poles}
    </g>
  )
}

function Shanyrak() {
  const { cx, cy, rx, ry } = RING
  return (
    <g>
      <g fill="none" stroke={WOOD_D} strokeWidth="5" strokeLinecap="round">
        <path d={`M${cx - rx + 8} ${cy} Q${cx} ${cy - 40} ${cx + rx - 8} ${cy}`} />
        <path d={`M${cx - rx + 22} ${cy - 8} Q${cx} ${cy - 30} ${cx + rx - 22} ${cy + 8}`} />
        <path d={`M${cx - rx + 22} ${cy + 8} Q${cx} ${cy - 30} ${cx + rx - 22} ${cy - 8}`} />
      </g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={WOOD} strokeWidth="10" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={WOOD_D} strokeWidth="3" />
    </g>
  )
}

const FELT_PATH = `M${WALL_X[0]} ${GROUND} V${WALL_TOP} Q120 132 ${RING.cx - RING.rx + 2} ${RING.cy + 4} H${RING.cx + RING.rx - 2} Q280 132 ${WALL_X[1]} ${WALL_TOP} V${GROUND} Z`

function Tuyrlyq() {
  return (
    <g>
      <path d={FELT_PATH} fill={FELT} stroke="#A8957A" strokeWidth="5" strokeLinejoin="round" />
      {/* швы на крыше */}
      <g stroke="#DCCFB6" strokeWidth="4" fill="none">
        <path d="M110 162 Q160 128 172 104" />
        <path d="M290 162 Q240 128 228 104" />
      </g>
      {/* орнаментальные полосы */}
      <path d={`M${WALL_X[0]} ${WALL_TOP + 8} H${WALL_X[1]}`} stroke={RED} strokeWidth="12" />
      <path d={`M${WALL_X[0]} ${WALL_TOP + 8} H${WALL_X[1]}`} stroke={GOLD} strokeWidth="3" strokeDasharray="10 8" />
      <path d={`M${WALL_X[0]} ${GROUND - 12} H${WALL_X[1]}`} stroke="#2F6DB5" strokeWidth="10" />
      {/* дверь */}
      <rect x="180" y="226" width="40" height={GROUND - 226} rx="3" fill={RED} stroke={WOOD_D} strokeWidth="5" />
      <path d="M200 240 L212 256 L200 272 L188 256 Z" fill={GOLD} />
    </g>
  )
}

const slotStyle = (hl?: boolean) =>
  hl
    ? { fill: '#FFE38A', fillOpacity: 0.55, stroke: '#FFB300', strokeWidth: 7, strokeDasharray: '16 8' }
    : { fill: '#ffffff', fillOpacity: 0.5, stroke: '#B9A88A', strokeWidth: 4, strokeDasharray: '12 10' }

export const PARTS: Record<PartId, PartDef> = {
  kerege: {
    id: 'kerege',
    hit: { x: 66, y: 198, w: 268, h: 94 },
    trayBox: '58 190 284 110',
    Shape: Kerege,
    Slot: ({ className, highlight }) => (
      <rect className={className} x={WALL_X[0]} y={WALL_TOP} width={WALL_X[1] - WALL_X[0]} height={GROUND - WALL_TOP} rx="6" {...slotStyle(highlight)} />
    ),
  },
  uyq: {
    id: 'uyq',
    hit: { x: 70, y: 96, w: 260, h: 104 },
    trayBox: '58 84 284 128',
    Shape: Uyq,
    Slot: ({ className, highlight }) => (
      <path className={className} d={`M${WALL_X[0]} ${WALL_TOP} L${RING.cx - RING.rx} ${RING.cy + 4} H${RING.cx + RING.rx} L${WALL_X[1]} ${WALL_TOP} Z`} {...slotStyle(highlight)} />
    ),
  },
  shanyrak: {
    id: 'shanyrak',
    hit: { x: 150, y: 62, w: 100, h: 56 },
    trayBox: '152 52 96 64',
    Shape: Shanyrak,
    Slot: ({ className, highlight }) => (
      <ellipse className={className} cx={RING.cx} cy={RING.cy} rx={RING.rx + 4} ry={RING.ry + 6} {...slotStyle(highlight)} />
    ),
  },
  tuyrlyq: {
    id: 'tuyrlyq',
    hit: { x: 66, y: 96, w: 268, h: 196 },
    trayBox: '56 84 288 216',
    Shape: Tuyrlyq,
    Slot: ({ className, highlight }) => <path className={className} d={FELT_PATH} {...slotStyle(highlight)} fillOpacity={highlight ? 0.35 : 0.2} />,
  },
}

/** Порядок отрисовки на сцене: войлок поверх каркаса, шаңырақ — сверху. */
export const DRAW_ORDER: PartId[] = ['kerege', 'uyq', 'tuyrlyq', 'shanyrak']

export const GROUND_Y = GROUND
