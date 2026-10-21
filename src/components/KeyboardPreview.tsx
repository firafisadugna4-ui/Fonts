import React, { useState, useEffect, useRef } from 'react';
import { KeyboardConfig, SubLegendType } from '../types';
import { SUB_LEGEND_MAPS } from '../utils/typography';
import { audioEngine } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, Terminal, RotateCcw } from 'lucide-react';

interface KeyboardPreviewProps {
  config: KeyboardConfig;
  onKeyClick?: (keyLabel: string) => void;
}

interface KeyDef {
  id: string;
  label: string;
  sub?: string;
  width?: string; // flex ratio or span
  isModifier?: boolean;
  isAccent?: boolean;
}

export const KeyboardPreview: React.FC<KeyboardPreviewProps> = ({ config, onKeyClick }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [testText, setTestText] = useState('');
  const [wpm, setWpm] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const testInputRef = useRef<HTMLInputElement>(null);

  // Key definition matrix (Compact 65% / QWERTY layout)
  const getSubLegend = (char: string): string | undefined => {
    if (config.subLegendType === 'none') return undefined;
    const lower = char.toLowerCase();
    const map = SUB_LEGEND_MAPS[config.subLegendType as keyof typeof SUB_LEGEND_MAPS];
    return map ? map[lower] : undefined;
  };

  const keyboardRows: KeyDef[][] = [
    // Number Row
    [
      { id: 'esc', label: 'ESC', isModifier: true, isAccent: true, width: 'w-10 sm:w-12' },
      { id: '1', label: '1', sub: getSubLegend('1') },
      { id: '2', label: '2', sub: getSubLegend('2') },
      { id: '3', label: '3', sub: getSubLegend('3') },
      { id: '4', label: '4', sub: getSubLegend('4') },
      { id: '5', label: '5', sub: getSubLegend('5') },
      { id: '6', label: '6', sub: getSubLegend('6') },
      { id: '7', label: '7', sub: getSubLegend('7') },
      { id: '8', label: '8', sub: getSubLegend('8') },
      { id: '9', label: '9', sub: getSubLegend('9') },
      { id: '0', label: '0', sub: getSubLegend('0') },
      { id: 'minus', label: '-' },
      { id: 'equal', label: '=' },
      { id: 'backspace', label: 'DEL', isModifier: true, isAccent: true, width: 'flex-1 min-w-12' },
    ],
    // QWERTY Row
    [
      { id: 'tab', label: 'TAB', isModifier: true, width: 'w-12 sm:w-14' },
      { id: 'q', label: 'Q', sub: getSubLegend('q') },
      { id: 'w', label: 'W', sub: getSubLegend('w') },
      { id: 'e', label: 'E', sub: getSubLegend('e') },
      { id: 'r', label: 'R', sub: getSubLegend('r') },
      { id: 't', label: 'T', sub: getSubLegend('t') },
      { id: 'y', label: 'Y', sub: getSubLegend('y') },
      { id: 'u', label: 'U', sub: getSubLegend('u') },
      { id: 'i', label: 'I', sub: getSubLegend('i') },
      { id: 'o', label: 'O', sub: getSubLegend('o') },
      { id: 'p', label: 'P', sub: getSubLegend('p') },
      { id: 'bracket_l', label: '[' },
      { id: 'bracket_r', label: ']' },
      { id: 'backslash', label: '\\', isModifier: true, width: 'flex-1' },
    ],
    // Home Row
    [
      { id: 'caps', label: 'CAPS', isModifier: true, width: 'w-14 sm:w-16' },
      { id: 'a', label: 'A', sub: getSubLegend('a') },
      { id: 's', label: 'S', sub: getSubLegend('s') },
      { id: 'd', label: 'D', sub: getSubLegend('d') },
      { id: 'f', label: 'F', sub: getSubLegend('f') },
      { id: 'g', label: 'G', sub: getSubLegend('g') },
      { id: 'h', label: 'H', sub: getSubLegend('h') },
      { id: 'j', label: 'J', sub: getSubLegend('j') },
      { id: 'k', label: 'K', sub: getSubLegend('k') },
      { id: 'l', label: 'L', sub: getSubLegend('l') },
      { id: 'semicolon', label: ';' },
      { id: 'quote', label: "'" },
      { id: 'enter', label: 'RETURN', isModifier: true, isAccent: true, width: 'flex-1 min-w-16' },
    ],
    // Shift Row
    [
      { id: 'shift_l', label: 'SHIFT', isModifier: true, width: 'w-16 sm:w-20' },
      { id: 'z', label: 'Z', sub: getSubLegend('z') },
      { id: 'x', label: 'X', sub: getSubLegend('x') },
      { id: 'c', label: 'C', sub: getSubLegend('c') },
      { id: 'v', label: 'V', sub: getSubLegend('v') },
      { id: 'b', label: 'B', sub: getSubLegend('b') },
      { id: 'n', label: 'N', sub: getSubLegend('n') },
      { id: 'm', label: 'M', sub: getSubLegend('m') },
      { id: 'comma', label: ',' },
      { id: 'period', label: '.' },
      { id: 'slash', label: '/' },
      { id: 'shift_r', label: 'SHIFT', isModifier: true, width: 'flex-1 min-w-14' },
    ],
    // Bottom Spacebar Row
    [
      { id: 'ctrl_l', label: 'CTRL', isModifier: true, width: 'w-11 sm:w-14' },
      { id: 'cmd_l', label: 'CMD', isModifier: true, width: 'w-11 sm:w-14' },
      { id: 'alt_l', label: 'ALT', isModifier: true, width: 'w-11 sm:w-14' },
      { id: 'space', label: 'KORME', isAccent: true, width: 'flex-[6] min-w-36 text-center tracking-widest' },
      { id: 'alt_r', label: 'ALT', isModifier: true, width: 'w-11 sm:w-14' },
      { id: 'fn', label: 'FN', isModifier: true, width: 'w-11 sm:w-14' },
      { id: 'ctrl_r', label: 'CTRL', isModifier: true, width: 'w-11 sm:w-14' },
    ]
  ];

  // Listen to physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      let keyId = k;
      if (k === ' ') keyId = 'space';
      if (k === 'enter') keyId = 'enter';
      if (k === 'backspace') keyId = 'backspace';
      if (k === 'escape') keyId = 'esc';
      if (k === 'tab') keyId = 'tab';
      if (k === 'capslock') keyId = 'caps';
      if (k === 'shift') keyId = 'shift_l';
      if (k === 'control') keyId = 'ctrl_l';
      if (k === 'alt') keyId = 'alt_l';
      if (k === 'meta') keyId = 'cmd_l';

      setActiveKeys((prev) => new Set(prev).add(keyId));
      audioEngine.playKey(config.soundProfile, config.volume, keyId === 'space' || keyId === 'enter');

      // Update typing stats
      if (!startTime) setStartTime(Date.now());
      setCharCount((prev) => prev + 1);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      let keyId = k;
      if (k === ' ') keyId = 'space';
      if (k === 'enter') keyId = 'enter';
      if (k === 'backspace') keyId = 'backspace';
      if (k === 'escape') keyId = 'esc';
      if (k === 'tab') keyId = 'tab';
      if (k === 'capslock') keyId = 'caps';
      if (k === 'shift') keyId = 'shift_l';
      if (k === 'control') keyId = 'ctrl_l';
      if (k === 'alt') keyId = 'alt_l';
      if (k === 'meta') keyId = 'cmd_l';

      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(keyId);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [config.soundProfile, config.volume, startTime]);

  // Calculate WPM
  useEffect(() => {
    if (!startTime || charCount === 0) return;
    const interval = setInterval(() => {
      const elapsedMins = (Date.now() - startTime) / 60000;
      if (elapsedMins > 0) {
        const words = charCount / 5;
        setWpm(Math.round(words / elapsedMins));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, charCount]);

  const handleKeyTouch = (key: KeyDef) => {
    setActiveKeys((prev) => new Set(prev).add(key.id));
    audioEngine.playKey(config.soundProfile, config.volume, key.id === 'space' || key.id === 'enter');
    if (onKeyClick) onKeyClick(key.label);

    setTimeout(() => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(key.id);
        return next;
      });
    }, 120);
  };

  // Border radius based on shape
  const getRadiusClass = (shape: KeyboardConfig['shape']) => {
    switch (shape) {
      case 'round': return 'rounded-full';
      case 'squircle': return 'rounded-xl';
      case 'chamfer': return 'rounded-sm';
      case 'chiclet': return 'rounded-md';
      case 'cherry':
      default: return 'rounded-lg';
    }
  };

  // Backlight style
  const getBacklightStyle = () => {
    if (config.rgbMode === 'off') return {};
    if (config.rgbMode === 'rainbow-wave') {
      return {
        background: 'linear-gradient(90deg, #ff0077, #7700ff, #00d4ff, #00ff66, #ffdd00, #ff0077)',
        backgroundSize: '300% 300%',
        animation: 'rgb-wave 5s linear infinite',
        opacity: 0.85,
        filter: 'blur(10px)',
      };
    }
    if (config.rgbMode === 'breathing') {
      return {
        backgroundColor: config.rgbColor,
        opacity: 0.6,
        filter: 'blur(12px)',
        animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      };
    }
    return {
      backgroundColor: config.rgbColor,
      opacity: 0.5,
      filter: 'blur(10px)',
    };
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2 px-1">
      {/* Mechanical Keyboard Chassis Frame */}
      <div className="relative w-full max-w-4xl p-3 sm:p-5 rounded-3xl transition-all duration-300 shadow-2xl overflow-hidden"
        style={{
          backgroundColor: config.chassisColor,
          border: `2px solid ${config.chassisBorderColor || '#27272a'}`,
          boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px ${config.rgbColor}20`
        }}
      >
        {/* RGB Underglow glow layer */}
        {config.rgbMode !== 'off' && (
          <div
            className="absolute inset-0 pointer-events-none -z-10 rounded-3xl"
            style={getBacklightStyle()}
          />
        )}

        {/* Chassis Brand Plate Header */}
        <div className="flex items-center justify-between pb-3 px-1 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.accentKeyColor }} />
            <span className="font-bold tracking-widest uppercase text-neutral-300" style={{ fontFamily: config.fontFamily }}>
              {config.name || 'KORME CUSTOM MECHANICAL'}
            </span>
            <span className="text-neutral-500 text-[11px] font-mono">[{config.shape.toUpperCase()}]</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
            <span className="hidden sm:inline font-mono">Font: {config.fontFamily.replace(/['",]/g, '')}</span>
            <div className="flex items-center gap-1">
              {config.soundProfile === 'mute' ? (
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="capitalize">{config.soundProfile}</span>
            </div>
          </div>
        </div>

        {/* Interactive Keyboard Matrix */}
        <div className="mt-3.5 flex flex-col gap-1.5 sm:gap-2">
          {keyboardRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 sm:gap-1.5 w-full justify-between">
              {row.map((key) => {
                const isPressed = activeKeys.has(key.id);
                const isAccent = key.isAccent || config.accentKeys.includes(key.id);
                
                // Color selection
                const keyBg = isAccent
                  ? config.accentKeyColor
                  : key.isModifier
                  ? config.modifierKeyColor
                  : config.primaryKeyColor;

                const legendColor = isAccent && (keyBg.toLowerCase() === '#fcee0a' || keyBg.toLowerCase() === '#ffffff')
                  ? '#09090b'
                  : config.legendColor;

                const glowEffect = config.legendGlow
                  ? `0 0 8px ${legendColor}80`
                  : 'none';

                return (
                  <button
                    key={key.id}
                    type="button"
                    onMouseDown={() => handleKeyTouch(key)}
                    className={`relative h-11 sm:h-13 ${key.width || 'flex-1'} ${getRadiusClass(
                      config.shape
                    )} keycap-bevel transition-all flex flex-col justify-between p-1.5 cursor-pointer select-none active:scale-95 ${
                      isPressed ? 'keycap-pressed' : ''
                    }`}
                    style={{
                      backgroundColor: keyBg,
                      border: `1px solid ${config.keyBorderColor || '#ffffff15'}`,
                      transform: isPressed ? 'translateY(2px)' : 'none',
                      boxShadow: isPressed
                        ? `0 1px 2px rgba(0,0,0,0.5), 0 0 12px ${config.rgbColor}`
                        : undefined
                    }}
                  >
                    {/* Primary Legend */}
                    <div className="w-full flex items-start justify-between">
                      <span
                        className="font-bold tracking-wider leading-none transition-all"
                        style={{
                          fontFamily: config.fontFamily,
                          fontSize: `${config.fontSize}px`,
                          fontWeight: config.fontWeight,
                          color: legendColor,
                          textShadow: glowEffect,
                          textTransform: config.textTransform,
                          letterSpacing: `${config.letterSpacing}px`
                        }}
                      >
                        {key.label}
                      </span>

                      {/* Sub-legend (Katakana / Runes / Tech Code) */}
                      {key.sub && config.subLegendType !== 'none' && (
                        <span
                          className="text-[10px] sm:text-[11px] opacity-75 font-mono leading-none"
                          style={{
                            color: config.subLegendColor || '#ff007f',
                            fontFamily: config.subFontFamily || "'DotGothic16', sans-serif"
                          }}
                        >
                          {key.sub}
                        </span>
                      )}
                    </div>

                    {/* Subtle keycap depth indicator / bottom tactile dot */}
                    <div className="w-full flex justify-end">
                      {key.id === 'f' || key.id === 'j' ? (
                        <div className="w-2.5 h-0.5 rounded-full bg-white/40 mb-0.5" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Live Keystroke Testing Console & WPM Meter */}
      <div className="w-full max-w-4xl mt-4 p-3 bg-neutral-900/90 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            ref={testInputRef}
            type="text"
            placeholder="Click here and type to test custom fonts, mechanical switch sounds & RGB..."
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="flex-1 bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-1.5 text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-500/80"
          />
        </div>

        <div className="flex items-center gap-4 text-neutral-400 shrink-0">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-neutral-500">Speed:</span>
            <span className="text-amber-400 font-bold text-sm">{wpm}</span>
            <span className="text-[10px] text-neutral-500">WPM</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-neutral-500">Keys:</span>
            <span className="text-neutral-200 font-bold">{charCount}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setTestText('');
              setCharCount(0);
              setWpm(0);
              setStartTime(null);
            }}
            className="p-1 hover:text-neutral-200 text-neutral-500 transition-colors"
            title="Reset Typing Stats"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
