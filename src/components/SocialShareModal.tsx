import React, { useState } from 'react';
import { WallpaperConfig, KeyboardConfig } from '../types';
import { ExportService } from '../utils/exportCanvas';
import { X, Share2, Download, Copy, Check, Twitter, Instagram, Send, Sparkles, ExternalLink, FileCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: WallpaperConfig;
  keyboard: KeyboardConfig;
  projectTitle: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  wallpaper,
  keyboard,
  projectTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedRes, setSelectedRes] = useState<'phone' | '4k' | 'hd'>('phone');
  const [activeTab, setActiveTab] = useState<'social' | 'download' | 'export-json'>('social');

  if (!isOpen) return null;

  const shareTitle = projectTitle || `${wallpaper.title} × ${keyboard.name}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://korme.com';

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#06b6d4', '#ec4899', '#ffffff'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleCopyLink = () => {
    const link = ExportService.generateShareLink(shareTitle);
    navigator.clipboard.writeText(link);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Check out my custom wallpaper & keyboard typography design on @korme_studio! 🚀✨\n\nTheme: "${shareTitle}"\nFont: ${keyboard.fontFamily.replace(/['",]/g, '')}\n#korme #customkeyboard #wallpaper #typography`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleShareReddit = () => {
    const title = encodeURIComponent(`[korme.com] Custom Keyboard & Wallpaper Design: "${shareTitle}"`);
    window.open(`https://www.reddit.com/submit?title=${title}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleDownloadWallpaper = async () => {
    setDownloading(true);
    try {
      const dataUrl = await ExportService.exportWallpaperImage(wallpaper, selectedRes);
      const filename = `korme-${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}-${selectedRes}.png`;
      ExportService.triggerDownload(dataUrl, filename);
      triggerConfetti();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportJson = () => {
    ExportService.exportKeyboardThemeJson(keyboard, `korme-${keyboard.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-100">Share Your Finished Creation</h2>
              <p className="text-xs text-neutral-400">Instantly export to social media or download high-resolution assets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Social Media Share
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('download')}
              className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'download'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              High-Res Download
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('export-json')}
              className={`py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'export-json'
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Theme Code (JSON)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Tab 1: Social Media Cards & Links */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              {/* Visual Preview Card */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-4">
                <img
                  src={wallpaper.imageUrl}
                  alt="Thumbnail"
                  className="w-16 h-24 object-cover rounded-lg border border-neutral-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">korme.com Studio Card</div>
                  <h3 className="text-sm font-bold text-neutral-100 truncate">{shareTitle}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                    Font: {keyboard.fontFamily.replace(/['",]/g, '')} · {keyboard.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">#4KWallpaper</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">#CustomKeycaps</span>
                  </div>
                </div>
              </div>

              {/* Direct Link Copy Bar */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Direct Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={ExportService.generateShareLink(shareTitle)}
                    className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-neutral-300 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-950" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instant Social Buttons */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-2">Instant Social Networks</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Twitter className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-200">Share to Twitter / X</div>
                      <div className="text-[10px] text-neutral-500">Post with #korme tags</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareReddit}
                    className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-200">Share to Reddit</div>
                      <div className="text-[10px] text-neutral-500">r/MechanicalKeyboards</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: High-Resolution Wallpaper Downloads */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <label className="block text-xs font-medium text-neutral-300">Select Export Resolution</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'phone', label: 'Phone High-Res', res: '1440 × 3120', desc: 'AMOLED Mobile Lockscreen' },
                  { id: '4k', label: '4K Ultra HD', res: '3840 × 2160', desc: 'Desktop / Ultrawide Monitors' },
                  { id: 'hd', label: 'Full HD', res: '1920 × 1080', desc: 'Standard Desktop' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRes(item.id as typeof selectedRes)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      selectedRes === item.id
                        ? 'border-amber-500 bg-amber-500/10 text-neutral-100'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-neutral-200">{item.label}</div>
                    <div className="text-xs font-mono text-amber-400 mt-0.5">{item.res}</div>
                    <div className="text-[10px] text-neutral-500 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadWallpaper}
                  disabled={downloading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Rendering Canvas...' : `Download ${selectedRes.toUpperCase()} PNG Wallpaper`}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: JSON Theme Configuration Export */}
          {activeTab === 'export-json' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-300">
                Export your custom keyboard typography styles, keycap color codes, and RGB profile as an open JSON specification:
              </p>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-48">
                <pre>{JSON.stringify({
                  studio: 'korme.com',
                  name: keyboard.name,
                  fontFamily: keyboard.fontFamily,
                  subLegendType: keyboard.subLegendType,
                  shape: keyboard.shape,
                  primaryKeyColor: keyboard.primaryKeyColor,
                  accentKeyColor: keyboard.accentKeyColor,
                  rgbMode: keyboard.rgbMode,
                  soundProfile: keyboard.soundProfile
                }, null, 2)}</pre>
              </div>

              <button
                type="button"
                onClick={handleExportJson}
                className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>Download .JSON Keyboard Configuration</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
