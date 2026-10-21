import { WallpaperConfig, KeyboardConfig } from '../types';

export class ExportService {
  /**
   * Generates a downloadable high-resolution image using an HTML5 Canvas
   */
  static async exportWallpaperCanvas(
    wallpaper: WallpaperConfig,
    resolution: 'phone' | '4k' | 'hd' = 'phone',
    cleanOnly: boolean = false
  ): Promise<HTMLCanvasElement> {
    const width = resolution === '4k' ? 3840 : resolution === 'phone' ? 1440 : 1920;
    const height = resolution === '4k' ? 2160 : resolution === 'phone' ? 3120 : 1080;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Fill background color
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, width, height);

    // Load background image
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw image cover
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;

        ctx.filter = `blur(${wallpaper.blur * (width / 1000)}px) brightness(${wallpaper.brightness}%) contrast(${wallpaper.contrast}%) saturate(${wallpaper.saturation}%)`;
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        ctx.filter = 'none';
        resolve();
      };
      img.onerror = () => {
        // Fallback gradient if CORS blocks image
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#18181b');
        grad.addColorStop(1, '#09090b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        resolve();
      };
      img.src = wallpaper.imageUrl;
    });

    // Dark overlay tint
    if (wallpaper.overlayOpacity > 0) {
      ctx.fillStyle = wallpaper.overlayColor;
      ctx.globalAlpha = wallpaper.overlayOpacity / 100;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1.0;
    }

    // Vignette
    if (wallpaper.vignette > 0) {
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.3,
        width / 2, height / 2, Math.max(width, height) * 0.75
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${wallpaper.vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Typography Overlay (Only if not cleanOnly)
    if (!cleanOnly && wallpaper.typographyOverlay.visible && wallpaper.typographyOverlay.text) {
      ctx.save();
      const scale = width / 600;
      const fontSize = Math.round(wallpaper.typographyOverlay.fontSize * scale);
      ctx.font = `${wallpaper.typographyOverlay.fontWeight} ${fontSize}px sans-serif`;
      ctx.fillStyle = wallpaper.typographyOverlay.color;
      ctx.textAlign = wallpaper.typographyOverlay.alignment;
      ctx.textBaseline = 'middle';

      if (wallpaper.typographyOverlay.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
      }

      const x = (width * wallpaper.typographyOverlay.positionX) / 100;
      const y = (height * wallpaper.typographyOverlay.positionY) / 100;

      ctx.fillText(wallpaper.typographyOverlay.text, x, y);
      ctx.restore();
    }

    return canvas;
  }

  /**
   * Generates a downloadable high-resolution data url
   */
  static async exportWallpaperImage(
    wallpaper: WallpaperConfig,
    resolution: '4k' | 'phone' | 'hd' = 'phone',
    cleanOnly: boolean = false
  ): Promise<string> {
    const canvas = await this.exportWallpaperCanvas(wallpaper, resolution, cleanOnly);
    return canvas.toDataURL('image/png');
  }

  /**
   * Converts canvas to Blob
   */
  static async exportWallpaperBlob(
    wallpaper: WallpaperConfig,
    resolution: '4k' | 'phone' | 'hd' = 'phone',
    cleanOnly: boolean = false
  ): Promise<Blob> {
    const canvas = await this.exportWallpaperCanvas(wallpaper, resolution, cleanOnly);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/png');
    });
  }

  /**
   * Saves wallpaper directly to user's Phone Photo Gallery / Downloads.
   * On mobile (iOS / Android), triggers native Share sheet with direct "Save Image" into Photos app.
   * On desktop or fallback, downloads the file directly to device storage.
   */
  static async saveToPhoneGallery(
    wallpaper: WallpaperConfig,
    resolution: 'phone' | '4k' | 'hd' = 'phone',
    cleanOnly: boolean = false
  ): Promise<{ method: 'native-gallery' | 'download'; success: boolean }> {
    const filename = `korme-${wallpaper.title.toLowerCase().replace(/[^\w-]/g, '') || 'wallpaper'}-${resolution}.png`;
    
    try {
      const blob = await this.exportWallpaperBlob(wallpaper, resolution, cleanOnly);
      const file = new File([blob], filename, { type: 'image/png' });

      // Check if navigator.share supports file sharing (iOS Safari / Android Chrome Photos integration)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${wallpaper.title} - korme.com Wallpaper`,
            text: 'Save this image to your phone gallery to set as wallpaper',
          });
          return { method: 'native-gallery', success: true };
        } catch (shareErr: any) {
          // If user cancelled share sheet, don't fallback to duplicate download
          if (shareErr.name === 'AbortError') {
            return { method: 'native-gallery', success: true };
          }
          // If share failed unexpectedly, fallback to direct download
        }
      }

      // Standard direct download for desktop / mobile browsers
      const url = URL.createObjectURL(blob);
      this.triggerDownload(url, filename);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return { method: 'download', success: true };
    } catch (err) {
      console.error('Failed to export image blob, falling back to dataUrl:', err);
      const dataUrl = await this.exportWallpaperImage(wallpaper, resolution, cleanOnly);
      this.triggerDownload(dataUrl, filename);
      return { method: 'download', success: true };
    }
  }

  /**
   * Triggers download of generated data url or blob url
   */
  static triggerDownload(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Export Keyboard JSON
   */
  static exportKeyboardThemeJson(keyboard: KeyboardConfig, filename: string = 'korme-keyboard-theme.json') {
    const blob = new Blob([JSON.stringify(keyboard, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    this.triggerDownload(url, filename);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate Direct Share Link
   */
  static generateShareLink(title: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://korme.com';
    const params = new URLSearchParams();
    params.set('share', encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-')));
    params.set('ref', 'studio');
    return `${origin}/?${params.toString()}`;
  }
}
