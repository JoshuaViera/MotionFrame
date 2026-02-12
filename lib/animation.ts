// Animation utilities for Ken Burns (zoom) and drift effects

export interface AnimationFrame {
  frameNumber: number;
  scale: number;
  translateX: number;
  translateY: number;
}

export interface AnimationConfig {
  type: 'zoom' | 'drift';
  duration: number; // seconds
  intensity: number; // 0-100
  fps: number;
}

/**
 * Generate Ken Burns (zoom) effect frames
 * Smoothly zooms in or out on the image
 */
export function generateZoomFrames(config: AnimationConfig): AnimationFrame[] {
  const totalFrames = Math.floor(config.duration * config.fps);
  const frames: AnimationFrame[] = [];
  
  // Calculate zoom range based on intensity
  // intensity 0 = no zoom (1.0 to 1.0)
  // intensity 50 = moderate zoom (1.0 to 1.2)
  // intensity 100 = heavy zoom (1.0 to 1.5)
  const minScale = 1.0;
  const maxScale = 1.0 + (config.intensity / 100) * 0.5;
  
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1); // 0 to 1
    
    // Use easeInOutCubic for smooth acceleration/deceleration
    const easedProgress = easeInOutCubic(progress);
    
    // Calculate scale (zoom in)
    const scale = minScale + (maxScale - minScale) * easedProgress;
    
    // Slight pan to keep it dynamic (optional, subtle movement)
    const translateX = Math.sin(progress * Math.PI) * 2; // -2 to 2
    const translateY = Math.cos(progress * Math.PI) * 2; // -2 to 2
    
    frames.push({
      frameNumber: i,
      scale,
      translateX,
      translateY
    });
  }
  
  return frames;
}

/**
 * Generate drift (pan) effect frames
 * Smoothly pans horizontally and/or vertically
 */
export function generateDriftFrames(config: AnimationConfig): AnimationFrame[] {
  const totalFrames = Math.floor(config.duration * config.fps);
  const frames: AnimationFrame[] = [];
  
  // Calculate drift range based on intensity
  // intensity 0 = no movement
  // intensity 50 = moderate drift (±5%)
  // intensity 100 = heavy drift (±10%)
  const maxDrift = (config.intensity / 100) * 10; // percentage
  
  for (let i = 0; i < totalFrames; i++) {
    const progress = i / (totalFrames - 1); // 0 to 1
    
    // Use easeInOutCubic for smooth motion
    const easedProgress = easeInOutCubic(progress);
    
    // Horizontal drift (left to right, then back)
    const translateX = Math.sin(easedProgress * Math.PI * 2) * maxDrift;
    
    // Vertical drift (subtle up/down motion)
    const translateY = Math.cos(easedProgress * Math.PI * 2) * (maxDrift * 0.5);
    
    // Slight zoom for parallax effect
    const scale = 1.0 + Math.sin(easedProgress * Math.PI) * 0.05;
    
    frames.push({
      frameNumber: i,
      scale,
      translateX,
      translateY
    });
  }
  
  return frames;
}

/**
 * Easing function for smooth animation
 * https://easings.net/#easeInOutCubic
 */
function easeInOutCubic(x: number): number {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Generate frames based on animation type
 */
export function generateAnimationFrames(config: AnimationConfig): AnimationFrame[] {
  switch (config.type) {
    case 'zoom':
      return generateZoomFrames(config);
    case 'drift':
      return generateDriftFrames(config);
    default:
      return generateZoomFrames(config);
  }
}

/**
 * Apply transform to canvas context
 */
export function applyTransform(
  ctx: CanvasRenderingContext2D,
  frame: AnimationFrame,
  canvasWidth: number,
  canvasHeight: number
) {
  // Reset transform
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  // Move to center for scaling
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  
  // Apply scale
  ctx.scale(frame.scale, frame.scale);
  
  // Apply translation (as percentage of image size)
  ctx.translate(
    (frame.translateX / 100) * canvasWidth,
    (frame.translateY / 100) * canvasHeight
  );
  
  // Move back
  ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
}