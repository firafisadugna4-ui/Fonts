import React, { useState } from 'react';
import { WallpaperConfig } from '../types';
import { ExportService } from '../utils/exportCanvas';
import { Smartphone, Download, Check, X, Sparkles, Image, CheckCircle2, ArrowRight, Layers, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhoneDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: WallpaperConfig;
  onSuccessToast?: (msg: string) => void;
}

export const PhoneDownloadModal: React.FC<PhoneDownloadModalProps> = ({
  isOpen,
  onClose,
  wallpaper,
  onSuccessToast,
}) => {
  const [resolution, setResolution] = useState<'phone' | '4k' | 'hd'>('phone');
  const [cleanOnly, setCleanOnly] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveToGallery = async () => {
    setIsProcessing(true);
    setDownloadSuccess(false);

    try {
      const result = await ExportService.saveToPhoneGallery(wallpaper, resolution, cleanOnly);
      
      setDownloadSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#06b6d4', '#10b981', '#ffffff'],
        });
      } catch {}

      const msg = result.method === 'native-gallery'
        ? 'Picture ready! Tap "Save Image" to place directly in your Phone Gallery.'
        : 'Wallpaper saved! Check your device Photos / Gallery or Downloads.';

      if (onSuccessToast) {
        onSuccessToast(msg);
      }
    } catch (err) {
      console.error('Failed to save to gallery:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient header */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-cyan-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Phone Wallpaper</span>
                <span className="text-neutral-500 text-xs">·</span>
                <span className="text-[11px] text-neutral-400">Direct to Gallery</span>
              </div>
              <h2 className="text-lg font-bold text-neutral-100">Download to Phone Gallery</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Wallpaper Preview Card */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950 flex items-center justify-center shadow-inner">
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              style={{
                filter: `blur(${wallpaper.blur * 0.4}px) brightness(${wallpaper.brightness}%) contrast(${wallpaper.contrast}%) saturate(${wallpaper.saturation}%)`,
              }}
            />

            {/* Dark overlay */}
            {wallpaper.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: wallpaper.overlayColor, opacity: wallpaper.overlayOpacity / 100 }}
              />
            )}

            {/* Typography if enabled and not cleanOnly */}
            {!cleanOnly && wallpaper.typographyOverlay.visible && wallpaper.typographyOverlay.text && (
              <div
                className="absolute pointer-events-none px-4 text-center"
                style={{
                  fontFamily: wallpaper.typographyOverlay.fontFamily,
                  color: wallpaper.typographyOverlay.color,
                  fontSize: `${wallpaper.typographyOverlay.fontSize}px`,
                  fontWeight: wallpaper.typographyOverlay.fontWeight,
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                {wallpaper.typographyOverlay.text}
              </div>
            )}

            {/* Overlay Phone Badge */}
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[11px] text-neutral-200">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>{resolution === 'phone' ? '1440 × 3120 AMOLED' : resolution === '4k' ? '3840 × 2160 4K UHD' : '1080 × 1920 HD'}</span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-neutral-400">
              korme.com
            </div>
          </div>

          {/* Clean vs Typography Toggle */}
          <div className="bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setCleanOnly(true)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                cleanOnly
                  ? 'bg-neutral-800 text-amber-300 shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Clean Image (Recommended)</span>
            </button>
            <button
              type="button"
              onClick={() => setCleanOnly(false)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !cleanOnly
                  ? 'bg-neutral-800 text-amber-300 shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>With Custom Typography</span>
            </button>
          </div>

          {/* Resolution Options */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Target Phone Resolution</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'phone', label: 'Phone AMOLED', res: '1440 × 3120', note: 'Best for iPhone & Galaxy' },
                { id: '4k', label: '4K Ultra HD', res: '3840 × 2160', note: 'Max Sharpness' },
                { id: 'hd', label: 'Standard HD', res: '1080 × 1920', note: 'Smaller file size' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setResolution(item.id as typeof resolution)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    resolution === item.id
                      ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-200">{item.label}</div>
                  <div className="text-[11px] font-mono text-amber-400">{item.res}</div>
                  <div className="text-[9px] text-neutral-500 truncate">{item.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleSaveToGallery}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Preparing High-Res Image for Gallery...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                <span>Downloaded! Check Your Phone Gallery</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download & Save to Phone Gallery</span>
              </>
            )}
          </button>

          {/* Simple How to Use Instructions */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <span className="font-semibold text-neutral-300 block">How to use this wallpaper on your phone:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-400">
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="font-bold text-neutral-200 block mb-1">📱 Apple iPhone (iOS)</span>
                <p>1. Tap the button above</p>
                <p>2. Tap "Save Image" to save into your Photos app</p>
                <p>3. Go to Settings &gt; Wallpaper &gt; Choose from Photos</p>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="font-bold text-neutral-200 block mb-1">🤖 Android (Samsung, Pixel, etc.)</span>
                <p>1. Tap the button above to download</p>
                <p>2. Open your Gallery or Google Photos</p>
                <p>3. Tap menu (⋮) &gt; "Set as wallpaper"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
