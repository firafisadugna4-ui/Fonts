import React, { useState, useEffect } from 'react';
import { WallpaperConfig } from '../types';
import { Wifi, Battery, Flashlight, Camera, Monitor, Smartphone, Maximize2, Sparkles, MessageSquare, Music } from 'lucide-react';

interface WallpaperPreviewProps {
  config: WallpaperConfig;
  onUpdateTypography?: (updates: Partial<WallpaperConfig['typographyOverlay']>) => void;
  interactive?: boolean;
  onOpenPhoneDownload?: () => void;
}

export const WallpaperPreview: React.FC<WallpaperPreviewProps> = ({ config, onOpenPhoneDownload }) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [currentDate, setCurrentDate] = useState('Tuesday, October 20');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const device = config.devicePreview;

  // Filter styling string
  const filterStyle = {
    filter: `blur(${config.blur}px) brightness(${config.brightness}%) contrast(${config.contrast}%) saturate(${config.saturation}%)`,
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3 select-none overflow-hidden">
      {/* Phone Lock Screen Preview */}
      {device === 'phone-lock' && (
        <div className="relative w-[310px] sm:w-[350px] h-[640px] sm:h-[690px] rounded-[48px] p-3.5 bg-neutral-900 border-[6px] border-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col justify-between">
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3 border border-neutral-800">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          {/* Wallpaper Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[40px] bg-neutral-950">
            <img
              src={config.imageUrl}
              alt={config.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-150"
              style={filterStyle}
            />

            {/* Dark overlay tint */}
            {config.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: config.overlayColor,
                  opacity: config.overlayOpacity / 100,
                }}
              />
            )}

            {/* Vignette */}
            {config.vignette > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, transparent 35%, rgba(0,0,0,${config.vignette / 100}) 100%)`,
                }}
              />
            )}

            {/* Custom Typography Overlay */}
            {config.typographyOverlay.visible && config.typographyOverlay.text && (
              <div
                className="absolute pointer-events-none transition-all duration-150 px-4"
                style={{
                  left: `${config.typographyOverlay.positionX}%`,
                  top: `${config.typographyOverlay.positionY}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: config.typographyOverlay.fontFamily,
                  fontSize: `${config.typographyOverlay.fontSize}px`,
                  fontWeight: config.typographyOverlay.fontWeight,
                  color: config.typographyOverlay.color,
                  opacity: config.typographyOverlay.opacity / 100,
                  letterSpacing: `${config.typographyOverlay.letterSpacing}px`,
                  textAlign: config.typographyOverlay.alignment,
                  textShadow: config.typographyOverlay.textShadow
                    ? '0 4px 12px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.6)'
                    : 'none',
                }}
              >
                {config.typographyOverlay.text}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="relative z-20 flex items-center justify-between text-neutral-100 text-xs px-6 pt-1">
            <span className="font-semibold text-[13px] tracking-tight">{currentTime}</span>
            <div className="flex items-center gap-2 text-neutral-200">
              <Wifi className="w-3.5 h-3.5" />
              <div className="text-[10px] font-bold">5G</div>
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Lock Screen Clock & Date */}
          {config.clockVisible && (
            <div className="relative z-20 flex flex-col items-center mt-12 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              <span className="text-xs font-medium text-neutral-200/90 tracking-wide mb-1">
                {currentDate}
              </span>
              <h1
                className="text-6xl sm:text-7xl font-light tracking-tight text-white leading-none"
                style={{ fontFamily: config.clockFont }}
              >
                {currentTime}
              </h1>
            </div>
          )}

          {/* Interactive Lockscreen Widget / Notification Banner */}
          <div className="relative z-20 mx-3 my-auto">
            <div 
              onClick={onOpenPhoneDownload}
              className="p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-white shadow-xl space-y-1.5 cursor-pointer hover:bg-black/60 transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <div className="w-4 h-4 rounded bg-amber-500/90 flex items-center justify-center text-[10px] text-black font-bold">K</div>
                  <span>korme.com Wallpaper</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Ready to Use
                </span>
              </div>
              <p className="text-xs text-neutral-100 font-bold group-hover:text-amber-400 transition-colors">
                {config.title}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
                <span className="text-neutral-300">1440 × 3120 AMOLED</span>
                <span className="text-amber-300 font-semibold flex items-center gap-1 group-hover:underline">
                  Save to Gallery →
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Flashlight, Home indicator, Camera */}
          <div className="relative z-20 flex flex-col items-center gap-4 pb-2 px-6">
            <div className="w-full flex items-center justify-between">
              <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90">
                <Flashlight className="w-5 h-5" />
              </div>
              <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            {/* Home Bar */}
            <div className="w-32 h-1 bg-white/70 rounded-full" />
          </div>
        </div>
      )}

      {/* Phone Home Screen with App Grid */}
      {device === 'phone-home' && (
        <div className="relative w-[310px] sm:w-[350px] h-[640px] sm:h-[690px] rounded-[48px] p-3.5 bg-neutral-900 border-[6px] border-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[40px] bg-neutral-950">
            <img
              src={config.imageUrl}
              alt={config.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              style={filterStyle}
            />
            {config.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: config.overlayColor, opacity: config.overlayOpacity / 100 }}
              />
            )}
            {/* Custom Typography Overlay */}
            {config.typographyOverlay.visible && config.typographyOverlay.text && (
              <div
                className="absolute pointer-events-none transition-all duration-150 px-4"
                style={{
                  left: `${config.typographyOverlay.positionX}%`,
                  top: `${config.typographyOverlay.positionY}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: config.typographyOverlay.fontFamily,
                  fontSize: `${config.typographyOverlay.fontSize}px`,
                  color: config.typographyOverlay.color,
                  opacity: config.typographyOverlay.opacity / 100,
                  letterSpacing: `${config.typographyOverlay.letterSpacing}px`,
                  textAlign: config.typographyOverlay.alignment,
                }}
              >
                {config.typographyOverlay.text}
              </div>
            )}
          </div>

          {/* Top Status */}
          <div className="relative z-20 flex items-center justify-between text-neutral-100 text-xs px-6 pt-1">
            <span className="font-semibold text-[13px]">{currentTime}</span>
            <div className="flex items-center gap-2 text-neutral-200">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Icons Grid */}
          <div className="relative z-20 px-4 pt-6 grid grid-cols-4 gap-y-5 gap-x-3 text-center">
            {[
              { name: 'Korme', icon: 'K', bg: 'from-amber-400 to-amber-600' },
              { name: 'Studio', icon: '✦', bg: 'from-cyan-400 to-blue-600' },
              { name: 'Fonts', icon: 'Aa', bg: 'from-purple-500 to-indigo-600' },
              { name: 'Gallery', icon: '❖', bg: 'from-rose-500 to-pink-600' },
              { name: 'Cloud', icon: '☁', bg: 'from-emerald-400 to-teal-600' },
              { name: 'Camera', icon: '📷', bg: 'from-neutral-700 to-neutral-800' },
              { name: 'Safari', icon: '🧭', bg: 'from-sky-400 to-blue-500' },
              { name: 'Music', icon: '♬', bg: 'from-red-500 to-rose-600' },
            ].map((app, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.bg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {app.icon}
                </div>
                <span className="text-[11px] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium">
                  {app.name}
                </span>
              </div>
            ))}
          </div>

          {/* Dock */}
          <div className="relative z-20 p-2.5 mx-3 mb-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-[28px] grid grid-cols-4 gap-3 text-center">
            {['📱', '💬', '✉️', '⚙️'].map((emoji, idx) => (
              <div key={idx} className="w-12 h-12 mx-auto rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-lg shadow-sm">
                {emoji}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop 4K Ultrawide / 16:9 Preview */}
      {device === 'desktop' && (
        <div className="relative w-full max-w-4xl aspect-[16/10] bg-neutral-900 rounded-2xl border border-neutral-700/80 shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* Wallpaper Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-950">
            <img
              src={config.imageUrl}
              alt={config.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              style={filterStyle}
            />
            {config.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: config.overlayColor, opacity: config.overlayOpacity / 100 }}
              />
            )}
            {config.vignette > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, transparent 35%, rgba(0,0,0,${config.vignette / 100}) 100%)`,
                }}
              />
            )}
            {config.typographyOverlay.visible && config.typographyOverlay.text && (
              <div
                className="absolute pointer-events-none transition-all duration-150 px-6"
                style={{
                  left: `${config.typographyOverlay.positionX}%`,
                  top: `${config.typographyOverlay.positionY}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: config.typographyOverlay.fontFamily,
                  fontSize: `${config.typographyOverlay.fontSize * 1.5}px`,
                  fontWeight: config.typographyOverlay.fontWeight,
                  color: config.typographyOverlay.color,
                  opacity: config.typographyOverlay.opacity / 100,
                  letterSpacing: `${config.typographyOverlay.letterSpacing}px`,
                  textAlign: config.typographyOverlay.alignment,
                  textShadow: config.typographyOverlay.textShadow
                    ? '0 6px 16px rgba(0,0,0,0.8)'
                    : 'none',
                }}
              >
                {config.typographyOverlay.text}
              </div>
            )}
          </div>

          {/* Desktop Top Menu Bar (macOS / Linux style) */}
          <div className="relative z-20 h-7 px-4 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-4 text-[11px] font-medium">
              <span className="font-bold text-amber-400">korme.com</span>
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Window</span>
              <span>Help</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <Wifi className="w-3 h-3" />
              <span>{currentTime}</span>
            </div>
          </div>

          {/* Desktop Floating Mock Window */}
          <div className="relative z-10 m-auto w-3/5 h-1/2 rounded-xl bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
            <div className="h-7 px-3 bg-neutral-950/80 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] text-neutral-400">korme-wallpaper-canvas.png</span>
              <div className="w-8" />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center items-center text-center">
              <p className="text-xs font-semibold text-neutral-200">High Resolution 4K Ultra-HD Wallpaper</p>
              <p className="text-[11px] text-neutral-400 mt-1">Resolution: 3840 × 2160 · Typographic Layout</p>
            </div>
          </div>

          {/* Desktop Taskbar / Dock */}
          <div className="relative z-20 h-10 mx-auto mb-2 px-3 bg-neutral-900/70 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3 shadow-lg">
            {['⌘', '🖥', '🎨', '⌨️', '📂', '⚙️'].map((icon, i) => (
              <div key={i} className="w-7 h-7 rounded-lg bg-neutral-800/90 hover:bg-neutral-700/90 flex items-center justify-center text-xs text-white shadow-sm cursor-pointer transition-transform hover:scale-110">
                {icon}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Minimal Full Canvas */}
      {device === 'minimal' && (
        <div className="relative w-full h-[520px] rounded-2xl border border-neutral-700/80 shadow-2xl overflow-hidden bg-neutral-950 flex items-center justify-center">
          <img
            src={config.imageUrl}
            alt={config.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            style={filterStyle}
          />
          {config.overlayOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: config.overlayColor, opacity: config.overlayOpacity / 100 }}
            />
          )}
          {config.vignette > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, transparent 35%, rgba(0,0,0,${config.vignette / 100}) 100%)`,
              }}
            />
          )}
          {config.typographyOverlay.visible && config.typographyOverlay.text && (
            <div
              className="absolute pointer-events-none transition-all duration-150 px-6"
              style={{
                left: `${config.typographyOverlay.positionX}%`,
                top: `${config.typographyOverlay.positionY}%`,
                transform: 'translate(-50%, -50%)',
                fontFamily: config.typographyOverlay.fontFamily,
                fontSize: `${config.typographyOverlay.fontSize * 1.3}px`,
                fontWeight: config.typographyOverlay.fontWeight,
                color: config.typographyOverlay.color,
                opacity: config.typographyOverlay.opacity / 100,
                letterSpacing: `${config.typographyOverlay.letterSpacing}px`,
                textAlign: config.typographyOverlay.alignment,
                textShadow: config.typographyOverlay.textShadow
                  ? '0 6px 16px rgba(0,0,0,0.8)'
                  : 'none',
              }}
            >
              {config.typographyOverlay.text}
            </div>
          )}
          <div className="absolute bottom-3 right-4 text-xs font-semibold text-white/50 tracking-wider">
            korme.com
          </div>
        </div>
      )}
    </div>
  );
};
