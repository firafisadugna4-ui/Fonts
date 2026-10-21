import { WallpaperPreset, KeyboardPreset, WallpaperConfig, KeyboardConfig } from '../types';

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  // Cyberpunk
  {
    id: 'wp-cyber-1',
    title: 'Neo Shinjuku Rain',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=70',
    tags: ['Cyberpunk', 'Neon', 'Tokyo', 'Rain'],
    recommendedFont: "'Orbitron', sans-serif"
  },
  {
    id: 'wp-cyber-2',
    title: 'Cyber Grid Horizon',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=70',
    tags: ['Synthwave', 'Purple', 'Grid', 'Futuristic'],
    recommendedFont: "'Righteous', cursive"
  },
  {
    id: 'wp-cyber-3',
    title: 'Neon Alleyway Cybernetic',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=70',
    tags: ['Night', 'Tokyo', 'Cyber', 'Reflections'],
    recommendedFont: "'DotGothic16', sans-serif"
  },

  // Minimalist
  {
    id: 'wp-min-1',
    title: 'Architectural Shadowplay',
    category: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=70',
    tags: ['Minimalist', 'Monochrome', 'Geometry', 'Clean'],
    recommendedFont: "'Space Grotesk', sans-serif"
  },
  {
    id: 'wp-min-2',
    title: 'Nordic Dunes Fog',
    category: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=70',
    tags: ['Desert', 'Calm', 'Sand', 'Warm'],
    recommendedFont: "'Inter', sans-serif"
  },
  {
    id: 'wp-min-3',
    title: 'Brutalist Concrete Curve',
    category: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=70',
    tags: ['Brutalist', 'Interior', 'Sculptural', 'Shadow'],
    recommendedFont: "'Cinzel', serif"
  },

  // Deep Cosmos
  {
    id: 'wp-cosmic-1',
    title: 'Carina Nebula Stellar Core',
    category: 'Deep Cosmos',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=70',
    tags: ['Cosmos', 'Nebula', 'Stars', 'Deep Space'],
    recommendedFont: "'Orbitron', sans-serif"
  },
  {
    id: 'wp-cosmic-2',
    title: 'Milky Way Observatory',
    category: 'Deep Cosmos',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=70',
    tags: ['Galaxy', 'Night Sky', 'Cosmic', 'Stargazing'],
    recommendedFont: "'Cinzel', serif"
  },

  // Anime & Art
  {
    id: 'wp-anime-1',
    title: 'Mount Fuji Cherry Blossom Sunset',
    category: 'Anime & Art',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=70',
    tags: ['Japan', 'Kyoto', 'Pagoda', 'Sakura'],
    recommendedFont: "'DotGothic16', sans-serif"
  },
  {
    id: 'wp-anime-2',
    title: 'Torii Gate Golden Hour',
    category: 'Anime & Art',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=70',
    tags: ['Shinto', 'Sunset', 'Japan', 'Peaceful'],
    recommendedFont: "'Syne', sans-serif"
  },

  // Abstract 3D
  {
    id: 'wp-abstract-1',
    title: 'Liquid Chromium Iridescence',
    category: 'Abstract 3D',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=70',
    tags: ['Liquid', 'Glass', 'Gradient', 'Fluid'],
    recommendedFont: "'Syne', sans-serif"
  },
  {
    id: 'wp-abstract-2',
    title: 'Holographic Gradient Wave',
    category: 'Abstract 3D',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=70',
    tags: ['Prismatic', 'Mesh', 'Pastel', 'Modern'],
    recommendedFont: "'Space Grotesk', sans-serif"
  },

  // Gaming
  {
    id: 'wp-gaming-1',
    title: 'Dark Battlestation Ambiance',
    category: 'Gaming',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=70',
    tags: ['Retro', 'Gaming', 'CRT', 'Arcade'],
    recommendedFont: "'Press Start 2P', monospace"
  },
  {
    id: 'wp-gaming-2',
    title: 'Cyberpunk Hardware Motherboard',
    category: 'Gaming',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2560&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70',
    tags: ['Circuit', 'Silicon', 'Tech', 'Hardware'],
    recommendedFont: "'JetBrains Mono', monospace"
  }
];

