import React, { useState } from 'react';
import { AppMode, UserAccount } from '../types';
import { Image, Keyboard, Columns, Compass, Cloud, Share2, Bookmark, LogIn, User, Sparkles, ChevronDown, LogOut, Smartphone, Download } from 'lucide-react';

interface NavbarProps {
  mode: AppMode;
  onModeChange: (newMode: AppMode) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onOpenCloudLibrary: () => void;
  onOpenShare: () => void;
  onOpenPhoneDownload: () => void;
  onSaveCurrent: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onModeChange,
  currentUser,
  onOpenAuth,
  onOpenCloudLibrary,
  onOpenShare,
  onOpenPhoneDownload,
  onSaveCurrent,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onModeChange('split')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-neutral-900 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-base text-neutral-100 font-sans">
                  korme<span className="text-amber-400">.com</span>
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase tracking-widest">
                  Studio
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 block tracking-tight">
                Wallpaper & Custom Keyboard Engine
              </span>
            </div>
          </div>
        </div>

        {/* Studio View Mode Switcher */}
        <nav className="hidden md:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            type="button"
            onClick={() => onModeChange('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'split'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Dual Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('wallpaper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'wallpaper'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Wallpaper Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('keyboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'keyboard'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard & Fonts</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('community')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              mode === 'community'
                ? 'bg-neutral-800 text-amber-400 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Community Showcase</span>
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cloud Sync Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-neutral-400 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800/80">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Cloud className="w-3 h-3 text-cyan-400" />
            <span>Cloud Sync Active</span>
          </div>

          {/* My Cloud Projects Button */}
          <button
            type="button"
            onClick={onOpenCloudLibrary}
            className="p-2 sm:px-3 sm:py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 border border-neutral-800 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="My Cloud Projects"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">My Projects</span>
          </button>

          {/* Save to Cloud Button */}
          <button
            type="button"
            onClick={onSaveCurrent}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            <span>Save</span>
          </button>

          {/* Direct Download to Phone Gallery Button */}
          <button
            type="button"
            onClick={onOpenPhoneDownload}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            title="Download wallpaper directly to your phone photos/gallery"
          >
            <Smartphone className="w-3.5 h-3.5 text-neutral-950" />
            <span className="hidden sm:inline">Save to Phone</span>
            <span className="sm:hidden">Phone</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={onOpenShare}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Personalized User Account Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-neutral-200 hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg bg-neutral-800 border border-amber-500/40"
                />
                <ChevronDown className="w-3 h-3 text-neutral-400 pr-1" />
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1 animate-in fade-in"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-neutral-800">
                    <p className="font-bold text-neutral-100">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">@{currentUser.username}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCloudLibrary}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-neutral-300 flex items-center gap-2"
                  >
                    <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Cloud Projects</span>
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Mode Switcher Bar */}
      <div className="flex md:hidden items-center justify-around pt-2 mt-2 border-t border-neutral-900 text-xs text-neutral-400">
        <button
          onClick={() => onModeChange('split')}
          className={`py-1 px-2 rounded-lg ${mode === 'split' ? 'text-amber-400 font-bold' : ''}`}
        >
          Dual
        </button>
        <button
          onClick={() => onModeChange('wallpaper')}
          className={`py-1 px-2 rounded-lg ${mode === 'wallpaper' ? 'text-amber-400 font-bold' : ''}`}
        >
          Wallpaper
        </button>
        <button
          onClick={() => onModeChange('keyboard')}
          className={`py-1 px-2 rounded-lg ${mode === 'keyboard' ? 'text-amber-400 font-bold' : ''}`}
        >
          Keyboard
        </button>
        <button
          onClick={() => onModeChange('community')}
          className={`py-1 px-2 rounded-lg ${mode === 'community' ? 'text-amber-400 font-bold' : ''}`}
        >
          Showcase
        </button>
      </div>
    </header>
  );
};
