export type AppMode = 'wallpaper' | 'keyboard' | 'split' | 'community';

export type PreviewDevice = 'phone-lock' | 'phone-home' | 'desktop' | 'minimal';

export type KeycapShape = 'squircle' | 'round' | 'chamfer' | 'cherry' | 'chiclet';

export type KeySoundProfile = 'thock' | 'clicky' | 'linear' | 'bubble' | 'cyber' | 'mute';

export type RgbMode = 'off' | 'reactive' | 'rainbow-wave' | 'breathing' | 'solid-glow' | 'neon-pulse';

export type SubLegendType = 'none' | 'katakana' | 'runes' | 'tech-code' | 'minimal-symbols';

export type LegendAlignment = 'top-left' | 'center' | 'bottom-right';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  plan: 'pro' | 'creator';
  createdAt: string;
}

export interface WallpaperTypography {
  text: string;
  fontFamily: string;
  fontSize: number; // 16 to 120
  fontWeight: string;
  color: string;
  opacity: number;
  letterSpacing: number;
  textShadow: boolean;
  positionX: number; // 0 to 100 percentage
  positionY: number; // 0 to 100 percentage
  alignment: 'left' | 'center' | 'right';
  visible: boolean;
}

export interface WallpaperConfig {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  gradient?: string;
  blur: number; // 0 to 30px
  brightness: number; // 50 to 150%
  contrast: number; // 50 to 150%
  saturation: number; // 0 to 200%
  vignette: number; // 0 to 100%
  noiseGrain: boolean;
  overlayColor: string;
  overlayOpacity: number;
  devicePreview: PreviewDevice;
  clockVisible: boolean;
  clockFont: string;
  clockStyle: 'ios' | 'minimal-cyber' | 'stacked' | 'analog';
  typographyOverlay: WallpaperTypography;
}

export interface KeyboardConfig {
  id: string;
  name: string;
  fontFamily: string;
  subFontFamily: string;
  subLegendType: SubLegendType;
  subLegendColor: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: number;
  textTransform: 'uppercase' | 'lowercase' | 'capitalize';
  legendAlignment: LegendAlignment;
  legendColor: string;
  legendGlow: boolean;
  
  // Keycap Appearance
  shape: KeycapShape;
  primaryKeyColor: string;
  modifierKeyColor: string;
  accentKeyColor: string;
  accentKeys: string[]; // key ids that get accent color
  chassisColor: string;
  chassisBorderColor: string;
  keyBorderColor: string;
  keycapDepth: number; // 1 to 5
  keycapTexture: 'matte' | 'gloss' | 'brushed' | 'frosted-glass';

  // Lighting & Sound
  rgbMode: RgbMode;
  rgbColor: string;
  soundProfile: KeySoundProfile;
  volume: number; // 0 to 100
}

export interface KormeProject {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  wallpaper: WallpaperConfig;
  keyboard: KeyboardConfig;
  tags: string[];
  likes: number;
  isPublic: boolean;
  remixedFrom?: string;
}

export interface WallpaperPreset {
  id: string;
  title: string;
  category: 'Cyberpunk' | 'Minimalist' | 'Anime & Art' | 'Deep Cosmos' | 'Abstract 3D' | 'Glassmorphism' | 'Gaming' | 'Typography';
  url: string;
  thumbnail: string;
  tags: string[];
  recommendedFont: string;
}

export interface KeyboardPreset {
  id: string;
  name: string;
  tagline: string;
  fontFamily: string;
  subLegend: SubLegendType;
  primaryColor: string;
  modifierColor: string;
  accentColor: string;
  legendColor: string;
  chassisColor: string;
  rgbMode: RgbMode;
  rgbColor: string;
  sound: KeySoundProfile;
  shape: KeycapShape;
}