export const KEYBOARD_PRESETS: KeyboardPreset[] = [
  {
    id: 'kb-cyber-matrix',
    name: 'Cyberpunk 2077',
    tagline: 'High-contrast yellow and cyan with Orbitron cyber legends',
    fontFamily: "'Orbitron', sans-serif",
    subLegend: 'katakana',
    primaryColor: '#121318',
    modifierColor: '#1e2029',
    accentColor: '#fcee0a',
    legendColor: '#00f0ff',
    chassisColor: '#0b0c10',
    rgbMode: 'rainbow-wave',
    rgbColor: '#00f0ff',
    sound: 'thock',
    shape: 'squircle'
  },
  {
    id: 'kb-olivia-luxury',
    name: 'Atelier Rose Gold',
    tagline: 'Refined dark slate with soft blush accents & Cinzel typography',
    fontFamily: "'Cinzel', serif",
    subLegend: 'runes',
    primaryColor: '#1e2124',
    modifierColor: '#2b2f36',
    accentColor: '#e0a899',
    legendColor: '#f1e7e4',
    chassisColor: '#16181b',
    rgbMode: 'solid-glow',
    rgbColor: '#e0a899',
    sound: 'thock',
    shape: 'chamfer'
  },
  {
    id: 'kb-matrix-terminal',
    name: 'Hacker Terminal 1982',
    tagline: 'Monospace phosphor green with memory address sub-legends',
    fontFamily: "'VT323', monospace",
    subLegend: 'tech-code',
    primaryColor: '#0a100d',
    modifierColor: '#121e17',
    accentColor: '#00ff66',
    legendColor: '#22c55e',
    chassisColor: '#050a07',
    rgbMode: 'reactive',
    rgbColor: '#22c55e',
    sound: 'clicky',
    shape: 'cherry'
  },
  {
    id: 'kb-cherry-blossom',
    name: 'Sakura Tokyo Bloom',
    tagline: 'Pastel blossom pink with authentic Japanese Katakana sub-legends',
    fontFamily: "'DotGothic16', sans-serif",
    subLegend: 'katakana',
    primaryColor: '#fdf2f4',
    modifierColor: '#fce7ea',
    accentColor: '#f43f5e',
    legendColor: '#4c1d24',
    chassisColor: '#fff1f2',
    rgbMode: 'breathing',
    rgbColor: '#f43f5e',
    sound: 'bubble',
    shape: 'round'
  },
  {
    id: 'kb-eva-01',
    name: 'Mecha EVA Unit-01',
    tagline: 'Neon purple & lime cybernetic anime aesthetic',
    fontFamily: "'Russo One', sans-serif",
    subLegend: 'tech-code',
    primaryColor: '#2e1065',
    modifierColor: '#3b0764',
    accentColor: '#84cc16',
    legendColor: '#a855f7',
    chassisColor: '#18022b',
    rgbMode: 'neon-pulse',
    rgbColor: '#84cc16',
    sound: 'thock',
    shape: 'squircle'
  },
  {
    id: 'kb-vintage-mac',
    name: '1984 Macintosh Beige',
    tagline: 'Iconic retro computing mechanical keyboard with Press Start font',
    fontFamily: "'Press Start 2P', monospace",
    subLegend: 'none',
    primaryColor: '#d6cfc7',
    modifierColor: '#c5bcb2',
    accentColor: '#b45309',
    legendColor: '#292524',
    chassisColor: '#bbb2a6',
    rgbMode: 'off',
    rgbColor: '#ffffff',
    sound: 'clicky',
    shape: 'cherry'
  },
  {
    id: 'kb-midnight-obsidian',
    name: 'Stealth Obsidian',
    tagline: 'Ultra-dark minimalist aesthetic with crisp Space Grotesk',
    fontFamily: "'Space Grotesk', sans-serif",
    subLegend: 'minimal-symbols',
    primaryColor: '#111215',
    modifierColor: '#181a1f',
    accentColor: '#38bdf8',
    legendColor: '#94a3b8',
    chassisColor: '#0a0a0c',
    rgbMode: 'reactive',
    rgbColor: '#38bdf8',
    sound: 'linear',
    shape: 'chiclet'
  }
];

export const DEFAULT_WALLPAPER_CONFIG: WallpaperConfig = {
  id: 'wp-default',
  title: 'Neo Shinjuku Rain',
  category: 'Cyberpunk',
  imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=2560&q=85',
  blur: 0,
  brightness: 100,
  contrast: 105,
  saturation: 110,
  vignette: 25,
  noiseGrain: false,
  overlayColor: '#000000',
  overlayOpacity: 15,
  devicePreview: 'phone-lock',
  clockVisible: true,
  clockFont: "'Orbitron', sans-serif",
  clockStyle: 'ios',
  typographyOverlay: {
    text: 'NEO FUTURE // KORME',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 28,
    fontWeight: '700',
    color: '#00f0ff',
    opacity: 90,
    letterSpacing: 4,
    textShadow: true,
    positionX: 50,
    positionY: 82,
    alignment: 'center',
    visible: true
  }
};

export const DEFAULT_KEYBOARD_CONFIG: KeyboardConfig = {
  id: 'kb-default',
  name: 'Cyberpunk 2077',
  fontFamily: "'Orbitron', sans-serif",
  subFontFamily: "'DotGothic16', sans-serif",
  subLegendType: 'katakana',
  subLegendColor: '#ff007f',
  fontSize: 13,
  fontWeight: '700',
  letterSpacing: 1,
  textTransform: 'uppercase',
  legendAlignment: 'top-left',
  legendColor: '#00f0ff',
  legendGlow: true,
  
  shape: 'squircle',
  primaryKeyColor: '#121318',
  modifierKeyColor: '#1c1e26',
  accentKeyColor: '#fcee0a',
  accentKeys: ['enter', 'space', 'escape', 'backspace'],
  chassisColor: '#0b0c10',
  chassisBorderColor: '#00f0ff40',
  keyBorderColor: '#ffffff15',
  keycapDepth: 3,
  keycapTexture: 'matte',

  rgbMode: 'reactive',
  rgbColor: '#00f0ff',
  soundProfile: 'thock',
  volume: 75
};
