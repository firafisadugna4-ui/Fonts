export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'Cyber & Tech' | 'Aesthetic Serif' | 'Retro & Pixel' | 'Brutalist & Heavy' | 'Minimalist' | 'Specialty Display';
  preview: string;
  subLegendCompatibility: boolean;
  tag: string;
}

export const TYPOGRAPHY_COLLECTION: FontOption[] = [
  // Cyber & Tech
  {
    id: 'orbitron',
    name: 'Orbitron Cyber',
    family: "'Orbitron', sans-serif",
    category: 'Cyber & Tech',
    preview: 'CYBER 2077',
    subLegendCompatibility: true,
    tag: 'Sci-Fi / Mecha'
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Code Mono',
    family: "'JetBrains Mono', monospace",
    category: 'Cyber & Tech',
    preview: 'function korme()',
    subLegendCompatibility: true,
    tag: 'Hacker / Developer'
  },
  {
    id: 'fira-code',
    name: 'Fira Ligature Code',
    family: "'Fira Code', monospace",
    category: 'Cyber & Tech',
    preview: '=> === != &&',
    subLegendCompatibility: true,
    tag: 'Clean Monospace'
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk Pro',
    family: "'Space Grotesk', sans-serif",
    category: 'Cyber & Tech',
    preview: 'KORME STUDIO',
    subLegendCompatibility: true,
    tag: 'Modern Tech'
  },
  {
    id: 'russo-one',
    name: 'Russo Industrial',
    family: "'Russo One', sans-serif",
    category: 'Cyber & Tech',
    preview: 'HEAVY IMPACT',
    subLegendCompatibility: false,
    tag: 'Cyber Armament'
  },
  {
    id: 'major-mono',
    name: 'Major Experimental',
    family: "'Major Mono Display', monospace",
    category: 'Cyber & Tech',
    preview: 'aBstRACt',
    subLegendCompatibility: false,
    tag: 'Avant-Garde'
  },

  // Aesthetic Serif
  {
    id: 'cinzel',
    name: 'Cinzel Imperium',
    family: "'Cinzel', serif",
    category: 'Aesthetic Serif',
    preview: 'AESTHETIC VOGUE',
    subLegendCompatibility: true,
    tag: 'Roman Luxury'
  },
  {
    id: 'playfair',
    name: 'Playfair Editorial',
    family: "'Playfair Display', serif",
    category: 'Aesthetic Serif',
    preview: 'The Studio Atelier',
    subLegendCompatibility: false,
    tag: 'High Fashion'
  },

  // Retro & Pixel
  {
    id: 'press-start',
    name: 'Press Start 8-Bit',
    family: "'Press Start 2P', monospace",
    category: 'Retro & Pixel',
    preview: 'GAME OVER 1984',
    subLegendCompatibility: false,
    tag: 'Arcade Classic'
  },
  {
    id: 'vt323',
    name: 'VT323 Terminal CRT',
    family: "'VT323', monospace",
    category: 'Retro & Pixel',
    preview: 'SYSTEM ROOT OK',
    subLegendCompatibility: true,
    tag: 'Phosphor Green'
  },
  {
    id: 'dot-gothic',
    name: 'DotGothic Neo Matrix',
    family: "'DotGothic16', sans-serif",
    category: 'Retro & Pixel',
    preview: 'ピクセル・デザイン',
    subLegendCompatibility: true,
    tag: 'Tokyo Cyberpunk'
  },
  {
    id: 'righteous',
    name: 'Righteous Synthwave',
    family: "'Righteous', cursive",
    category: 'Retro & Pixel',
    preview: 'RETRO WAVE 80s',
    subLegendCompatibility: false,
    tag: 'Outrun Neon'
  },

  // Brutalist & Heavy
  {
    id: 'syne',
    name: 'Syne Brutal',
    family: "'Syne', sans-serif",
    category: 'Brutalist & Heavy',
    preview: 'KORME ARCHIVE',
    subLegendCompatibility: true,
    tag: 'Editorial Poster'
  },
  {
    id: 'montserrat',
    name: 'Montserrat Ultra',
    family: "'Montserrat', sans-serif",
    category: 'Brutalist & Heavy',
    preview: 'MINIMALIST RAW',
    subLegendCompatibility: true,
    tag: 'Heavy Geometric'
  },
  {
    id: 'unifraktur',
    name: 'Gothic Metal Blackletter',
    family: "'UnifrakturMaguntia', cursive",
    category: 'Brutalist & Heavy',
    preview: 'Dark Heritage',
    subLegendCompatibility: false,
    tag: 'Dark Aesthetic'
  },

  // Minimalist
  {
    id: 'inter',
    name: 'Inter Pure Swiss',
    family: "'Inter', sans-serif",
    category: 'Minimalist',
    preview: 'Clean Legibility',
    subLegendCompatibility: true,
    tag: 'Modern Neutral'
  }
];

