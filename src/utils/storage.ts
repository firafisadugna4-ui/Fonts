import { UserAccount, KormeProject, WallpaperConfig, KeyboardConfig } from '../types';
import { DEFAULT_KEYBOARD_CONFIG, DEFAULT_WALLPAPER_CONFIG, KEYBOARD_PRESETS, WALLPAPER_PRESETS } from './presets';

const STORAGE_KEY_USER = 'korme_active_user_v1';
const STORAGE_KEY_PROJECTS = 'korme_cloud_projects_v1';
const STORAGE_KEY_COMMUNITY = 'korme_community_showcase_v1';
const STORAGE_KEY_HAS_ONBOARDED = 'korme_has_prompted_auth_v1';

// Seed community projects
const SEED_COMMUNITY_PROJECTS: KormeProject[] = [
  {
    id: 'proj-seed-1',
    title: 'Tokyo Neo Cyber Matrix',
    description: 'Custom neon Katakana keycaps paired with Shinjuku high-res rain wallpaper',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    userId: 'user-creator-1',
    authorName: 'Kenji Sato',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    wallpaper: DEFAULT_WALLPAPER_CONFIG,
    keyboard: DEFAULT_KEYBOARD_CONFIG,
    tags: ['Cyberpunk', 'Tokyo', 'Orbitron', 'Thock'],
    likes: 428,
    isPublic: true
  },
  {
    id: 'proj-seed-2',
    title: 'Atelier Rose Gold & Marble',
    description: 'Roman Cinzel typography keycaps matched with brutalist architectural wallpaper',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    userId: 'user-creator-2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    wallpaper: {
      ...DEFAULT_WALLPAPER_CONFIG,
      id: 'wp-min-1',
      title: 'Architectural Shadowplay',
      category: 'Minimalist',
      imageUrl: WALLPAPER_PRESETS[3].url,
      typographyOverlay: {
        ...DEFAULT_WALLPAPER_CONFIG.typographyOverlay,
        text: 'ARCHIVE // ATELIER',
        fontFamily: "'Cinzel', serif",
        color: '#e0a899'
      }
    },
    keyboard: {
      ...DEFAULT_KEYBOARD_CONFIG,
      id: 'kb-olivia',
      name: 'Atelier Rose Gold',
      fontFamily: "'Cinzel', serif",
      subLegendType: 'runes',
      primaryKeyColor: '#1e2124',
      modifierKeyColor: '#2b2f36',
      accentKeyColor: '#e0a899',
      legendColor: '#f1e7e4',
      chassisColor: '#16181b',
      rgbMode: 'solid-glow',
      rgbColor: '#e0a899',
      shape: 'chamfer'
    },
    tags: ['Minimalist', 'Luxury', 'Cinzel', 'RoseGold'],
    likes: 382,
    isPublic: true
  },
  {
    id: 'proj-seed-3',
    title: '1984 Arcade Macintosh',
    description: 'Retro computing 8-bit Press Start fonts on vintage chassis with dark arcade background',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    userId: 'user-creator-3',
    authorName: 'Marcus V.',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    wallpaper: {
      ...DEFAULT_WALLPAPER_CONFIG,
      id: 'wp-gaming-1',
      title: 'Dark Battlestation Ambiance',
      category: 'Gaming',
      imageUrl: WALLPAPER_PRESETS[12].url,
      typographyOverlay: {
        ...DEFAULT_WALLPAPER_CONFIG.typographyOverlay,
        text: 'INSERT COIN TO PLAY',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 20,
        color: '#fbbf24'
      }
    },
    keyboard: {
      ...DEFAULT_KEYBOARD_CONFIG,
      id: 'kb-mac',
      name: '1984 Macintosh Beige',
      fontFamily: "'Press Start 2P', monospace",
      subLegendType: 'none',
      primaryKeyColor: '#d6cfc7',
      modifierKeyColor: '#c5bcb2',
      accentKeyColor: '#b45309',
      legendColor: '#292524',
      chassisColor: '#bbb2a6',
      rgbMode: 'off',
      rgbColor: '#ffffff',
      soundProfile: 'clicky',
      shape: 'cherry'
    },
    tags: ['Retro', '8Bit', 'Arcade', 'Mechanical'],
    likes: 519,
    isPublic: true
  }
];

export class StorageService {
  // Check if initial auth modal prompt is needed
  static hasPromptedAuth(): boolean {
    if (typeof window === 'undefined') return true;
    return !!localStorage.getItem(STORAGE_KEY_HAS_ONBOARDED);
  }

