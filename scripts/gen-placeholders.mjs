// Генерирует простые плоские SVG-заглушки в public/assets/img.
// Запуск: npm run gen:img
// Настоящие картинки можно положить поверх с тем же именем файла — код менять не нужно.
// ВНИМАНИЕ: скрипт перезаписывает файлы с этими именами.
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('public/assets/img')
fs.mkdirSync(OUT, { recursive: true })

const wrap = (bg, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="36" fill="${bg}"/>${body}</svg>\n`

const mirror = (s) => `<g transform="translate(200 0) scale(-1 1)">${s}</g>`

// Цвета
const WOOD = '#B9772F', WOOD_D = '#7A4A17', FELT = '#F4ECDC', GOLD = '#F5C242', RED = '#D9483B'
const BROWN = '#9A6233', WHITE = '#FFFFFF', INK = '#3A2A1A'

// ---------- Юрта ----------
const keregeLines = () => {
  let s = ''
  for (let x = 10; x <= 190; x += 22) {
    s += `<line x1="${x}" y1="60" x2="${x + 50}" y2="150"/><line x1="${x + 50}" y1="60" x2="${x}" y2="150"/>`
  }
  return `<clipPath id="k"><rect x="30" y="60" width="140" height="90" rx="6"/></clipPath><g clip-path="url(#k)" stroke="${WOOD}" stroke-width="7" stroke-linecap="round">${s}</g><rect x="30" y="60" width="140" height="90" rx="6" fill="none" stroke="${WOOD_D}" stroke-width="5"/>`
}

const yurtSilhouette = `
  <path d="M30 150 V105 Q100 40 170 105 V150 Z" fill="${FELT}" stroke="${WOOD_D}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M38 110 H162" stroke="${RED}" stroke-width="8"/>
  <ellipse cx="100" cy="66" rx="20" ry="7" fill="${WOOD}" stroke="${WOOD_D}" stroke-width="4"/>
  <rect x="86" y="118" width="28" height="32" rx="4" fill="${RED}" stroke="${WOOD_D}" stroke-width="4"/>
  <line x1="20" y1="152" x2="180" y2="152" stroke="${WOOD_D}" stroke-width="6" stroke-linecap="round"/>`

const items = {
  shanyrak: `
    <circle cx="100" cy="100" r="62" fill="none" stroke="${WOOD}" stroke-width="16"/>
    <circle cx="100" cy="100" r="62" fill="none" stroke="${WOOD_D}" stroke-width="4"/>
    <g fill="none" stroke="${WOOD_D}" stroke-width="8" stroke-linecap="round">
      <path d="M42 85 Q100 60 158 85"/><path d="M40 115 Q100 90 160 115"/>
      <path d="M85 42 Q60 100 85 158"/><path d="M115 42 Q90 100 115 158"/>
    </g>`,
  kerege: keregeLines(),
  uyq: `
    <g stroke="${WOOD}" stroke-width="8" stroke-linecap="round" fill="none">
      <path d="M100 40 Q60 70 30 150 L24 162"/><path d="M100 40 Q78 80 62 150 L58 162"/>
      <path d="M100 40 V162"/><path d="M100 40 Q122 80 138 150 L142 162"/><path d="M100 40 Q140 70 170 150 L176 162"/>
    </g>
    <circle cx="100" cy="40" r="12" fill="${WOOD_D}"/>`,
  tuyrlyq: `
    <path d="M20 150 Q24 90 100 48 Q176 90 180 150 Z" fill="${FELT}" stroke="#B9A88A" stroke-width="5" stroke-linejoin="round"/>
    <path d="M38 112 Q100 92 162 112" stroke="${RED}" stroke-width="7" fill="none"/>
    <path d="M30 132 Q100 112 170 132" stroke="#2F6DB5" stroke-width="7" fill="none"/>`,
  kiiz: `
    <rect x="25" y="45" width="150" height="110" rx="10" fill="${RED}"/>
    <rect x="38" y="58" width="124" height="84" rx="6" fill="${FELT}"/>
    <path d="M100 72 C88 82 76 82 70 100 C76 118 88 118 100 128 C112 118 124 118 130 100 C124 82 112 82 100 72 Z" fill="${RED}"/>
    <circle cx="100" cy="100" r="9" fill="${GOLD}"/>`,
  tuskiiz: `
    <line x1="30" y1="38" x2="170" y2="38" stroke="${WOOD_D}" stroke-width="8" stroke-linecap="round"/>
    <path d="M42 42 H158 V150 L100 170 L42 150 Z" fill="#2F6DB5"/>
    <path d="M52 52 H148 V144 L100 160 L52 144 Z" fill="none" stroke="${GOLD}" stroke-width="4"/>
    <g fill="${RED}"><circle cx="100" cy="95" r="18"/><circle cx="72" cy="70" r="9"/><circle cx="128" cy="70" r="9"/><circle cx="72" cy="125" r="9"/><circle cx="128" cy="125" r="9"/></g>
    <circle cx="100" cy="95" r="8" fill="${GOLD}"/>`,
  saba: `
    <path d="M86 40 H114 V62 Q156 80 152 128 Q148 166 100 166 Q52 166 48 128 Q44 80 86 62 Z" fill="${BROWN}" stroke="#5C3311" stroke-width="5" stroke-linejoin="round"/>
    <rect x="82" y="34" width="36" height="12" rx="5" fill="#5C3311"/>
    <path d="M62 110 Q100 126 138 110" stroke="${GOLD}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  sandyq: `
    <path d="M30 80 Q30 50 60 50 H140 Q170 50 170 80 Z" fill="#C0392B" stroke="#6E1C14" stroke-width="5"/>
    <rect x="30" y="80" width="140" height="80" rx="6" fill="#D9483B" stroke="#6E1C14" stroke-width="5"/>
    <g stroke="${GOLD}" stroke-width="8"><line x1="58" y1="52" x2="58" y2="160"/><line x1="142" y1="52" x2="142" y2="160"/></g>
    <rect x="88" y="88" width="24" height="26" rx="4" fill="${GOLD}"/><circle cx="100" cy="100" r="4" fill="#6E1C14"/>`,

  // ---------- Еда ----------
  baursak: `
    <ellipse cx="100" cy="140" rx="78" ry="24" fill="${WHITE}" stroke="#D7C7B0" stroke-width="4"/>
    <g fill="#E8A53C" stroke="#A8661A" stroke-width="4" stroke-linejoin="round">
      <rect x="48" y="96" width="38" height="38" rx="12" transform="rotate(-12 67 115)"/>
      <rect x="114" y="96" width="38" height="38" rx="12" transform="rotate(14 133 115)"/>
      <rect x="80" y="70" width="40" height="40" rx="13" transform="rotate(6 100 90)"/>
      <rect x="82" y="108" width="36" height="34" rx="12"/>
    </g>`,
  beshbarmak: `
    <ellipse cx="100" cy="112" rx="84" ry="46" fill="${WHITE}" stroke="#D7C7B0" stroke-width="4"/>
    <g fill="#F6E3B4" stroke="#C9AE70" stroke-width="3">
      <rect x="40" y="98" width="34" height="26" rx="4"/><rect x="126" y="98" width="34" height="26" rx="4"/>
      <rect x="66" y="118" width="34" height="24" rx="4"/><rect x="104" y="118" width="32" height="24" rx="4"/>
    </g>
    <g fill="#A2562B"><ellipse cx="88" cy="96" rx="20" ry="13"/><ellipse cx="116" cy="102" rx="18" ry="12"/></g>
    <g fill="none" stroke="#C784C0" stroke-width="4"><circle cx="70" cy="92" r="8"/><circle cx="132" cy="90" r="8"/></g>`,
  shelpek: `
    <circle cx="100" cy="102" r="66" fill="#F0C470" stroke="#B27A27" stroke-width="5"/>
    <g fill="#D9973A"><circle cx="78" cy="84" r="8"/><circle cx="120" cy="78" r="6"/><circle cx="128" cy="116" r="9"/><circle cx="86" cy="126" r="6"/><circle cx="104" cy="104" r="5"/></g>`,
  kurt: `
    <path d="M30 100 H170 Q166 162 100 162 Q34 162 30 100 Z" fill="#3B7FC4" stroke="#24548A" stroke-width="5"/>
    <g fill="${WHITE}" stroke="#CFC8BA" stroke-width="3">
      <circle cx="68" cy="92" r="17"/><circle cx="100" cy="86" r="18"/><circle cx="132" cy="92" r="17"/>
      <circle cx="84" cy="70" r="15"/><circle cx="117" cy="68" r="15"/>
    </g>`,
  sorpa: `
    <path d="M28 90 H172 Q168 160 100 160 Q32 160 28 90 Z" fill="${WHITE}" stroke="#2F6DB5" stroke-width="6"/>
    <ellipse cx="100" cy="90" rx="72" ry="16" fill="#E7B04A" stroke="#2F6DB5" stroke-width="6"/>
    <g fill="#F7D57D"><circle cx="78" cy="88" r="5"/><circle cx="112" cy="92" r="4"/><circle cx="128" cy="86" r="3"/></g>
    <g fill="none" stroke="#BBB" stroke-width="5" stroke-linecap="round"><path d="M80 62 q-8 -12 0 -24"/><path d="M104 62 q-8 -12 0 -24"/><path d="M128 62 q-8 -12 0 -24"/></g>`,
  'sutti-shai': `
    <path d="M44 92 H156 Q152 158 100 158 Q48 158 44 92 Z" fill="${WHITE}" stroke="#2F6DB5" stroke-width="6"/>
    <path d="M60 118 Q100 130 140 118" stroke="#2F6DB5" stroke-width="5" fill="none"/>
    <ellipse cx="100" cy="92" rx="56" ry="12" fill="#D9AE7E" stroke="#2F6DB5" stroke-width="6"/>
    <g fill="none" stroke="#BBB" stroke-width="5" stroke-linecap="round"><path d="M84 66 q-8 -12 0 -24"/><path d="M110 66 q-8 -12 0 -24"/></g>`,

  // ---------- Животные ----------
  tuye: `
    <g fill="#C8954F" stroke="#7A5220" stroke-width="4" stroke-linejoin="round">
      <rect x="56" y="128" width="12" height="46" rx="5"/><rect x="78" y="128" width="12" height="46" rx="5"/>
      <rect x="112" y="128" width="12" height="46" rx="5"/><rect x="132" y="128" width="12" height="46" rx="5"/>
      <path d="M44 120 Q44 92 64 92 Q72 62 88 92 Q100 98 110 92 Q124 60 136 92 Q150 96 152 120 Q150 140 100 140 Q46 140 44 120 Z"/>
      <path d="M144 106 Q164 92 160 60 L176 54 Q186 58 182 68 L172 72 Q176 104 154 124 Z"/>
    </g>
    <circle cx="172" cy="62" r="3" fill="${INK}"/>`,
  zhylqy: `
    <g fill="#8B5A2B" stroke="#4E2E10" stroke-width="4" stroke-linejoin="round">
      <rect x="56" y="118" width="12" height="54" rx="5"/><rect x="76" y="118" width="12" height="54" rx="5"/>
      <rect x="116" y="118" width="12" height="54" rx="5"/><rect x="136" y="118" width="12" height="54" rx="5"/>
      <path d="M46 112 Q46 88 76 88 H128 Q148 88 150 108 Q150 130 128 130 H72 Q46 130 46 112 Z"/>
      <path d="M126 96 L146 46 Q152 36 164 40 L184 64 Q186 72 178 74 L162 66 L148 108 Z"/>
      <path d="M48 98 Q28 110 30 148 Q42 130 52 112 Z"/>
    </g>
    <path d="M144 48 Q132 70 128 96" stroke="#2E1A08" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="164" cy="52" r="3" fill="${INK}"/>`,
  qoy: `
    <g fill="#333"><rect x="64" y="128" width="11" height="40" rx="5"/><rect x="84" y="130" width="11" height="40" rx="5"/><rect x="110" y="130" width="11" height="40" rx="5"/><rect x="128" y="128" width="11" height="40" rx="5"/></g>
    <g fill="${WHITE}" stroke="#C9C2B4" stroke-width="3">
      <circle cx="70" cy="106" r="24"/><circle cx="100" cy="94" r="26"/><circle cx="130" cy="106" r="24"/>
      <circle cx="86" cy="124" r="20"/><circle cx="116" cy="124" r="20"/><circle cx="100" cy="112" r="24"/>
    </g>
    <ellipse cx="156" cy="96" rx="18" ry="22" fill="#333"/>
    <ellipse cx="150" cy="78" rx="12" ry="6" fill="#333" transform="rotate(-30 150 78)"/>
    <circle cx="162" cy="92" r="3.5" fill="${WHITE}"/>`,
  siyr: `
    <g fill="${WHITE}" stroke="#4A4A4A" stroke-width="4" stroke-linejoin="round">
      <rect x="54" y="120" width="13" height="48" rx="5"/><rect x="74" y="120" width="13" height="48" rx="5"/>
      <rect x="114" y="120" width="13" height="48" rx="5"/><rect x="134" y="120" width="13" height="48" rx="5"/>
      <rect x="42" y="78" width="112" height="56" rx="24"/>
      <path d="M148 84 Q148 66 166 64 Q186 66 186 90 Q186 110 168 112 Q150 110 148 84 Z"/>
    </g>
    <g fill="#333"><ellipse cx="78" cy="96" rx="14" ry="10"/><ellipse cx="118" cy="114" rx="12" ry="9"/><circle cx="132" cy="90" r="8"/></g>
    <path d="M156 66 Q150 50 158 46 M176 66 Q182 50 174 46" stroke="#C9B48A" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="172" cy="104" rx="11" ry="7" fill="#F2A9A0"/><circle cx="166" cy="82" r="3" fill="${INK}"/>`,
  eshki: `
    <g fill="#C9C2B4" stroke="#6B6458" stroke-width="4" stroke-linejoin="round">
      <rect x="58" y="120" width="11" height="48" rx="5"/><rect x="76" y="120" width="11" height="48" rx="5"/>
      <rect x="114" y="120" width="11" height="48" rx="5"/><rect x="132" y="120" width="11" height="48" rx="5"/>
      <rect x="48" y="86" width="102" height="44" rx="20"/>
      <path d="M134 94 L148 62 Q154 52 166 56 L180 78 Q182 88 172 88 L158 84 L150 104 Z"/>
      <path d="M50 96 L36 82 L46 100 Z"/>
    </g>
    <path d="M150 58 Q140 30 120 36" stroke="#6B6458" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M170 86 L172 108 L162 92 Z" fill="#6B6458"/><circle cx="163" cy="66" r="3" fill="${INK}"/>`,
  it: `
    <g fill="#D79A4E" stroke="#7A4E1A" stroke-width="4" stroke-linejoin="round">
      <rect x="58" y="118" width="12" height="44" rx="5"/><rect x="76" y="118" width="12" height="44" rx="5"/>
      <rect x="114" y="118" width="12" height="44" rx="5"/><rect x="132" y="118" width="12" height="44" rx="5"/>
      <rect x="50" y="92" width="98" height="40" rx="18"/>
      <path d="M52 100 Q30 92 32 64 Q42 86 58 94 Z"/>
      <circle cx="152" cy="84" r="26"/>
      <ellipse cx="176" cy="92" rx="14" ry="10"/>
    </g>
    <path d="M138 66 Q128 88 136 104 Q148 90 146 66 Z" fill="#7A4E1A"/>
    <circle cx="186" cy="88" r="5" fill="${INK}"/><circle cx="158" cy="78" r="3.5" fill="${INK}"/>`,

  // ---------- Одежда ----------
  shapan: `
    <path d="M70 38 L100 52 L130 38 L172 70 L158 98 L140 88 L146 170 H54 L60 88 L42 98 L28 70 Z" fill="#3B5BA9" stroke="#1E3366" stroke-width="5" stroke-linejoin="round"/>
    <path d="M70 38 L100 52 L130 38 M100 52 V170" stroke="${GOLD}" stroke-width="7" fill="none"/>
    <path d="M54 162 H146" stroke="${GOLD}" stroke-width="7"/>`,
  taqiya: `
    <path d="M36 128 Q36 56 100 56 Q164 56 164 128 Z" fill="#2F2F6E" stroke="#16163C" stroke-width="5"/>
    <rect x="30" y="122" width="140" height="22" rx="8" fill="${RED}" stroke="#16163C" stroke-width="5"/>
    <g fill="${GOLD}"><circle cx="100" cy="92" r="11"/><circle cx="66" cy="104" r="7"/><circle cx="134" cy="104" r="7"/><circle cx="100" cy="66" r="5"/></g>`,
  kamzol: `
    <path d="M66 36 L92 40 L100 90 L108 40 L134 36 L156 62 L150 168 H50 L44 62 Z" fill="#B23A48" stroke="#5C1720" stroke-width="5" stroke-linejoin="round"/>
    <path d="M92 40 L100 90 L108 40" fill="${WHITE}"/>
    <g fill="${GOLD}"><circle cx="100" cy="108" r="6"/><circle cx="100" cy="130" r="6"/><circle cx="100" cy="152" r="6"/></g>
    <path d="M50 160 H150" stroke="${GOLD}" stroke-width="6"/>`,
  saukele: `
    <path d="M100 18 L136 140 H64 Z" fill="${WHITE}" stroke="#A8861E" stroke-width="5" stroke-linejoin="round"/>
    <path d="M100 18 L136 140 H64 Z" fill="${RED}" opacity=".85"/>
    <g fill="${GOLD}"><circle cx="100" cy="56" r="7"/><circle cx="100" cy="84" r="9"/><circle cx="100" cy="114" r="10"/></g>
    <rect x="54" y="136" width="92" height="16" rx="6" fill="${GOLD}"/>
    <g stroke="${GOLD}" stroke-width="4"><line x1="62" y1="152" x2="58" y2="182"/><line x1="138" y1="152" x2="142" y2="182"/></g>
    <g fill="#E8E2D2"><circle cx="58" cy="184" r="5"/><circle cx="142" cy="184" r="5"/></g>`,
  etik: `
    <g fill="#5B3A1E" stroke="#2C1A0B" stroke-width="5" stroke-linejoin="round">
      <path d="M38 36 H76 V128 Q96 132 98 150 V164 H32 Q30 140 38 128 Z"/>
      <path d="M108 36 H146 V128 Q166 132 168 150 V164 H102 Q100 140 108 128 Z"/>
    </g>
    <g stroke="${GOLD}" stroke-width="6"><line x1="38" y1="50" x2="76" y2="50"/><line x1="108" y1="50" x2="146" y2="50"/></g>`,

  // ---------- Инструменты ----------
  dombyra: `
    <g transform="rotate(35 100 100)">
      <rect x="93" y="14" width="14" height="96" rx="5" fill="${WOOD_D}"/>
      <rect x="88" y="6" width="24" height="18" rx="6" fill="${WOOD_D}"/>
      <path d="M100 96 Q140 100 138 146 Q134 188 100 188 Q66 188 62 146 Q60 100 100 96 Z" fill="${WOOD}" stroke="${WOOD_D}" stroke-width="5"/>
      <g stroke="#F1E5C9" stroke-width="2.5"><line x1="97" y1="12" x2="97" y2="174"/><line x1="103" y1="12" x2="103" y2="174"/></g>
      <rect x="88" y="168" width="24" height="6" rx="2" fill="${INK}"/>
    </g>`,
  qobyz: `
    <g transform="rotate(-20 100 100)">
      <path d="M100 20 Q118 20 116 44 L112 70 Q140 84 136 128 Q132 176 100 178 Q68 176 64 128 Q60 84 88 70 L84 44 Q82 20 100 20 Z" fill="#A0522D" stroke="#5A2B12" stroke-width="5"/>
      <path d="M100 112 Q122 118 122 140 Q120 166 100 168 Q80 166 78 140 Q78 118 100 112 Z" fill="#F1E2C4"/>
      <g stroke="#2C1A0B" stroke-width="2.5"><line x1="96" y1="30" x2="96" y2="164"/><line x1="104" y1="30" x2="104" y2="164"/></g>
    </g>
    <path d="M30 150 Q100 120 176 60" stroke="${WOOD_D}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  sybyzgy: `
    <g transform="rotate(-40 100 100)">
      <rect x="14" y="90" width="172" height="20" rx="10" fill="#C99A55" stroke="#6E4A17" stroke-width="5"/>
      <g fill="#4A2F0A"><circle cx="70" cy="100" r="4.5"/><circle cx="96" cy="100" r="4.5"/><circle cx="122" cy="100" r="4.5"/><circle cx="148" cy="100" r="4.5"/></g>
      <g stroke="${RED}" stroke-width="5"><line x1="34" y1="90" x2="34" y2="110"/><line x1="170" y1="90" x2="170" y2="110"/></g>
    </g>`,
}

// ---------- Орнаменты ----------
const horn = (c) => `<path d="M100 160 V108 C100 70 56 52 40 76 C28 96 46 116 62 106 C72 98 66 84 56 88" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`
const ORN = '#C2185B'
items['qoshqar-muiz'] = horn(ORN) + mirror(horn(ORN))
items['qos-muiz'] =
  `<g transform="translate(0 -26) scale(1 .78) translate(0 20)">${horn(ORN) + mirror(horn(ORN))}</g>` +
  `<g transform="translate(0 200) scale(1 -1) translate(0 -26) scale(1 .78) translate(0 20)">${horn('#7B1FA2') + mirror(horn('#7B1FA2'))}</g>`
const paw = (x, y) => `<path transform="translate(${x} ${y})" d="M0 -26 C20 -26 26 -8 18 6 C14 14 22 24 12 28 C4 30 2 22 0 22 C-2 22 -4 30 -12 28 C-22 24 -14 14 -18 6 C-26 -8 -20 -26 0 -26 Z" fill="${ORN}"/>`
items['tuye-taban'] = paw(64, 66) + paw(136, 66) + paw(64, 138) + paw(136, 138) + `<circle cx="100" cy="102" r="10" fill="${GOLD}"/>`
const feather = (a) => `<path transform="rotate(${a} 100 160)" d="M100 160 C88 120 90 70 100 38 C110 70 112 120 100 160 Z" fill="${ORN}" stroke="#7B0F3A" stroke-width="3"/>`
items['qus-qanaty'] = [-60, -30, 0, 30, 60].map(feather).join('') + `<circle cx="100" cy="160" r="12" fill="${GOLD}"/>`
const hook = (x) => `<path transform="translate(${x} 0)" d="M0 140 V90 C0 62 34 62 34 86 C34 102 14 104 14 92" fill="none" stroke="${ORN}" stroke-width="10" stroke-linecap="round"/>`
items['it-quyryq'] = hook(30) + hook(80) + hook(130) + `<line x1="24" y1="146" x2="176" y2="146" stroke="${ORN}" stroke-width="10" stroke-linecap="round"/>`
items.gul =
  Array.from({ length: 8 }, (_, i) => `<ellipse cx="100" cy="58" rx="16" ry="36" fill="${i % 2 ? '#E91E63' : ORN}" transform="rotate(${i * 45} 100 100)"/>`).join('') +
  `<circle cx="100" cy="100" r="22" fill="${GOLD}"/><circle cx="100" cy="100" r="9" fill="#E65100"/>`

// ---------- Фон по категориям ----------
const BG = { yurt: '#FDEBCB', food: '#FDDCD2', animals: '#DDF2D4', clothes: '#D8ECFA', music: '#E9DEF7', ornaments: '#FADCEA' }
const CAT_OF = {
  yurt: ['shanyrak', 'kerege', 'uyq', 'tuyrlyq', 'kiiz', 'tuskiiz', 'saba', 'sandyq'],
  food: ['baursak', 'beshbarmak', 'shelpek', 'kurt', 'sorpa', 'sutti-shai'],
  animals: ['tuye', 'zhylqy', 'qoy', 'siyr', 'eshki', 'it'],
  clothes: ['shapan', 'taqiya', 'kamzol', 'saukele', 'etik'],
  music: ['dombyra', 'qobyz', 'sybyzgy'],
  ornaments: ['qoshqar-muiz', 'qos-muiz', 'tuye-taban', 'qus-qanaty', 'it-quyryq', 'gul'],
}
const CAT_ICON = { yurt: yurtSilhouette, food: items.baursak, animals: items.qoy, clothes: items.taqiya, music: items.dombyra, ornaments: items['qoshqar-muiz'] }

let n = 0
for (const [cat, ids] of Object.entries(CAT_OF)) {
  for (const id of ids) {
    fs.writeFileSync(path.join(OUT, `${id}.svg`), wrap(BG[cat], items[id]))
    n++
  }
  fs.writeFileSync(path.join(OUT, `cat-${cat}.svg`), wrap(BG[cat], CAT_ICON[cat]))
  n++
}
// Иконка приложения (из неё делаются PNG для PWA: npm run gen:icons)
fs.writeFileSync(path.resolve('public/icon.svg'), wrap('#FFB547', yurtSilhouette))
console.log(`Создано ${n} SVG + public/icon.svg`)
