// Все иконки — инлайн SVG, без текста.
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P): P => ({
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...p,
})

export const IconBack = (p: P) => (
  <svg {...base(p)}><path d="M28 10 L14 24 L28 38" /></svg>
)
export const IconNext = (p: P) => (
  <svg {...base(p)}><path d="M20 10 L34 24 L20 38" /></svg>
)
export const IconHome = (p: P) => (
  <svg {...base(p)}><path d="M8 22 L24 8 L40 22" /><path d="M13 19 V40 H35 V19" /><path d="M21 40 V29 H27 V40" /></svg>
)
export const IconReplay = (p: P) => (
  <svg {...base(p)}><path d="M38 24 A14 14 0 1 1 33.9 14.1" /><path d="M35 5 V15 H25" /></svg>
)
export const IconSpeaker = (p: P) => (
  <svg {...base(p)}><path d="M8 18 H15 L25 9 V39 L15 30 H8 Z" fill="currentColor" /><path d="M31 17 Q36 24 31 31" /><path d="M36 12 Q44 24 36 36" /></svg>
)
export const IconMute = (p: P) => (
  <svg {...base(p)}><path d="M8 18 H15 L25 9 V39 L15 30 H8 Z" fill="currentColor" /><path d="M32 18 L42 30 M42 18 L32 30" /></svg>
)
export const IconGear = (p: P) => (
  <svg {...base({ strokeWidth: 4, ...p })}>
    <circle cx="24" cy="24" r="6" />
    <path d="M24 5 V11 M24 37 V43 M5 24 H11 M37 24 H43 M10.6 10.6 L14.8 14.8 M33.2 33.2 L37.4 37.4 M10.6 37.4 L14.8 33.2 M33.2 14.8 L37.4 10.6" />
    <circle cx="24" cy="24" r="13" />
  </svg>
)
export const IconClose = (p: P) => (
  <svg {...base(p)}><path d="M12 12 L36 36 M36 12 L12 36" /></svg>
)
export const IconSearch = (p: P) => (
  <svg {...base(p)}><circle cx="21" cy="21" r="12" /><path d="M30 30 L41 41" /></svg>
)
export const IconStar = ({ filled = true, ...p }: P & { filled?: boolean }) => (
  <svg {...base({ strokeWidth: 3, ...p })}>
    <path
      d="M24 5 L29.6 17.3 L43 18.8 L33 27.9 L35.8 41.2 L24 34.4 L12.2 41.2 L15 27.9 L5 18.8 L18.4 17.3 Z"
      fill={filled ? '#FFC93C' : 'none'}
      stroke="#E39A00"
    />
  </svg>
)

// ---------- Крупные цветные иконки для главного меню ----------

export const IconCards = (p: P) => (
  <svg viewBox="0 0 120 120" aria-hidden {...p}>
    <rect x="18" y="26" width="58" height="76" rx="12" fill="#FFFFFF" stroke="#2F6DB5" strokeWidth="5" transform="rotate(-12 47 64)" />
    <rect x="44" y="18" width="58" height="76" rx="12" fill="#FFF3D6" stroke="#2F6DB5" strokeWidth="5" transform="rotate(8 73 56)" />
    <circle cx="73" cy="48" r="13" fill="#EF6F4B" />
    <path d="M56 80 L68 62 L78 74 L86 66 L94 80 Z" fill="#6CBF4B" transform="rotate(8 73 56)" />
  </svg>
)

export const IconYurt = (p: P) => (
  <svg viewBox="0 0 120 120" aria-hidden {...p}>
    <path d="M14 96 V64 Q60 16 106 64 V96 Z" fill="#F4ECDC" stroke="#7A4A17" strokeWidth="5" strokeLinejoin="round" />
    <path d="M20 68 H100" stroke="#D9483B" strokeWidth="7" />
    <ellipse cx="60" cy="34" rx="14" ry="5" fill="#B9772F" stroke="#7A4A17" strokeWidth="4" />
    <rect x="50" y="72" width="20" height="24" rx="3" fill="#D9483B" stroke="#7A4A17" strokeWidth="4" />
    <path d="M8 98 H112" stroke="#7A4A17" strokeWidth="6" strokeLinecap="round" />
  </svg>
)

export const IconMemory = (p: P) => (
  <svg viewBox="0 0 120 120" aria-hidden {...p}>
    <rect x="10" y="26" width="46" height="62" rx="10" fill="#9B6BD6" stroke="#4B2A80" strokeWidth="5" />
    <path d="M22 44 L44 70 M44 44 L22 70" stroke="#E9DEF7" strokeWidth="4" />
    <rect x="64" y="20" width="46" height="62" rx="10" fill="#FFFFFF" stroke="#4B2A80" strokeWidth="5" transform="rotate(8 87 51)" />
    <circle cx="87" cy="51" r="13" fill="#FFC93C" stroke="#E39A00" strokeWidth="3" />
    <path d="M44 100 Q60 112 78 100" stroke="#4B2A80" strokeWidth="5" fill="none" strokeLinecap="round" />
  </svg>
)

/** Флаги — только для взрослых в настройках. */
export const FlagKZ = (p: P) => (
  <svg viewBox="0 0 60 40" aria-hidden {...p}>
    <rect width="60" height="40" rx="6" fill="#00AFCA" />
    <circle cx="30" cy="18" r="8" fill="#FEC50C" />
    <path d="M18 30 Q30 24 42 30" stroke="#FEC50C" strokeWidth="3" fill="none" />
  </svg>
)
export const FlagRU = (p: P) => (
  <svg viewBox="0 0 60 40" aria-hidden {...p}>
    <clipPath id="ru-r"><rect width="60" height="40" rx="6" /></clipPath>
    <g clipPath="url(#ru-r)">
      <rect width="60" height="14" fill="#FFFFFF" />
      <rect y="13" width="60" height="14" fill="#0039A6" />
      <rect y="26" width="60" height="14" fill="#D52B1E" />
    </g>
    <rect width="60" height="40" rx="6" fill="none" stroke="#ccc" strokeWidth="1.5" />
  </svg>
)