  static markAuthPrompted() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_HAS_ONBOARDED, 'true');
    }
  }

  // Active user session
  static getCurrentUser(): UserAccount | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: UserAccount | null) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }

  // Quick register for personalized account
  static register(name: string, email: string, username: string): UserAccount {
    const user: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim() || 'Korme Creator',
      email: email.trim().toLowerCase(),
      username: (username.trim() || name.replace(/\s+/g, '').toLowerCase()) || 'creator',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username || email)}`,
      plan: 'pro',
      createdAt: new Date().toISOString()
    };
    this.setCurrentUser(user);
    this.markAuthPrompted();
    return user;
  }

  // Fast login
  static login(emailOrUsername: string): UserAccount {
    const input = emailOrUsername.trim();
    // Check if user already exists in storage or create session
    const existing = this.getCurrentUser();
    if (existing && (existing.email === input.toLowerCase() || existing.username === input.toLowerCase())) {
      return existing;
    }

    const name = input.includes('@') ? input.split('@')[0] : input;
    const user: UserAccount = {
      id: `usr_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: input.includes('@') ? input.toLowerCase() : `${input.toLowerCase()}@korme.com`,
      username: input.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'creator',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(input)}`,
      plan: 'pro',
      createdAt: new Date().toISOString()
    };
    this.setCurrentUser(user);
    this.markAuthPrompted();
    return user;
  }

  static logout() {
    this.setCurrentUser(null);
  }

  // Cloud Projects Saving
  static getCloudProjects(userId?: string): KormeProject[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    let projects: KormeProject[] = [];
    if (raw) {
      try {
        projects = JSON.parse(raw);
      } catch {
        projects = [];
      }
    }

    if (userId) {
      return projects.filter(p => p.userId === userId);
    }
    return projects;
  }

  static saveProject(
    title: string,
    description: string,
    wallpaper: WallpaperConfig,
    keyboard: KeyboardConfig,
    tags: string[],
    isPublic: boolean = false,
    existingId?: string
  ): KormeProject {
    const user = this.getCurrentUser();
    const projects = this.getCloudProjects();

    const authorName = user ? user.name : 'Guest Designer';
    const authorAvatar = user ? user.avatar : 'https://api.dicebear.com/7.x/identicon/svg?seed=korme';
    const userId = user ? user.id : 'guest-local';

    if (existingId) {
      const idx = projects.findIndex(p => p.id === existingId);
      if (idx !== -1) {
        projects[idx] = {
          ...projects[idx],
          title: title.trim() || 'Untitled Studio Creation',
          description: description.trim(),
          wallpaper,
          keyboard,
          tags,
          isPublic,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
        return projects[idx];
      }
    }

    const newProject: KormeProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim() || 'Untitled Studio Creation',
      description: description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      authorName,
      authorAvatar,
      wallpaper,
      keyboard,
      tags: tags.length > 0 ? tags : ['Wallpaper', 'KeyboardFont', 'Korme'],
      likes: 1,
      isPublic
    };

    projects.unshift(newProject);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    return newProject;
  }

  static deleteProject(id: string): boolean {
    const projects = this.getCloudProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(filtered));
    return true;
  }

  // Community Showcase
  static getCommunityProjects(): KormeProject[] {
    if (typeof window === 'undefined') return SEED_COMMUNITY_PROJECTS;
    const raw = localStorage.getItem(STORAGE_KEY_COMMUNITY);
    let communityList: KormeProject[] = [];
    if (raw) {
      try {
        communityList = JSON.parse(raw);
      } catch {
        communityList = [];
      }
    }

    // Merge public user projects
    const userProjects = this.getCloudProjects().filter(p => p.isPublic);
    const map = new Map<string, KormeProject>();
    
    // add seeds
    for (const p of SEED_COMMUNITY_PROJECTS) {
      map.set(p.id, p);
    }
    // add stored community
    for (const p of communityList) {
      map.set(p.id, p);
    }
    // add public user projects
    for (const p of userProjects) {
      map.set(p.id, p);
    }

    return Array.from(map.values()).sort((a, b) => b.likes - a.likes);
  }

  static likeProject(projectId: string): number {
    const key = `korme_liked_${projectId}`;
    const alreadyLiked = localStorage.getItem(key);
    let newLikes = 0;

    const list = this.getCommunityProjects();
    const target = list.find(p => p.id === projectId);
    if (!target) return 0;

    if (alreadyLiked) {
      target.likes = Math.max(0, target.likes - 1);
      localStorage.removeItem(key);
    } else {
      target.likes += 1;
      localStorage.setItem(key, 'true');
    }
    newLikes = target.likes;

    // Update community storage
    localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(list));

    // Also update in user projects if present
    const userProjects = this.getCloudProjects();
    const userIdx = userProjects.findIndex(p => p.id === projectId);
    if (userIdx !== -1) {
      userProjects[userIdx].likes = newLikes;
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(userProjects));
    }

    return newLikes;
  }

  static isProjectLiked(projectId: string): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(`korme_liked_${projectId}`);
  }
}
