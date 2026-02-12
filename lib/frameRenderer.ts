// Frame renderer for generating animation frames

import { AnimationFrame, applyTransform } from './animation';

export interface RenderConfig {
  width: number;
  height: number;
  quality: number; // 0-100
}

/**
 * Load an image from URL
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * Create a canvas element with specified dimensions
 */
export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Render a single frame with animation transform
 */
export function renderFrame(
  image: HTMLImageElement,
  frame: AnimationFrame,
  config: RenderConfig
): string {
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Clear canvas
  ctx.clearRect(0, 0, config.width, config.height);
  
  // Fill with black background (for letterboxing)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, config.width, config.height);
  
  // Apply animation transform
  applyTransform(ctx, frame, config.width, config.height);
  
  // Calculate image dimensions to fit canvas (cover)
  const imageAspect = image.width / image.height;
  const canvasAspect = config.width / config.height;
  
  let drawWidth, drawHeight, drawX, drawY;
  
  if (imageAspect > canvasAspect) {
    // Image is wider than canvas
    drawHeight = config.height;
    drawWidth = drawHeight * imageAspect;
    drawX = (config.width - drawWidth) / 2;
    drawY = 0;
  } else {
    // Image is taller than canvas
    drawWidth = config.width;
    drawHeight = drawWidth / imageAspect;
    drawX = 0;
    drawY = (config.height - drawHeight) / 2;
  }
  
  // Draw image
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  
  // Convert to data URL
  const quality = config.quality / 100;
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Render all animation frames
 */
export async function renderAllFrames(
  imageUrl: string,
  frames: AnimationFrame[],
  config: RenderConfig,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  // Load image once
  const image = await loadImage(imageUrl);
  
  const renderedFrames: string[] = [];
  
  // Render each frame
  for (let i = 0; i < frames.length; i++) {
    const frameDataUrl = renderFrame(image, frames[i], config);
    renderedFrames.push(frameDataUrl);
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, frames.length);
    }
  }
  
  return renderedFrames;
}

/**
 * Convert data URL to Blob
 */
export function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  
  return new Blob([u8arr], { type: mime });
}

/**
 * Estimate output dimensions based on input image
 */
export async function estimateOutputDimensions(imageUrl: string): Promise<{ width: number; height: number }> {
  const image = await loadImage(imageUrl);
  
  // Target 720p for GIFs (good balance of quality and file size)
  const targetHeight = 720;
  const aspectRatio = image.width / image.height;
  
  return {
    width: Math.round(targetHeight * aspectRatio),
    height: targetHeight
  };
}