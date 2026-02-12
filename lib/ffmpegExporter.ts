// GIF export using gif.js (browser-compatible, no WASM issues)

export interface ExportConfig {
  fps: number;
  quality: number; // 0-100
}

// gif.js is loaded from CDN
let GIF: any = null;
let isLoaded = false;

/**
 * Load gif.js library from CDN
 */
export async function loadFFmpeg(): Promise<any> {
  // Keep the same function name for compatibility
  if (isLoaded && GIF) {
    return GIF;
  }

  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).GIF) {
      GIF = (window as any).GIF;
      isLoaded = true;
      resolve(GIF);
      return;
    }

    // Load gif.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js';
    script.onload = () => {
      GIF = (window as any).GIF;
      isLoaded = true;
      resolve(GIF);
    };
    script.onerror = () => reject(new Error('Failed to load gif.js'));
    document.head.appendChild(script);
  });
}

/**
 * Load an image from a data URL
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Convert frames to GIF using gif.js
 */
export async function framesToGif(
  frameDataUrls: string[],
  config: ExportConfig,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Load gif.js
  await loadFFmpeg();
  
  if (onProgress) onProgress(5);

  // Calculate delay between frames (in ms)
  const delay = Math.round(1000 / config.fps);
  
  // Quality: gif.js uses 1-30 where 1 is best, 30 is worst
  // Convert our 0-100 scale (100 = best) to gif.js scale
  const gifQuality = Math.max(1, Math.round(30 - (config.quality / 100) * 29));

  // Create GIF encoder - DISABLE WORKERS to avoid cross-origin security errors
  const gif = new (window as any).GIF({
    workers: 0, // Disable workers - runs on main thread (slower but no security issues)
    quality: gifQuality,
    width: 720,
    height: 720,
  });

  if (onProgress) onProgress(10);

  // Load all images first
  const images: HTMLImageElement[] = [];
  for (let i = 0; i < frameDataUrls.length; i++) {
    const img = await loadImage(frameDataUrls[i]);
    images.push(img);
    
    // Report progress (10% to 50% for loading frames)
    if (onProgress) {
      const loadProgress = 10 + (i / frameDataUrls.length) * 40;
      onProgress(Math.round(loadProgress));
    }
  }

  if (onProgress) onProgress(50);

  // Create a canvas to resize images
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  // Add frames to GIF
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    
    // Calculate scaling to fit 720x720 while maintaining aspect ratio
    const scale = Math.min(720 / img.width, 720 / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const offsetX = (720 - scaledWidth) / 2;
    const offsetY = (720 - scaledHeight) / 2;
    
    // Clear and draw
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 720, 720);
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    
    // Add frame
    gif.addFrame(ctx, { copy: true, delay });
    
    // Report progress (50% to 70% for adding frames)
    if (onProgress) {
      const addProgress = 50 + (i / images.length) * 20;
      onProgress(Math.round(addProgress));
    }
  }

  if (onProgress) onProgress(70);

  // Render GIF
  return new Promise((resolve, reject) => {
    gif.on('progress', (p: number) => {
      // Report progress (70% to 95% for rendering)
      if (onProgress) {
        const renderProgress = 70 + p * 25;
        onProgress(Math.round(renderProgress));
      }
    });

    gif.on('finished', (blob: Blob) => {
      if (onProgress) onProgress(100);
      resolve(blob);
    });

    gif.on('error', (error: Error) => {
      reject(error);
    });

    gif.render();
  });
}

/**
 * Create animated preview (lower quality, faster rendering)
 */
export async function createAnimatedPreview(
  frameDataUrls: string[],
  fps: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Use lower quality settings for preview
  const previewConfig: ExportConfig = {
    fps: Math.min(fps, 15), // Cap at 15fps for preview
    quality: 60 // Lower quality for faster rendering
  };
  
  return framesToGif(frameDataUrls, previewConfig, onProgress);
}

/**
 * Get loading status
 */
export function isFFmpegLoaded(): boolean {
  return isLoaded;
}

/**
 * Estimate GIF file size (rough approximation)
 */
export function estimateGifSize(
  frameCount: number,
  width: number,
  height: number,
  quality: number
): string {
  // Very rough estimate: ~10-50KB per frame depending on quality
  const bytesPerFrame = (quality / 100) * 40000 + 10000;
  const totalBytes = frameCount * bytesPerFrame;
  
  // Convert to human-readable format
  if (totalBytes < 1024 * 1024) {
    return `~${Math.round(totalBytes / 1024)}KB`;
  } else {
    return `~${(totalBytes / (1024 * 1024)).toFixed(1)}MB`;
  }
}