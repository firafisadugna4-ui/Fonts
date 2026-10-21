/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppMode,
  WallpaperConfig,
  KeyboardConfig,
  UserAccount,
  KormeProject,
} from './types';
import { DEFAULT_WALLPAPER_CONFIG, DEFAULT_KEYBOARD_CONFIG } from './utils/presets';
import { StorageService } from './utils/storage';
import { Navbar } from './components/Navbar';
import { WallpaperPreview } from './components/WallpaperPreview';
import { KeyboardPreview } from './components/KeyboardPreview';
import { WallpaperControls } from './components/Controls/WallpaperControls';
import { KeyboardControls } from './components/Controls/KeyboardControls';
import { AuthModal } from './components/AuthModal';
import { SocialShareModal } from './components/SocialShareModal';
import { CloudLibraryModal } from './components/CloudLibraryModal';
import { CommunityShowcase } from './components/CommunityShowcase';
import { PhoneDownloadModal } from './components/PhoneDownloadModal';
import { Sparkles, Sliders, Layers, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation & View Mode
  const [mode, setMode] = useState<AppMode>('split');

  // Studio Configurations
  const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperConfig>(DEFAULT_WALLPAPER_CONFIG);
  const [keyboardConfig, setKeyboardConfig] = useState<KeyboardConfig>(DEFAULT_KEYBOARD_CONFIG);
  const [activeProjectTitle, setActiveProjectTitle] = useState('Neo Shinjuku × Cyberpunk 2077');

  // Modals & User Account
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => StorageService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [cloudLibraryOpen, setCloudLibraryOpen] = useState(false);
  const [phoneDownloadOpen, setPhoneDownloadOpen] = useState(false);

  // Active Tool Panel Tab for Split view (toggle between Wallpaper settings and Keyboard settings)
  const [activeInspector, setActiveInspector] = useState<'wallpaper' | 'keyboard'>('keyboard');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Requirement: When a person enters, ask registration and login for personalized accounts and cloud-based project saving
  useEffect(() => {
    if (!StorageService.hasPromptedAuth() && !currentUser) {
      // Small delay for smooth entry animation
      const timer = setTimeout(() => {
        setAuthModalOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  // Load a project from library or community
  const handleLoadProject = (project: KormeProject) => {
    setWallpaperConfig(project.wallpaper);
    setKeyboardConfig(project.keyboard);
    setActiveProjectTitle(project.title);
    setMode('split');
    showToast(`Loaded "${project.title}" into Studio`);
  };

  // Fast Save to Cloud
  const handleQuickSave = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    StorageService.saveProject(
      activeProjectTitle,
      `Designed with ${keyboardConfig.fontFamily} & ${wallpaperConfig.title}`,
      wallpaperConfig,
      keyboardConfig,
      [wallpaperConfig.category, keyboardConfig.name, 'KormeDesign'],
      true
    );
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.2 } });
    } catch {}
    showToast(`Saved "${activeProjectTitle}" to your Cloud Library!`);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    showToast('Signed out of personalized account');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-neutral-900 border border-amber-500/50 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold text-neutral-100 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        mode={mode}
        onModeChange={setMode}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenCloudLibrary={() => setCloudLibraryOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
        onOpenPhoneDownload={() => setPhoneDownloadOpen(true)}
        onSaveCurrent={handleQuickSave}
        onLogout={handleLogout}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {mode === 'community' ? (
          /* Community Showcase */
          <div className="flex-1 overflow-y-auto">
            <CommunityShowcase
              onRemixProject={handleLoadProject}
              onOpenShare={(project) => {
                setWallpaperConfig(project.wallpaper);
                setKeyboardConfig(project.keyboard);
                setActiveProjectTitle(project.title);
                setShareModalOpen(true);
              }}
            />
          </div>
        ) : (
          /* Real-Time Studio Editor */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1700px] w-full mx-auto p-2 sm:p-4 gap-4">
            {/* Left: Customization Control Center */}
            <div className="w-full lg:w-[440px] xl:w-[480px] flex flex-col shrink-0 order-2 lg:order-1">
              {/* If in Split mode, give tabs to switch between Wallpaper & Keyboard tools */}
              {mode === 'split' && (
                <div className="flex items-center p-1 mb-2 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveInspector('keyboard')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeInspector === 'keyboard'
                        ? 'bg-neutral-800 text-amber-400 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>Keyboard & Fonts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInspector('wallpaper')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeInspector === 'wallpaper'
                        ? 'bg-neutral-800 text-amber-400 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>Wallpaper Background</span>
                  </button>
                </div>
              )}

              {/* Render controls based on mode / activeInspector */}
              <div className="flex-1 min-h-[500px]">
                {mode === 'wallpaper' || (mode === 'split' && activeInspector === 'wallpaper') ? (
                  <WallpaperControls
                    config={wallpaperConfig}
                    onChange={setWallpaperConfig}
                    onOpenPhoneDownload={() => setPhoneDownloadOpen(true)}
                  />
                ) : (
                  <KeyboardControls
                    config={keyboardConfig}
                    onChange={setKeyboardConfig}
                  />
                )}
              </div>
            </div>

            {/* Right / Center: Real-Time Live Preview Stage */}
            <div className="flex-1 flex flex-col bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3 sm:p-5 overflow-y-auto order-1 lg:order-2 shadow-2xl relative">
              {/* Studio Stage Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <input
                    type="text"
                    value={activeProjectTitle}
                    onChange={(e) => setActiveProjectTitle(e.target.value)}
                    className="bg-transparent border-b border-dashed border-neutral-700 hover:border-amber-400 text-xs sm:text-sm font-bold text-neutral-200 focus:outline-none focus:border-amber-400 px-1 py-0.5"
                    title="Click to rename design title"
                  />
                </div>

                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <button
                    type="button"
                    onClick={() => setPhoneDownloadOpen(true)}
                    className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Save to Phone Gallery</span>
                  </button>
                  <span className="font-mono text-amber-400/90 font-medium">60 FPS</span>
                </div>
              </div>

              {/* Preview Stage Switcher */}
              {mode === 'split' ? (
                /* Dual View: Both Wallpaper Mockup and Interactive Mechanical Keyboard stacked elegantly */
                <div className="flex-1 flex flex-col gap-6 justify-center items-center py-2">
                  <div className="w-full flex justify-center">
                    <WallpaperPreview 
                      config={wallpaperConfig} 
                      onOpenPhoneDownload={() => setPhoneDownloadOpen(true)}
                    />
                  </div>
                  <div className="w-full">
                    <KeyboardPreview config={keyboardConfig} />
                  </div>
                </div>
              ) : mode === 'wallpaper' ? (
                /* Wallpaper Canvas Focus */
                <div className="flex-1 flex items-center justify-center">
                  <WallpaperPreview 
                    config={wallpaperConfig} 
                    onOpenPhoneDownload={() => setPhoneDownloadOpen(true)}
                  />
                </div>
              ) : (
                /* Keyboard & Typography Focus */
                <div className="flex-1 flex flex-col justify-center items-center py-4">
                  <KeyboardPreview config={keyboardConfig} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-3 px-6 bg-neutral-950 border-t border-neutral-800/80 text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-bold text-neutral-200">korme.com</span>
          <span className="text-neutral-500">·</span>
          <span>Professional Wallpaper & Keyboard Customization Platform</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>4K Backgrounds</span>
          <span>·</span>
          <span>25+ Typographic Fonts</span>
          <span>·</span>
          <span>Cloud Project Sync</span>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome ${user.name}! Cloud project sync ready.`);
        }}
      />

      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        wallpaper={wallpaperConfig}
        keyboard={keyboardConfig}
        projectTitle={activeProjectTitle}
      />

      <CloudLibraryModal
        isOpen={cloudLibraryOpen}
        onClose={() => setCloudLibraryOpen(false)}
        currentUser={currentUser}
        currentWallpaper={wallpaperConfig}
        currentKeyboard={keyboardConfig}
        onLoadProject={handleLoadProject}
        onRequestAuth={() => setAuthModalOpen(true)}
      />

      <PhoneDownloadModal
        isOpen={phoneDownloadOpen}
        onClose={() => setPhoneDownloadOpen(false)}
        wallpaper={wallpaperConfig}
        onSuccessToast={(msg) => showToast(msg)}
      />
    </div>
  );
}
