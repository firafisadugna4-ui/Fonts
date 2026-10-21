import React, { useState } from 'react';
import { KormeProject, UserAccount, WallpaperConfig, KeyboardConfig } from '../types';
import { StorageService } from '../utils/storage';
import { Cloud, FolderOpen, Trash2, Edit3, Plus, ArrowRight, X, Check, Globe, Lock, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CloudLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  currentWallpaper: WallpaperConfig;
  currentKeyboard: KeyboardConfig;
  onLoadProject: (project: KormeProject) => void;
  onRequestAuth: () => void;
}

export const CloudLibraryModal: React.FC<CloudLibraryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentWallpaper,
  currentKeyboard,
  onLoadProject,
  onRequestAuth,
}) => {
  const [projects, setProjects] = useState<KormeProject[]>(() => 
    StorageService.getCloudProjects(currentUser?.id)
  );
  const [isSavingCurrent, setIsSavingCurrent] = useState(false);
  const [projectTitle, setProjectTitle] = useState('My Studio Theme');
  const [projectDesc, setProjectDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [tagsInput, setTagsInput] = useState('Cyberpunk, Mechanical, 4K');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const refreshProjects = () => {
    setProjects(StorageService.getCloudProjects(currentUser?.id));
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequestAuth();
      return;
    }

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    StorageService.saveProject(
      projectTitle,
      projectDesc,
      currentWallpaper,
      currentKeyboard,
      tags,
      isPublic
    );

    refreshProjects();
    setIsSavingCurrent(false);
    setSavedSuccess(true);
    try {
      confetti({ particleCount: 50, spread: 50 });
    } catch {}
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this saved project from your cloud library?')) {
      StorageService.deleteProject(id);
      refreshProjects();
    }
  };

  const handleSelect = (project: KormeProject) => {
    onLoadProject(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-100">My Cloud Projects Library</h2>
                {currentUser && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    @{currentUser.username}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">Save, restore, and organize your wallpaper & keyboard configurations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} saved to cloud
          </div>
          <button
            type="button"
            onClick={() => setIsSavingCurrent(!isSavingCurrent)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Save Current Studio Project</span>
          </button>
        </div>

        {/* Save Current Project Drawer/Form */}
        {isSavingCurrent && (
          <form onSubmit={handleSaveCurrent} className="p-5 bg-neutral-950 border-b border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Save Current Workspace</span>
              <button
                type="button"
                onClick={() => setIsSavingCurrent(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Neo Shinjuku Dark Edition"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Cyberpunk, Katakana, 4K"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="A high-contrast keyboard setup designed for dark mode workspaces"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Publish to Community Showcase (publicly discoverable)</span>
                </div>
              </label>

              <button
                type="submit"
                className="py-1.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                Commit to Cloud
              </button>
            </div>
          </form>
        )}

        {/* Project List */}
        <div className="p-6 space-y-3 overflow-y-auto">
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Project securely synced to your korme.com cloud library!</span>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-500 mb-3">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-200">No saved cloud projects yet</h3>
              <p className="text-xs text-neutral-400 max-w-xs mt-1">
                Customize your wallpaper background and keyboard typography, then click "Save Current Studio Project" above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all flex flex-col justify-between group"
                >
                  <div className="flex gap-3">
                    <img
                      src={proj.wallpaper.imageUrl}
                      alt={proj.title}
                      className="w-14 h-20 object-cover rounded-lg border border-neutral-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mb-0.5">
                        <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                        <span>·</span>
                        {proj.isPublic ? (
                          <span className="text-cyan-400 flex items-center gap-0.5">
                            <Globe className="w-2.5 h-2.5" /> Public
                          </span>
                        ) : (
                          <span className="text-neutral-500 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Private
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-neutral-100 truncate">{proj.title}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {proj.keyboard.name} · {proj.keyboard.fontFamily.replace(/['",]/g, '')}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.tags.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800/80">
                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelect(proj)}
                      className="py-1 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Load into Editor</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