// Mapping for sub-legends on keys
export const SUB_LEGEND_MAPS = {
  katakana: {
    q: 'タ', w: 'テ', e: 'イ', r: 'ス', t: 'カ', y: 'ン', u: 'ナ', i: 'ニ', o: 'ラ', p: 'セ',
    a: 'チ', s: 'ト', d: 'シ', f: 'ハ', g: 'キ', h: 'ク', j: 'マ', k: 'ノ', l: 'リ',
    z: 'ツ', x: 'サ', c: 'ソ', v: 'ヒ', b: 'コ', n: 'ミ', m: 'モ',
    '1': 'ヌ', '2': 'フ', '3': 'ア', '4': 'ウ', '5': 'エ', '6': 'オ', '7': 'ヤ', '8': 'ユ', '9': 'ヨ', '0': 'ワ'
  } as Record<string, string>,
  
  runes: {
    q: 'ᚠ', w: 'ᚢ', e: 'ᚦ', r: 'ᚨ', t: 'ᚱ', y: 'ᚲ', u: 'ᚷ', i: 'ᚹ', o: 'ᚺ', p: 'ᚾ',
    a: 'ᛁ', s: 'ᛃ', d: 'ᛇ', f: 'ᛈ', g: 'ᛉ', h: 'ᛊ', j: 'ᛏ', k: 'ᛒ', l: 'ᛖ',
    z: 'ᛗ', x: 'ᛚ', c: 'ᛜ', v: 'ᛞ', b: 'ᛟ', n: 'ᛠ', m: 'ᛡ',
    '1': '᛫', '2': '᛬', '3': '᛭', '4': 'ᛮ', '5': 'ᛯ', '6': 'ᛰ', '7': 'I', '8': 'II', '9': 'III', '0': 'IV'
  } as Record<string, string>,

  'tech-code': {
    q: '0x1', w: '0x2', e: '0x3', r: '0x4', t: '0x5', y: '0x6', u: '0x7', i: '0x8', o: '0x9', p: '0xA',
    a: 'SYS', s: 'RAM', d: 'CPU', f: 'GPU', g: 'IO', h: 'NET', j: 'BUS', k: 'REG', l: 'CLK',
    z: 'HEX', x: 'BIN', c: 'DEC', v: 'VCC', b: 'GND', n: 'TX', m: 'RX',
    '1': 'F1', '2': 'F2', '3': 'F3', '4': 'F4', '5': 'F5', '6': 'F6', '7': 'F7', '8': 'F8', '9': 'F9', '0': 'F10'
  } as Record<string, string>,

  'minimal-symbols': {
    q: '⬡', w: '⬢', e: '◈', r: '◇', t: '▲', y: '▼', u: '◀', i: '▶', o: '◎', p: '◉',
    a: '✦', s: '✧', d: '★', f: '☆', g: '✶', h: '✸', j: '✹', k: '✺', l: '✻',
    z: '⌘', x: '⌥', c: '⌃', v: '⇧', b: '⎋', n: '↵', m: '⌫',
    '1': '•', '2': '••', '3': '•••', '4': '◦', '5': '▫', '6': '▪', '7': '△', '8': '▽', '9': '○', '0': '●'
  } as Record<string, string>
};
