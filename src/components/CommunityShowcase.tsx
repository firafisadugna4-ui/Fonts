import React, { useState } from 'react';
import { KormeProject } from '../types';
import { StorageService } from '../utils/storage';
import { Heart, Sparkles, Search, SlidersHorizontal, ArrowUpRight, Keyboard, Image, Share2, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CommunityShowcaseProps {
  onRemixProject: (project: KormeProject) => void;
  onOpenShare: (project: KormeProject) => void;
}

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({
  onRemixProject,
  onOpenShare,
}) => {
  const [projects, setProjects] = useState<KormeProject[]>(() => StorageService.getCommunityProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'cyberpunk' | 'minimalist' | 'retro' | 'anime'>('all');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    const list = StorageService.getCommunityProjects();
    const map: Record<string, boolean> = {};
    for (const p of list) {
      map[p.id] = StorageService.isProjectLiked(p.id);
    }
    return map;
  });

  const handleLike = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    const updatedCount = StorageService.likeProject(projectId);
    setLikedMap((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, likes: updatedCount } : p))
    );
    try {
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
    } catch {}
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.keyboard.fontFamily.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'cyberpunk') {
      return p.tags.some(t => /cyber|tokyo|matrix|neon/i.test(t));
    }
    if (activeCategory === 'minimalist') {
      return p.tags.some(t => /minimal|clean|nordic|luxury/i.test(t));
    }
    if (activeCategory === 'retro') {
      return p.tags.some(t => /retro|8bit|arcade|vintage/i.test(t));
    }
    if (activeCategory === 'anime') {
      return p.tags.some(t => /anime|japan|sakura|fuji/i.test(t));
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Hero Headline */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>korme.com Community Showcase</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
          Curated Wallpapers & Typographic Keyboards
        </h1>
        <p className="text-sm text-neutral-400">
          Explore trending designs created by the community. Open any creation directly in the studio to customize the background or keyboard font.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Creations' },
            { id: 'cyberpunk', label: 'Cyberpunk & Sci-Fi' },
            { id: 'minimalist', label: 'Minimalist & Luxury' },
            { id: 'retro', label: 'Retro 8-Bit & Arcade' },
            { id: 'anime', label: 'Anime & Aesthetic' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search fonts, themes, styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj) => {
          const isLiked = likedMap[proj.id];
          return (
            <div
              key={proj.id}
              className="group bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Media Preview Stack */}
              <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden cursor-pointer"
                onClick={() => onRemixProject(proj)}
              >
                {/* Wallpaper background image */}
                <img
                  src={proj.wallpaper.imageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Floating Miniature Keyboard Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: proj.keyboard.accentKeyColor }}
                    />
                    <div className="text-xs font-bold text-white truncate" style={{ fontFamily: proj.keyboard.fontFamily }}>
                      {proj.keyboard.name}
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-300 font-mono">
                    Font: {proj.keyboard.fontFamily.replace(/['",]/g, '')}
                  </span>
                </div>

                {/* Sub-Legend Tag */}
                {proj.keyboard.subLegendType !== 'none' && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-amber-300">
                    Sub-Legend: {proj.keyboard.subLegendType}
                  </div>
                )}
              </div>

              {/* Card Meta & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={proj.authorAvatar}
                        alt={proj.authorName}
                        className="w-5 h-5 rounded-full border border-neutral-700"
                      />
                      <span className="font-medium text-neutral-300">{proj.authorName}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleLike(e, proj.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked ? 'text-rose-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{proj.likes}</span>
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {proj.description}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {proj.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenShare(proj)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      title="Share Creation"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemixProject(proj)}
                      className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Remix in Studio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
