import React, { useState } from 'react';
import { WallpaperConfig, WallpaperPreset, PreviewDevice } from '../../types';
import { WALLPAPER_PRESETS } from '../../utils/presets';
import { TYPOGRAPHY_COLLECTION } from '../../utils/typography';
import { Image, Sliders, Type, Smartphone, Monitor, Eye, Upload, Sparkles, Wand2, RefreshCw, Check, ArrowRight, Download, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WallpaperControlsProps {
  config: WallpaperConfig;
  onChange: (updated: WallpaperConfig) => void;
  onOpenPhoneDownload?: () => void;
}

interface GeneratedWallpaperItem {
  id: string;
  imageUrl: string;
  prompt: string;
  title: string;
  style: string;
  aspectRatio: string;
  timestamp: string;
  recommendedFont?: string;
}

// Initial pre-generated AI masterworks
const INITIAL_AI_GENERATIONS: GeneratedWallpaperItem[] = [
  {
    id: 'gen-ai-1',
    imageUrl: '/src/assets/images/cyberpunk_rain_neon_1792540653843.jpg',
    prompt: 'Futuristic Tokyo alley at night in the rain with glowing neon signs in cyan and magenta, reflective puddles, high-tech architectural details, 8k resolution',
    title: 'Neo Shinjuku Cyber Rain',
    style: 'Cyberpunk',
    aspectRatio: '9:16',
    timestamp: 'Just now',
    recommendedFont: "'Orbitron', sans-serif",
  },
  {
    id: 'gen-ai-2',
    imageUrl: '/src/assets/images/cosmic_nebula_core_1792540653662.jpg',
    prompt: 'Deep cosmos wallpaper with vibrant glowing purple and gold nebula clouds, sparkling stellar dust, celestial aura, cosmic horizon, ultra-detailed 8k',
    title: 'Cosmic Stellar Nebula',
    style: 'Deep Cosmos',
    aspectRatio: '9:16',
    timestamp: 'Just now',
    recommendedFont: "'Orbitron', sans-serif",
  },
  {
    id: 'gen-ai-3',
    imageUrl: '/src/assets/images/minimalist_zen_stone_1792540653441.jpg',
    prompt: 'Minimalist architectural interior with smooth curved concrete walls, sculptural zen black stone, soft warm golden hour sunbeam casting long elegant shadows',
    title: 'Minimalist Zen Architecture',
    style: 'Minimalist',
    aspectRatio: '9:16',
    timestamp: 'Just now',
    recommendedFont: "'Space Grotesk', sans-serif",
  },
];

const INSPIRATION_PROMPTS = [
  'Futuristic neo-Tokyo rain-soaked boulevard with glowing magenta holographic signs, reflective wet asphalt, dark cinematic lighting, 8k wallpaper',
  'Deep space stellar nursery with vibrant gold and amethyst nebula clouds, celestial planetary rings, sparkling star clusters',
  'Minimalist architectural interior with smooth curved concrete walls, sculptural zen black stone, warm golden hour sunbeam',
  'Liquid chromatic mercury waves with iridescent rainbow oil-slick sheen, glossy 3D fluid glass abstraction',
  'Retro 80s arcade sunset grid with palm silhouettes, glowing magenta mountains, outrun synthwave aesthetic',
  'Ethereal anime cherry blossom shrine atop misty mountain at twilight with golden lanterns and falling sakura petals',
  'Dark cybernetic battlestation motherboard circuits with pulsing emerald fiber-optic traces and glowing heatsinks',
  'Nordic brutalist mountain observatory shrouded in morning mist, minimalist geometric concrete, soft diffused light',
];

export const WallpaperControls: React.FC<WallpaperControlsProps> = ({ config, onChange, onOpenPhoneDownload }) => {
  const [activeTab, setActiveTab] = useState<'ai-generate' | 'presets' | 'adjust' | 'typography'>('ai-generate');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customUrl, setCustomUrl] = useState('');

  // AI Generator State
  const [aiPrompt, setAiPrompt] = useState('Futuristic Tokyo alley at night in the rain with glowing neon signs in cyan and magenta, reflective puddles, 8k resolution');
  const [aiStyle, setAiStyle] = useState('Cyberpunk');
  const [aiAspectRatio, setAiAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '3:4'>('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedList, setGeneratedList] = useState<GeneratedWallpaperItem[]>(INITIAL_AI_GENERATIONS);
  const [activeGenerated, setActiveGenerated] = useState<GeneratedWallpaperItem | null>(INITIAL_AI_GENERATIONS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const categories = ['All', 'Cyberpunk', 'Minimalist', 'Deep Cosmos', 'Anime & Art', 'Abstract 3D', 'Gaming'];

  const filteredPresets = selectedCategory === 'All'
    ? WALLPAPER_PRESETS
    : WALLPAPER_PRESETS.filter(p => p.category === selectedCategory);

  const handleSelectPreset = (preset: WallpaperPreset) => {
    onChange({
      ...config,
      title: preset.title,
      category: preset.category,
      imageUrl: preset.url,
      typographyOverlay: {
        ...config.typographyOverlay,
        fontFamily: preset.recommendedFont || config.typographyOverlay.fontFamily,
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            ...config,
            title: file.name.replace(/\.[^/.]+$/, ''),
            imageUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Prompt Inspiration cycle
  const handleSurprisePrompt = () => {
    const random = INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
    setAiPrompt(random);
  };

  // AI Generation Handler
  const handleGenerateAiWallpaper = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/generate-wallpaper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          aspectRatio: aiAspectRatio,
          style: aiStyle,
        }),
      });

      if (!res.ok) {
        throw new Error(`Generation failed with status ${res.status}`);
      }

      const data = await res.json();
      if (!data.imageUrl) {
        throw new Error('No image returned from generation engine');
      }

      const newItem: GeneratedWallpaperItem = {
        id: `ai_${Date.now()}`,
        imageUrl: data.imageUrl,
        prompt: aiPrompt.trim(),
        title: data.title || `${aiStyle} AI Wallpaper`,
        style: aiStyle,
        aspectRatio: aiAspectRatio,
        timestamp: 'Just now',
        recommendedFont: data.recommendedFont,
      };

      setGeneratedList((prev) => [newItem, ...prev]);
      setActiveGenerated(newItem);

      // Automatically apply to active wallpaper configuration
      onChange({
        ...config,
        title: newItem.title,
        category: aiStyle,
        imageUrl: newItem.imageUrl,
        typographyOverlay: {
          ...config.typographyOverlay,
          fontFamily: data.recommendedFont || config.typographyOverlay.fontFamily,
        },
      });

      setSaveSuccess(true);
      try {
        confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
      } catch {}
    } catch (err: any) {
      console.error('AI generation error:', err);
      setGenerationError(err?.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Explicit Save & Apply
  const handleApplyGenerated = (item: GeneratedWallpaperItem) => {
    setActiveGenerated(item);
    onChange({
      ...config,
      title: item.title,
      category: item.style,
      imageUrl: item.imageUrl,
      typographyOverlay: {
        ...config.typographyOverlay,
        fontFamily: item.recommendedFont || config.typographyOverlay.fontFamily,
      },
    });

    setSaveSuccess(true);
    try {
      confetti({ particleCount: 30, spread: 40 });
    } catch {}
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Quick Save to Phone Gallery Action Header */}
      {onOpenPhoneDownload && (
        <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-950/70 via-neutral-950 to-teal-950/70 border-b border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-200 font-semibold text-[11px]">Need this on your phone?</span>
          </div>
          <button
            type="button"
            onClick={onOpenPhoneDownload}
            className="py-1 px-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-extrabold text-[11px] rounded-lg shadow-sm flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Save to Phone Gallery</span>
          </button>
        </div>
      )}

      {/* Sub-navigation tabs with prominent AI Generate tab */}
      <div className="flex items-center border-b border-neutral-800 p-2 gap-1 bg-neutral-950/60">
        <button
          type="button"
          onClick={() => setActiveTab('ai-generate')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'ai-generate'
              ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Generate</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-neutral-800 text-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Gallery</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('adjust')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'adjust'
              ? 'bg-neutral-800 text-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'typography'
              ? 'bg-neutral-800 text-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Overlay</span>
        </button>
      </div>

      {/* Device Viewport Selector Bar */}
      <div className="px-4 py-2.5 bg-neutral-950/40 border-b border-neutral-800/80 flex items-center justify-between text-xs">
        <span className="text-neutral-400 font-medium">Preview Device:</span>
        <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
          {[
            { id: 'phone-lock', label: 'Lockscreen', icon: Smartphone },
            { id: 'phone-home', label: 'Homescreen', icon: Smartphone },
            { id: 'desktop', label: 'Desktop 4K', icon: Monitor },
            { id: 'minimal', label: 'Canvas', icon: Eye },
          ].map((dev) => (
            <button
              key={dev.id}
              type="button"
              onClick={() => onChange({ ...config, devicePreview: dev.id as PreviewDevice })}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                config.devicePreview === dev.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <dev.icon className="w-3 h-3" />
              <span>{dev.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB: AI Generate Background (The Feature Requested) */}
      {activeTab === 'ai-generate' && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[580px]">
          {/* Header & Inspiration Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                <span>AI Background Generator</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Describe any wallpaper vision to synthesize custom high-res imagery
              </p>
            </div>
            <button
              type="button"
              onClick={handleSurprisePrompt}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Get prompt idea"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>Inspire Me</span>
            </button>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleGenerateAiWallpaper} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                Wallpaper Prompt
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Neon rain-soaked Tokyo alleyway with futuristic holographic signs and reflective wet pavement..."
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Aesthetic Style Selector */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
                Aesthetic Style Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { id: 'Cyberpunk', label: 'Cyberpunk Neon' },
                  { id: 'Deep Cosmos', label: 'Deep Cosmos' },
                  { id: 'Minimalist', label: 'Minimalist Zen' },
                  { id: 'Anime & Art', label: 'Anime Tokyo' },
                  { id: 'Abstract 3D', label: '3D Fluid Glass' },
                  { id: 'Gaming', label: 'Retro Synthwave' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setAiStyle(s.id)}
                    className={`px-2 py-1.5 text-[11px] rounded-lg border text-left transition-colors cursor-pointer ${
                      aiStyle === s.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-200 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
                Target Resolution & Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: '9:16', label: 'Phone', sub: '9:16' },
                  { id: '16:9', label: 'Desktop', sub: '16:9' },
                  { id: '1:1', label: 'Square', sub: '1:1' },
                  { id: '3:4', label: 'Tablet', sub: '3:4' },
                ].map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAiAspectRatio(ar.id as typeof aiAspectRatio)}
                    className={`py-1.5 px-2 text-center rounded-lg border transition-colors cursor-pointer ${
                      aiAspectRatio === ar.id
                        ? 'border-amber-500 bg-amber-500/10 text-amber-200 font-semibold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-[11px]">{ar.label}</div>
                    <div className="text-[9px] text-neutral-500">{ar.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {generationError && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300">
                {generationError}
              </div>
            )}

            {/* Generation Button */}
            <button
              type="submit"
              disabled={isGenerating || !aiPrompt.trim()}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 hover:from-amber-400 hover:to-cyan-300 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing AI Background...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Background with AI</span>
                </>
              )}
            </button>
          </form>

          {/* Active Generation Preview & Direct Save Action */}
          {activeGenerated && (
            <div className="pt-3 border-t border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-200">Selected AI Generation</span>
                {saveSuccess ? (
                  <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved to Configuration!
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-500">{activeGenerated.timestamp}</span>
                )}
              </div>

              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 group">
                <img
                  src={activeGenerated.imageUrl}
                  alt={activeGenerated.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-xs font-bold text-white line-clamp-1">{activeGenerated.title}</span>
                  <span className="text-[10px] text-neutral-300 line-clamp-1">{activeGenerated.prompt}</span>
                </div>
              </div>

              {/* Direct Save & Apply Button */}
              <button
                type="button"
                onClick={() => handleApplyGenerated(activeGenerated)}
                className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Save Directly to Wallpaper Configuration</span>
              </button>
            </div>
          )}

          {/* Recent AI Generations Strip */}
          {generatedList.length > 0 && (
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-300">Recent AI Generations</span>
                <span className="text-[10px] text-neutral-500 font-mono">{generatedList.length} ready</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {generatedList.map((item) => {
                  const isCurrent = config.imageUrl === item.imageUrl;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleApplyGenerated(item)}
                      className={`group relative aspect-[3/4] rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-[1.02]'
                          : 'border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                        <span className="text-[10px] font-medium text-white truncate">{item.title}</span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[9px] font-bold shadow">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: High-Res Wallpaper Gallery & Upload */}
      {activeTab === 'presets' && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[580px]">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-semibold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Wallpaper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredPresets.map((preset) => {
              const isSelected = config.imageUrl === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative aspect-[3/4] rounded-xl overflow-hidden border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30 scale-[1.02]'
                      : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <img
                    src={preset.thumbnail}
                    alt={preset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-xs font-semibold text-white drop-shadow-sm line-clamp-1">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {preset.category}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold shadow">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom Upload & URL Input */}
          <div className="pt-2 border-t border-neutral-800/80 space-y-2">
            <span className="text-xs font-medium text-neutral-300 block">Use Custom High-Resolution Image</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste high-res image URL (e.g. Unsplash)..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customUrl.trim()) {
                    onChange({ ...config, imageUrl: customUrl.trim(), title: 'Custom Wallpaper' });
                    setCustomUrl('');
                  }
                }}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-200 cursor-pointer"
              >
                Apply
              </button>
            </div>

            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 border border-dashed border-neutral-700 hover:border-amber-500/80 bg-neutral-950/60 rounded-xl text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Upload Local Photo / Wallpaper PNG</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Adjustments & Filters */}
      {activeTab === 'adjust' && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[580px]">
          {/* Sliders */}
          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Gaussian Blur</span>
                <span className="font-mono text-neutral-500">{config.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={config.blur}
                onChange={(e) => onChange({ ...config, blur: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Brightness</span>
                <span className="font-mono text-neutral-500">{config.brightness}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="160"
                step="5"
                value={config.brightness}
                onChange={(e) => onChange({ ...config, brightness: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Contrast</span>
                <span className="font-mono text-neutral-500">{config.contrast}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="160"
                step="5"
                value={config.contrast}
                onChange={(e) => onChange({ ...config, contrast: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Vignette Edge Shadow</span>
                <span className="font-mono text-neutral-500">{config.vignette}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={config.vignette}
                onChange={(e) => onChange({ ...config, vignette: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-1">
                <span>Dark Contrast Tint Overlay</span>
                <span className="font-mono text-neutral-500">{config.overlayOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="5"
                value={config.overlayOpacity}
                onChange={(e) => onChange({ ...config, overlayOpacity: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Clock Display Settings */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-300">Lockscreen Clock Overlay</span>
              <input
                type="checkbox"
                checked={config.clockVisible}
                onChange={(e) => onChange({ ...config, clockVisible: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {config.clockVisible && (
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Clock Typography Style</label>
                <select
                  value={config.clockFont}
                  onChange={(e) => onChange({ ...config, clockFont: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200"
                >
                  {TYPOGRAPHY_COLLECTION.map((f) => (
                    <option key={f.id} value={f.family}>
                      {f.name} ({f.tag})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Typographic Text Overlay */}
      {activeTab === 'typography' && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[580px]">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <span className="text-xs font-semibold text-neutral-200">Show Typographic Quote / Brand</span>
            <input
              type="checkbox"
              checked={config.typographyOverlay.visible}
              onChange={(e) =>
                onChange({
                  ...config,
                  typographyOverlay: { ...config.typographyOverlay, visible: e.target.checked }
                })
              }
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {config.typographyOverlay.visible && (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Custom Text</label>
                <input
                  type="text"
                  placeholder="e.g. NEO FUTURE // KORME"
                  value={config.typographyOverlay.text}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      typographyOverlay: { ...config.typographyOverlay, text: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Font Family</label>
                <select
                  value={config.typographyOverlay.fontFamily}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      typographyOverlay: { ...config.typographyOverlay, fontFamily: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-100"
                >
                  {TYPOGRAPHY_COLLECTION.map((f) => (
                    <option key={f.id} value={f.family}>
                      {f.name} — {f.preview}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Font Size ({config.typographyOverlay.fontSize}px)</label>
                  <input
                    type="range"
                    min="14"
                    max="64"
                    value={config.typographyOverlay.fontSize}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        typographyOverlay: { ...config.typographyOverlay, fontSize: Number(e.target.value) }
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Letter Spacing ({config.typographyOverlay.letterSpacing}px)</label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={config.typographyOverlay.letterSpacing}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        typographyOverlay: { ...config.typographyOverlay, letterSpacing: Number(e.target.value) }
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Vertical Position ({config.typographyOverlay.positionY}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={config.typographyOverlay.positionY}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        typographyOverlay: { ...config.typographyOverlay, positionY: Number(e.target.value) }
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.typographyOverlay.color}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          typographyOverlay: { ...config.typographyOverlay, color: e.target.value }
                        })
                      }
                      className="w-8 h-8 rounded border border-neutral-700 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-neutral-400">{config.typographyOverlay.color}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
