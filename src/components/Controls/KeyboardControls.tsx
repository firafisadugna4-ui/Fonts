import React, { useState } from 'react';
import { KeyboardConfig, KeycapShape, KeySoundProfile, RgbMode, SubLegendType } from '../../types';
import { KEYBOARD_PRESETS } from '../../utils/presets';
import { TYPOGRAPHY_COLLECTION, FontOption } from '../../utils/typography';
import { Keyboard, Type, Palette, Volume2, Sparkles, Layers, Sliders } from 'lucide-react';

interface KeyboardControlsProps {
  config: KeyboardConfig;
  onChange: (updated: KeyboardConfig) => void;
}

export const KeyboardControls: React.FC<KeyboardControlsProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'typography' | 'appearance' | 'lighting-sound'>('typography');
  const [selectedFontCategory, setSelectedFontCategory] = useState<string>('All');

  const fontCategories = ['All', 'Cyber & Tech', 'Aesthetic Serif', 'Retro & Pixel', 'Brutalist & Heavy', 'Minimalist'];

  const filteredFonts = selectedFontCategory === 'All'
    ? TYPOGRAPHY_COLLECTION
    : TYPOGRAPHY_COLLECTION.filter(f => f.category === selectedFontCategory);

  const applyPreset = (presetId: string) => {
    const preset = KEYBOARD_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    onChange({
      ...config,
      name: preset.name,
      fontFamily: preset.fontFamily,
      subLegendType: preset.subLegend,
      primaryKeyColor: preset.primaryColor,
      modifierKeyColor: preset.modifierColor,
      accentKeyColor: preset.accentColor,
      legendColor: preset.legendColor,
      chassisColor: preset.chassisColor,
      rgbMode: preset.rgbMode,
      rgbColor: preset.rgbColor,
      soundProfile: preset.sound,
      shape: preset.shape,
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Navigation tabs */}
      <div className="flex items-center border-b border-neutral-800 p-2 gap-1 bg-neutral-950/60">
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
          <span>Fonts & Legends</span>
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
          <Sparkles className="w-3.5 h-3.5" />
          <span>Themes</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'appearance'
              ? 'bg-neutral-800 text-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Keycaps & Shape</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lighting-sound')}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'lighting-sound'
              ? 'bg-neutral-800 text-amber-400 shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>RGB & Audio</span>
        </button>
      </div>

      {/* Tab 1: Typography & Font Engine */}
      {activeTab === 'typography' && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[580px]">
          {/* Category Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {fontCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFontCategory(cat)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] transition-colors cursor-pointer ${
                  selectedFontCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-semibold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Typography Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredFonts.map((font) => {
              const isSelected = config.fontFamily === font.family;
              return (
                <div
                  key={font.id}
                  onClick={() => onChange({ ...config, fontFamily: font.family })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30'
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="font-semibold text-neutral-200">{font.name}</span>
                    <span className="text-[10px] text-amber-400/90 font-mono">{font.tag}</span>
                  </div>
                  <div
                    className="text-lg py-1 tracking-wider text-neutral-100 truncate"
                    style={{ fontFamily: font.family }}
                  >
                    {font.preview}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sub-Legend Selector */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <label className="block text-xs font-semibold text-neutral-200">
              Sub-Legends (Second Glyph on Keys)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[
                { id: 'none', label: 'None', desc: 'Single legend' },
                { id: 'katakana', label: 'Tokyo Katakana', desc: 'Japanese タ テ イ' },
                { id: 'runes', label: 'Nordic Runes', desc: 'Ancient ᚠ ᚢ ᚦ' },
                { id: 'tech-code', label: 'Hacker Code', desc: 'Registers 0x1 SYS' },
                { id: 'minimal-symbols', label: 'Minimal Glyphs', desc: 'Shapes ⬡ ◈ ✦' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onChange({ ...config, subLegendType: sub.id as SubLegendType })}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    config.subLegendType === sub.id
                      ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-medium">{sub.label}</div>
                  <div className="text-[10px] text-neutral-500 truncate">{sub.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Text Controls: Size, Transform, Glow */}
          <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">
                Font Size ({config.fontSize}px)
              </label>
              <input
                type="range"
                min="10"
                max="18"
                value={config.fontSize}
                onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Text Casing</label>
              <div className="flex bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
                {(['uppercase', 'lowercase'] as const).map((transform) => (
                  <button
                    key={transform}
                    type="button"
                    onClick={() => onChange({ ...config, textTransform: transform })}
                    className={`flex-1 py-1 text-xs font-medium rounded capitalize ${
                      config.textTransform === transform
                        ? 'bg-neutral-800 text-amber-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    {transform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Keyboard Presets */}
      {activeTab === 'presets' && (
        <div className="p-4 space-y-3 overflow-y-auto max-h-[580px]">
          <div className="text-xs text-neutral-400 mb-2">
            Curated colorways & typographic pairings ready to use or customize:
          </div>
          <div className="space-y-2">
            {KEYBOARD_PRESETS.map((preset) => {
              const isActive = config.name === preset.name;
              return (
                <div
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isActive
                      ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30'
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-neutral-100">{preset.name}</span>
                    <span className="text-[11px] text-neutral-400 line-clamp-1">{preset.tagline}</span>
                  </div>

                  {/* Swatches */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <div
                      className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: preset.primaryColor }}
                      title="Primary Key"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: preset.accentColor }}
                      title="Accent Key"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                      style={{ backgroundColor: preset.legendColor }}
                      title="Legend Text"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Keycap Shape & Palette Colors */}
      {activeTab === 'appearance' && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[580px]">
          {/* Shape selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-2">Keycap Shape & Profile</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'squircle', label: 'Squircle', desc: 'Modern Rounded' },
                { id: 'round', label: 'Round / Bubble', desc: 'Typewriter Style' },
                { id: 'chamfer', label: 'Chamfer', desc: 'Industrial Mecha' },
                { id: 'cherry', label: 'Cherry Profile', desc: 'Classic Mechanical' },
                { id: 'chiclet', label: 'Chiclet Flat', desc: 'Ultra-Minimal' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onChange({ ...config, shape: s.id as KeycapShape })}
                  className={`p-2 rounded-xl border text-left transition-colors cursor-pointer ${
                    config.shape === s.id
                      ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{s.label}</div>
                  <div className="text-[10px] text-neutral-500">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="pt-3 border-t border-neutral-800 space-y-3">
            <span className="text-xs font-semibold text-neutral-200 block">Chassis & Keycap Palette</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Primary Keys</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryKeyColor}
                    onChange={(e) => onChange({ ...config, primaryKeyColor: e.target.value })}
                    className="w-8 h-8 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-300">{config.primaryKeyColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Accent Keys (Enter/Esc)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.accentKeyColor}
                    onChange={(e) => onChange({ ...config, accentKeyColor: e.target.value })}
                    className="w-8 h-8 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-300">{config.accentKeyColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Font Legend Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.legendColor}
                    onChange={(e) => onChange({ ...config, legendColor: e.target.value })}
                    className="w-8 h-8 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-300">{config.legendColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Chassis Body Frame</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.chassisColor}
                    onChange={(e) => onChange({ ...config, chassisColor: e.target.value })}
                    className="w-8 h-8 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-300">{config.chassisColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: RGB Backlight & Sound Synthesizer */}
      {activeTab === 'lighting-sound' && (
        <div className="p-4 space-y-4 overflow-y-auto max-h-[580px]">
          {/* RGB Mode */}
          <div>
            <label className="block text-xs font-semibold text-neutral-200 mb-2">RGB Underglow & Backlighting</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'reactive', label: 'Reactive Pulse', desc: 'Keys light up when pressed' },
                { id: 'rainbow-wave', label: 'Rainbow Wave', desc: 'Smooth animated gradient' },
                { id: 'breathing', label: 'Breathing Glow', desc: 'Pulsing aura' },
                { id: 'solid-glow', label: 'Solid Glow', desc: 'Steady static backlight' },
                { id: 'off', label: 'Off / Stealth', desc: 'Zero illumination' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange({ ...config, rgbMode: m.id as RgbMode })}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    config.rgbMode === m.id
                      ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{m.label}</div>
                  <div className="text-[10px] text-neutral-500">{m.desc}</div>
                </button>
              ))}
            </div>

            {config.rgbMode !== 'off' && config.rgbMode !== 'rainbow-wave' && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-neutral-400">RGB Tint Color:</span>
                <input
                  type="color"
                  value={config.rgbColor}
                  onChange={(e) => onChange({ ...config, rgbColor: e.target.value })}
                  className="w-7 h-7 rounded border border-neutral-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-neutral-300">{config.rgbColor}</span>
              </div>
            )}
          </div>

          {/* Mechanical Switch Audio Profile */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <label className="block text-xs font-semibold text-neutral-200">
              Mechanical Switch Sound Synthesizer (Web Audio)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'thock', label: 'Brown Switch', desc: 'Deep warm thock' },
                { id: 'clicky', label: 'Blue Switch', desc: 'Crisp tactile click' },
                { id: 'linear', label: 'Red Linear', desc: 'Soft smooth clack' },
                { id: 'bubble', label: 'Bubble Pop', desc: 'Playful cute pop' },
                { id: 'cyber', label: 'Cyber Synth', desc: 'Sci-fi futuristic blip' },
                { id: 'mute', label: 'Muted', desc: 'Silent mode' },
              ].map((snd) => (
                <button
                  key={snd.id}
                  type="button"
                  onClick={() => onChange({ ...config, soundProfile: snd.id as KeySoundProfile })}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    config.soundProfile === snd.id
                      ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{snd.label}</div>
                  <div className="text-[10px] text-neutral-500">{snd.desc}</div>
                </button>
              ))}
            </div>

            {config.soundProfile !== 'mute' && (
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Audio Volume</span>
                  <span className="font-mono">{config.volume}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.volume}
                  onChange={(e) => onChange({ ...config, volume: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
